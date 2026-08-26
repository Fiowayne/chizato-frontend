import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import forgotPasswordImg from "../assets/img/forgot.jpg";
import { API_BASE_URL } from "../services/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/users/forgot-password`,
        { email }
      );

      if (response.status === 200) {
        setShowModal(true);
        setEmail("");
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError("El correo o usuario no fue encontrado.");
      } else if (
        err.response &&
        err.response.data &&
        err.response.data.message
      ) {
        setError(err.response.data.message);
      } else {
        setError("Ocurrió un error. Intenta nuevamente.");
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate("/login");
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <div
        className="text-white border border-white p-4 rounded"
        style={{
          width: "40%",
          minWidth: "300px",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
        }}
      >
        <h2 className="text-center">Olvidé mi contraseña</h2>

        <div className="d-flex justify-content-center mb-4">
          <img
            src={forgotPasswordImg}
            alt="Olvidé mi contraseña"
            className="img-fluid rounded-circle"
            style={{ width: "150px", height: "150px", objectFit: "cover" }}
          />
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Correo electrónico</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Enviar instrucciones
          </button>
        </form>
      </div>
      {/* Modal para el mensaje de éxito */}
      {showModal && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark text-white border border-white">
              <div className="modal-header border-bottom border-secondary">
                <h5 className="modal-title">Estado de la Solicitud</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={handleCloseModal}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  Su solicitud ha sido enviada al administrador, pronto se
                  comunicarán con usted para la recuperación de la contraseña.
                </p>
              </div>
              <div className="modal-footer border-top border-secondary">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleCloseModal}
                >
                  Entendido
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
