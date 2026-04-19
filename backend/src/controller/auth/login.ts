import { PostLogin } from "../../services/auth/login.js";
import type { Request, Response } from "express";

import { generateToken } from "../../utils/generateToken.js";
export async function loginController(req: Request, res: Response) {
  try {

    const { student_id, Student_ID, password, remember_me } = req.body as {
      student_id?: string | number;
      Student_ID?: number;
      password?: string;
      remember_me?: boolean;
    };

    // support both `Student_ID` (frontend) and `student_id` (lowercase)
    const id = student_id ?? (typeof Student_ID === "number" ? String(Student_ID) : undefined);

    //validation
    if (!id || !password) {
      return res.status(400).json({ message: "Student ID and password are required" });
    }

    let result;
    try 
    {
      //Login services
      result = await PostLogin(String(id), password);
      
    } catch (err: any) {
      // map known service errors to HTTP status codes
      const msg = err?.message ?? String(err);
      if (msg.includes("User not found")) {
        return res.status(404).json({ message: "User not found" });
      }
      if (msg.includes("Incorrect password")) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      if (msg.includes("Account is deactivated")) {
        return res.status(403).json({ message: "Account is deactivated" });
      }
      if (msg.includes("No password set")) {
        return res.status(400).json({ message: "No password set for this account" });
      }

      console.error("Unhandled PostLogin error:", err);
      const devMessage = err?.message ?? "Internal server error";
      const payload = process.env.NODE_ENV === "production" ? { message: "Internal server error" } : { message: devMessage };
      return res.status(500).json(payload);
    }
    //jwt token generation
    const token = generateToken(result);
    res.json({
          user: result,
          token,
          remember_me: remember_me ?? false,
        });

  } catch (error: any) {
    console.error("Login error:", error);
    const devMessage = error?.message ?? "Internal server error";
    const payload = process.env.NODE_ENV === "production" ? { message: "Internal server error" } : { message: devMessage };
    res.status(500).json(payload);
  }
};