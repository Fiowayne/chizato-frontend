// src/component/Register.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import chisatoAvatar from "../assets/img/register.webp";
import ChisatoZone from "../assets/img/logo-chisato-zone.png";

import { registerUser } from "../services/api";
import MessageModal from "./MessageModal";

import "../css/Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    avatar: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const [messageModal, setMessageModal] = useState({
    show: false,
    type: "info",
    title: "",
    message: "",
    onConfirm: null,
    onModalCloseRedirect: null,
  });

  const navigate = useNavigate();

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

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "firstName":
      case "username":
      case "email":
      case "password":
      case "confirmPassword":
        if (!value.trim()) {
          error = "Este campo es obligatorio.";
        }
        break;
      default:
        break;
    }

    if (
      name === "email" &&
      value.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    ) {
      error = "Formato de email inválido.";
    }

    if (name === "password" && value.trim() && value.length < 6) {
      error = "La contraseña debe tener al menos 6 caracteres.";
    }

    if (
      name === "confirmPassword" &&
      value.trim() &&
      value !== formData.password
    ) {
      error = "Las contraseñas no coinciden.";
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (
        key === "firstName" ||
        key === "username" ||
        key === "email" ||
        key === "password" ||
        key === "confirmPassword"
      ) {
        validateField(key, formData[key]);
        if (errors[key]) newErrors[key] = errors[key];
      }
    });

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden.";
    }

    const isRobotChecked = e.target.elements.checkRobot.checked;
    if (!isRobotChecked) {
      showMessage(
        "warning",
        "Verificación Requerida",
        "Por favor, confirma que no eres un robot para continuar."
      );
      setIsLoading(false);
      return;
    }

    if (Object.values(newErrors).some((error) => error)) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    const fullName =
      formData.firstName.trim() +
      (formData.lastName.trim() ? ` ${formData.lastName.trim()}` : "");

    const newUser = {
      name: fullName,
      username: formData.username,
      email: formData.email,
      password: formData.password,
      isAdmin: false,
    };

    try {
      await registerUser(newUser);
      showMessage(
        "success",
        "¡Registro Exitoso!",
        "¡Tu cuenta ha sido creada con éxito! Ahora puedes iniciar sesión.",
        null,
        () => navigate("/login")
      );
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Fallo el registro. Por favor, inténtalo de nuevo.";
      showMessage("error", "Error de Registro", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const formFields = [
    {
      id: "firstName",
      label: "Nombre",
      type: "text",
      placeholder: "Tu nombre aquí",
      max: 30,
    },
    {
      id: "lastName",
      label: "Apellido",
      type: "text",
      placeholder: "Tu apellido aquí",
      max: 30,
    },
    {
      id: "username",
      label: "Nombre de Usuario",
      type: "text",
      placeholder: "Tu nombre de usuario",
      max: 20,
    },
    {
      id: "email",
      label: "Email",
      type: "email",
      placeholder: "ejemplo@dominio.com",
      max: 30,
    },
  ];

  return (
    <div className="container p-0 d-flex flex-wrap justify-content-between text-white p-md-5 m-0">
      <div className="registration-image col-lg-6 col-md-12 d-flex justify-content-between p-3 bg-dark border border-white d-none img-container-2 m-0">
        <div className="profile-image-container col-6 col-md-3 d-flex flex-column justify-content-center align-items-start">
          <img
            src={ChisatoZone}
            alt="logo_chisato_zone"
            className="img-fluid mb-3"
            style={{ width: "100%", height: "auto" }}
          />
        </div>
        <div className="profile-image-container col-6 col-md-3 d-flex flex-column justify-content-center align-items-end">
          <img
            src={chisatoAvatar}
            alt="chisato_register"
            className="img-fluid rounded"
            style={{ width: "100%", height: "auto" }}
          />
        </div>
      </div>

      <div className="registration-form col-lg-6 col-md-12 border border-white p-4 rounded">
        <h1 className="fw-bold fs-1 text-start">Regístrate</h1>
        <form onSubmit={handleSubmit}>
          {formFields.map(({ id, label, type, placeholder, max }) => (
            <div className="mb-3" key={id}>
              <label htmlFor={id} className="form-label text-start d-block">
                {label}
              </label>
              <input
                type={type}
                className={`form-control ${errors[id] ? "is-invalid" : ""}`}
                id={id}
                name={id}
                placeholder={placeholder}
                maxLength={max}
                value={formData[id]}
                onChange={handleChange}
                {...(id !== "lastName" ? { required: true } : {})}
              />
              {errors[id] && (
                <div className="invalid-feedback d-block">{errors[id]}</div>
              )}
            </div>
          ))}

          <div className="mb-3">
            <label htmlFor="password" className="form-label text-start d-block">
              Contraseña
            </label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className={`form-control ${
                  errors.password ? "is-invalid" : ""
                }`}
                id="password"
                name="password"
                placeholder="Mínimo 6 caracteres"
                maxLength={10}
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword((show) => !show)}
                tabIndex={-1}
                aria-label={
                  showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                }
              >
                {showPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>
            {errors.password && (
              <div className="invalid-feedback d-block">{errors.password}</div>
            )}
          </div>

          <div className="mb-3">
            <label
              htmlFor="confirmPassword"
              className="form-label text-start d-block"
            >
              Confirmar Contraseña
            </label>
            <div className="input-group">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className={`form-control ${
                  errors.confirmPassword ? "is-invalid" : ""
                }`}
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Repite tu contraseña"
                maxLength={10}
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowConfirmPassword((show) => !show)}
                tabIndex={-1}
                aria-label={
                  showConfirmPassword
                    ? "Ocultar contraseña"
                    : "Mostrar contraseña"
                }
              >
                {showConfirmPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>
            {errors.confirmPassword && (
              <div className="invalid-feedback d-block">
                {errors.confirmPassword}
              </div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="phone" className="form-label text-start d-block">
              Teléfono (Opcional)
            </label>
            <input
              type="tel"
              className="form-control"
              id="phone"
              name="phone"
              placeholder="Ej: +5491112345678"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="checkRobot"
              required
            />
            <label className="form-check-label" htmlFor="checkRobot">
              Confirmo que no soy un robot
            </label>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-register"
            disabled={isLoading}
          >
            {isLoading ? "Registrando..." : "Registrarse"}
          </button>
        </form>
      </div>

      <div className="registration-image col-lg-6 col-md-12 d-flex flex-column justify-content-center align-items-center border border-white p-3 bg-dark img-container-1">
        <img
          src={ChisatoZone}
          alt="logo_chisato_zone"
          className="mb-3"
          style={{ width: "200px", height: "auto" }}
        />
        <img
          src={chisatoAvatar}
          alt="chisato_register"
          className="img-fluid rounded"
          style={{
            maxWidth: "100%",
            height: "auto",
          }}
        />
      </div>

      <MessageModal
        show={messageModal.show}
        handleClose={handleCloseMessageModal}
        type={messageModal.type}
        title={messageModal.title}
        message={messageModal.message}
        onConfirm={messageModal.onConfirm}
      />
    </div>
  );
};

export default Register;
