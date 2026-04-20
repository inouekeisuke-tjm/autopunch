"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Clock, ShieldCheck, Mail, Power, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { punchAction, PunchActionState } from "@/app/actions/punch";

const initialState: PunchActionState = {
  success: null,
  message: "",
};

export default function Dashboard() {
  const [state, formAction, isPending] = useActionState(punchAction, initialState);
  
  // Local state for credentials (initially with user's provided info)
  const [empCode, setEmpCode] = useState("017158");
  const [passWord, setPassWord] = useState("Dry8");
  const [url, setUrl] = useState("https://vg.i-abs.co.jp/vpc-241-148/TimePro-VG/Page/OVg00030t.aspx?CC=1&CN=14");

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      {/* Header */}
      <header className="flex justify-between items-end border-b border-border-default pb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tighter uppercase transition-all hover:tracking-normal cursor-default">
            AutoPunch
          </h1>
          <p className="text-text-secondary mt-2 text-sm tracking-wide">
            勤怠打刻を、記憶から消す。
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2 text-success text-sm font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
            </span>
            System Active
          </span>
        </div>
      </header>

      {/* Status Feedback */}
      {state.success !== null && (
        <div className={`p-4 flex items-center gap-3 border ${state.success ? 'bg-teal-50 border-teal-200 text-teal-800' : 'bg-red-50 border-red-200 text-red-800'} animate-in slide-in-from-top duration-300`}>
          {state.success ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="text-sm font-medium">{state.message}</span>
        </div>
      )}

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <form action={formAction} className="contents">
          <input type="hidden" name="url" value={url} />
          <input type="hidden" name="empCode" value={empCode} />
          <input type="hidden" name="passWord" value={passWord} />
          
          {/* Attendance Card */}
          <Card className="group border border-border-default hover:border-text-primary transition-colors relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium uppercase tracking-widest text-text-secondary">
                出勤打刻
              </CardTitle>
              <Clock className="w-4 h-4 text-text-muted group-hover:text-text-primary transition-colors" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-light">08:40</div>
              <button 
                name="type" 
                value="attendance"
                disabled={isPending}
                className="mt-4 text-xs font-semibold uppercase tracking-widest text-text-primary hover:underline disabled:opacity-50 inline-flex items-center gap-2"
              >
                出勤としてテスト実行 {isPending && <Loader2 className="w-3 h-3 animate-spin" />}
              </button>
            </CardContent>
          </Card>

          {/* Departure Card */}
          <Card className="group border border-border-default hover:border-text-primary transition-colors relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium uppercase tracking-widest text-text-secondary">
                退勤打刻
              </CardTitle>
              <Clock className="w-4 h-4 text-text-muted group-hover:text-text-primary transition-colors" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-light">21:00</div>
              <button 
                name="type" 
                value="clock-out"
                disabled={isPending}
                className="mt-4 text-xs font-semibold uppercase tracking-widest text-text-primary hover:underline disabled:opacity-50 inline-flex items-center gap-2"
              >
                退勤としてテスト実行 {isPending && <Loader2 className="w-3 h-3 animate-spin" />}
              </button>
            </CardContent>
          </Card>
        </form>
      </div>

      {/* Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Auth Settings */}
        <Card className="lg:col-span-2 border border-border-default p-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" />
              認証設定
            </CardTitle>
            <CardDescription>
              勤怠管理システムのログイン情報を設定します。情報は暗号化して保存されます。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">個人コード</label>
                <Input 
                  value={empCode} 
                  onChange={(e) => setEmpCode(e.target.value)}
                  placeholder="000000" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">パスワード</label>
                <Input 
                  type="password" 
                  value={passWord} 
                  onChange={(e) => setPassWord(e.target.value)}
                  placeholder="••••••••" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">打刻サイトURL</label>
              <Input 
                value={url} 
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
            <div className="flex justify-end mt-4">
              <Button variant="primary">設定を保存</Button>
            </div>
          </CardContent>
        </Card>

        {/* Action / Notification */}
        <Card className="border border-border-default flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Mail className="w-5 h-5" />
              通知設定
            </CardTitle>
            <CardDescription>
              打刻完了時に確認メールを送信します。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-border-default italic text-sm text-text-secondary">
              Email Notifications
              <span className="text-success font-medium not-italic">Enabled</span>
            </div>
            <div className="text-xs text-text-muted text-center pt-2">
              自動実行スケジュール: 平日 08:40 / 21:00
            </div>
          </CardContent>
          <CardContent className="pt-0">
             <Button variant="ghost" className="w-full text-error hover:bg-red-50 flex items-center gap-2">
               <Power className="w-4 h-4" />
               自動化を停止する
             </Button>
          </CardContent>
        </Card>
      </div>

      {/* Footer / Info */}
      <footer className="pt-12 text-center">
        <p className="text-xs text-text-muted tracking-widest uppercase">
          &copy; 2026 AutoPunch / Architectural Minimal Design System
        </p>
      </footer>
    </div>
  );
}
