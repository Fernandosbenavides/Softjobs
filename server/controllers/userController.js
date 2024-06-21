import pool from "../config/database.js";

export const getUser = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM usuarios WHERE email = $1", [
      req.userEmail,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener los datos del usuario." });
  }
};
