import { describe, expect, test } from "vitest";
import { profileFor } from "./profiles";
import { annualCopyFor } from "./outlook";
import { outlookFor } from "../domain/outlook";
import { pillarFromYmd } from "../domain/pillar";

const kinds = ["子丑", "寅卯", "辰巳", "午未", "申酉", "戌亥"] as const;
describe("自己分析の本文", () => {
  test("6種類の軸と全章・3つの問いを持つ", () => {
    const anchors = ["自分", "受け継", "自由", "深", "外", "納得"];
    kinds.forEach((kind,index) => {
      const p = profileFor(kind);
      expect(p.headline).toContain(anchors[index]);
      expect(p.overview.join("").length).toBeGreaterThanOrEqual(600);
      for(const key of ["axis","ties","strengths","work","love","team"] as const) {
        expect(p[key].length).toBeGreaterThanOrEqual(2);
        expect(p[key].join("").length).toBeGreaterThanOrEqual(200);
      }
      expect(p.love).not.toEqual(p.team);
      expect(p.questions).toHaveLength(3);
      expect(new Set(p.questions).size).toBe(3);
      expect(p.action.length).toBeGreaterThan(60);
    });
    expect(new Set(kinds.map(kind=>profileFor(kind).overview.join(""))).size).toBe(6);
    expect(new Set(kinds.map(kind=>profileFor(kind).love.join(""))).size).toBe(6);
  });
  test("日柱60通りで3年間を含む本文が3500〜5000字", () => {
    for(let index=0;index<60;index++) {
      const date = new Date(Date.UTC(2000,0,7+index));
      const pillar = pillarFromYmd({year:date.getUTCFullYear(),month:date.getUTCMonth()+1,day:date.getUTCDate()});
      const p = profileFor(pillar.kind);
      const profileText = [p.headline,...p.overview,...p.axis,...p.ties,...p.strengths,...p.work,...p.love,...p.team,...p.questions,p.action].join("");
      const annualText = [2026,2027,2028].map(year=>{
        const copy = annualCopyFor(outlookFor(pillar,year));
        return [copy.theme,...copy.paragraphs,...copy.actions,copy.caution].join("");
      }).join("");
      expect(profileText.length+annualText.length,`${pillar.kind} ${pillar.name}`).toBeGreaterThanOrEqual(3500);
      expect(profileText.length+annualText.length,`${pillar.kind} ${pillar.name}`).toBeLessThanOrEqual(5000);
    }
  });
});
