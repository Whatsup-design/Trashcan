import express from "express";

import { loginController } from "../controller/auth/login.js";

const router = express.Router();

// router.post("/login", async (req, res) => {
//   // Implement your login logic here, e.g., validate credentials, generate JWT, etc.
//   console.log("Received login request with body:", req.body);

//   // For demonstration, we'll just return a success response.
//   res.json({message : "Login successful", payload:req.body});
// });
router.post("/login", loginController); 

export default router;