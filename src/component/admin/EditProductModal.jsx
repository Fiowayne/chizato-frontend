import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const EditProductModal = ({
  isOpen,
  onClose,
  productToEdit,
  onUpdateProduct,
}) => {
  const [stock, setStock] = useState(0);
  const [adjustAmount, setAdjustAmount] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (productToEdit) {
      setStock(productToEdit.stock ?? 0);
      setAdjustAmount("");
      setError("");
    }
  }, [productToEdit, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (stock < 0) {
      setError("El stock no puede ser negativo.");
      return;
    }
    await onUpdateProduct(productToEdit._id, { stock: Number(stock) });
    onClose();
  };

  const handleQuickAdjust = async (amount) => {
    if (!productToEdit) return;
    const newStock = (productToEdit.stock ?? 0) + amount;
    if (newStock < 0) {
      setError("El stock resultante no puede ser negativo.");
      return;
    }
    setError("");
    await onUpdateProduct(productToEdit._id, { stock: newStock });
    onClose();
  };

  const handleCustomAdjust = async () => {
    const amount = parseInt(adjustAmount, 10);
    if (isNaN(amount) || amount === 0) {
      setError("Ingresá un número distinto de cero para ajustar el stock.");
      return;
    }
    await handleQuickAdjust(amount);
  };

  if (!productToEdit) return null;

  const formatControlDate = (dateString) => {
    if (!dateString) return "Sin registro";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Fecha inválida";
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Control de Stock</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="mb-1">
          <strong>Producto:</strong> {productToEdit.name}
        </p>
        <p className="text-muted mb-3">
          Último control:{" "}
          {formatControlDate(productToEdit.lastStockControlDate)}
        </p>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Stock actual</Form.Label>
            <Form.Control
              type="number"
              min="0"
              value={stock}
              onChange={(e) => {
                setStock(parseInt(e.target.value, 10) || 0);
                setError("");
              }}
              required
            />
          </Form.Group>

          {error && <p className="text-danger small">{error}</p>}

          <div className="d-flex flex-wrap gap-2 mb-3">
            <Button
              type="button"
              variant="outline-success"
              size="sm"
              onClick={() => handleQuickAdjust(1)}
            >
              +1
            </Button>
            <Button
              type="button"
              variant="outline-success"
              size="sm"
              onClick={() => handleQuickAdjust(5)}
            >
              +5
            </Button>
            <Button
              type="button"
              variant="outline-danger"
              size="sm"
              onClick={() => handleQuickAdjust(-1)}
            >
              -1
            </Button>
            <Button
              type="button"
              variant="outline-danger"
              size="sm"
              onClick={() => handleQuickAdjust(-5)}
            >
              -5
            </Button>
          </div>

          <Form.Group className="mb-3">
            <Form.Label>Ajuste personalizado (+/- unidades)</Form.Label>
            <div className="d-flex gap-2">
              <Form.Control
                type="number"
                placeholder="Ej: 10 o -3"
                value={adjustAmount}
                onChange={(e) => {
                  setAdjustAmount(e.target.value);
                  setError("");
                }}
              />
              <Button
                type="button"
                variant="secondary"
                onClick={handleCustomAdjust}
              >
                Aplicar
              </Button>
            </div>
          </Form.Group>

          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Guardar stock
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditProductModal;
