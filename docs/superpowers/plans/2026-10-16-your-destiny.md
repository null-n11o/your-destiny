# your-destiny Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 友人がスマホのブラウザで西暦の年月日を入れると、天中殺6種類の一つと定型文を端末内で表示する。

**Architecture:** Vite が TypeScript を静的ファイルへまとめる。日付検証、日柱、本文は純関数に分ける。画面は React を使わず、同じページの DOM を書き換える。生年月日は通信しない。

**Tech Stack:** Node.js 22 以上、TypeScript 5、Vite 6、Vitest 3、happy-dom。配信先は Cloudflare Pages の Free。この計画では配置しない。

**Spec:** `docs/superpowers/specs/2026-10-16-your-destiny-design.md`

## Global Constraints

- 入力は西暦の年、月、日だけである。時刻欄と呼び名欄は置かない。
- 受け付ける暦日は1900年1月1日から2099年12月31日までである。2月29日はグレゴリオ暦のうるう年だけ通す。
- 日付の境は午前0時である。23時では変えない。日数差は `Date.UTC` で求める。
- 2000年1月1日は戊午、甲子を0とした番号は54である。
- 結果は、種類の一文、人との距離4行、今夜の場面、隣への問い、芸能人3人の順で一つだけ出す。
- 注記、相性、時期の天中殺、年柱、月柱、星の一覧、課金、アカウント、専門家表示は出さない。
- 生年月日を URL、localStorage、sessionStorage、cookie、fetch、外部AIへ出さない。
- 未入力は「年、月、日を入れてください。」。それ以外で計算できないときは「その日は存在しません。入れ直してください。」。
- 空白だけの欄は未入力とする。欄の値は整数として読む。
- UI に React は使わない。Pages Functions と Workers は置かない。アクセス解析は置かない。
- Cloudflare への配置と友人への URL 共有は、この計画の実行に含めない。
- 本文の文字列は設計書の「本文」節から一字も変えない。

## Review Focus

- 日本以外のタイムゾーンでも、入力した暦日の日柱が `Date.UTC` の日付差と一致する。Task 2 で固定する。
- 全角数字「１９８５」「０３」「１２」を半角の整数として読む。未対応だと実在する日を存在しない日と表示する。Task 1 で固定する。
- 「1985年」のように数字以外が混ざった欄は例外にせず、存在しない日として扱う。Task 1 で固定する。
- 「入れ直す」のあと、直前の種類名が画面に残らない。Task 4 で固定する。
- 「見てみる」を押しても `fetch`、`location.search`、`localStorage` が増えない。Task 4 で固定する。

---

### Task 1: 暦日の検証

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `vite.config.ts`
- Create: `src/domain/date.ts`
- Test: `src/domain/date.test.ts`

**Interfaces:**
- Consumes: なし
- Produces: `parseYmd(year: string, month: string, day: string): Ymd | "empty" | "invalid"`。`Ymd` は `{ year: number; month: number; day: number }`。空欄と空白だけは `"empty"`。範囲外、存在しない日、整数でない値は `"invalid"`。

- [ ] **Step 1: テストを実行できる土台を作る**

`package.json`:

```json
{
  "name": "your-destiny",
  "private": true,
  "type": "module",
  "engines": { "node": ">=22" },
  "scripts": {
    "dev": "vite",
    "build": "tsc --noEmit && vite build",
    "test": "vitest run"
  }
}
```

`tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noEmit": true,
    "lib": ["ES2022", "DOM"],
    "skipLibCheck": true
  },
  "include": ["src", "vite.config.ts"]
}
```

`vite.config.ts`:

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
```

Run: `npm install -D typescript@5 vite@6 vitest@3`
Expected: `package-lock.json` ができ、`npm test` はテストファイルなしで終了する。

- [ ] **Step 2: Write the failing test**

`src/domain/date.test.ts`:

```ts
import { describe, expect, test } from "vitest";
import { parseYmd } from "./date";

