import { describe, expect, it } from "vitest";
import { calculatePrice } from "./calculatePrice";

describe("calculatePrice", () => {
  it("calculates the expected price from the specification example", () => {
    const result = calculatePrice({
      estimatedWeight: 50,
      pricePerGram: 2,
      printTimeHours: 5,
      machineRatePerHour: 15,
      setupCost: 30,
      electricityRatePerHour: 0,
      postProcessing: 0,
      marginPercent: 20,
      quantity: 1,
      minimumPrice: 80,
    });

    expect(result.materialCost).toBe(100);
    expect(result.machineCost).toBe(75);
    expect(result.subtotal).toBe(205);
    expect(result.unitPrice).toBe(246);
    expect(result.totalPrice).toBe(246);
  });
});
