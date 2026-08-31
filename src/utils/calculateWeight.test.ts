import { describe, expect, it } from "vitest";
import { calculateWeight } from "./calculateWeight";

describe("calculateWeight", () => {
  it("uses shell and internal infill ratios", () => {
    const result = calculateWeight({
      volumeCm3: 42.8,
      density: 1.24,
      infillPercent: 20,
      shellRatio: 0.3,
      internalRatio: 0.7,
    });

    expect(result).toBeCloseTo(23.35, 2);
  });
});
