import { copyFor } from "../content/copies";
import { parseYmd } from "../domain/date";
import { pillarFromYmd } from "../domain/pillar";

export function mount(root: HTMLElement): void {
  root.replaceChildren();
  const main = document.createElement("main");
  root.append(main);
  showForm(main);
}

function showForm(main: HTMLElement): void {
  main.replaceChildren();
  main.className = "entry";
  const header = document.createElement("header");
  header.className = "entry-header";
  const title = document.createElement("h1");
  title.textContent = "天中殺";
  header.append(title);
  const form = document.createElement("form");
  form.setAttribute("aria-label", "生年月日");
  form.autocomplete = "off";
  const fields = document.createElement("fieldset");
  const legend = document.createElement("legend");
  legend.textContent = "生年月日";
  const row = document.createElement("div");
  row.className = "date-fields";
  row.append(labeled("年", "year"), labeled("月", "month"), labeled("日", "day"));
  fields.append(legend, row);
  form.append(fields);
  const button = document.createElement("button");
  button.type = "submit";
  button.textContent = "見てみる";
  const message = document.createElement("p");
  message.setAttribute("role", "alert");
  form.append(button, message);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const year = value(form, "year");
    const month = value(form, "month");
    const day = value(form, "day");
    const parsed = parseYmd(year, month, day);
    if (parsed === "empty") {
      message.textContent = "年、月、日を入れてください。";
      return;
    }
    if (parsed === "invalid") {
      message.textContent = "その日は存在しません。入れ直してください。";
      return;
    }
    showResult(main, parsed);
  });
  main.append(header, form);
}

function showResult(main: HTMLElement, ymd: { year: number; month: number; day: number }): void {
  const copy = copyFor(pillarFromYmd(ymd).kind);
  main.replaceChildren();
  main.className = "result";
  const title = document.createElement("h1");
  title.textContent = copy.title;
  title.tabIndex = -1;
  const lead = paragraph("lead", copy.lead);
  const distance = document.createElement("ul");
  distance.dataset.part = "distance";
  for (const line of [...copy.thin, ...copy.valued]) {
    const item = document.createElement("li");
    item.textContent = line;
    distance.append(item);
  }
  const people = document.createElement("ul");
  people.dataset.part = "people";
  for (const name of copy.people) {
    const item = document.createElement("li");
    item.textContent = name;
    people.append(item);
  }
  const reset = document.createElement("button");
  reset.id = "reset";
  reset.type = "button";
  reset.textContent = "入れ直す";
  reset.addEventListener("click", () => {
    showForm(main);
    main.querySelector<HTMLInputElement>('input[name="year"]')?.focus();
  });
  const intro = document.createElement("section");
  intro.className = "result-intro";
  intro.append(title, lead);
  main.append(
    intro,
    section("distance", "人との距離", distance),
    section("scene", "今夜の場面", paragraph("scene", copy.scene)),
    section("question", "隣への問い", paragraph("question", copy.question)),
    section("people", "同じ天中殺の芸能人", people),
    reset,
  );
  title.focus();
}

function labeled(label: string, name: string): HTMLLabelElement {
  const wrap = document.createElement("label");
  wrap.append(label);
  const input = document.createElement("input");
  input.name = name;
  input.inputMode = "numeric";
  wrap.append(input);
  return wrap;
}

function value(form: HTMLFormElement, name: string): string {
  const input = form.elements.namedItem(name);
  return input instanceof HTMLInputElement ? input.value : "";
}

function paragraph(part: string, text: string): HTMLParagraphElement {
  const node = document.createElement("p");
  node.dataset.part = part;
  node.textContent = text;
  return node;
}

function section(name: string, label: string, content: HTMLElement): HTMLElement {
  const block = document.createElement("section");
  block.className = `result-${name}`;
  const heading = document.createElement("h2");
  heading.id = `heading-${name}`;
  heading.textContent = label;
  block.setAttribute("aria-labelledby", heading.id);
  block.append(heading, content);
  return block;
}
