import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { HTTP_ERROR_MESSAGES } from "../../utils/httpErrors";
import "../../css/error.css";
import error404Image from "../img/4042.png";

const ResourceErrorPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const status = location.state?.status || 404;
  const message =
    location.state?.message ||
    HTTP_ERROR_MESSAGES[status] ||
    HTTP_ERROR_MESSAGES[404];

  const title =
    status === 404
      ? "Recurso no encontrado"
      : status === 403
        ? "Acceso denegado"
        : `Error ${status}`;

  return (
    <div className="body">
      <h1 className="text-center mt-3 mb-3 pulsating text-white">{title}</h1>
      <p className="text-center text-white-50 px-3">{message}</p>
      <div className="responsive-container">
        <img src={error404Image} alt={`Error ${status}`} />
        <div className="d-flex flex-column flex-sm-row gap-2">
          <Button variant="dark" onClick={() => navigate(-1)}>
            Volver atrás
          </Button>
          <Button variant="warning">
            <Link to="/" style={{ color: "black", textDecoration: "none" }}>
              Ir al inicio
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResourceErrorPage;
