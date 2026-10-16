import { describe, expect, test } from "vitest";
import { parseYmd } from "./date";

describe("parseYmd", () => {
  test("実在する日を整数にする", () => {
    expect(parseYmd("1985", "3", "12")).toEqual({ year: 1985, month: 3, day: 12 });
    expect(parseYmd("01985", "03", "012")).toEqual({ year: 1985, month: 3, day: 12 });
    expect(parseYmd("１９８５", "０３", "１２")).toEqual({ year: 1985, month: 3, day: 12 });
  });

  test("空白は未入力", () => {
    expect(parseYmd("", "3", "12")).toBe("empty");
    expect(parseYmd("  ", "3", "12")).toBe("empty");
  });

  test("範囲外と存在しない日と数字以外は invalid", () => {
    expect(parseYmd("1899", "12", "31")).toBe("invalid");
    expect(parseYmd("2100", "1", "1")).toBe("invalid");
    expect(parseYmd("1985", "2", "31")).toBe("invalid");
    expect(parseYmd("1900", "2", "29")).toBe("invalid");
    expect(parseYmd("2000", "2", "29")).toEqual({ year: 2000, month: 2, day: 29 });
    expect(parseYmd("1985年", "3", "12")).toBe("invalid");
    expect(parseYmd("1985.5", "3", "12")).toBe("invalid");
  });

  test("境界の日は通す", () => {
    expect(parseYmd("1900", "1", "1")).toEqual({ year: 1900, month: 1, day: 1 });
    expect(parseYmd("2099", "12", "31")).toEqual({ year: 2099, month: 12, day: 31 });
  });
});
