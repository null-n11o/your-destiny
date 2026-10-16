// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
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
function submit(year="2000",month="1",day="1") {
  field("year").value=year; field("month").value=month; field("day").value=day;
  document.querySelector("form")!.dispatchEvent(new Event("submit",{bubbles:true,cancelable:true}));
}
beforeEach(()=>{
  localStorage.clear(); sessionStorage.clear();
  vi.useFakeTimers(); vi.setSystemTime(new Date("2026-10-16T09:00:00Z"));
});
afterEach(()=>{vi.restoreAllMocks();vi.unstubAllGlobals();vi.useRealTimers();});

const chapters = ["あなたの全体像","人生で育てる軸","縁と人との関わり","強みとつまずき","力を発揮する仕事と環境","恋愛で相性のよい人","仕事で相性のよい人","今後3年間","自分を振り返る問い","同じ天中殺の芸能人"];
describe("自己分析の画面",()=>{
  test("本人の年月日だけで自己分析を始める",()=>{
    setup();
    expect([...document.querySelectorAll("input")].map(n=>n.name)).toEqual(["year","month","day"]);
    expect(document.body.textContent).toContain("自己分析");
    expect(document.querySelector("button")?.textContent).toBe("見てみる");
    expect(document.body.textContent).not.toContain("呼び名");
    expect(document.body.textContent).not.toContain("時刻");
  });
  test("空欄と不正日を結果へ進めず読み上げへ知らせる",()=>{
    setup(); submit("1985","","");
    const alert = document.querySelector('[role="alert"]');
    expect(alert?.textContent).toBe("年、月、日を入れてください。");
    expect(document.querySelector("nav")).toBeNull();
    submit("1985年","3","12");
    expect(alert?.textContent).toBe("その日は存在しません。入れ直してください。");
    expect(document.querySelector("[data-year]")).toBeNull();
  });
  test("全角の実在日から本人の結果を読む",()=>{
    setup(); submit("１９８５","０３","１２");
    expect(document.querySelector("h1")?.textContent).toBe("寅卯天中殺");
    expect(document.body.textContent).toContain("受け継いだもの");
  });
  test("10章を全文表示し、旧短文を詳しい本文へ置き換える",()=>{
    setup(); submit();
    const sections = [...document.querySelectorAll("main > section")];
    expect(sections.map(n=>n.querySelector("h2")?.textContent)).toEqual(chapters);
    expect(document.querySelector("details, [hidden]")).toBeNull();
    expect(document.querySelector("h1")?.textContent).toBe("子丑天中殺");
    expect(document.querySelector("[data-part='lead']")?.textContent).toContain("自分で道をつくり");
    expect(document.body.textContent).not.toContain("父や上司の用事は後回しになりやすい。");
    expect(document.body.textContent).not.toContain("上司の話は聞き流す。");
    const body = sections.map(n=>n.textContent??"").join("");
    expect(body.length).toBeGreaterThanOrEqual(3500);
    expect(body.length).toBeLessThanOrEqual(5200);
    expect(document.querySelectorAll('[data-part="questions"] li')).toHaveLength(3);
    expect([...document.querySelectorAll('[data-part="people"] li')].map(n=>n.textContent)).toEqual(["綾瀬はるか","明石家さんま","タモリ"]);
    expect(document.querySelector("form")).toBeNull();
    expect(document.activeElement).toBe(document.querySelector("h1"));
  });
  test("日本時間の今年から3年間を表示し、テーマを分ける",()=>{
    vi.setSystemTime(new Date("2026-12-31T15:00:00Z"));
    setup(); submit();
    const cards=[...document.querySelectorAll("[data-year]")];
    expect(cards.map(n=>n.getAttribute("data-year"))).toEqual(["2027","2028","2029"]);
    expect(cards.map(n=>n.querySelector("h3")?.textContent)).toEqual(["2027年","2028年","2029年"]);
    expect(cards[0].textContent).toContain("学びを深め");
    expect(cards[1].textContent).toContain("自分の軸を固める");
    expect(cards[0].textContent).toContain("2027年の立春〜2028年の立春前日");
    for(const card of cards) expect(card.querySelectorAll("li")).toHaveLength(2);
  });
  test("午未の2026・2027年にだけ天中殺の表示を出す",()=>{
    setup(); submit("1994","7","5");
    expect([...document.querySelectorAll('[data-year] [data-tenchusatsu]')].map(n=>n.closest("[data-year]")?.getAttribute("data-year"))).toEqual(["2026","2027"]);
    expect(document.querySelector('[data-year="2028"]')?.textContent).not.toContain("天中殺に当たる年");
  });
  test("目次から章を移動し、URLに入力を残さない",()=>{
    setup(); submit(); const initialUrl=location.href;
    const links=[...document.querySelectorAll<HTMLAnchorElement>('nav[aria-label="結果の目次"] a')];
    expect(links.map(n=>n.textContent)).toEqual(chapters);
    for(const link of links) {
      const target=document.getElementById(link.getAttribute("href")!.slice(1));
      expect(target?.querySelector("h2")?.textContent).toBe(link.textContent);
    }
    links[5].click();
    expect(document.activeElement?.textContent).toBe("恋愛で相性のよい人");
    expect(location.href).toBe(initialUrl);
  });
  test("表示・章移動・再入力で出生年月日を通信も保存もしない",()=>{
    const fetchSpy=vi.spyOn(globalThis,"fetch");
    const xhrSpy=vi.spyOn(XMLHttpRequest.prototype,"send");
    const beaconSpy=vi.spyOn(navigator,"sendBeacon");
    const localSpy=vi.spyOn(localStorage,"setItem");
    const sessionSpy=vi.spyOn(sessionStorage,"setItem");
    const cookieSpy=vi.spyOn(document,"cookie","set");
    const url=location.href;
    setup(); submit();
    document.querySelector<HTMLAnchorElement>("nav a")!.click();
    document.querySelector<HTMLButtonElement>("#reset")!.click();
    expect(fetchSpy).not.toHaveBeenCalled();expect(xhrSpy).not.toHaveBeenCalled();expect(beaconSpy).not.toHaveBeenCalled();
    expect(localSpy).not.toHaveBeenCalled();expect(sessionSpy).not.toHaveBeenCalled();expect(cookieSpy).not.toHaveBeenCalled();
    expect(location.href).toBe(url);
    expect(localStorage.length).toBe(0);expect(sessionStorage.length).toBe(0);
  });
  test("再入力で本文・年・目次を消し、空の年欄へ戻る",()=>{
    setup(); submit();
    const reset=document.querySelector<HTMLButtonElement>("#reset")!;
    reset.focus();reset.click();
    expect(document.querySelector("nav, [data-year], main > section")).toBeNull();
    expect(document.body.textContent).not.toContain("子丑天中殺");
    expect(document.body.textContent).not.toContain("恋愛で相性のよい人");
    expect([field("year").value,field("month").value,field("day").value]).toEqual(["","",""]);
    expect(document.activeElement).toBe(field("year"));
  });
});
