import type { Pillar } from "./pillar";

export type AnnualStar = "貫索" | "石門" | "鳳閣" | "調舒" | "禄存" | "司禄" | "車騎" | "牽牛" | "龍高" | "玉堂";
export type Outlook = { year: number; stem: string; branch: string; star: AnnualStar; isTenchusatsu: boolean };
const STEMS = [..."甲乙丙丁戊己庚辛壬癸"];
const BRANCHES = [..."子丑寅卯辰巳午未申酉戌亥"];
// 五行を相生の順（木・火・土・金・水）に並べる。
const STARS: readonly (readonly [AnnualStar, AnnualStar])[] = [
  ["貫索", "石門"], ["鳳閣", "調舒"], ["禄存", "司禄"],
  ["車騎", "牽牛"], ["龍高", "玉堂"],
];

export function readingYears(now: Date): readonly number[] {
  const year = Number(new Intl.DateTimeFormat("en", { timeZone: "Asia/Tokyo", year: "numeric" }).format(now));
  return [year, year + 1, year + 2];
}

export function outlookFor(pillar: Pillar, year: number): Outlook {
  const index = ((year - 1984) % 60 + 60) % 60;
  const annual = index % 10;
  const day = STEMS.indexOf(pillar.stem);
  if (day < 0 || !Number.isSafeInteger(year)) throw new RangeError("日干と年を確認してください");
  const relation = (Math.floor(annual / 2) - Math.floor(day / 2) + 5) % 5;
  const star = STARS[relation][day % 2 === annual % 2 ? 0 : 1];
  const branch = BRANCHES[index % 12];
  return { year, stem: STEMS[annual], branch, star, isTenchusatsu: pillar.kind.includes(branch) };
}
