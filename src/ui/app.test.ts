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

  test("入力エラーを読み上げへ通知する", () => {
    setup();
    const alert = document.querySelector('[role="alert"]');
    expect(alert).not.toBeNull();
    expect(alert?.textContent).toBe("");
    document.querySelector("form")!.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    expect(alert?.textContent).toBe("年、月、日を入れてください。");
    field("year").value = "1985年";
    field("month").value = "3";
    field("day").value = "12";
    document.querySelector("form")!.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    expect(alert?.textContent).toBe("その日は存在しません。入れ直してください。");
  });

  test("結果の見出しと再入力先へフォーカスを移す", () => {
    setup();
    field("year").value = "2000";
    field("month").value = "1";
    field("day").value = "1";
    document.querySelector<HTMLButtonElement>('button[type="submit"]')!.focus();
    document.querySelector("form")!.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    const heading = document.querySelector("h1");
    expect(heading).not.toBeNull();
    expect(document.activeElement).toBe(heading);
    const reset = document.querySelector<HTMLButtonElement>("#reset")!;
    reset.focus();
    reset.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(document.activeElement).toBe(field("year"));
    expect(field("year").value).toBe("");
  });


  test("結果を5つの見出し付きブロックとして読む", () => {
    setup();
    expect(document.querySelector("h1")?.textContent).toBe("天中殺");
    field("year").value = "2000";
    field("month").value = "1";
    field("day").value = "1";
    document.querySelector("form")!.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    const blocks = [...document.querySelectorAll("main > section")];
    expect(blocks).toHaveLength(5);
    expect(blocks.map((block) => block.querySelector("h1, h2")?.textContent)).toEqual([
      "子丑天中殺", "人との距離", "今夜の場面", "隣への問い", "同じ天中殺の芸能人",
    ]);
    expect(blocks[1].querySelectorAll("li")).toHaveLength(4);
    expect(blocks[4].querySelectorAll("li")).toHaveLength(3);
  });

});
