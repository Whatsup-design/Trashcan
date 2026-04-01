import type { Request, Response } from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../services/admin/market.js";

export async function getAllProductsController(_req: Request, res: Response) {
  try {
    const data = await getAllProducts();
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
}

export async function getProductByIdController(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const data = await getProductById(id);

    if (!data) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch product" });
  }
}

export async function createProductController(req: Request, res: Response) {
  try {
    const data = await createProduct(req.body);
    res.status(201).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create product" });
  }
}

export async function updateProductController(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const data = await updateProduct(id, req.body);
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update product" });
  }
}

export async function deleteProductController(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    await deleteProduct(id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete product" });
  }
}
