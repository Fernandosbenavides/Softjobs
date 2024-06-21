import express from "express";
import { getUser } from "../controllers/userController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/usuarios", verifyToken, getUser);

export default router;
