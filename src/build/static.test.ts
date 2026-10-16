import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";

describe("static", () => {
  test("検索エンジンへ載せない", () => {
    const html = readFileSync("index.html", "utf8");
    const headers = readFileSync("public/_headers", "utf8");
    const css = readFileSync("src/style.css", "utf8");
    expect(html).toContain('content="noindex"');
    expect(headers).toContain("/*");
    expect(headers).toContain("X-Robots-Tag: noindex");
    expect(css).toContain("overflow-x: hidden");
  });
});
