import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { requestLogger } from "./middlewares/requestLogger.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.use("/api", authRoutes);
app.use("/api", userRoutes);

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
