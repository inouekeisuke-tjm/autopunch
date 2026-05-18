import { performPunch, PunchType } from "../src/lib/punch-service";

/**
 * Japanese National Holidays for 2026 and 2027.
 * Format: "YYYY-MM-DD"
 */
const NATIONAL_HOLIDAYS = [
  // 2026
  "2026-01-01", "2026-01-12", "2026-02-11", "2026-02-23", "2026-03-20",
  "2026-04-29", "2026-05-03", "2026-05-04", "2026-05-05", "2026-05-06",
  "2026-07-20", "2026-08-11", "2026-09-21", "2026-09-22", "2026-09-23",
  "2026-10-12", "2026-11-03", "2026-11-23",
  // 2027
  "2027-01-01", "2027-01-11", "2027-02-11", "2027-02-23", "2027-03-21", "2027-03-22",
  "2027-04-29", "2027-05-03", "2027-05-04", "2027-05-05", "2027-07-19",
  "2027-08-11", "2027-09-20", "2027-09-23", "2027-10-11", "2027-11-03",
  "2027-11-23"
];

/**
 * Company Holidays
 */
const COMPANY_HOLIDAYS = [
  "08-13", // Aug 13
  "08-14"  // Aug 14
];

/**
 * Entry point for GitHub Actions.
 * Environment variables:
 * - PUNCH_URL
 * - PUNCH_EMP_CODE
 * - PUNCH_PASSWORD
 * - SKIP_HOLIDAY_CHECK (optional)
 */
async function main() {
  // Check for holidays if not skipped
  const skipHolidayCheck = process.env.SKIP_HOLIDAY_CHECK === "true";
  
  if (!skipHolidayCheck) {
    // Calculate JST date (UTC+9)
    const now = new Date();
    const jstDate = new Date(now.getTime() + (9 * 60 * 60 * 1000));
    
    // Check if it's Saturday or Sunday
    const dayOfWeek = jstDate.getUTCDay(); // 0: Sunday, 6: Saturday
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      console.log(`[Script] Today is ${dayOfWeek === 0 ? 'Sunday' : 'Saturday'}. Skipping.`);
      process.exit(0);
    }

    // Check for National Holidays
    const dateStr = jstDate.toISOString().split('T')[0];
    if (NATIONAL_HOLIDAYS.includes(dateStr)) {
      console.log(`[Script] Today is a national holiday (${dateStr}). Skipping.`);
      process.exit(0);
    }

    // Check for Company Holidays (Aug 13, Aug 14)
    const mmdd = dateStr.substring(5); // "MM-DD"
    if (COMPANY_HOLIDAYS.includes(mmdd)) {
      console.log(`[Script] Today is a company holiday (${mmdd}). Skipping.`);
      process.exit(0);
    }
  } else {
    console.log("[Script] SKIP_HOLIDAY_CHECK is true. Proceeding regardless of holiday status.");
  }

  const typeParam = process.argv[2];
  if (typeParam !== "attendance" && typeParam !== "clock-out") {
    console.error("Error: Please specify punch type ('attendance' or 'clock-out') as an argument.");
    process.exit(1);
  }
  const type = typeParam as PunchType;

  const credentials = {
    url: process.env.PUNCH_URL || "",
    empCode: process.env.PUNCH_EMP_CODE || "",
    passWord: process.env.PUNCH_PASSWORD || "",
  };

  if (!credentials.url || !credentials.empCode || !credentials.passWord) {
    console.error("Error: Missing required environment variables (PUNCH_URL, PUNCH_EMP_CODE, PUNCH_PASSWORD)");
    process.exit(1);
  }

  console.log(`[Script] Starting ${type} punch process...`);
  
  try {
    const result = await performPunch(type, credentials);
    if (result.success) {
      console.log(`[Script] Success: ${result.message}`);
      process.exit(0);
    } else {
      console.error(`[Script] Failed: ${result.message}`);
      process.exit(1);
    }
  } catch (error) {
    console.error(`[Script] Fatal Error:`, error);
    process.exit(1);
  }
}

main();
