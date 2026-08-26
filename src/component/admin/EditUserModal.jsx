import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import MessageModal from "../MessageModal";

const EditUserModal = ({ isOpen, onClose, userToEdit, onUpdateUser }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    isAdmin: false,
    isSuspended: false,
    password: "",
  });
  const [errors, setErrors] = useState({});

  const loggedInUserId = JSON.parse(localStorage.getItem("user"))?.id;

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
    if (userToEdit) {
      setFormData({
        name: userToEdit.name || "",
        email: userToEdit.email || "",
        isAdmin: userToEdit.isAdmin || false,
        isSuspended: userToEdit.isSuspended || false,
        password: "",
      });
      setErrors({});
    }
  }, [userToEdit, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "El nombre es obligatorio.";
    }
    if (!formData.email.trim()) {
      newErrors.email = "El email es obligatorio.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Formato de email inválido.";
    }
    if (formData.password.trim() && formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      showMessage(
        "error",
        "Errores en el Formulario",
        "Por favor, corrige los errores en el formulario."
      );
      return;
    }

    const updatedData = {
      name: formData.name,
      email: formData.email,
      isAdmin: formData.isAdmin,
      isSuspended: formData.isSuspended,
    };

    if (userToEdit && userToEdit._id === loggedInUserId) {
      updatedData.isAdmin = userToEdit.isAdmin;
    }

    if (formData.password.trim()) {
      updatedData.password = formData.password;
    }

    try {
      await onUpdateUser(userToEdit._id, updatedData);
      showMessage(
        "success",
        "Usuario Actualizado",
        "El usuario ha sido actualizado con éxito."
      );
      onClose();
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      showMessage(
        "error",
        "Error al Actualizar Usuario",
        "No se pudo actualizar el usuario. Intente nuevamente."
      );
    }
  };

  const isCurrentUser = userToEdit && userToEdit._id === loggedInUserId;

  return (
    <>
      <Modal
        show={isOpen}
        onHide={onClose}
        centered
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {userToEdit ? "Editar Usuario" : "Crear Usuario"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formName">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                isInvalid={!!errors.name}
                placeholder="Introduce el nombre del usuario"
              />
              <Form.Control.Feedback type="invalid">
                {errors.name}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                isInvalid={!!errors.email}
                placeholder="Introduce el email del usuario"
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label>
                Nueva Contraseña (dejar vacío para no cambiar)
              </Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                isInvalid={!!errors.password}
                placeholder="Deja vacío para no cambiar la contraseña"
              />
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formIsSuspended">
              <Form.Check
                type="checkbox"
                label="Cuenta suspendida"
                name="isSuspended"
                checked={formData.isSuspended}
                onChange={handleChange}
                disabled={isCurrentUser}
                title={
                  isCurrentUser
                    ? "No podés suspender tu propia cuenta."
                    : ""
                }
              />
              {isCurrentUser && (
                <Form.Text className="text-muted">
                  No podés suspender tu propia cuenta de administrador.
                </Form.Text>
              )}
            </Form.Group>

            <Form.Group className="mb-3" controlId="formIsAdmin">
              <Form.Check
                type="checkbox"
                label="Es Administrador"
                name="isAdmin"
                checked={formData.isAdmin}
                onChange={handleChange}
                disabled={isCurrentUser}
                title={
                  isCurrentUser
                    ? "No puedes cambiar tu propio rol de administrador."
                    : ""
                }
              />
              {isCurrentUser && (
                <Form.Text className="text-muted">
                  No puedes cambiar tu propio rol de administrador.
                </Form.Text>
              )}
            </Form.Group>

            <Modal.Footer>
              <Button variant="secondary" onClick={onClose}>
                Cancelar
              </Button>
              <Button variant="primary" type="submit">
                Guardar Cambios
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
      <MessageModal
        show={messageModal.show}
        handleClose={handleCloseMessageModal}
        type={messageModal.type}
        title={messageModal.title}
        message={messageModal.message}
        onConfirm={messageModal.onConfirm}
        onModalCloseRedirect={messageModal.onModalCloseRedirect}
      />
    </>
  );
};

export default EditUserModal;
