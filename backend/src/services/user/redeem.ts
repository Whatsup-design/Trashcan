import { supabase } from "../../lib/supabase.js";

const REDEEM_TABLE = "Redeem";

type ProductRow = {
  Product_ID: number;
  Product_name: string | null;
  Product_Description: string | null;
  Product_Price: number | null;
  Product_Img: string | null;
  Product_ImgUrl: string | null;
};

export async function getUserRedeem(studentId: number) {
  const { data, error } = await supabase
    .from(REDEEM_TABLE)
    .select("*")
    .eq("Student_ID", studentId)
    .order("Reedem_Date", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch redeem data: ${error.message}`);
  }

  return data ?? [];
}

export async function putUserRedeem(studentId: number, productId: number) {
  const { data: product, error: productError } = await supabase
    .from("Product")
    .select(
      "Product_ID, Product_name, Product_Description, Product_Price, Product_Img, Product_ImgUrl"
    )
    .eq("Product_ID", productId)
    .maybeSingle();

  if (productError) {
    throw new Error(`Failed to fetch product: ${productError.message}`);
  }

  const productRow = product as ProductRow | null;

  if (!productRow) {
    throw new Error("Product not found");
  }

  const payload = {
    Reedem_Date: new Date().toISOString(),
    Student_ID: studentId,
    Product_ID: productRow.Product_ID,
    Product_Img: productRow.Product_Img,
    Product_ImgUrl: productRow.Product_ImgUrl,
  };

  const { data, error } = await supabase
    .from(REDEEM_TABLE)
    .insert([payload])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create redeem: ${error.message}`);
  }

  return {
    ...data,
    product: {
      id: productRow.Product_ID,
      name: productRow.Product_name,
      description: productRow.Product_Description,
      price: productRow.Product_Price,
      image: productRow.Product_Img,
      imageUrl: productRow.Product_ImgUrl,
    },
  };
}


export async function deleteUserRedeem(studentId: number, redeemId: number) {
  const { data, error } = await supabase
    .from(REDEEM_TABLE)
    .delete()
    .eq("Reedeem_ID", redeemId)
    .eq("Student_ID", studentId)
    .select()
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to delete redeem: ${error.message}`);
  }

  if (!data) {
    throw new Error("Redeem not found");
  }

  return data;
}
