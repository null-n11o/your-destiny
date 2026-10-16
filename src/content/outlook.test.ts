import { describe, expect, test } from "vitest";
import { annualCopyFor } from "./outlook";
import type { AnnualStar, Outlook } from "../domain/outlook";
const stars: AnnualStar[] = ["貫索","石門","鳳閣","調舒","禄存","司禄","車騎","牽牛","龍高","玉堂"];
describe("年別の文章", () => {
  test("10テーマを固有の説明・2つの行動・注意点へする", () => {
    const themes = stars.map(star=>annualCopyFor({year:2026,stem:"丙",branch:"午",star,isTenchusatsu:false}));
    expect(new Set(themes.map(c=>c.theme)).size).toBe(10);
    for(const copy of themes) {
      expect(copy.paragraphs.length).toBeGreaterThanOrEqual(2);
      expect(copy.actions).toHaveLength(2);
      expect([copy.theme,...copy.paragraphs,...copy.actions,copy.caution].join("").length).toBeGreaterThanOrEqual(280);
    }
  });
  test("天中殺ではテーマを保ち、実践を棚卸しや練習へ切り替える", () => {
    const base: Outlook = {year:2026,stem:"丙",branch:"午",star:"龍高",isTenchusatsu:false};
    const normal = annualCopyFor(base);
    const quiet = annualCopyFor({...base,isTenchusatsu:true});
    expect(quiet.theme).toBe(normal.theme);
    expect(quiet.actions).not.toEqual(normal.actions);
    expect(quiet.paragraphs.join("")).toContain("天中殺");
    expect(quiet.caution).not.toBe(normal.caution);
    expect(normal.paragraphs.join("")).not.toContain("天中殺");
  });
});
