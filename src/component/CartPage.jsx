import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as cartService from "../services/cartService";
import * as orderService from "../services/orderService";
import "../css/CartPage.css";
import CheckoutModal from "./CheckoutModal";
import PurchaseSuccessModal from "./PurchaseSuccessModal";
import MessageModal from "./MessageModal";
import eventEmitter from "../utils/eventEmitter";
import { getProductImageUrl } from "../utils/productImage";
import { getHttpErrorMessage } from "../utils/httpErrors";

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [messageModal, setMessageModal] = useState({
    show: false,
    type: "info",
    title: "",
    message: "",
    onConfirm: null,
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await cartService.getMyCart();
      setCart(data);

      const totalCount = data.items.reduce(
        (acc, item) => acc + item.quantity,
        0
      );
      eventEmitter.emit("cartUpdated", totalCount);
    } catch (err) {
      if (
        err.message.includes("No autorizado") ||
        err.message.includes("token")
      ) {
        navigate("/login");

        setMessageModal({
          show: true,
          type: "error",
          title: "Sesión Requerida",
          message: "Necesitas iniciar sesión para ver tu carrito.",
          onConfirm: () => navigate("/login"),
        });
        setError("Necesitas iniciar sesión para ver tu carrito.");
      } else {
        setError(getHttpErrorMessage(err, "No se pudo cargar el carrito."));
      }
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, title, message, onConfirm = null) => {
    setMessageModal({ show: true, type, title, message, onConfirm });
  };

  const handleCloseMessageModal = () => {
    setMessageModal({ ...messageModal, show: false });
  };

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    const itemInCart = cart.items.find(
      (item) => item.product._id === productId
    );
    if (
      itemInCart &&
      itemInCart.product &&
      itemInCart.product.stock < newQuantity
    ) {
      showMessage(
        "warning",
        "Stock Insuficiente",
        "No hay suficiente stock disponible para esta cantidad."
      );
      return;
    }

    try {
      await cartService.addOrUpdateItemInCart(productId, newQuantity);
      await fetchCart();
    } catch (err) {
      showMessage(
        "error",
        "Error al Actualizar Cantidad",
        `Hubo un problema al actualizar la cantidad: ${
          err.message || "Error desconocido"
        }`
      );
    }
  };

  const handleRemoveItem = async (productId) => {
    showMessage(
      "confirm",
      "Confirmar Eliminación",
      "¿Estás seguro de que quieres eliminar este producto del carrito?",
      async () => {
        try {
          await cartService.removeItemFromCart(productId);
          await fetchCart();
          showMessage(
            "success",
            "Producto Eliminado",
            "El producto ha sido eliminado del carrito."
          );
        } catch (err) {
          showMessage(
            "error",
            "Error al Eliminar Producto",
            `Hubo un problema al eliminar el producto: ${
              err.message || "Error desconocido"
            }`
          );
        }
      }
    );
  };

  const handleClearCart = async () => {
    showMessage(
      "confirm",
      "Confirmar Vaciado de Carrito",
      "¿Estás seguro de que quieres vaciar todo el carrito?",
      async () => {
        try {
          await cartService.clearMyCart();
          await fetchCart();
          showMessage(
            "success",
            "Carrito Vaciado",
            "El carrito ha sido vaciado con éxito."
          );
        } catch (err) {
          showMessage(
            "error",
            "Error al Vaciar Carrito",
            `Hubo un problema al vaciar el carrito: ${
              err.message || "Error desconocido"
            }`
          );
        }
      }
    );
  };

  const calculateTotal = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((acc, item) => {
      if (item && item.product && typeof item.product.price === "number") {
        return acc + item.product.price * item.quantity;
      }
      return acc;
    }, 0);
  };

  const handleShowCheckoutModal = () => {
    setShowCheckoutModal(true);
  };

  const handleCloseCheckoutModal = () => {
    setShowCheckoutModal(false);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
  };

  const handlePurchaseSuccess = async (orderDetailsFromCheckout) => {
    try {
      const currentCart = await cartService.getMyCart();

      if (!currentCart || currentCart.items.length === 0) {
        showMessage(
          "error",
          "Carrito Vacío",
          "Error: El carrito está vacío, no se puede finalizar la compra."
        );
        setShowCheckoutModal(false);
        return;
      }

      const orderData = {
        items: currentCart.items.map((item) => ({
          product: item.product._id,
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
          image: item.product.image,
        })),
        totalAmount: calculateTotal(),
        ...orderDetailsFromCheckout,
      };

      await orderService.createOrder(orderData);

      await cartService.clearMyCart();
      await fetchCart();

      setShowCheckoutModal(false);
      setShowSuccessModal(true);
    } catch (err) {
      showMessage(
        "error",
        "Error al Finalizar Compra",
        getHttpErrorMessage(err, "No se pudo completar la compra.")
      );
      setShowCheckoutModal(false);
    }
  };

  if (loading) {
    return (
      <div className="cart-container text-center text-white mt-5">
        Cargando carrito...
      </div>
    );
  }

  if (error) {
    return (
      <div className="cart-container text-center text-danger mt-5">
        Error: {error}
      </div>
    );
  }

  if (!cart || (cart.items.length === 0 && !showSuccessModal)) {
    return (
      <div className="cart-container empty-cart text-white text-center mt-5">
        <h2>Tu carrito está vacío 🛒</h2>
        <p>¡Añade algunos productos para empezar a comprar!</p>
        <button className="btn btn-primary mt-3" onClick={() => navigate("/")}>
          Ir de compras
        </button>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2>Mi Carrito de Compras</h2>
      <div className="cart-items-list">
        {cart.items.map((item) => (
          <div key={item.product?._id || item._id} className="cart-item-card">
            {" "}
            {item.product ? (
              <>
                <img
                  src={getProductImageUrl(item.product.image)}
                  alt={item.product.name}
                  className="cart-item-image"
                />
                <div className="cart-item-details">
                  <h4>{item.product.name}</h4>
                  <p>
                    Precio unitario: ${" "}
                    {typeof item.product.price === "number"
                      ? item.product.price.toFixed(2)
                      : "N/A"}{" "}
                  </p>
                  <div className="item-quantity-control">
                    <button
                      className="btn btn-sm btn-outline-light"
                      onClick={() =>
                        handleUpdateQuantity(
                          item.product._id,
                          item.quantity - 1
                        )
                      }
                      disabled={item.quantity === 1}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      className="btn btn-sm btn-outline-light"
                      onClick={() =>
                        handleUpdateQuantity(
                          item.product._id,
                          item.quantity + 1
                        )
                      }
                      disabled={item.product.stock === item.quantity}
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  className="btn btn-danger btn-sm remove-item-btn"
                  onClick={() => handleRemoveItem(item.product._id)}
                >
                  Eliminar
                </button>
              </>
            ) : (
              <div className="text-danger">
                Producto no disponible o eliminado.
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <h3>Total: ${calculateTotal().toFixed(2)}</h3>
        <div className="cart-actions">
          <button
            className="btn btn-warning me-2"
            onClick={handleClearCart}
            disabled={cart.items.length === 0}
          >
            Vaciar Carrito
          </button>
          <button
            className="btn btn-success"
            onClick={handleShowCheckoutModal}
            disabled={calculateTotal() === 0 || loading}
          >
            Finalizar Compra
          </button>
        </div>
      </div>

      <CheckoutModal
        show={showCheckoutModal}
        handleClose={handleCloseCheckoutModal}
        onPurchaseSuccess={handlePurchaseSuccess}
        totalAmount={calculateTotal()}
      />

      <PurchaseSuccessModal
        show={showSuccessModal}
        handleClose={handleCloseSuccessModal}
      />

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

export default CartPage;
