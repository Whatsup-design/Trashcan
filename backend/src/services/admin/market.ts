import { supabase } from "../../lib/supabase.js";

export async function getAllProducts() {
  const { data, error } = await supabase
    .from("Product")
    .select("*")
    .order("Product_ID", { ascending: true });

  if (error) {
    throw error;
  }

  return data;
}

export async function getProductById(id: number) {
  const { data, error } = await supabase
    .from("Product")
    .select("*")
    .eq("Product_ID", id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

export async function createProduct(payload: {
  Product_name: string;
  Product_Description?: string;
  Product_Price: number;
  Product_Status: string;
  Product_limit: number;
  Product_ImgUrl?: string | null;
  Product_StartDate?: string;
  Product_EndDate?: string;
}) {
  const { data, error } = await supabase
    .from("Product")
    .insert([payload])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateProduct(
  id: number,
  payload: {
    Product_name?: string;
    Product_Description?: string;
    Product_Price?: number;
    Product_Status?: string;
    Product_limit?: number;
    Product_ImgUrl?: string | null;
    Product_StartDate?: string;
    Product_EndDate?: string;
  }
) {
  const { data, error } = await supabase
    .from("Product")
    .update(payload)
    .eq("Product_ID", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function deleteProduct(id: number) {
  const { error } = await supabase
    .from("Product")
    .delete()
    .eq("Product_ID", id);

  if (error) {
    throw error;
  }

  return true;
}
