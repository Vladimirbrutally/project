import { describe, expect, it } from "vitest";
import { BoxGeometry } from "three";
import { calculateMeshVolume } from "./calculateVolume";

describe("calculateMeshVolume", () => {
  it("returns cubic centimeters for a closed STL-style mesh in millimeters", () => {
    const geometry = new BoxGeometry(10, 10, 10);

    expect(calculateMeshVolume(geometry)).toBeCloseTo(1, 5);
  });
});
