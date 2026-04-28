import type { Request, Response } from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "../../services/admin/market.js";

function normalizeMarketBody(body: Request["body"]) {
  return {
    Product_name: String(body.Product_name ?? "").trim(),
    Product_Description: String(body.Product_Description ?? "").trim(),
    Product_Price: Number(body.Product_Price),
    Product_Status: String(body.Product_Status ?? "Permanent"),
    Product_limit: Number(body.Product_limit),
    removeImage:
      body.removeImage === true ||
      body.removeImage === "true" ||
      body.removeImage === "1",
    ...(body.Product_StartDate
      ? { Product_StartDate: String(body.Product_StartDate) }
      : {}),
    ...(body.Product_EndDate
      ? { Product_EndDate: String(body.Product_EndDate) }
      : {}),
  };
}

export async function getAllProductsController(_req: Request, res: Response) {
  try {
    const data = await getAllProducts();
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch products" });
  }
}

export async function getProductByIdController(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const data = await getProductById(id);

    if (!data) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch product" });
  }
}

export async function createProductController(req: Request, res: Response) {
  try {
    const payload = normalizeMarketBody(req.body);

    const data = await createProduct({
      ...payload,
      imageFile: req.file ?? null,
    });

    return res.status(201).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message:
        error instanceof Error ? error.message : "Failed to create product",
    });
  }
}

export async function updateProductController(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const payload = normalizeMarketBody(req.body);

    const data = await updateProduct(id, {
      ...payload,
      imageFile: req.file ?? null,
    });

    return res.status(200).json(data);
  } catch (error) {
    console.error(error);

    if (error instanceof Error && error.message === "Product not found") {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(500).json({
      message:
        error instanceof Error ? error.message : "Failed to update product",
    });
  }
}

export async function deleteProductController(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    await deleteProduct(id);
    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);

    if (error instanceof Error && error.message === "Product not found") {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(500).json({
      message:
        error instanceof Error ? error.message : "Failed to delete product",
    });
  }
}
