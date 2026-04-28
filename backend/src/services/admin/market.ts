import { supabase } from "../../lib/supabase.js";

const PRODUCT_IMAGE_BUCKET = "Product_Img";

type ProductRow = {
  Product_ID: number;
  Product_name: string;
  Product_Description: string | null;
  Product_Price: number;
  Product_Status: string;
  Product_limit: number;
  Product_Img: string | null;
  Product_ImgUrl: string | null;
  Product_StartDate: string | null;
  Product_EndDate: string | null;
};

type ProductPayload = {
  Product_name: string;
  Product_Description?: string;
  Product_Price: number;
  Product_Status: string;
  Product_limit: number;
  Product_StartDate?: string;
  Product_EndDate?: string;
  Product_ImgUrl?: string | null;
};

type CreateProductInput = ProductPayload & {
  imageFile: Express.Multer.File | null;
};

type UpdateProductInput = Partial<ProductPayload> & {
  imageFile: Express.Multer.File | null;
  removeImage?: boolean;
};

function getProductFileExtension(filename: string) {
  const segments = filename.split(".");
  const extension = segments.length > 1 ? segments.pop() : "";
  return (extension || "png").toLowerCase();
}

function buildStoragePath(file: Express.Multer.File) {
  const extension = getProductFileExtension(file.originalname);
  return `market/product-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`;
}

//select from bucket then upload
async function uploadProductImage(file: Express.Multer.File) {
  const storagePath = buildStoragePath(file);
  const { error: uploadError } = await supabase.storage
    .from(PRODUCT_IMAGE_BUCKET)
    .upload(storagePath, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Failed to upload product image: ${uploadError.message}`);
  }

  const { data } = supabase.storage
    .from(PRODUCT_IMAGE_BUCKET)
    .getPublicUrl(storagePath);

  return {
    storagePath,
    publicUrl: data.publicUrl,
  };
}

async function removeProductImage(storagePath: string | null | undefined) {
  if (!storagePath) {
    return;
  }

  const { error } = await supabase.storage
    .from(PRODUCT_IMAGE_BUCKET)
    .remove([storagePath]);

  if (error) {
    console.error("Failed to remove product image from storage:", error);
  }
}

function normalizeCreatePayload(input: CreateProductInput, imageData?: { storagePath: string; publicUrl: string }) {
  return {
    Product_name: input.Product_name,
    Product_Description: input.Product_Description ?? "",
    Product_Price: input.Product_Price,
    Product_Status: input.Product_Status,
    Product_limit: input.Product_limit,
    Product_StartDate: input.Product_StartDate || null,
    Product_EndDate: input.Product_EndDate || null,
    Product_Img: imageData?.storagePath ?? null,
    Product_ImgUrl: imageData?.publicUrl ?? null,
  };
}

function normalizeUpdatePayload(
  input: UpdateProductInput,
  options?: {
    imageData?: { storagePath: string; publicUrl: string };
    removeImage?: boolean;
  }
) {
  const payload: Record<string, unknown> = {};

  if (input.Product_name !== undefined) payload.Product_name = input.Product_name;
  if (input.Product_Description !== undefined) payload.Product_Description = input.Product_Description;
  if (input.Product_Price !== undefined) payload.Product_Price = input.Product_Price;
  if (input.Product_Status !== undefined) payload.Product_Status = input.Product_Status;
  if (input.Product_limit !== undefined) payload.Product_limit = input.Product_limit;

  if (input.Product_Status === "Temporary") {
    payload.Product_StartDate = input.Product_StartDate || null;
    payload.Product_EndDate = input.Product_EndDate || null;
  } else if (input.Product_Status !== undefined) {
    payload.Product_StartDate = null;
    payload.Product_EndDate = null;
  }

  if (options?.imageData) {
    payload.Product_Img = options.imageData.storagePath;
    payload.Product_ImgUrl = options.imageData.publicUrl;
  } else if (options?.removeImage) {
    payload.Product_Img = null;
    payload.Product_ImgUrl = null;
  }

  return payload;
}

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

export async function createProduct(input: CreateProductInput) {
  let imageData:
    | {
        storagePath: string;
        publicUrl: string;
      }
    | undefined;

  if (input.imageFile) {
    imageData = await uploadProductImage(input.imageFile);
  }

  const { data, error } = await supabase
    .from("Product")
    .insert([normalizeCreatePayload(input, imageData)])
    .select()
    .single();

  if (error) {
    await removeProductImage(imageData?.storagePath);
    throw error;
  }

  return data;
}

export async function updateProduct(id: number, input: UpdateProductInput) {
  const existingProduct = (await getProductById(id)) as ProductRow | null;

  if (!existingProduct) {
    throw new Error("Product not found");
  }

  let imageData:
    | {
        storagePath: string;
        publicUrl: string;
      }
    | undefined;

  if (input.imageFile) {
    imageData = await uploadProductImage(input.imageFile);
  }

  const payload = normalizeUpdatePayload(input, {
    ...(imageData ? { imageData } : {}),
    ...(input.removeImage !== undefined ? { removeImage: input.removeImage } : {}),
  });

  const { data, error } = await supabase
    .from("Product")
    .update(payload)
    .eq("Product_ID", id)
    .select()
    .single();

  if (error) {
    await removeProductImage(imageData?.storagePath);
    throw error;
  }

  if (imageData && existingProduct.Product_Img) {
    await removeProductImage(existingProduct.Product_Img);
  }

  if (input.removeImage && existingProduct.Product_Img) {
    await removeProductImage(existingProduct.Product_Img);
  }

  return data;
}

export async function deleteProduct(id: number) {
  const existingProduct = (await getProductById(id)) as ProductRow | null;

  if (!existingProduct) {
    throw new Error("Product not found");
  }

  const { error } = await supabase
    .from("Product")
    .delete()
    .eq("Product_ID", id);

  if (error) {
    throw error;
  }

  if (existingProduct.Product_Img) {
    await removeProductImage(existingProduct.Product_Img);
  }

  return true;
}
