import type { QuotePayload, QuoteSubmissionResult } from "../types/order";
import { sanitizeFileName } from "../utils/orderNumber";
import { getSupabaseClient } from "./supabase";
import { uploadQuoteStl } from "./storage";

export function createStoragePath(orderNumber: string, fileName: string): string {
  return `${orderNumber}/${Date.now()}-${sanitizeFileName(fileName)}`;
}

export async function submitQuote(payload: Omit<QuotePayload, "filePath">): Promise<QuoteSubmissionResult> {
  const filePath = createStoragePath(payload.orderNumber, payload.file.name);
  await uploadQuoteStl(payload.file, filePath);

  const supabase = getSupabaseClient();
  const { error } = await supabase.from("orders").insert({
    order_number: payload.orderNumber,
    customer_name: payload.customer.customerName,
    customer_phone: payload.customer.customerPhone,
    customer_email: payload.customer.customerEmail,
    customer_note: payload.customer.customerNote || null,
    status: "new",
    file_name: payload.model.fileName,
    file_size: payload.model.fileSize,
    file_path: filePath,
    file_delete_after: null,
    material_id: payload.printSettings.material.id,
    material_name: payload.printSettings.material.name,
    density: payload.printSettings.material.density,
    price_per_gram: payload.printSettings.material.pricePerGram,
    infill_percent: payload.printSettings.infillPercent,
    layer_height: payload.printSettings.layerHeight,
    quantity: payload.printSettings.quantity,
    dimension_x: payload.model.dimensions.x,
    dimension_y: payload.model.dimensions.y,
    dimension_z: payload.model.dimensions.z,
    volume_cm3: payload.model.volumeCm3,
    triangle_count: payload.model.triangleCount,
    model_too_large: payload.model.tooLarge,
    estimated_weight: payload.estimate.estimatedWeight,
    estimated_print_time_hours: payload.estimate.printTimeHours,
    estimated_price: payload.estimate.estimatedPrice,
    price_breakdown: payload.estimate.priceBreakdown,
  });

  if (error) {
    throw new Error(`Database insert failed: ${error.message}`);
  }

  return { orderNumber: payload.orderNumber };
}
