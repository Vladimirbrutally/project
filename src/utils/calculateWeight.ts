interface CalculateWeightInput {
  volumeCm3: number;
  density: number;
  infillPercent: number;
  shellRatio: number;
  internalRatio: number;
}

export function calculateWeight({
  volumeCm3,
  density,
  infillPercent,
  shellRatio,
  internalRatio,
}: CalculateWeightInput): number {
  const solidWeight = volumeCm3 * density;
  const infill = infillPercent / 100;

  return solidWeight * (shellRatio + internalRatio * infill);
}
