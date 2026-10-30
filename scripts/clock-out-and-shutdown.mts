import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";
import { performPunch } from "../src/lib/punch-service";

// Load .env.local if present
function loadEnv() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, "utf-8").split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const [key, ...rest] = trimmed.split("=");
      if (key && rest.length > 0) {
        const val = rest.join("=").replace(/^["']|["']$/g, "").trim();
        if (!process.env[key.trim()]) {
          process.env[key.trim()] = val;
        }
      }
    }
  }
}

async function main() {
  loadEnv();

  const url = process.env.PUNCH_URL;
  const empCode = process.env.PUNCH_EMP_CODE;
  const passWord = process.env.PUNCH_PASSWORD;

  if (!url || !empCode || !passWord) {
    console.error("\n❌ [エラー] 認証情報 (.env.local) が見つからないか不足しています。");
    console.error("PUNCH_URL, PUNCH_EMP_CODE, PUNCH_PASSWORD を設定してください。");
    process.exit(1);
  }

  console.log("==========================================");
  console.log(" 🏢 自動退勤打刻＆シャットダウン システム ");
  console.log("==========================================");
  console.log(`[1/2] 退勤打刻を実行中... (社員番号: ${empCode})`);

  try {
    const result = await performPunch("clock-out", {
      url,
      empCode,
      passWord,
    });

    if (!result.success) {
      throw new Error(result.message);
    }

    console.log(`\n✅ 退勤打刻が正常に完了しました！ (${result.timestamp})`);
    console.log("==========================================");
    console.log("[2/2] 10秒後にPCをシャットダウンします。");
    console.log("※ 中止したい場合は、このウィンドウを閉じるか、別のコマンドプロンプトで「shutdown /a」を実行してください。");
    console.log("==========================================");

    // 10秒シャットダウンコマンドを発行 (/s: シャットダウン, /t: 秒数, /c: コメント)
    execSync('shutdown /s /t 10 /c "退勤打刻が完了しました。10秒後にPCをシャットダウンします。"', {
      stdio: "inherit",
    });

    // 10秒カウントダウン表示
    for (let i = 10; i > 0; i--) {
      process.stdout.write(`\rシャットダウンまで残り: ${i} 秒... (中断するにはこのウィンドウを閉じてください)`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    console.log("\nシャットダウンを実行しています...");
  } catch (error) {
    console.error("\n❌ [エラー] 退勤打刻に失敗したため、シャットダウンを中止しました。");
    console.error(`原因: ${error instanceof Error ? error.message : String(error)}`);
    console.error("\n確認のため、何かキーを押すまでウィンドウを保持します。");
    process.exit(1);
  }
}

main();

