import React from "react";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const PurchaseSuccessModal = ({ show, handleClose }) => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    handleClose();
    navigate("/");
  };

  const getModalContent = () => {
    return {
      title: "Estado del Pedido",
      heading: "🎉 ¡Muchas gracias por confiar en Chisato Zone! 🎉",
      body: <p>Tu compra ha sido recibida y está siendo preparada!</p>,
      headerClass: "bg-primary text-white",
      headingClass: "text-primary",
    };
  };

  const content = getModalContent();

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header
        className={content.headerClass}
        closeButton
        onClick={handleClose}
      >
        <Modal.Title>{content.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-light text-dark text-center p-4">
        <h4 className={`${content.headingClass} mb-3`}>{content.heading}</h4>{" "}
        {content.body}
        <div className="d-flex justify-content-center">
          {" "}
          <Button variant="primary" onClick={handleGoHome}>
            Volver al Inicio
          </Button>
        </div>
      </Modal.Body>
      <Modal.Footer className="bg-dark"></Modal.Footer>
    </Modal>
  );
};

export default PurchaseSuccessModal;
