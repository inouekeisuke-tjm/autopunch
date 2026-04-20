# Design System Rules (design_system.md)

このドキュメントは、本プロジェクトにおけるUIデザインの唯一の正解情報源（Single Source of Truth）です。
GRAFTEKT / kitchenhouse のブランドイメージである「家具のようなキッチン」「建築的な美しさ」を体現するため、以下のルールを厳守してください。

## 1. Design Principles (デザイン原則)
- **Architectural Minimal**: 装飾を極限まで排除し、直線と面（グリッド）の美しさを強調する。
- **Material Focus**: UIの色は控えめにし、写真（プロダクトの素材感）を主役にする。
- **High Contrast**: テキストは真っ黒（#000000）または濃いグレーを使用し、洗練された印象を与える。
- **Solid**: 角丸は小さめ（2px - 4px）か、あえて直角（0px）を採用し、シャープさを保つ。

---

## 2. Color Palette (カラーパレット)
Tailwind CSSクラスと具体的なHEX値を定義します。

### Base UI Colors (Monochrome)
ブランドの高級感を演出するため、基本はモノトーンで構成します。

- **Background**:
  - Main: `#FFFFFF` (bg-white) - 清潔感のある白
  - Sub: `#F5F5F5` (bg-neutral-100) - わずかにグレーがかった背景（区分け用）
  - Dark: `#1A1A1A` (bg-neutral-900) - フッターや強調エリア
- **Text**:
  - Primary: `#000000` (text-black) - 見出し、重要テキスト（完全な黒で可読性と高級感を担保）
  - Secondary: `#525252` (text-neutral-600) - 本文、補足
  - Muted: `#A3A3A3` (text-neutral-400) - プレースホルダー、無効状態
- **Border**:
  - Default: `#E5E5E5` (border-neutral-200)
  - Active: `#000000` (border-black)

### Product Colors (EVALT Materials)
UIのアクセントや、商品選択チップ（Color Chips）として使用するブランド固有のカラーです。
※近似値であり、実物とは異なります。

- **Stone / Concrete (石目・コンクリート調)**
  - **Beton Grey (ベトングレー)**: `#787878` - ブランドを象徴するコンクリートグレー
  - **Piano Beton (ピアノベトン)**: `#9E9E9E` - 明るめのコンクリート
  - **Mercurio (メルクリオ)**: `#3E3C3C` - 錆感のあるダークグレー
  - **Forte Beton (フォルテベトン)**: `#4A4A4A` - 重厚なダークコンクリート
- **Wood (木目)**
  - **Notty Natural (ノッティナチュラル)**: `#C2B280` - ナチュラルなオーク色
  - **Oak Chocolat (オークショコラ)**: `#5D4037` - 深みのあるブラウン
  - **Ash Beige (アッシュベージュ)**: `#D7CCC8` - グレイッシュなベージュ
- **Solid (単色)**
  - **Fog Grey (フォッググレー)**: `#ECEFF1` - 霧のような白に近いグレー
  - **Onyx Grey (オニキスグレー)**: `#37474F` - 青みがかったダークグレー

### Functional Colors
エラーや成功メッセージも、彩度を抑えたシックな色味を使用します。
- **Success**: `#0F766E` (text-teal-700)
- **Error**: `#991B1B` (text-red-800)
- **Warning**: `#B45309` (text-amber-700)

---

## 3. Typography (タイポグラフィ)
欧文は幾何学的でモダンなフォント、和文は視認性の高いゴシック体を指定します。

- **Font Family**: `font-family: "Inter", "Noto Sans JP", "Hiragino Kaku Gothic ProN", sans-serif;`

| Role | Tag | Size (Desktop/Mobile) | Weight | Letter Spacing | Line Height |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display** | H1 | 36px / 28px | Bold (700) | 0.05em | 1.3 |
| **Title** | H2 | 24px / 20px | Regular (400) | 0.05em | 1.5 |
| **Subtitle** | H3 | 18px / 16px | Medium (500) | 0.02em | 1.5 |
| **Body** | p | 15px / 14px | Regular (400) | 0.02em | 1.8 |
| **Small** | small | 12px / 11px | Regular (400) | 0em | 1.5 |

**Typography Rules:**
1. **Letter Spacing**: 高級感を出すため、見出し（H1, H2）の字間をわずかに広げる（`tracking-wide`）。
2. **Font Weight**: 日本語の太字は野暮ったくなりやすいため、H2以下の見出しでもあえてRegular（400）を使用し、サイズと余白で階層を表現することを好む。

---

## 4. Spacing & Radius (スペーシングと角丸)

### Spacing Scale
余白を大きく取り、美術館のような「間」を作ります。
- `section`: 80px - 120px (py-20 to py-32)
- `component`: 40px (gap-10)
- `item`: 16px (gap-4)

### Border Radius
ブランドのシャープさを表現するため、角丸は極小にします。
- `none`: 0px (rounded-none) - **推奨**: 画像、カード、ボタン
- `sm`: 2px (rounded-sm) - 入力フォームなど、わずかに柔らかさが欲しい箇所
- `md`: 4px (rounded) - 最大でもこれに留める

---

## 5. UI Components (コンポーネント定義)

### Buttons
- **Primary Button (Solid)**:
  - Bg: `#000000` (bg-black)
  - Text: `#FFFFFF` (text-white)
  - Radius: `rounded-none` (直角)
  - Padding: `py-3 px-8` (横長)
  - Hover: Opacity 80% (色は変えず透明度で表現)
- **Secondary Button (Outline)**:
  - Bg: Transparent
  - Border: 1px solid `#000000`
  - Text: `#000000`
  - Radius: `rounded-none`
  - Hover: Bg `#F5F5F5`

### Cards (Product Card)
- **Style**:
  - Bg: Transparent or White
  - Border: None (画像のエッジで見せる)
  - Shadow: None (フラットデザイン)
  - Image: Aspect Ratio 4:3 or 1:1, `object-cover`

### Inputs
- **Style**:
  - Bg: `#F9FAFB` (bg-gray-50)
  - Border: 1px solid `#E5E5E5` (bottom border only style is also acceptable for elegance)
  - Radius: `rounded-none`
  - Focus: Border `#000000`, Ring 0

---

## 6. Layout & Grid
- **Container**: `max-w-7xl` (1280px), `mx-auto`, `px-4 md:px-8`
- **Grid**: プロダクト一覧などはシンプルなグリッドレイアウトを採用。
  - Desktop: 3カラム (`grid-cols-3`)
  - Mobile: 1カラム (`grid-cols-1`)