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
