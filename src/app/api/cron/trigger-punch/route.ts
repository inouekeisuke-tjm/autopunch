import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    // Vercel Cron authentication check
    if (cronSecret) {
      if (authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json(
          { error: "Unauthorized: Invalid CRON_SECRET token." },
          { status: 401 }
        );
      }
    } else {
      console.warn(
        "[Cron API] CRON_SECRET is not configured in environment variables. Running without auth check."
      );
    }

    const { searchParams } = new URL(request.url);
    const punchType = searchParams.get("type");

    if (punchType !== "attendance" && punchType !== "clock-out") {
      return NextResponse.json(
        {
          error:
            "Invalid 'type' parameter. Expected 'attendance' or 'clock-out'.",
        },
        { status: 400 }
      );
    }

    const githubToken =
      process.env.GH_TRIGGER_TOKEN || process.env.GITHUB_DISPATCH_TOKEN;
    if (!githubToken) {
      console.error(
        "[Cron API] Missing GH_TRIGGER_TOKEN (or GITHUB_DISPATCH_TOKEN) in environment."
      );
      return NextResponse.json(
        {
          error:
            "Server configuration error: GH_TRIGGER_TOKEN is not set.",
        },
        { status: 500 }
      );
    }

    const repo = process.env.GITHUB_REPO || "inouekeisuke-tjm/autopunch";
    const branch = process.env.GITHUB_BRANCH || "master";

    console.log(
      `[Cron API] Triggering GitHub workflow punch.yml for ${punchType} on ${repo}@${branch}...`
    );

    const authPrefix = githubToken.startsWith("ghp_") ? "token" : "Bearer";
    const ghResponse = await fetch(
      `https://api.github.com/repos/${repo}/actions/workflows/punch.yml/dispatches`,
      {
        method: "POST",
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `${authPrefix} ${githubToken}`,
          "X-GitHub-Api-Version": "2022-11-28",
          "User-Agent": "autopunch-vercel-cron",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ref: branch,
          inputs: {
            type: punchType,
          },
        }),
      }
    );

    if (!ghResponse.ok) {
      const errorText = await ghResponse.text();
      const oauthScopes = ghResponse.headers.get("x-oauth-scopes");
      const acceptedScopes = ghResponse.headers.get("x-accepted-oauth-scopes");
      console.error(
        `[Cron API] GitHub API dispatch failed with status ${ghResponse.status}: ${errorText} (scopes: ${oauthScopes}, accepted: ${acceptedScopes})`
      );
      return NextResponse.json(
        {
          error: `GitHub API dispatch failed (${ghResponse.status})`,
          details: errorText,
          scopes: oauthScopes,
          acceptedScopes: acceptedScopes,
        },
        { status: ghResponse.status }
      );
    }

    console.log(
      `[Cron API] Successfully dispatched ${punchType} workflow on GitHub Actions.`
    );
    return NextResponse.json({
      success: true,
      message: `Triggered ${punchType} punch workflow on GitHub Actions.`,
      dispatchedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("[Cron API] Unexpected error:", error);
    return NextResponse.json(
      {
        error: "Internal server error occurred while triggering punch.",
        details: error?.message || String(error),
      },
      { status: 500 }
    );
  }
}
