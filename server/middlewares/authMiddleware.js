import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const jwtSecret = process.env.JWT_SECRET;

export const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(403).json({ message: "Token no proporcionado." });
  }

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      if (err instanceof jwt.TokenExpiredError) {
        return res
          .status(401)
          .json({ message: "Sesion expirada, logea nuevamente." });
      }
      return res
        .status(500)
        .json({ message: "Error inesperado, intenta nuevamente." });
    }
    req.userEmail = decoded.email;
    next();
  });
};
