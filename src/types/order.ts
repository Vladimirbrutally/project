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

export type OrderStatus = "new" | "reviewing" | "quoted" | "printing" | "finished" | "cancelled";

export interface AdminOrder {
  id: string;
  order_number: string;
  created_at: string;
  updated_at: string;
  status: OrderStatus;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  customer_note: string | null;
  file_name: string;
  file_size: number;
  file_path: string;
  file_delete_after: string | null;
  material_id: string;
  material_name: string;
  density: number;
  price_per_gram: number;
  infill_percent: number;
  layer_height: number;
  quantity: number;
  dimension_x: number;
  dimension_y: number;
  dimension_z: number;
  volume_cm3: number;
  triangle_count: number;
  model_too_large: boolean;
  estimated_weight: number;
  estimated_print_time_hours: number;
  estimated_price: number;
  final_price: number | null;
  price_breakdown: PriceBreakdown;
  admin_note: string | null;
}

export interface AdminOrderUpdate {
  status: OrderStatus;
  final_price: number | null;
  admin_note: string | null;
}
