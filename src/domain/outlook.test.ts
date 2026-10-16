import { describe, expect, test } from "vitest";
import { outlookFor, readingYears } from "./outlook";
import { pillarFromYmd, type TenchusatsuKind } from "./pillar";

const base = pillarFromYmd({year: 2000, month: 1, day: 1});
describe("年ごとの読み方", () => {
  test("戊午の3年間は龍高・玉堂・貫索", () => {
    expect([2026,2027,2028].map(year => outlookFor(base,year))).toEqual([
      {year:2026,stem:"丙",branch:"午",star:"龍高",isTenchusatsu:false},
      {year:2027,stem:"丁",branch:"未",star:"玉堂",isTenchusatsu:false},
      {year:2028,stem:"戊",branch:"申",star:"貫索",isTenchusatsu:false},
    ]);
  });
  test("午未天中殺は2026・2027年に当たる", () => {
    const pillar = pillarFromYmd({year:1994,month:7,day:5});
    expect([2026,2027,2028].map(year=>outlookFor(pillar,year).isTenchusatsu)).toEqual([true,true,false]);
  });
  test("日干と年干100通りを五行・陰陽の対応表へ合わせる", () => {
    const stems = [..."甲乙丙丁戊己庚辛壬癸"];
    const table = [
      "貫索 石門 鳳閣 調舒 禄存 司禄 車騎 牽牛 龍高 玉堂",
      "石門 貫索 調舒 鳳閣 司禄 禄存 牽牛 車騎 玉堂 龍高",
      "龍高 玉堂 貫索 石門 鳳閣 調舒 禄存 司禄 車騎 牽牛",
      "玉堂 龍高 石門 貫索 調舒 鳳閣 司禄 禄存 牽牛 車騎",
      "車騎 牽牛 龍高 玉堂 貫索 石門 鳳閣 調舒 禄存 司禄",
      "牽牛 車騎 玉堂 龍高 石門 貫索 調舒 鳳閣 司禄 禄存",
      "禄存 司禄 車騎 牽牛 龍高 玉堂 貫索 石門 鳳閣 調舒",
      "司禄 禄存 牽牛 車騎 玉堂 龍高 石門 貫索 調舒 鳳閣",
      "鳳閣 調舒 禄存 司禄 車騎 牽牛 龍高 玉堂 貫索 石門",
      "調舒 鳳閣 司禄 禄存 牽牛 車騎 玉堂 龍高 石門 貫索",
    ];
    for(let day=0;day<10;day++) for(let annual=0;annual<10;annual++) {
      expect(outlookFor({...base,stem:stems[day]},1984+annual).star).toBe(table[day].split(" ")[annual]);
    }
  });
  test("年支12通りの該当者と60年周期", () => {
    const kinds: TenchusatsuKind[] = ["子丑","寅卯","辰巳","午未","申酉","戌亥"];
    for(let offset=0;offset<60;offset++) {
      const first = outlookFor(base,1984+offset);
      expect(outlookFor(base,2044+offset)).toEqual({...first,year:2044+offset});
      for(const kind of kinds) expect(outlookFor({...base,kind},1984+offset).isTenchusatsu).toBe(kind===["子丑","子丑","寅卯","寅卯","辰巳","辰巳","午未","午未","申酉","申酉","戌亥","戌亥"][offset%12]);
    }
  });
  test("日本時間の年越しから3年を選ぶ", () => {
    expect(readingYears(new Date("2026-12-31T14:59:59Z"))).toEqual([2026,2027,2028]);
    expect(readingYears(new Date("2026-12-31T15:00:00Z"))).toEqual([2027,2028,2029]);
    expect(readingYears(new Date("2026-01-01T00:00:00Z"))).toEqual([2026,2027,2028]);
  });
});
