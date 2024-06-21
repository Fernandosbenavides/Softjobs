import axios from "axios";
import { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ENDPOINT } from "../config/constans.js";
import Context from "../contexts/Context";

const Profile = () => {
  const navigate = useNavigate();
  const { getDeveloper, setDeveloper } = useContext(Context);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getDeveloperData = async () => {
      try {
        const token = window.sessionStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get(ENDPOINT.users, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = response.data;

        if (!userData) {
          console.error("Datos de usuario indefinidos.");
          window.sessionStorage.removeItem("token");
          setDeveloper(null);
          navigate("/login");
          return;
        }

        setDeveloper(userData);
      } catch (error) {
        console.error("Error al obtener datos del usuario:", error);
        window.sessionStorage.removeItem("token");
        setDeveloper(null);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    getDeveloperData();
  }, []);

  if (loading) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="py-5">
      <h1>
        Bienvenido <span className="fw-bold">{getDeveloper?.email}</span>
      </h1>
      <h3>
        {getDeveloper?.rol} en {getDeveloper?.lenguage}
      </h3>
    </div>
  );
};

export default Profile;
