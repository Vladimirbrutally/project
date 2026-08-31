import type { AdminOrder, AdminOrderUpdate, OrderStatus } from "../types/order";
import { getSupabaseClient } from "./supabase";
import { stlBucketName } from "./storage";

export const orderStatuses: OrderStatus[] = [
  "new",
  "reviewing",
  "quoted",
  "printing",
  "finished",
  "cancelled",
];

export async function getCurrentAdminEmail(): Promise<string | null> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    return null;
  }

  return data.user?.email ?? null;
}

export async function signInAdmin(email: string, password: string): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    throw new Error(`Unauthorized admin: ${error.message}`);
  }
}

export async function signOutAdmin(): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }
}

export async function listOrders(): Promise<AdminOrder[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Unable to load orders: ${error.message}`);
  }

  return (data ?? []) as AdminOrder[];
}

export async function getOrder(orderNumber: string): Promise<AdminOrder> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("order_number", orderNumber)
    .single();

  if (error) {
    throw new Error(`Unable to load order: ${error.message}`);
  }

  return data as AdminOrder;
}

export async function updateOrder(orderNumber: string, update: AdminOrderUpdate): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase
    .from("orders")
    .update({
      status: update.status,
      final_price: update.final_price,
      admin_note: update.admin_note,
      updated_at: new Date().toISOString(),
    })
    .eq("order_number", orderNumber);

  if (error) {
    throw new Error(`Unable to update order: ${error.message}`);
  }
}

export async function createStlDownloadUrl(filePath: string): Promise<string> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.storage
    .from(stlBucketName)
    .createSignedUrl(filePath, 60 * 10);

  if (error || !data?.signedUrl) {
    throw new Error(`Unable to create STL download URL: ${error?.message ?? "missing URL"}`);
  }

  return data.signedUrl;
}
