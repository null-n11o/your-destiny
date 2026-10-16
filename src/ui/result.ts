import { peopleFor } from "../content/people";
import { profileFor, type Profile } from "../content/profiles";
import { annualCopyFor } from "../content/outlook";
import { outlookFor, readingYears } from "../domain/outlook";
import type { Pillar } from "../domain/pillar";

const CHAPTERS: readonly [string, string, keyof Profile][] = [
  ["overview", "あなたの全体像", "overview"],
  ["axis", "人生で育てる軸", "axis"],
  ["ties", "縁と人との関わり", "ties"],
  ["strengths", "強みとつまずき", "strengths"],
  ["work", "力を発揮する仕事と環境", "work"],
  ["love", "恋愛で相性のよい人", "love"],
  ["team", "仕事で相性のよい人", "team"],
];

export function renderResult(main: HTMLElement, pillar: Pillar, reset: () => void, now = new Date()): void {
  const profile = profileFor(pillar.kind);
  main.replaceChildren();
  main.className = "result reading";
  const header = document.createElement("header");
  header.className = "report-header";
  header.append(text("p", "算命学の自己分析", "eyebrow"));
  const title = text("h1", `${pillar.kind}天中殺`);
  title.tabIndex = -1;
  const lead = text("p", profile.headline, "report-lead");
  lead.dataset.part = "lead";
  header.append(title, lead, text("p", "読む目安 5〜10分", "reading-time"));
  header.append(text("p", "天中殺の6分類をもとにした自己分析です。自分の経験と照らしながら、これからの選び方を考えてみてください。", "report-basis"));
  const blocks = CHAPTERS.map(([id, label, key]) => {
    const block = chapter(id, label);
    for (const paragraph of profile[key] as readonly string[]) block.append(text("p", paragraph));
    return block;
  });
  const outlook = chapter("outlook", "今後3年間");
  outlook.append(text("p", "日干と年の干支による、過ごし方の目安。命式全体や大運を合わせた総合的な年運とは異なります。", "section-intro"));
  for (const year of readingYears(now)) {
    const reading = outlookFor(pillar, year);
    const copy = annualCopyFor(reading);
    const card = document.createElement("article");
    card.className = "year-card";
    card.dataset.year = String(year);
    card.append(text("h3", `${year}年`), text("p", `${year}年の立春〜${year + 1}年の立春前日`, "year-period"));
    if (reading.isTenchusatsu) {
      const status = text("p", "天中殺に当たる年", "year-status");
      status.dataset.tenchusatsu = "true";
      card.append(status);
    }
    card.append(text("h4", copy.theme, "year-theme"));
    for (const paragraph of copy.paragraphs) card.append(text("p", paragraph));
    card.append(text("h5", "取り組むこと"), list(copy.actions));
    card.append(text("h5", "気をつけること"), text("p", copy.caution, "year-caution"));
    outlook.append(card);
  }
  const reflection = chapter("questions", "自分を振り返る問い");
  const questions = list(profile.questions, true);
  questions.dataset.part = "questions";
  reflection.append(questions, text("h3", "今週、一つ試すなら"), text("p", profile.action, "weekly-action"));
  const people = chapter("people", "同じ天中殺の著名人");
  const names = document.createElement("ul");
  for (const person of peopleFor(pillar.kind)) {
    const item = document.createElement("li");
    item.append(text("p", person.name, "person-name"), text("p", `${person.role}／${person.country}`, "person-meta"));
    names.append(item);
  }
  names.dataset.part = "people";
  people.append(names);
  blocks.push(outlook, reflection, people);
  const nav = document.createElement("nav");
  nav.id = "result-contents";
  nav.className = "contents";
  nav.setAttribute("aria-label", "結果の目次");
  nav.append(text("p", "この結果の内容", "contents-label"));
  const links = document.createElement("ol");
  for (const block of blocks) {
    const item = document.createElement("li");
    const link = document.createElement("a");
    link.href = `#${block.id}`;
    link.textContent = block.querySelector("h2")!.textContent;
    link.addEventListener("click", event => {
      event.preventDefault();
      block.querySelector("h2")!.focus();
    });
    item.append(link);
    links.append(item);
  }
  nav.append(links);
  const footer = document.createElement("footer");
  footer.className = "report-footer";
  const top = document.createElement("button");
  top.type = "button";
  top.className = "back-to-contents";
  top.textContent = "目次へ戻る";
  nav.tabIndex = -1;
  top.addEventListener("click", () => nav.focus());
  const resetButton = document.createElement("button");
  resetButton.id = "reset";
  resetButton.type = "button";
  resetButton.textContent = "入れ直す";
  resetButton.addEventListener("click", reset);
  footer.append(top, resetButton);
  main.append(header, nav, ...blocks, footer);
  title.focus();
}

function text<K extends keyof HTMLElementTagNameMap>(tag: K, content: string, className?: string): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  node.textContent = content;
  if (className) node.className = className;
  return node;
}

function chapter(id: string, label: string): HTMLElement {
  const section = document.createElement("section");
  section.id = `analysis-${id}`;
  section.className = "analysis-section";
  const heading = text("h2", label);
  heading.id = `${section.id}-heading`;
  heading.tabIndex = -1;
  section.setAttribute("aria-labelledby", heading.id);
  section.append(heading);
  return section;
}

function list(lines: readonly string[], ordered = false): HTMLOListElement | HTMLUListElement {
  const node = document.createElement(ordered ? "ol" : "ul");
  for (const line of lines) node.append(text("li", line));
  return node;
}
