interface CalculatePrintTimeInput {
  estimatedWeight: number;
  layerHeight: number;
  gramsPerHour: number;
  layerHeightFactors: Record<number, number>;
  complexityFactor?: number;
}

export function calculatePrintTime({
  estimatedWeight,
  layerHeight,
  gramsPerHour,
  layerHeightFactors,
  complexityFactor = 1,
}: CalculatePrintTimeInput): number {
  if (gramsPerHour <= 0) {
    return 0;
  }

  const factor = layerHeightFactors[layerHeight] ?? 1;
  return (estimatedWeight / gramsPerHour) * factor * complexityFactor;
}
