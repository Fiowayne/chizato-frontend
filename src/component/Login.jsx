import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Chisato from "../assets/img/Loging.jpg";
import { loginUser } from "../services/api";
import { getHttpErrorMessage } from "../utils/httpErrors";
import { Link } from "react-router-dom";
import MessageModal from "./MessageModal";
import "../css/Login.css";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);

  const navigate = useNavigate();

  const [messageModal, setMessageModal] = useState({
    show: false,
    type: "info",
    title: "",
    message: "",
    onConfirm: null,
    onModalCloseRedirect: null,
  });

  const showMessage = (
    type,
    title,
    message,
    onConfirm = null,
    onModalCloseRedirect = null
  ) => {
    setMessageModal({
      show: true,
      type,
      title,
      message,
      onConfirm,
      onModalCloseRedirect,
    });
  };

  const handleCloseMessageModal = () => {
    if (messageModal.onModalCloseRedirect) {
      messageModal.onModalCloseRedirect();
    }
    setMessageModal({ ...messageModal, show: false });
  };

  useEffect(() => {
    setEmail("");
    setPassword("");

    setMessageModal({
      show: false,
      type: "info",
      title: "",
      message: "",
      onConfirm: null,
      onModalCloseRedirect: null,
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userData = await loginUser({ email, password });

      if (userData && userData.token) {
        localStorage.setItem("token", userData.token);
        const decodedToken = jwtDecode(userData.token);

        const user = {
          id: decodedToken.id,
          isAdmin: decodedToken.isAdmin,
          username: decodedToken.username || email,
        };
        localStorage.setItem("user", JSON.stringify(user));

        if (user.isAdmin) {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        throw new Error("Faltan datos o token inválido en la respuesta.");
      }
    } catch (err) {
      console.error("Error en el inicio de sesión:", err);

      const backendMessage = err.userMessage || getHttpErrorMessage(err);
      showMessage(
        "error",
        "Error de Inicio de Sesión",
        backendMessage ||
          "Correo o contraseña incorrectos. Por favor, inténtalo de nuevo."
      );
      setPassword("");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-height-desktop">

      <div
        className="text-white border border-white p-4 rounded"
        style={{
          width: "30%",
          minWidth: "300px",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
        }}
      >
        <h2 className="text-center">Iniciar sesión</h2>

        <div className="mt-4 d-flex justify-content-center pb-3">
          <img
            src={Chisato}
            alt="Avatar"
            className="rounded-circle"
            style={{ width: "150px", height: "150px", objectFit: "cover" }}
          />
        </div>

        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="mb-3">
            <label>Correo electrónico</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="off"
              required
            />
          </div>

          <div className="mb-3">
            <label>Contraseña</label>
            <div className="input-group">
              <input
                type={mostrarPassword ? "text" : "password"}
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setMostrarPassword((prev) => !prev)}
              >
                {mostrarPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-success w-100">
            Iniciar sesión
          </button>
        </form>

        <div className="mt-3 text-center">
          <p>
            <Link to="/forgot-password" className="text-primary">
              ¿Olvidaste tu contraseña?
            </Link>
          </p>
          <p>
            ¿No tienes cuenta?{" "}
            <Link to="/register" className="text-primary">
              Regístrate
            </Link>
          </p>
        </div>
      </div>

      <MessageModal
        show={messageModal.show}
        handleClose={handleCloseMessageModal}
        type={messageModal.type}
        title={messageModal.title}
        message={messageModal.message}
        onConfirm={messageModal.onConfirm}
        onModalCloseRedirect={messageModal.onModalCloseRedirect}
      />
    </div>
  );
};

export default Login;
