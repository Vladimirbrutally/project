import type { ModelDimensions } from "./model";
import type { Material } from "./material";
import type { PriceBreakdown } from "../utils/calculatePrice";

export interface CustomerDetails {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerNote: string;
  privacyAccepted: boolean;
}

export interface QuotePayload {
  orderNumber: string;
  customer: CustomerDetails;
  file: File;
  filePath: string;
  model: {
    fileName: string;
    fileSize: number;
    dimensions: ModelDimensions;
    volumeCm3: number;
    triangleCount: number;
    tooLarge: boolean;
  };
  printSettings: {
    material: Material;
    infillPercent: number;
    layerHeight: number;
    quantity: number;
  };
  estimate: {
    estimatedWeight: number;
    printTimeHours: number;
    estimatedPrice: number;
    priceBreakdown: PriceBreakdown;
  };
}

export interface QuoteSubmissionResult {
  orderNumber: string;
}
