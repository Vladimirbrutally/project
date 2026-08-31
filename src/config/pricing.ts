export const pricingConfig = {
  machineRatePerHour: 15,
  setupCost: 30,
  electricityRatePerHour: 0,
  postProcessing: 0,
  minimumPrice: 80,
  marginPercent: 20,
  shellRatio: 0.3,
  internalRatio: 0.7,
  gramsPerHour: 8,
};

export const infillOptions = [10, 15, 20, 30, 40, 50, 75, 100];

export const layerHeightOptions = [0.1, 0.12, 0.16, 0.2, 0.24, 0.28];

export const layerHeightFactors: Record<number, number> = {
  0.1: 1.8,
  0.12: 1.6,
  0.16: 1.25,
  0.2: 1,
  0.24: 0.85,
  0.28: 0.75,
};
