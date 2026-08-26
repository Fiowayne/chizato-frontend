import React, { useState } from "react";
import "../css/TermsOfService.css";
import termsImage from "../assets/img/ChatGPT Image 23 abr 2025, 08_08_19 a.m..png";
import MessageModal from "./MessageModal";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [messageModal, setMessageModal] = useState({
    show: false,
    type: "info",
    title: "",
    message: "",
  });

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "El nombre es obligatorio.";
    if (!formData.email.trim()) {
      newErrors.email = "El email es obligatorio.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Formato de email inválido.";
    }
    if (!formData.subject.trim()) newErrors.subject = "El asunto es obligatorio.";
    if (!formData.message.trim()) newErrors.message = "El mensaje es obligatorio.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setMessageModal({
      show: true,
      type: "success",
      title: "Mensaje enviado",
      message:
        "Gracias por contactarnos. Recibimos tu consulta y te responderemos a la brevedad.",
    });
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="terms-container">
      <div className="terms-image-container">
        <img src={termsImage} alt="Contacto" className="terms-image" />
      </div>
      <div className="terms-content-wrapper">
        <div className="terms-content">
          <h1 className="terms-title">Contacto</h1>
          <hr className="terms-divider" />

          <div className="terms-scrollable">
            <p>
              ¿Tenés dudas sobre nuestros productos, tu pedido o el control de
              stock? Completá el formulario y nos pondremos en contacto con vos.
            </p>

            <div className="mb-4">
              <p className="mb-1">
                <strong>Email:</strong> contacto@chisatozone.com
              </p>
              <p className="mb-1">
                <strong>Teléfono:</strong> +54 11 1234-5678
              </p>
              <p className="mb-1">
                <strong>Horario:</strong> Lun a Vie, 9:00 – 18:00 hs
              </p>
            </div>

            <form onSubmit={handleSubmit} className="text-white">
              <div className="mb-3">
                <label htmlFor="contactName" className="form-label">
                  Nombre
                </label>
                <input
                  type="text"
                  id="contactName"
                  name="name"
                  className={`form-control ${errors.name ? "is-invalid" : ""}`}
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && (
                  <div className="invalid-feedback d-block">{errors.name}</div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="contactEmail" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  id="contactEmail"
                  name="email"
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <div className="invalid-feedback d-block">{errors.email}</div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="contactSubject" className="form-label">
                  Asunto
                </label>
                <input
                  type="text"
                  id="contactSubject"
                  name="subject"
                  className={`form-control ${errors.subject ? "is-invalid" : ""}`}
                  value={formData.subject}
                  onChange={handleChange}
                />
                {errors.subject && (
                  <div className="invalid-feedback d-block">
                    {errors.subject}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="contactMessage" className="form-label">
                  Mensaje
                </label>
                <textarea
                  id="contactMessage"
                  name="message"
                  rows={4}
                  className={`form-control ${errors.message ? "is-invalid" : ""}`}
                  value={formData.message}
                  onChange={handleChange}
                />
                {errors.message && (
                  <div className="invalid-feedback d-block">
                    {errors.message}
                  </div>
                )}
              </div>

              <button type="submit" className="btn btn-warning">
                Enviar consulta
              </button>
            </form>
          </div>
        </div>
      </div>

      <MessageModal
        show={messageModal.show}
        handleClose={() => setMessageModal({ ...messageModal, show: false })}
        type={messageModal.type}
        title={messageModal.title}
        message={messageModal.message}
      />
    </div>
  );
};

export default Contact;
