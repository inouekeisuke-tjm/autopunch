import { chromium as playwrightChromium, Page, Frame } from "playwright-core";

export type PunchType = "attendance" | "clock-out";

export interface PunchCredentials {
  url: string;
  empCode: string;
  passWord: string;
}

export interface PunchResult {
  success: boolean;
  message: string;
  timestamp: string;
}

/**
 * Resolve Chromium executable path depending on environment.
 * - Production (Vercel): use @sparticuz/chromium (compressed binary for serverless)
 * - Local dev: use system Chromium bundled with playwright-core
 */
async function launchBrowser() {
  const isProduction = process.env.NODE_ENV === "production";
  if (isProduction) {
    const chromium = await import("@sparticuz/chromium");
    return playwrightChromium.launch({
      args: chromium.default.args,
      executablePath: await chromium.default.executablePath(),
      headless: true,
    });
  }
  // Local: playwright-core needs an explicit executable path or the PLAYWRIGHT_BROWSERS_PATH env
  return playwrightChromium.launch({ headless: true });
}

/**
 * Handles the "Previous connection exists" error dialog specific to TimePro-VG.
 */
async function handleSessionErrorIfPresent(page: Page, url: string) {
  const errorText = "前回の接続情報が残っています";
  const isErrorPresent = await page.evaluate((text) => {
    return document.body.innerText.includes(text);
  }, errorText);

  if (isErrorPresent) {
    console.log(`[PunchService] Session error detected. Attempting to clear...`);
    const okButton = await page.getByRole("button", { name: /OK/i }).or(page.locator("#btnOK")).first();
    if (await okButton.isVisible()) {
      await okButton.click();
      console.log(`[PunchService] Error dialog dismissed. Reloading...`);
      await page.waitForTimeout(2000);
      await page.goto(url, { waitUntil: "networkidle" });
    } else {
      console.log(`[PunchService] Could not find OK button, re-navigating...`);
      await page.goto(url, { waitUntil: "networkidle" });
    }
  }
}

/**
 * Find the first frame that contains the given selector.
 */
async function findFrameWithSelector(page: Page, selector: string): Promise<Frame> {
  for (const frame of page.frames()) {
    try {
      await frame.waitForSelector(selector, { state: "visible", timeout: 2000 });
      return frame;
    } catch (e) {
      // continue searching
    }
  }
  throw new Error(`要素 ${selector} が見つかりませんでした。`);
}

/**
 * Perform the actual punching action using Playwright.
 */
export async function performPunch(
  type: PunchType,
  credentials: PunchCredentials
): Promise<PunchResult> {
  const browser = await launchBrowser();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log(`[PunchService] Navigating to ${credentials.url}...`);
    await page.goto(credentials.url, { waitUntil: "networkidle" });

    // 1. Handle possible session error
    await handleSessionErrorIfPresent(page, credentials.url);

    // 2. Locate the frame that contains the employee code input (iframe1)
    const frame = await findFrameWithSelector(page, "#edtEmpCode");

    // 3. Wait for password field inside the same frame
    await frame.waitForSelector("#edtPassWord", { state: "visible", timeout: 15000 });

    // 4. Fill credentials
    console.log(`[PunchService] Filling credentials inside frame...`);
    await frame.fill("#edtEmpCode", credentials.empCode);
    await frame.fill("#edtPassWord", credentials.passWord);

    // 5. Determine button selector
    const punchButtonSelector = type === "attendance" ? "#btn1" : "#btn2";
    const typeLabel = type === "attendance" ? "出勤" : "退勤";
    console.log(`[PunchService] Clicking ${typeLabel} button (${punchButtonSelector})...`);

    const btn = frame.locator(punchButtonSelector);
    if (!(await btn.isVisible())) {
      throw new Error(`打刻ボタン(${typeLabel})が見つかりませんでした。`);
    }

    // 6. Click the punch button — performs the punch directly
    await btn.click();

    // Wait briefly for the server to process the request
    await page.waitForTimeout(3000);

    return {
      success: true,
      message: `${typeLabel}打刻が完了しました`,
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    console.error(`[PunchService] Error:`, error);
    return {
      success: false,
      message: `失敗しました: ${error.message || "不明なエラー"}`,
      timestamp: new Date().toISOString(),
    };
  } finally {
    await browser.close();
    console.log(`[PunchService] Browser closed.`);
  }
}
