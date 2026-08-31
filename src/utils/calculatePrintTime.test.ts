import { describe, expect, it } from "vitest";
import { calculatePrintTime } from "./calculatePrintTime";

describe("calculatePrintTime", () => {
  it("applies grams per hour, layer height factor, and complexity factor", () => {
    const result = calculatePrintTime({
      estimatedWeight: 16,
      layerHeight: 0.1,
      gramsPerHour: 8,
      layerHeightFactors: { 0.1: 1.8 },
      complexityFactor: 1.5,
    });

    expect(result).toBeCloseTo(5.4, 5);
  });
});