describe("parseYmd", () => {
  test("実在する日を整数にする", () => {
    expect(parseYmd("1985", "3", "12")).toEqual({ year: 1985, month: 3, day: 12 });
    expect(parseYmd("01985", "03", "012")).toEqual({ year: 1985, month: 3, day: 12 });
    expect(parseYmd("１９８５", "０３", "１２")).toEqual({ year: 1985, month: 3, day: 12 });
  });

  test("空白は未入力", () => {
    expect(parseYmd("", "3", "12")).toBe("empty");
    expect(parseYmd("  ", "3", "12")).toBe("empty");
  });

  test("範囲外と存在しない日と数字以外は invalid", () => {
    expect(parseYmd("1899", "12", "31")).toBe("invalid");
    expect(parseYmd("2100", "1", "1")).toBe("invalid");
    expect(parseYmd("1985", "2", "31")).toBe("invalid");
    expect(parseYmd("1900", "2", "29")).toBe("invalid");
    expect(parseYmd("2000", "2", "29")).toEqual({ year: 2000, month: 2, day: 29 });
    expect(parseYmd("1985年", "3", "12")).toBe("invalid");
    expect(parseYmd("1985.5", "3", "12")).toBe("invalid");
  });

  test("境界の日は通す", () => {
    expect(parseYmd("1900", "1", "1")).toEqual({ year: 1900, month: 1, day: 1 });
    expect(parseYmd("2099", "12", "31")).toEqual({ year: 2099, month: 12, day: 31 });
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npx vitest run src/domain/date.test.ts`
Expected: FAIL。`./date` が見つからない。

- [ ] **Step 4: Write minimal implementation**

`src/domain/date.ts`:

```ts
export type Ymd = { year: number; month: number; day: number };

const MIN = Date.UTC(1900, 0, 1);
const MAX = Date.UTC(2099, 11, 31);

function toAsciiDigits(value: string): string {
  return value.trim().replace(/[０-９]/g, (char) => String(char.charCodeAt(0) - "０".charCodeAt(0)));
}

export function parseYmd(year: string, month: string, day: string): Ymd | "empty" | "invalid" {
  const fields = [year, month, day].map(toAsciiDigits);
  if (fields.some((field) => field === "")) return "empty";
  if (!fields.every((field) => /^\d+$/.test(field))) return "invalid";
  const ymd = { year: Number(fields[0]), month: Number(fields[1]), day: Number(fields[2]) };
  const utc = Date.UTC(ymd.year, ymd.month - 1, ymd.day);
  const check = new Date(utc);
  const real =
    check.getUTCFullYear() === ymd.year &&
    check.getUTCMonth() === ymd.month - 1 &&
    check.getUTCDate() === ymd.day;
  if (!real || utc < MIN || utc > MAX) return "invalid";
  return ymd;
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/domain/date.test.ts`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json tsconfig.json vite.config.ts src/domain/date.ts src/domain/date.test.ts
git commit -m "[quick] 西暦の年月日が実在するかを検証する"
```

### Task 2: 日柱

**Files:**
- Create: `src/domain/pillar.ts`
- Test: `src/domain/pillar.test.ts`

**Interfaces:**
- Consumes: `Ymd`
- Produces: `pillarFromYmd(ymd: Ymd): Pillar`。`Pillar` は `{ index: number; stem: string; branch: string; name: string; kind: TenchusatsuKind }`。`TenchusatsuKind` は `"子丑" | "寅卯" | "辰巳" | "午未" | "申酉" | "戌亥"`。

- [ ] **Step 1: Write the failing test**

`src/domain/pillar.test.ts`:

```ts
import { describe, expect, test } from "vitest";
import { pillarFromYmd } from "./pillar";

describe("pillarFromYmd", () => {
  test("公開例", () => {
    expect(pillarFromYmd({ year: 2000, month: 1, day: 1 })).toMatchObject({
      index: 54, name: "戊午", kind: "子丑",
    });
    expect(pillarFromYmd({ year: 1985, month: 3, day: 12 })).toMatchObject({
      index: 46, name: "庚戌", kind: "寅卯",
    });
    expect(pillarFromYmd({ year: 2011, month: 9, day: 26 })).toMatchObject({
      index: 20, name: "甲申", kind: "午未",
    });
  });

  test("Date.UTC の日付差と番号が一致する", () => {
    const diff = Math.round((Date.UTC(1985, 2, 12) - Date.UTC(2000, 0, 1)) / 86400000);
    const pillar = pillarFromYmd({ year: 1985, month: 3, day: 12 });
    expect(pillar.index).toBe((54 + diff % 60 + 60) % 60);
  });

  test("同じ暦日は同じ日柱", () => {
    const ymd = { year: 1985, month: 3, day: 12 };
    expect(pillarFromYmd(ymd)).toEqual(pillarFromYmd(ymd));
  });

  test("60通りで日の支が天中殺の2支に入らない", () => {
    for (let offset = 0; offset < 60; offset += 1) {
      const date = new Date(Date.UTC(2000, 0, 7 + offset));
      const pillar = pillarFromYmd({
        year: date.getUTCFullYear(),
        month: date.getUTCMonth() + 1,
        day: date.getUTCDate(),
      });
      expect(pillar.index).toBe(offset);
      expect(pillar.kind.includes(pillar.branch)).toBe(false);
    }
  });

  test("芸能人の暦日", () => {
    const people = [
      [1985, 3, 24, 58, "子丑"],
      [1955, 7, 1, 59, "子丑"],
      [1945, 8, 22, 59, "子丑"],
      [1972, 11, 13, 44, "寅卯"],
      [1983, 1, 19, 43, "寅卯"],
      [1969, 2, 6, 48, "寅卯"],
      [1988, 6, 11, 33, "辰巳"],
      [1986, 12, 24, 38, "辰巳"],
      [1978, 10, 2, 33, "辰巳"],
      [1994, 7, 5, 28, "午未"],
      [1999, 2, 3, 22, "午未"],
      [1983, 8, 30, 26, "午未"],
      [1991, 3, 10, 15, "申酉"],
      [1977, 9, 20, 16, "申酉"],
      [1983, 6, 17, 12, "申酉"],
      [1993, 2, 21, 9, "戌亥"],
      [1993, 2, 13, 1, "戌亥"],
      [1997, 1, 29, 7, "戌亥"],
    ] as const;
    for (const [year, month, day, index, kind] of people) {
      expect(pillarFromYmd({ year, month, day })).toMatchObject({ index, kind });
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/domain/pillar.test.ts`
Expected: FAIL。`./pillar` が見つからない。

- [ ] **Step 3: Write minimal implementation**

`src/domain/pillar.ts`:

```ts
import type { Ymd } from "./date";

const STEMS = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"] as const;
const BRANCHES = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"] as const;

export type TenchusatsuKind = "子丑" | "寅卯" | "辰巳" | "午未" | "申酉" | "戌亥";

const KINDS: readonly { from: number; to: number; kind: TenchusatsuKind }[] = [
  { from: 0, to: 9, kind: "戌亥" },
  { from: 10, to: 19, kind: "申酉" },
  { from: 20, to: 29, kind: "午未" },
  { from: 30, to: 39, kind: "辰巳" },
  { from: 40, to: 49, kind: "寅卯" },
  { from: 50, to: 59, kind: "子丑" },
];

export type Pillar = {
  index: number;
  stem: string;
  branch: string;
  name: string;
  kind: TenchusatsuKind;
};

const BASE = Date.UTC(2000, 0, 1);
const BASE_INDEX = 54;

export function pillarFromYmd(ymd: Ymd): Pillar {
  const diff = Math.round((Date.UTC(ymd.year, ymd.month - 1, ymd.day) - BASE) / 86400000);
  let index = (BASE_INDEX + diff) % 60;
  if (index < 0) index += 60;
  const stem = STEMS[index % 10];
  const branch = BRANCHES[index % 12];
  const found = KINDS.find((row) => index >= row.from && index <= row.to);
  if (!found) throw new Error(`index ${index} has no kind`);
  return { index, stem, branch, name: stem + branch, kind: found.kind };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/domain/pillar.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/domain/pillar.ts src/domain/pillar.test.ts
git commit -m "[quick] 日柱の番号から天中殺6種類の一つを決める"
```

### Task 3: 本文

**Files:**
- Create: `src/content/copies.ts`
- Test: `src/content/copies.test.ts`

**Interfaces:**
- Consumes: `TenchusatsuKind`、`pillarFromYmd`
- Produces: `copyFor(kind: TenchusatsuKind): Copy`。`Copy` は `{ kind, title, lead, thin: readonly [string, string], valued: readonly [string, string], scene, question, people: readonly [string, string, string] }`。6種類のキーをすべて持つ。

- [ ] **Step 1: Write the failing test**

`src/content/copies.test.ts` では、設計書の6種類について `title`、`lead`、`thin`、`valued`、`scene`、`question`、`people` が次の値と一致することを期待する。

```ts
import { describe, expect, test } from "vitest";
import { pillarFromYmd } from "../domain/pillar";
import { copyFor, type Copy } from "./copies";

const expected: Record<Copy["kind"], Copy> = {
  子丑: {
    kind: "子丑",
    title: "子丑天中殺",
    lead: "目上との縁よりも、目下との縁を大切にする。",
    thin: ["父や上司の用事は後回しになりやすい。", "先輩に相談されても深入りしない。"],
    valued: ["後輩が困っていると自分から動く。", "年下の話は最後まで聞く。"],
    scene: "上司の話は聞き流す。後輩が失敗した話だと自分から理由を聞く。",
    question: "最近、年下に頼まれて引き受けたことは何だ？",
    people: ["綾瀬はるか", "明石家さんま", "タモリ"],
  },
  寅卯: {
    kind: "寅卯",
    title: "寅卯天中殺",
    lead: "友人や兄弟との縁よりも、家庭との縁を大切にする。",
    thin: ["友人の誘いは後回しにする。", "兄弟の近況は聞き流す。"],
    valued: ["配偶者の話は最後まで聞く。", "家の予定は自分から入れる。"],
    scene: "友人の近況は流す。家の話になると具体的になる。",
    question: "今日の話を家に帰って誰にする？",
    people: ["木村拓哉", "宇多田ヒカル", "福山雅治"],
  },
  辰巳: {
    kind: "辰巳",
    title: "辰巳天中殺",
    lead: "気持ちを話すことよりも、実行することを大切にする。",
    thin: ["気持ちの吐露は短く終える。", "なぜそう感じるかは後回しにする。"],
    valued: ["次に何をするかは自分から決める。", "作業の話になると自分から口を出す。"],
    scene: "気持ちの話が続くと席を外したくなる。次に何をするかの話になると前に出る。",
    question: "今の話を次にやるのはいつだ？",
    people: ["新垣結衣", "石原さとみ", "浜崎あゆみ"],
  },
  午未: {
    kind: "午未",
    title: "午未天中殺",
    lead: "目下との縁よりも、目上との縁を大切にする。",
    thin: ["後輩の相談は短く終える。", "年下の失敗には深入りしない。"],
    valued: ["上司の評価は覚えている。", "父や先輩の話は最後まで聞く。"],
    scene: "後輩の相談は短く切る。上司の話になると内容を覚えている。",
    question: "上司か先輩にその件を伝えるとき、最初の一言は何だ？",
    people: ["大谷翔平", "橋本環奈", "松本潤"],
  },
  申酉: {
    kind: "申酉",
    title: "申酉天中殺",
    lead: "家庭との縁よりも、友人や兄弟との縁を大切にする。",
    thin: ["配偶者の話は短く終える。", "家の予定は後回しにする。"],
    valued: ["友人の誘いは自分から受ける。", "兄弟の近況は最後まで聞く。"],
    scene: "家の話は一文で終える。友人の話題だと自分から広げる。",
    question: "その話を最初に伝える友達は誰だ？",
    people: ["米津玄師", "安室奈美恵", "二宮和也"],
  },
  戌亥: {
    kind: "戌亥",
    title: "戌亥天中殺",
    lead: "実行することよりも、気持ちを話すことを大切にする。",
    thin: ["次に何をするかの段取りは後回しにする。", "作業の話は短く終える。"],
    valued: ["なぜそう感じるかは自分から聞く。", "気持ちの話だと最後までいる。"],
    scene: "段取りの話は後回しにする。気持ちの話だと長くいる。",
    question: "その件のどこに納得していない？",
    people: ["菅田将暉", "有村架純", "平野紫耀"],
  },
};

describe("copyFor", () => {
  test("6種類の本文が設計書と一致する", () => {
    for (const kind of Object.keys(expected) as Copy["kind"][]) {
      expect(copyFor(kind)).toEqual(expected[kind]);
    }
  });

  test("同じ暦日は同じ種類と同じ本文", () => {
    const ymd = { year: 1985, month: 3, day: 12 };
    const first = pillarFromYmd(ymd);
    const second = pillarFromYmd(ymd);
    expect(copyFor(second.kind)).toEqual(copyFor(first.kind));
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/content/copies.test.ts`
Expected: FAIL。`./copies` が見つからない。

- [ ] **Step 3: Write minimal implementation**

`src/content/copies.ts` に、上の `expected` と同じ6件を `const COPIES` として置く。`copyFor` はその種類のオブジェクトを返す。本文の句読点を実装時に変えない。

```ts
import type { TenchusatsuKind } from "../domain/pillar";

export type Copy = {
  kind: TenchusatsuKind;
  title: string;
  lead: string;
  thin: readonly [string, string];
  valued: readonly [string, string];
  scene: string;
  question: string;
  people: readonly [string, string, string];
};

const COPIES: Record<TenchusatsuKind, Copy> = {
  子丑: {
    kind: "子丑",
    title: "子丑天中殺",
    lead: "目上との縁よりも、目下との縁を大切にする。",
    thin: ["父や上司の用事は後回しになりやすい。", "先輩に相談されても深入りしない。"],
    valued: ["後輩が困っていると自分から動く。", "年下の話は最後まで聞く。"],
    scene: "上司の話は聞き流す。後輩が失敗した話だと自分から理由を聞く。",
    question: "最近、年下に頼まれて引き受けたことは何だ？",
    people: ["綾瀬はるか", "明石家さんま", "タモリ"],
  },
  寅卯: {
    kind: "寅卯",
    title: "寅卯天中殺",
    lead: "友人や兄弟との縁よりも、家庭との縁を大切にする。",
    thin: ["友人の誘いは後回しにする。", "兄弟の近況は聞き流す。"],
    valued: ["配偶者の話は最後まで聞く。", "家の予定は自分から入れる。"],
    scene: "友人の近況は流す。家の話になると具体的になる。",
    question: "今日の話を家に帰って誰にする？",
    people: ["木村拓哉", "宇多田ヒカル", "福山雅治"],
  },
  辰巳: {
    kind: "辰巳",
    title: "辰巳天中殺",
    lead: "気持ちを話すことよりも、実行することを大切にする。",
    thin: ["気持ちの吐露は短く終える。", "なぜそう感じるかは後回しにする。"],
    valued: ["次に何をするかは自分から決める。", "作業の話になると自分から口を出す。"],
    scene: "気持ちの話が続くと席を外したくなる。次に何をするかの話になると前に出る。",
    question: "今の話を次にやるのはいつだ？",
    people: ["新垣結衣", "石原さとみ", "浜崎あゆみ"],
  },
  午未: {
    kind: "午未",
    title: "午未天中殺",
    lead: "目下との縁よりも、目上との縁を大切にする。",
    thin: ["後輩の相談は短く終える。", "年下の失敗には深入りしない。"],
    valued: ["上司の評価は覚えている。", "父や先輩の話は最後まで聞く。"],
    scene: "後輩の相談は短く切る。上司の話になると内容を覚えている。",
    question: "上司か先輩にその件を伝えるとき、最初の一言は何だ？",
    people: ["大谷翔平", "橋本環奈", "松本潤"],
  },
  申酉: {
    kind: "申酉",
    title: "申酉天中殺",
    lead: "家庭との縁よりも、友人や兄弟との縁を大切にする。",
    thin: ["配偶者の話は短く終える。", "家の予定は後回しにする。"],
    valued: ["友人の誘いは自分から受ける。", "兄弟の近況は最後まで聞く。"],
    scene: "家の話は一文で終える。友人の話題だと自分から広げる。",
    question: "その話を最初に伝える友達は誰だ？",
    people: ["米津玄師", "安室奈美恵", "二宮和也"],
  },
  戌亥: {
    kind: "戌亥",
    title: "戌亥天中殺",
    lead: "実行することよりも、気持ちを話すことを大切にする。",
    thin: ["次に何をするかの段取りは後回しにする。", "作業の話は短く終える。"],
    valued: ["なぜそう感じるかは自分から聞く。", "気持ちの話だと最後までいる。"],
    scene: "段取りの話は後回しにする。気持ちの話だと長くいる。",
    question: "その件のどこに納得していない？",
    people: ["菅田将暉", "有村架純", "平野紫耀"],
  },
};

export function copyFor(kind: TenchusatsuKind): Copy {
  return COPIES[kind];
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/content/copies.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/content/copies.ts src/content/copies.test.ts
git commit -m "[quick] 6種類の定型文を定数にする"
```

### Task 4: 画面

**Files:**
- Create: `index.html`
- Create: `src/main.ts`
- Create: `src/style.css`
- Create: `src/ui/app.ts`
- Test: `src/ui/app.test.ts`

**Interfaces:**
- Consumes: `parseYmd`、`pillarFromYmd`、`copyFor`
- Produces: `mount(root: HTMLElement): void`。入力が3欄、送信が「見てみる」、結果が5ブロック、戻りが「入れ直す」。

- [ ] **Step 1: happy-dom を入れて、失敗するテストを書く**

Run: `npm install -D happy-dom@17`
Expected: `package.json` の devDependencies に `happy-dom` が入る。

`src/ui/app.test.ts` の先頭に `// @vitest-environment happy-dom` を置く。

```ts
// @vitest-environment happy-dom
import { beforeEach, describe, expect, test, vi } from "vitest";
import { mount } from "./app";

function setup() {
  document.body.innerHTML = '<div id="app"></div>';
  mount(document.querySelector("#app") as HTMLElement);
}

function field(name: string): HTMLInputElement {
  const input = document.querySelector(`input[name="${name}"]`);
  if (!(input instanceof HTMLInputElement)) throw new Error(name);
  return input;
}

beforeEach(() => {
  localStorage.clear();
});

describe("mount", () => {
  test("欄は年、月、日だけ", () => {
    setup();
    expect([...document.querySelectorAll("input")].map((input) => input.getAttribute("name"))).toEqual([
      "year", "month", "day",
    ]);
    expect(document.body.textContent).not.toContain("呼び名");
    expect(document.body.textContent).not.toContain("時刻");
  });

  test("空欄では結果を出さない", () => {
    setup();
    field("year").value = "1985";
    document.querySelector("form")!.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    expect(document.body.textContent).toContain("年、月、日を入れてください。");
    expect(document.querySelector("[data-part='lead']")).toBeNull();
  });

  test("存在しない日では結果を出さない", () => {
    setup();
    field("year").value = "1985年";
    field("month").value = "3";
    field("day").value = "12";
    document.querySelector("form")!.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    expect(document.body.textContent).toContain("その日は存在しません。入れ直してください。");
    expect(document.querySelector("[data-part='lead']")).toBeNull();
  });

  test("2000年1月1日は子丑を出し、通信も保存もしない", () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    setup();
    field("year").value = "2000";
    field("month").value = "1";
    field("day").value = "1";
    document.querySelector("form")!.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    const text = document.body.textContent ?? "";
    const leadAt = text.indexOf("目上との縁よりも、目下との縁を大切にする。");
    const thinAt = text.indexOf("父や上司の用事は後回しになりやすい。");
    const sceneAt = text.indexOf("上司の話は聞き流す。後輩が失敗した話だと自分から理由を聞く。");
    const questionAt = text.indexOf("最近、年下に頼まれて引き受けたことは何だ？");
    const personAt = text.indexOf("綾瀬はるか");
    expect(text.indexOf("子丑天中殺")).toBeLessThan(leadAt);
    expect(leadAt).toBeLessThan(thinAt);
    expect(thinAt).toBeLessThan(sceneAt);
    expect(sceneAt).toBeLessThan(questionAt);
    expect(questionAt).toBeLessThan(personAt);
    expect(text).not.toContain("時期の吉凶");
    expect(text).not.toContain("鑑定");
    expect(text).not.toContain("相性");
    expect(location.search).toBe("");
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(localStorage.length).toBe(0);
    expect(document.querySelector("form")).toBeNull();
    fetchSpy.mockRestore();
  });

  test("入れ直すと結果が残らない", () => {
    setup();
    field("year").value = "2000";
    field("month").value = "1";
    field("day").value = "1";
    document.querySelector("form")!.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    document.querySelector("#reset")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(document.body.textContent).not.toContain("子丑天中殺");
    expect(field("year").value).toBe("");
    expect(document.querySelector("[data-part='lead']")).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/ui/app.test.ts`
Expected: FAIL。`./app` が見つからない。

- [ ] **Step 3: Write minimal implementation**

`index.html`:

```html
<!doctype html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex" />
    <title>天中殺</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

`src/main.ts`:

```ts
import { mount } from "./ui/app";
import "./style.css";

const root = document.querySelector("#app");
if (root instanceof HTMLElement) mount(root);
```

`src/style.css`:

```css
body {
  margin: 0;
  font: 16px/1.7 sans-serif;
}
main {
  max-width: 32rem;
  margin: 0 auto;
  padding: 1rem;
  overflow-x: hidden;
}
label, button {
  display: block;
  margin: 0.75rem 0;
}
input {
  font: inherit;
  width: 8rem;
}
```

`src/ui/app.ts`:

```ts
import { copyFor } from "../content/copies";
import { parseYmd } from "../domain/date";
import { pillarFromYmd } from "../domain/pillar";

export function mount(root: HTMLElement): void {
  root.replaceChildren();
  const main = document.createElement("main");
  root.append(main);
  showForm(main);
}

function showForm(main: HTMLElement): void {
  main.replaceChildren();
  const form = document.createElement("form");
  form.append(labeled("年", "year"), labeled("月", "month"), labeled("日", "day"));
  const button = document.createElement("button");
  button.type = "submit";
  button.textContent = "見てみる";
  const message = document.createElement("p");
  form.append(button, message);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const year = value(form, "year");
    const month = value(form, "month");
    const day = value(form, "day");
    const parsed = parseYmd(year, month, day);
    if (parsed === "empty") {
      message.textContent = "年、月、日を入れてください。";
      return;
    }
    if (parsed === "invalid") {
      message.textContent = "その日は存在しません。入れ直してください。";
      return;
    }
    showResult(main, parsed);
  });
  main.append(form);
}

function showResult(main: HTMLElement, ymd: { year: number; month: number; day: number }): void {
  const copy = copyFor(pillarFromYmd(ymd).kind);
  main.replaceChildren();
  const title = document.createElement("h1");
  title.textContent = copy.title;
  const lead = paragraph("lead", copy.lead);
  const distance = document.createElement("ul");
  distance.dataset.part = "distance";
  for (const line of [...copy.thin, ...copy.valued]) {
    const item = document.createElement("li");
    item.textContent = line;
    distance.append(item);
  }
  const people = document.createElement("ul");
  people.dataset.part = "people";
  for (const name of copy.people) {
    const item = document.createElement("li");
    item.textContent = name;
    people.append(item);
  }
  const reset = document.createElement("button");
  reset.id = "reset";
  reset.type = "button";
  reset.textContent = "入れ直す";
  reset.addEventListener("click", () => showForm(main));
  main.append(title, lead, distance, paragraph("scene", copy.scene), paragraph("question", copy.question), people, reset);
}

function labeled(label: string, name: string): HTMLLabelElement {
  const wrap = document.createElement("label");
  wrap.append(label);
  const input = document.createElement("input");
  input.name = name;
  input.inputMode = "numeric";
  wrap.append(input);
  return wrap;
}

function value(form: HTMLFormElement, name: string): string {
  const input = form.elements.namedItem(name);
  return input instanceof HTMLInputElement ? input.value : "";
}

function paragraph(part: string, text: string): HTMLParagraphElement {
  const node = document.createElement("p");
  node.dataset.part = part;
  node.textContent = text;
  return node;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/ui/app.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add index.html src/main.ts src/style.css src/ui/app.ts src/ui/app.test.ts package.json package-lock.json
git commit -m "[quick] 入力と結果を同じページで切り替える"
```

### Task 5: 検索回避と静的ビルド

**Files:**
- Create: `public/_headers`
- Modify: `AGENTS.md` の Commands
- Test: `src/build/static.test.ts`

**Interfaces:**
- Consumes: Task 4 の `index.html`
- Produces: `dist/index.html`。`public/_headers` は全パスへ `X-Robots-Tag: noindex` を付ける。配置コマンドは作らない。

- [ ] **Step 1: Write the failing test**

`src/build/static.test.ts`:

```ts
import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";

describe("static", () => {
  test("検索エンジンへ載せない", () => {
    const html = readFileSync("index.html", "utf8");
    const headers = readFileSync("public/_headers", "utf8");
    const css = readFileSync("src/style.css", "utf8");
    expect(html).toContain('content="noindex"');
    expect(headers).toContain("/*");
    expect(headers).toContain("X-Robots-Tag: noindex");
    expect(css).toContain("overflow-x: hidden");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/build/static.test.ts`
Expected: FAIL。`public/_headers` が見つからない。

- [ ] **Step 3: Write minimal implementation**

`public/_headers`:

```text
/*
  X-Robots-Tag: noindex
```

`AGENTS.md` の Commands を次に替える。

```md
## Commands

Node.js 22 以上。

- `npm test`：Vitest
- `npm run dev`：ローカル表示
- `npm run build`：dist へ静的ファイルを出す

文書の確認は `git diff --check`。Cloudflare への配置は、その操作の明示承認があるまで行わない。
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run && npm run build`
Expected: テストが PASS。`dist/index.html` がある。`functions` ディレクトリはできない。

- [ ] **Step 5: Commit**

```bash
git add public/_headers src/build/static.test.ts AGENTS.md
git commit -m "[quick] 検索回避と静的ビルドを確認する"
```
