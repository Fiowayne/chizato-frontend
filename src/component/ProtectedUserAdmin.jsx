// src/component/ProtectedUserAdmin.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedUserAdmin = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user")); // Obtiene el usuario del localStorage

  // Verifica si el usuario está logueado Y si tiene la propiedad 'isAdmin' en true
  const isAuthenticated = !!user;
  const isAdmin = user && user.isAdmin;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/404" replace />;
  }

  return children;
};

export { ProtectedUserAdmin };
