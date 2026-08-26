import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as productService from "../../services/productService.js";
import * as cartService from "../../services/cartService";
import { getHttpErrorMessage, getHttpStatus } from "../../utils/httpErrors";
import { getProductImageUrl } from "../../utils/productImage";
import MessageModal from "../MessageModal";
import LogoChisato from "../../assets/img/logo-main.png";
import "../../css/MainPage.css";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
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
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await productService.getProductById(id);
        setProduct(data);
      } catch (err) {
        console.error("Error al cargar el producto:", err);
        navigate("/recurso-no-encontrado", {
          state: {
            status: getHttpStatus(err) || 404,
            message: getHttpErrorMessage(
              err,
              "No se pudo cargar el detalle del producto."
            ),
          },
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id, navigate]);

  useEffect(() => {
    const fetchCart = async () => {
      if (!localStorage.getItem("token")) {
        setQuantityInCart(0);
        return;
      }

      try {
        const cart = await cartService.getMyCart();
        const item = cart.items.find((item) => item.product._id === id);
        setQuantityInCart(item ? item.quantity : 0);
      } catch {
        setQuantityInCart(0);
      }
    };

    fetchCart();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product || product.stock <= 0 || adding) return;

    if (!localStorage.getItem("token")) {
      showMessage(
        "warning",
        "Inicia Sesión para Comprar",
        "Debés iniciar sesión para añadir productos al carrito.",
        null,
        () => navigate("/login")
      );
      return;
    }

    setAdding(true);
    try {
      await cartService.addOrUpdateItemInCart(product._id, quantityInCart + 1);
      setTimeout(() => {
        setQuantityInCart((prev) => prev + 1);
        setAdding(false);
        showMessage(
          "success",
          "Producto Añadido",
          `"${product.name}" ha sido añadido al carrito.`
        );
      }, 500);
    } catch (error) {
      console.error("Error al añadir al carrito:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Ocurrió un error al añadir el producto al carrito.";

      if (error.response && error.response.status === 401) {
        showMessage(
          "warning",
          "Inicia Sesión para Comprar",
          "Debes iniciar sesión para poder añadir productos al carrito.",
          null,
          () => navigate("/login")
        );
      } else {
        showMessage("error", "Error al Añadir", errorMessage);
      }
      setAdding(false);
    }
  };

  const formattedPrice = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(product?.price || 0);

  if (loading) {
    return (
      <div className="container text-white text-center py-5">
        <div className="spinner-border text-warning" role="status" />
        <p className="mt-3">Cargando producto...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container text-white text-center py-5">
        Producto no encontrado.
      </div>
    );
  }

  return (
    <div className="container text-white">
      <div className="row">
        <div className="col-12 text-center py-4">
          <img
            src={LogoChisato}
            alt="Logo"
            className="img-fluid"
            style={{ maxWidth: "120px" }}
          />
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <hr className="border-warning" style={{ borderTopWidth: "3px" }} />
        </div>
      </div>

      <div className="row mt-4 mb-3">
        <div className="col-12 d-flex justify-content-between align-items-center flex-wrap gap-2">
          <h2 className="text-warning h3 mb-0">{product.name}</h2>
          <button
            type="button"
            className="btn btn-outline-light btn-sm"
            onClick={() => navigate("/products")}
          >
            ← Volver al catálogo
          </button>
        </div>
      </div>

      <div className="row my-4">
        <div className="col-md-6 text-center mb-4 mb-md-0">
          <img
            src={getProductImageUrl(product.image)}
            alt={product.name}
            className="img-fluid rounded shadow"
            style={{ maxHeight: "400px", objectFit: "cover" }}
          />
        </div>
        <div className="col-md-6">
          <p className="lead">
            <strong>Autor:</strong> {product.author}
          </p>
          <p>
            <strong>Categoría:</strong> {product.category}
          </p>
          <p>
            <strong>Descripción:</strong> {product.description}
          </p>
          <p>
            <strong>Stock:</strong> {product.stock}
          </p>

          <h3 className="text-warning mt-3">
            <strong>Precio: {formattedPrice}</strong>
          </h3>

          <div className="mt-4">
            {product.stock > 0 ? (
              <button
                type="button"
                className="btn btn-success btn-lg w-100 d-flex justify-content-center align-items-center"
                onClick={handleAddToCart}
                disabled={adding}
              >
                {adding ? (
                  <div
                    className="spinner-border spinner-border-sm text-light"
                    role="status"
                    style={{ width: "1.2rem", height: "1.2rem" }}
                  />
                ) : quantityInCart > 0 ? (
                  <>Añadido ({quantityInCart})</>
                ) : (
                  "Añadir al Carrito"
                )}
              </button>
            ) : (
              <button type="button" className="btn btn-secondary btn-lg w-100" disabled>
                Sin Stock
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <hr className="border-warning" style={{ borderTopWidth: "3px" }} />
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

export default ProductDetail;
