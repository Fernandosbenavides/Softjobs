import pool from "../config/database.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const jwtSecret = process.env.JWT_SECRET;

export const registerUser = async (req, res) => {
  const { email, password, rol, lenguage } = req.body;
  if (!email || !password || !rol || !lenguage) {
    return res
      .status(400)
      .json({ message: "Todos los campos son obligatorios." });
  }

  try {
    const existingUser = await pool.query(
      "SELECT * FROM usuarios WHERE email = $1",
      [email]
    );
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ message: "El email ya está registrado." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO usuarios (email, password, rol, lenguage) VALUES ($1, $2, $3, $4) RETURNING *",
      [email, hashedPassword, rol, lenguage]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error al registrar el usuario." });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email y password son obligatorios." });
  }

  try {
    const result = await pool.query("SELECT * FROM usuarios WHERE email = $1", [
      email,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    const user = result.rows[0];
    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (!passwordIsValid) {
      return res.status(401).json({ message: "Password incorrecto." });
    }

    const token = jwt.sign({ email: user.email }, jwtSecret, {
      expiresIn: "1m",
    });

    console.log("Token del usuario:", token);

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Error al iniciar sesión." });
  }
};
