# 自己分析の拡充 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 6種類それぞれを5〜10分読める自己分析に拡充し、恋愛・仕事の相性と3年間の見通しを表示する。

**Architecture:** 既存の日柱計算を再利用する。年の干支と十大主星を純関数で求め、固定の自己分析本文・年別本文を同じページへ表示する。本文と計算、DOM生成を分ける。

**Tech Stack:** 既存のTypeScript・Vite・Vitest・happy-dom。依存を追加しない。

**Spec:** `docs/superpowers/specs/2026-10-16-relationships-outlook-design.md`。2026-10-16にユーザーが本文密度と構成を承認し「進めて」と実行を依頼した。方式は既存セッションのNativeを維持する。

## Global Constraints

- 本人の年月日3欄だけを入力し、生年月日をURL、保存領域、fetch、外部AIへ出さない。
- 日柱の基準日2000-01-01戊午・番号54を変更しない。
- 本人だけの入力で合いやすい相手の特徴を表示する。相性の点数や二人比較は追加しない。
- 3年間は表示時点の日本時間の暦年から3年。各年の立春から翌立春前日までの目安であり、今日の天中殺判定や大運は追加しない。
- 可視本文は結果1件3,500〜5,000字を編集目標とし、概要は承認済みの約800字の例に合わせる。同義反復で埋めない。
- 命式全体を読む総合鑑定や、人生の出来事の保証として表示しない。
- 配置・共有・mainへのマージはしない。既存作業ツリーと指定ブランチで作業する。

## Review Focus

- 12月31日のUTC時刻でも日本では翌年なら、日本時間の年から3件を出す（Task 1）。
- 年支が午・未である2026・2027年は午未天中殺にだけ該当する（Task 1）。
- 六つの本文が重複せず、概要だけで終わらず、恋愛と仕事の相性が別の内容になっている（Task 2）。
- 6種類×日干10通りの結果で文章量が不足せず、天中殺該当年も読む内容が残る（Task 2/3）。
- 章リンクはDOM内だけを移動し、URLへ個人情報を出さない。再入力で結果・リンク・年別カードが残らない（Task 3）。

---

### Task 1: 年ごとの読み方の計算

**Files:** Create `src/domain/outlook.ts`, `src/domain/outlook.test.ts`

**Interfaces:** Consumes `Pillar`, `TenchusatsuKind`; produces `readingYears(now: Date): readonly number[]`, `outlookFor(pillar: Pillar, year: number): {year: number; stem: string; branch: string; star: AnnualStar; isTenchusatsu: boolean}`. `AnnualStar` は貫索・石門・鳳閣・調舒・禄存・司禄・車騎・牽牛・龍高・玉堂のunion。

- [ ] Step 1: 失敗するテストを書く。2000-01-01の2026/27/28年は龍高/玉堂/貫索、午/未/申、天中殺false。1994-07-05は2026/27だけtrue。年干と日干10×10は五行・陰陽表のリテラル100件に一致。60年周期。`readingYears(new Date("2026-12-31T15:00:00Z"))` は `[2027,2028,2029]`、直前は `[2026,2027,2028]`。
- [ ] Step 2: `npx vitest run src/domain/outlook.test.ts`。未実装のimportで失敗することを確認。
- [ ] Step 3: 純関数を実装。干支は1984年甲子、五行の相生は木→火→土→金→水→木、相剋は木→土→水→火→金→木。年の選択はIntlのAsia/Tokyoで求める。
- [ ] Step 4: 同テストと `npm test`。すべて成功。
- [ ] Step 5: `git add src/domain/outlook.ts src/domain/outlook.test.ts && git commit -m "[quick] 年の干支と日干から3年間の読み方を求める"`

### Task 2: 自己分析と年別の本文

**Files:** Create `src/content/profiles.ts`, `src/content/profiles.test.ts`, `src/content/outlook.ts`, `src/content/outlook.test.ts`

**Interfaces:** Produces `profileFor(kind): Profile`。`Profile` は `headline`, `overview: readonly string[]`, `axis`, `ties`, `strengths`, `work`, `love`, `team`（各readonly string[]）、`questions: readonly [string,string,string]`, `action`。Produces `annualCopyFor(outlook): {theme: string; paragraphs: readonly string[]; actions: readonly [string,string]; caution: string}`。Consumes Task 1のAnnualStarとOutlook。

- [ ] Step 1: 失敗するテスト。全6種類について概要600字以上、全体像・軸・縁・強み・仕事・恋愛・仕事相性・問いの存在、固有の見出し、3問い、本文の重複がないことを確認。年別は10テーマ全ての本文と2行動、注意点、天中殺該当時の差分。6種類×日干10通りの全結果が3,500〜5,000字になることを確認。
- [ ] Step 2: `npx vitest run src/content/profiles.test.ts src/content/outlook.test.ts`。未実装importで失敗を確認。
- [ ] Step 3: 承認済み概要例と設計の章構成に沿って、全6種類の固有本文を制作。占術の解釈とアプリの行動提案を区別する。年別は10テーマを定数化し、天中殺該当時は棚卸し・練習・余白を含む提案へ切り替える。
- [ ] Step 4: 同テストと `npm test`。全て成功。文字数は実測し、足りない内容を具体的な場面で補う。文字数のための同義反復は避ける。
- [ ] Step 5: `git add src/content/profiles.ts src/content/profiles.test.ts src/content/outlook.ts src/content/outlook.test.ts && git commit -m "[quick] 6種類の自己分析と恋愛・仕事・年別の本文を充実させる"`

### Task 3: 読む画面への統合と確認

**Files:** Modify `src/ui/app.ts`, `src/ui/app.test.ts`, `src/style.css`, `AGENTS.md`, existing design document; Create optional `src/ui/result.ts` for long-result rendering.

**Interfaces:** `mount(root)`は維持。本文と計算を再利用し、章リンク・10章・年別3カード・再入力を表示。DOM生成が大きくなるため結果部分をresult.tsへ分ける。

- [ ] Step 1: 旧5ブロックのテストを承認済みの章構成へ更新。旧短文の非表示、長文、順序、3カード、日本時間の年、全章が展開済み、3問い、芸能人維持を確認。fetch・XHR・sendBeacon・URL・localStorage・sessionStorage・cookieへ出生年月日が出ず、再入力ですべて消えることを確認。移動先の存在とフォーカスも確認。
- [ ] Step 2: `npx vitest run src/ui/app.test.ts`。新しい結果が存在せず失敗することを確認。
- [ ] Step 3: 長文結果を実装。章リンクはページ内移動し、画面幅320/390pxとPCで読むための文字サイズ・行間・区切りを設定。入力画面に自己分析サイトとしての短い説明を置く。生年月日や相手の情報を保存・送信する機能を足さない。
- [ ] Step 4: `npm test && npm run build && git diff --check`。ブラウザで入力・結果・章移動・年別・再入力・スマホ幅を確認。スクリーンショットを保存し、本文量も実測する。
- [ ] Step 5: 承認済み追加設計を正本としてAGENTSと旧設計の対象外指定を整合させる。`git add src/ui src/style.css AGENTS.md docs/superpowers/specs && git commit -m "[quick] 長文の自己分析と相性・3年間を結果画面へ組み込む"`

## 最終確認

全体レビューを1回行い、Important以上は再現する失敗テストから修正する。最終テスト・ビルド成功後、指定ブランチへpushし、開いているPRを更新する。マージ・配置・共有は行わない。
