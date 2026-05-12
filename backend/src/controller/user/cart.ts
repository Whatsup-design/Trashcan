import type { Request, Response } from "express";
import { getUserCart } from "../../services/user/cart.js";

function getStudentId(req: Request) {
  const studentId = Number(req.user?.student_id);

  if (!Number.isFinite(studentId) || studentId <= 0) {
    return null;
  }

  return studentId;
}

export async function UserCartController(req: Request, res: Response) {
  try {
    const studentId = getStudentId(req);

    if (studentId === null) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    const cartData = await getUserCart(studentId);
    return res.json(cartData);
  } catch (error) {
    console.error("Error fetching cart data:", error);
    return res.status(500).json({ message: "Failed to fetch cart data" });
  }
}
