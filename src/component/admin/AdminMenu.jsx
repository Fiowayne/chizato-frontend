import React from "react";
import { Link, useLocation } from "react-router-dom";

const AdminMenu = () => {
  const location = useLocation();

  const linkClass = (path) =>
    `btn d-block mb-2 mb-lg-0 me-lg-2 ${
      location.pathname === path ? "btn-light" : "btn-outline-light"
    }`;

  return (
    <>
      <Link to="/admin" className={linkClass("/admin")}>
        Administrar Productos
      </Link>
      <Link to="/admin/stock" className={linkClass("/admin/stock")}>
        Control de Stock
      </Link>
      <Link to="/admin/users" className={linkClass("/admin/users")}>
        Administrar Usuarios
      </Link>
      <Link to="/admin/orders" className={linkClass("/admin/orders")}>
        Historial de Órdenes
      </Link>
    </>
  );
};

export default AdminMenu;
