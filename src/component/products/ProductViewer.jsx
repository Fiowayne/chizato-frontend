import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProductImageUrl } from "../../utils/productImage";
import * as cartService from "../../services/cartService";
import MessageModal from "../MessageModal";

const ProductViewer = ({ product, onClose }) => {
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);
  const [quantityInCart, setQuantityInCart] = useState(0);
  const [messageModal, setMessageModal] = useState({
    show: false,
    type: "info",
    title: "",
    message: "",
    onConfirm: null,
    onModalCloseRedirect: null,
  });

  useEffect(() => {
    if (!product?._id) return;

    const fetchCart = async () => {
      if (!localStorage.getItem("token")) {
        setQuantityInCart(0);
        return;
      }

      try {
        const cart = await cartService.getMyCart();
        const item = cart.items.find((i) => i.product._id === product._id);
        setQuantityInCart(item ? item.quantity : 0);
      } catch {
        setQuantityInCart(0);
      }
    };

    fetchCart();
  }, [product?._id]);

  if (!product) return null;

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

  const handleAddToCart = async () => {
    if (product.stock <= 0 || adding) return;

    setAdding(true);
    try {
      await cartService.addOrUpdateItemInCart(product._id, quantityInCart + 1);
      setQuantityInCart((prev) => prev + 1);
      showMessage(
        "success",
        "Producto añadido",
        `"${product.name}" fue añadido al carrito.`
      );
    } catch (error) {
      if (error.response?.status === 401) {
        showMessage(
          "warning",
          "Iniciá sesión",
          "Debés iniciar sesión para comprar.",
          null,
          () => navigate("/login")
        );
      } else {
        showMessage(
          "error",
          "Error",
          error.response?.data?.message ||
            "No se pudo añadir al carrito."
        );
      }
    } finally {
      setAdding(false);
    }
  };

  const formattedPrice = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(product.price || 0);

  const formatControlDate = (dateString) => {
    if (!dateString) return "Sin registro";
    return new Date(dateString).toLocaleDateString("es-ES");
  };

  return (
    <div className="product-viewer border border-warning rounded p-4 bg-dark">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="text-warning mb-0">Detalle del producto</h3>
        {onClose && (
          <button
            type="button"
            className="btn btn-outline-light btn-sm"
            onClick={onClose}
          >
            Cerrar visor
          </button>
        )}
      </div>

      <div className="row align-items-start">
        <div className="col-md-5 text-center mb-4 mb-md-0">
          <img
            src={getProductImageUrl(product.image)}
            alt={product.name}
            className="img-fluid rounded shadow"
            style={{ maxHeight: "320px", objectFit: "cover", width: "100%" }}
          />
        </div>
        <div className="col-md-7 text-white">
          <h2 className="h4 mb-3">{product.name}</h2>
          <p className="mb-2">
            <strong>Autor:</strong> {product.author}
          </p>
          <p className="mb-2">
            <strong>Categoría:</strong> {product.category}
          </p>
          <p className="mb-2">
            <strong>Stock:</strong>{" "}
            <span
              className={`badge ${
                product.stock <= 5 ? "bg-danger" : "bg-success"
              }`}
            >
              {product.stock} disponibles
            </span>
          </p>
          <p className="mb-2">
            <strong>Último control:</strong>{" "}
            {formatControlDate(product.lastStockControlDate)}
          </p>
          <p className="mb-3">{product.description}</p>
          <p className="h5 text-warning mb-4">{formattedPrice}</p>

          {product.stock > 0 ? (
            <button
              type="button"
              className="btn btn-success"
              onClick={handleAddToCart}
              disabled={adding}
            >
              {adding
                ? "Añadiendo..."
                : quantityInCart > 0
                  ? `Añadido (${quantityInCart}) — Agregar otro`
                  : "Añadir al carrito"}
            </button>
          ) : (
            <button type="button" className="btn btn-secondary" disabled>
              Sin stock
            </button>
          )}
        </div>
      </div>

      <MessageModal
        show={messageModal.show}
        handleClose={handleCloseMessageModal}
        type={messageModal.type}
        title={messageModal.title}
        message={messageModal.message}
        onConfirm={messageModal.onConfirm}
        onModalCloseRedirect={messageModal.onModalCloseRedirect}
      />
    </div>
  );
};

export default ProductViewer;
