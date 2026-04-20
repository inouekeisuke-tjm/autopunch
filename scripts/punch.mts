import { performPunch, PunchType } from "../src/lib/punch-service";

/**
 * Entry point for GitHub Actions.
 * Environment variables:
 * - PUNCH_URL
 * - PUNCH_EMP_CODE
 * - PUNCH_PASSWORD
 */
async function main() {
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
