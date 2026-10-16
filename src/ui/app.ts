import { renderResult } from "./result";
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
  title.textContent = "自分を知る";
  const eyebrow = document.createElement("p");
  eyebrow.className = "eyebrow";
  eyebrow.textContent = "算命学の自己分析";
  const description = document.createElement("p");
  description.className = "entry-description";
  description.textContent = "生まれた日を手がかりに、価値観と人との関わりを読み解く。";
  header.append(eyebrow, title, description);
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
  renderResult(main, pillarFromYmd(ymd), () => {
    showForm(main);
    main.querySelector<HTMLInputElement>('input[name="year"]')?.focus();
  });
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
