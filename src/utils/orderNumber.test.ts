import { describe, expect, it } from "vitest";
import { generateOrderNumber, sanitizeFileName } from "./orderNumber";

describe("orderNumber utilities", () => {
  it("generates a dated order number", () => {
    const orderNumber = generateOrderNumber(new Date("2026-08-31T00:00:00Z"));

    expect(orderNumber).toMatch(/^3DP-20260831-[A-Z0-9]{5}$/);
  });

  it("sanitizes untrusted file names", () => {
    expect(sanitizeFileName("../My Part Final.stl")).toBe("my-part-final.stl");
    expect(sanitizeFileName("part")).toBe("part.stl");
  });
});
