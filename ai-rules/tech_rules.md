# Technology Stack & Implementation Rules (tech_rules.md)

このドキュメントは、本プロジェクトにおける技術選定と実装方針を定義します。
具体的なライブラリのバージョンは `package.json` を参照し、**現在インストールされているバージョンの最新の記法**を採用してください。

## 1. Core Architecture (アーキテクチャ)
- **Framework**: Next.js (App Router / Server Components採用)
- **Language**: TypeScript (Strict mode)
- **Styling**: Tailwind CSS (Utility First)
- **Component Model**: React Functional Components & Hooks
- **Validation**: Zod (Schema validation)

---

## 2. General Coding Principles (基本原則)
- **Functional Components**: コンポーネントは全てアロー関数 (`const Component = () => {}`) で定義する。
- **Strict TypeScript**: `any` 型の使用は禁止。Props、APIレスポンス、ステートには必ず型定義を行う。
- **DRY & Composition**: 巨大なコンポーネントを作らず、再利用可能な小さなパーツに分割して組み立てる。
- **Descriptive Naming**: 変数名・関数名は役割が明確に伝わる英語にする（省略形は避ける）。

### Internationalization (i18n)
- **Default Locale**: `ja` (日本語)。ルートレイアウトのHTMLタグには必ず `<html lang="ja">` を設定すること。
- **Hardcoding**: 多言語対応の予定がない場合、テキストはハードコードでも可とする（i18nライブラリの導入は必須ではない）。

---

## 3. Implementation Rules (実装ルール)

### Server vs Client Components
Next.js App Routerの特性を最大限活かすため、以下のルールを厳守する。

1.  **Default to Server**: 基本的に全てのコンポーネントは **Server Component** として記述する。
2.  **"use client" Usage**: 以下の機能が必要な場合のみ、ファイルの先頭に `"use client"` を記述して **Client Component** とする。
    - Event Listeners (`onClick`, `onChange`, `onSubmit` etc.)
    - React Hooks (`useState`, `useEffect`, `useContext`, `useRef` etc.)
    - Browser APIs (`window`, `document`, `localStorage` etc.)
3.  **Boundary Separation**: Client Componentは可能な限り末端（Leaf）に配置し、Server Componentのメリット（パフォーマンス、SEO）を損なわないようにする。

### Directory Structure (App Router Standard)
- `/app`: ルーティング、レイアウト、ページ本体
  - `page.tsx`: ページUI
  - `layout.tsx`: 共通レイアウト
  - `loading.tsx`: Suspenseフォールバック
  - `error.tsx`: エラーバウンダリ
- `/components`: UIパーツ
  - `/ui`: 汎用的な最小単位（Button, Input等）
  - `/features`: 特定機能に特化したコンポーネント群
- `/lib` or `/utils`: ヘルパー関数、型定義、設定ファイル
- `/hooks`: カスタムフック

### Styling (Tailwind CSS)
- **Utility First**: 原則としてTailwindのユーティリティクラスのみでスタイリングする。
- **Consistency**: 色やスペーシングは `design_system.md` で定義された値（例: `bg-primary`, `p-4`）を使用し、マジックナンバー（`w-[357px]`など意味不明な数値）は避ける。
- **Conditional Styles**: 条件付きクラスには `clsx` または `tailwind-merge` を使用して可読性を保ち整理する。

### Import Sorting (インポート順序)
可読性向上のため、以下の順序で記述するよう統一する。

1.  **React / Next.js core imports** (e.g., `import { useState } from 'react'`)
2.  **Third-party libraries** (e.g., `import { useForm } from 'react-hook-form'`)
3.  **Internal components** (e.g., `import { Button } from '@/components/ui/button'`)
4.  **Utilities / Hooks / Types** (e.g., `import { cn } from '@/lib/utils'`)
5.  **Styles** (if any CSS modules are used)

---

## 4. Error Handling & Loading (エラー処理とローディング)

- **Async Handling**: 非同期処理は必ず `try-catch` で囲み、コンソールログだけでなく、ユーザーに適切なエラーメッセージを表示（Toast通知やエラーテキスト）する。
- **Loading State**: データの取得中や処理中は、ユーザーが操作不能に見えないよう、必ず **スケルトンローダー（Skeleton）** または **スピナー** を表示する。
- **Empty States**: データが空の場合のUI（Empty State）も考慮して実装する。