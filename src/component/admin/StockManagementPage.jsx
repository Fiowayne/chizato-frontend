import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import * as productService from "../../services/productService";
import styles from "./AdminPage.module.css";
import EditProductModal from "./EditProductModal";
import AdminMenu from "./AdminMenu";
import MessageModal from "../MessageModal";

const StockManagementPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

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
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.isAdmin) {
      navigate("/404");
    } else {
      fetchProducts();
    }
  }, [navigate]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (err) {
      console.error("Error al obtener los productos:", err);
      showMessage(
        "error",
        "Error de Carga",
        err.response?.data?.message ||
          "No se pudieron cargar los productos. Verificá que el backend esté activo."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (product) => {
    setProductToEdit(product);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setProductToEdit(null);
    fetchProducts();
  };

  const handleUpdateStock = async (productId, { stock }) => {
    try {
      await productService.updateProduct(productId, { stock });
      showMessage("success", "Stock Actualizado", "Stock actualizado con éxito.");
      fetchProducts();
    } catch (err) {
      console.error("Error al actualizar stock:", err);
      showMessage(
        "error",
        "Error al Actualizar Stock",
        err.response?.data?.message ||
          "No se pudo actualizar el stock. Intentá nuevamente."
      );
    }
  };

  const formatControlDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Fecha Inválida";
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const filteredProducts = useMemo(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        product.category.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }, [products, searchTerm]);

  if (loading) {
    return (
      <div className="text-white text-center mt-5">Cargando productos...</div>
    );
  }

  return (
    <div className={styles.adminContainer}>
      <h1>Control de Stock</h1>
      <p className="text-white-50 text-center mb-4">
        Actualizá las unidades disponibles de cada producto. La fecha de último
        control se registra automáticamente.
      </p>

      <div className="d-flex justify-content-center mb-4">
        <AdminMenu />
      </div>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar por nombre o categoría..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredProducts.length === 0 ? (
        <p className="text-white text-center">
          {searchTerm
            ? "No hay productos que coincidan con la búsqueda."
            : "No hay productos registrados."}
        </p>
      ) : (
        <div className="table-responsive">
          <table className="table table-dark table-striped table-hover">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Stock</th>
                <th>Descripción</th>
                <th>Último Control</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product._id}>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>
                    <span
                      className={`badge ${
                        product.stock <= 5 ? "bg-danger" : "bg-success"
                      }`}
                    >
                      {product.stock} u.
                    </span>
                  </td>
                  <td>
                    <p className={`${styles.descriptionCell} mb-0`}>
                      {product.description}
                    </p>
                  </td>
                  <td>{formatControlDate(product.lastStockControlDate)}</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => handleEditClick(product)}
                    >
                      Cargar / Ajustar Stock
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        productToEdit={productToEdit}
        onUpdateProduct={handleUpdateStock}
      />
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

export default StockManagementPage;
