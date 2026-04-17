// import { PostLogin } from "../../services/auth/login.js";
// import type { Request, Response } from "express";

// import { generateToken } from "../../utils/generateToken.js";
// export async function loginController(req: Request, res: Response) {
//   try {

//     const { username, password } = req.body as {
//       username?: string;o

//       password?: string;
//     };

//     if (!username || !password) {
//       return res.status(400).json({ message: "Username and password are required" });
//     }

//     const result = await PostLogin(username, password);



//   } catch (error) {
//     console.error("Login error:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };