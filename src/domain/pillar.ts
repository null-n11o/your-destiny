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
