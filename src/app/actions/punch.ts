"use server";

import { z } from "zod";
import { performPunch, PunchType, PunchResult } from "@/lib/punch-service";

const punchSchema = z.object({
  type: z.enum(["attendance", "clock-out"]),
  url: z.string().url("有効なURLを入力してください。"),
  empCode: z.string().min(1, "個人コードを入力してください。"),
  passWord: z.string().min(1, "パスワードを入力してください。"),
});

export type PunchActionState = {
  success: boolean | null;
  message: string;
  data?: PunchResult;
};

/**
 * Server action to trigger the punch process.
 */
export async function punchAction(
  prevState: PunchActionState,
  formData: FormData
): Promise<PunchActionState> {
  // Extract data from form
  const rawData = {
    type: formData.get("type"),
    url: formData.get("url"),
    empCode: formData.get("empCode"),
    passWord: formData.get("passWord"),
  };

  // Validate
  const validatedFields = punchSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "入力内容に誤りがあります。" + validatedFields.error.flatten().fieldErrors,
    };
  }

  const { type, url, empCode, passWord } = validatedFields.data;

  try {
    const result = await performPunch(type as PunchType, {
      url,
      empCode,
      passWord,
    });

    return {
      success: result.success,
      message: result.message,
      data: result,
    };
  } catch (error: any) {
    return {
      success: false,
      message: "通信エラーが発生しました。" + (error.message || ""),
    };
  }
}
