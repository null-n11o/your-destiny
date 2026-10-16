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


test("小さい補助文字は本文と目次の背景で4.5対1以上のコントラストを持つ", () => {
  const css = readFileSync("src/style.css", "utf8");
  const muted = css.match(/--muted:\s*(#[0-9a-f]{6})/i)![1];
  const paper = css.match(/--paper:\s*(#[0-9a-f]{6})/i)![1];
  const contents = css.match(/\.contents\s*\{[^}]*background:\s*(#[0-9a-f]{6})/i)![1];
  for (const background of [paper, contents]) {
    const values = [luminance(muted), luminance(background)].sort((a, b) => b - a);
    expect((values[0] + 0.05) / (values[1] + 0.05)).toBeGreaterThanOrEqual(4.5);
  }
});

function luminance(hex: string): number {
  const channels = hex.slice(1).match(/../g)!.map(channel => {
    const value = parseInt(channel, 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}
