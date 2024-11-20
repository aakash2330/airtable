"use server";

import { revalidatePath } from "next/cache";

export async function clearCache() {
  return revalidatePath("/table");
}
