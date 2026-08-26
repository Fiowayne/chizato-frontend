import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { BsCart } from "react-icons/bs";
import axios from "axios";
import "../../css/Navbar.css";
import logoImg from "../../assets/img/home.png";
import * as cartService from "../../services/cartService";
import eventEmitter from "../../utils/eventEmitter";
import { API_BASE_URL } from "../../services/api";

export const Navbar = () => {
  const [busqueda, setBusqueda] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [estaLogueado, setEstaLogueado] = useState(false);
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchUserAndCartData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setEstaLogueado(false);
        setUsuarioActual(null);
        setCartCount(0);
        return;
      }

      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const userId = payload.id;

        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        const userResponse = await axios.get(
          `${API_BASE_URL}/api/users/${userId}`,
          config
        );

        setUsuarioActual(userResponse.data);
        setEstaLogueado(true);

        try {
          const cart = await cartService.getMyCart();
          const count = cart.items.reduce(
            (acc, item) => acc + item.quantity,
            0
          );
          setCartCount(count);
        } catch (cartError) {
          console.error("Error al obtener el carrito:", cartError);
          setCartCount(0);
        }
      } catch (error) {
        console.error("Error al obtener usuario o verificar token:", error);
        setEstaLogueado(false);
        setUsuarioActual(null);
        setCartCount(0);
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("token");
        }
      }
    };

    fetchUserAndCartData();

    const updateCartCount = (newCount) => {
      setCartCount(newCount);
    };
    eventEmitter.on("cartUpdated", updateCartCount);
    return () => {
      eventEmitter.off("cartUpdated", updateCartCount);
    };
  }, [location, estaLogueado]);

  const manejarCambioInput = (e) => {
    setBusqueda(e.target.value);
    setDropdownVisible(false);
  };

  const manejarSubmit = (e) => {
    e.preventDefault();
    if (busqueda.trim()) {
      navigate(`/search/books/${encodeURIComponent(busqueda)}`);
    } else {
      navigate("/404");
    }
  };

  const manejarClickCarrito = () => {
    navigate("/cart");
  };

  const manejarLogout = () => {
    localStorage.removeItem("token");
    setEstaLogueado(false);
    setUsuarioActual(null);
    setCartCount(0);
    navigate("/login");
  };

  useEffect(() => {
    const manejarClickFuera = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
    };
    document.addEventListener("click", manejarClickFuera);
    return () => document.removeEventListener("click", manejarClickFuera);
  }, []);

  useEffect(() => {
    setDropdownVisible(false);
  }, [location]);

  return (
    <nav className="navbar navbar-expand-lg bg-dark w-100 position-relative navbar-01">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img src={logoImg} alt="Logo" className="Logo-home" />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Alternar navegación"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link active text-white" to="/">
                Inicio
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/products">
                Catálogo
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/about">
                Quiénes Somos
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/contact">
                Contacto
              </Link>
            </li>
          </ul>

          <form
            className="d-flex align-items-center position-relative me-3"
            role="search"
            onSubmit={manejarSubmit}
          >
            <input
              className="form-control me-2"
              type="search"
              placeholder="Buscar libro"
              value={busqueda}
              onChange={manejarCambioInput}
              aria-label="Buscar"
            />
            <button className="btn btn-outline-success" type="submit">
              <i className="bi bi-search"></i>
            </button>
          </form>

          <div className="d-flex align-items-center me-3">
            {!estaLogueado ? (
              <>
                <Link to="/register" className="btn btn-outline-primary me-2">
                  Registrarse
                </Link>
                <Link to="/login" className="btn btn-outline-success me-2">
                  Iniciar Sesión
                </Link>
              </>
            ) : (
              <>
                <div className="dropdown me-2" ref={dropdownRef}>
                  <button
                    className="btn btn-outline-secondary dropdown-toggle text-white"
                    type="button"
                    id="dropdownAccount"
                    data-bs-toggle="dropdown"
                    aria-expanded={dropdownVisible}
                    onClick={() => setDropdownVisible(!dropdownVisible)}
                  >
                    {usuarioActual?.name || "Mi Cuenta"}
                  </button>
                  <ul
                    className={`dropdown-menu dropdown-menu-end dropdown-menu-user ${
                      dropdownVisible ? "show" : ""
                    }`}
                    aria-labelledby="dropdownAccount"
                  >
                    {!usuarioActual?.isAdmin && (
                      <li>
                        <Link className="dropdown-item" to="/profile">
                          Perfil
                        </Link>
                      </li>
                    )}
                    {!usuarioActual?.isAdmin && (
                      <li>
                        <Link className="dropdown-item" to="/mypurchases">
                          Mis Compras
                        </Link>
                      </li>
                    )}
                    {usuarioActual?.isAdmin && (
                      <>
                        <li>
                          <hr className="dropdown-divider" />
                        </li>
                        <li>
                          <Link className="dropdown-item" to="/admin">
                            Panel Administrador
                          </Link>
                        </li>
                      </>
                    )}
                    <li>
                      <button className="dropdown-item" onClick={manejarLogout}>
                        Cerrar Sesión
                      </button>
                    </li>
                  </ul>
                </div>

                <div className="position-relative">
                  <button
                    className="btn btn-outline-warning"
                    onClick={manejarClickCarrito}
                    title="Carrito"
                  >
                    <BsCart size={20} />
                  </button>
                  {cartCount > 0 && (
                    <span
                      className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                      style={{ fontSize: "0.7rem", padding: "4px 6px" }}
                    >
                      {cartCount > 10 ? "10+" : cartCount}
                    </span>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
