// src/assets/layout/Footer.jsx
import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "../../css/Footer.css";
import backgroundFooter from "../img/FooterImg1.png";

export const Footer = () => {
  const navigate = useNavigate();
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  const estaLogueado = !!user;

  const manejarLinkPerfil = (e) => {
    if (!estaLogueado) {
      e.preventDefault();
      navigate("/404");
    }
  };

  const manejarLinkRedes = (e) => {
    e.preventDefault();
    navigate("/404");
  };

  return (
    <footer
      className="footer-custom text-light pt-5 pb-4"
      style={{
        backgroundImage: `url(${backgroundFooter})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="container">
        <div className="row footer-grid">
          {/* Navegación */}
          <div className="col-6 col-md-3 mb-4">
            <h5 className="text-uppercase mb-3">Navegación</h5>
            <ul className="list-unstyled">
              <li>
                <Link to="/" className="text-light text-decoration-none">
                  Inicio
                </Link>
              </li>
            </ul>
          </div>

          {/* Ayuda */}
          <div className="col-6 col-md-3 mb-4">
            <h5 className="text-uppercase mb-3">Ayuda</h5>
            <ul className="list-unstyled">
            <li>
              <Link to="/about" className="text-light text-decoration-none">
                Sobre Nosotros
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-light text-decoration-none">
                Contacto
              </Link>
            </li>
            <li>
              <Link to="/terms" className="text-light text-decoration-none">
                Términos del Servicio
              </Link>
            </li>
            </ul>
          </div>

          {/* Cuenta */}
          <div className="col-6 col-md-3 mb-4">
            <h5 className="text-uppercase mb-3">Cuenta</h5>
            <ul className="list-unstyled">
              <li>
                <Link
                  to="/profile"
                  className="text-light text-decoration-none"
                  onClick={manejarLinkPerfil}
                >
                  Mi Perfil
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="text-light text-decoration-none"
                >
                  Registrarse
                </Link>
              </li>
            </ul>
          </div>

          {/* Redes Sociales */}
          <div className="col-6 col-md-3 mb-4 text-center">
            <h5 className="text-uppercase mb-3">Seguinos</h5>
            <div className="social-icons-container">
              <a
                href="#"
                className="text-light fs-5"
                onClick={manejarLinkRedes}
              >
                <FaFacebookF />
              </a>
              <a
                href="#"
                className="text-light fs-5"
                onClick={manejarLinkRedes}
              >
                <FaTwitter />
              </a>
              <a
                href="#"
                className="text-light fs-5"
                onClick={manejarLinkRedes}
              >
                <FaInstagram />
              </a>
              <a
                href="#"
                className="text-light fs-5"
                onClick={manejarLinkRedes}
              >
                <FaYoutube />
              </a>
            </div>
          </div>
        </div>

        {/* Línea inferior */}
        <hr className="bg-secondary" />
        <div className="text-center">
          <p className="mb-0">
            &copy; {new Date().getFullYear()} BookApp. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
