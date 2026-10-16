import { describe, expect, test } from "vitest";
import { peopleFor } from "./people";
import { copyFor } from "./copies";
import { pillarFromYmd, type TenchusatsuKind } from "../domain/pillar";

const kinds: TenchusatsuKind[] = ["子丑", "寅卯", "辰巳", "午未", "申酉", "戌亥"];

describe("同じ天中殺の著名人", () => {
  test("全員の公開暦日が表示先の天中殺と一致し、重複しない", () => {
    const names: string[] = [];
    for (const kind of kinds) {
      for (const person of peopleFor(kind)) {
        const [year, month, day] = person.birthDate.split("-").map(Number);
        expect(pillarFromYmd({ year, month, day }).kind, person.name).toBe(kind);
        names.push(person.name);
      }
    }
    expect(new Set(names).size).toBe(names.length);
  });

  test("既存の例を残し、各タイプで国と分野の違う人物を読める", () => {
    for (const kind of kinds) {
      const people = peopleFor(kind);
      expect(people.length).toBeGreaterThanOrEqual(7);
      expect(people.map(person => person.name)).toEqual(expect.arrayContaining([...copyFor(kind).people]));
      expect(new Set(people.map(person => person.country)).size).toBeGreaterThanOrEqual(3);
      expect(people.some(person => person.field === "スポーツ")).toBe(true);
      expect(people.some(person => person.field === "ビジネス")).toBe(true);
      expect(people.some(person => person.field === "音楽")).toBe(true);
      for (const person of people) expect(person.role.length).toBeGreaterThan(0);
    }
  });
});
