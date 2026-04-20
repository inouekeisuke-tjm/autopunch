import { NextRequest, NextResponse } from "next/server";
import { performPunch, PunchType } from "@/lib/punch-service";

/**
 * GET /api/cron/punch?type=attendance|clock-out
 *
 * Called automatically by Vercel Cron Jobs on the schedule defined in vercel.json.
 * Protected by Authorization header (Vercel injects CRON_SECRET automatically).
 */
export async function GET(request: NextRequest) {
  // --- Security: verify the cron secret ---
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    console.error("[Cron] Unauthorized request");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // --- Determine punch type from query param ---
  const { searchParams } = new URL(request.url);
  const typeParam = searchParams.get("type");
  if (typeParam !== "attendance" && typeParam !== "clock-out") {
    return NextResponse.json(
      { error: "Invalid type. Use 'attendance' or 'clock-out'" },
      { status: 400 }
    );
  }
  const type: PunchType = typeParam;

  // --- Read credentials from environment variables ---
  const url = process.env.PUNCH_URL;
  const empCode = process.env.PUNCH_EMP_CODE;
  const passWord = process.env.PUNCH_PASSWORD;

  if (!url || !empCode || !passWord) {
    console.error("[Cron] Missing environment variables: PUNCH_URL, PUNCH_EMP_CODE, PUNCH_PASSWORD");
    return NextResponse.json({ error: "Server misconfiguration: missing credentials" }, { status: 500 });
  }

  console.log(`[Cron] Starting ${type} punch at ${new Date().toISOString()}`);

  // --- Execute punch ---
  const result = await performPunch(type, { url, empCode, passWord });

  console.log(`[Cron] Result:`, result);

  return NextResponse.json(result, { status: result.success ? 200 : 500 });
}
