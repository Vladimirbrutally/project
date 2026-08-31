import { getSupabaseClient } from "./supabase";

export const stlBucketName = "quote-stl";

export async function uploadQuoteStl(file: File, filePath: string): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.storage.from(stlBucketName).upload(filePath, file, {
    contentType: "model/stl",
    cacheControl: "3600",
    upsert: false,
  });

  if (error) {
    throw new Error(`Unable to upload file: ${error.message}`);
  }
}
