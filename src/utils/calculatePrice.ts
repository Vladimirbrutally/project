interface CalculatePriceInput {
  estimatedWeight: number;
  pricePerGram: number;
  printTimeHours: number;
  machineRatePerHour: number;
  setupCost: number;
  electricityRatePerHour: number;
  postProcessing: number;
  marginPercent: number;
  quantity: number;
  minimumPrice: number;
}

export interface PriceBreakdown {
  materialCost: number;
  machineCost: number;
  setupCost: number;
  electricityCost: number;
  postProcessing: number;
  subtotal: number;
  margin: number;
  unitPrice: number;
  totalPrice: number;
}

export function calculatePrice(input: CalculatePriceInput): PriceBreakdown {
  const materialCost = input.estimatedWeight * input.pricePerGram;
  const machineCost = input.printTimeHours * input.machineRatePerHour;
  const electricityCost = input.printTimeHours * input.electricityRatePerHour;
  const subtotal =
    materialCost +
    machineCost +
    input.setupCost +
    electricityCost +
    input.postProcessing;
  const margin = subtotal * (input.marginPercent / 100);
  const unitPrice = Math.max(input.minimumPrice, Math.ceil(subtotal + margin));
  const totalPrice = unitPrice * Math.max(1, input.quantity);

  return {
    materialCost,
    machineCost,
    setupCost: input.setupCost,
    electricityCost,
    postProcessing: input.postProcessing,
    subtotal,
    margin,
    unitPrice,
    totalPrice,
  };
}
