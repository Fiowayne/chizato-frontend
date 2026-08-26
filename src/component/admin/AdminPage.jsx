import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import * as productService from "../../services/productService";
import ProductTable from "./ProductTable";
import AdminMenu from "./AdminMenu";
import AddProductModal from "./AddProductModal";
import styles from "./AdminPage.module.css";
import MessageModal from "../MessageModal";
import { getHttpErrorMessage } from "../../utils/httpErrors";

const AdminPage = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [productToEdit, setProductToEdit] = useState(null);
  const [loading, setLoading] = useState(true);
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
    }
    fetchProducts();
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
        getHttpErrorMessage(
          err,
          "No se pudieron cargar los productos. Asegúrate de que tu backend esté funcionando."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const openModal = (product) => {
    setProductToEdit(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setProductToEdit(null);
    fetchProducts();
  };

  const handleAddProduct = async (newProduct) => {
    try {
      await productService.addProduct(newProduct);
      showMessage(
        "success",
        "Producto Agregado",
        "Producto agregado con éxito!"
      );
      fetchProducts();
    } catch (err) {
      console.error("Error al agregar el producto:", err);
      showMessage(
        "error",
        "Error al Agregar",
        getHttpErrorMessage(err, "Error al agregar el producto.")
      );
      throw err;
    }
  };

  const handleUpdateProduct = async (updatedProduct) => {
    try {
      await productService.updateProduct(updatedProduct._id, updatedProduct);
      showMessage(
        "success",
        "Producto Actualizado",
        "Producto actualizado con éxito!"
      );
      fetchProducts();
    } catch (err) {
      console.error("Error al actualizar el producto:", err);
      showMessage(
        "error",
        "Error al Actualizar",
        getHttpErrorMessage(err, "Error al actualizar el producto.")
      );
      throw err;
    }
  };

  const handleDeleteProduct = async (productId) => {
    showMessage(
      "warning",
      "Confirmar Eliminación",
      "¿Estás seguro de que quieres eliminar este producto?",
      async () => {
        try {
          await productService.deleteProduct(productId);
          showMessage(
            "success",
            "Producto Eliminado",
            "Producto eliminado con éxito!"
          );
        } catch (err) {
          console.error("Error al eliminar el producto:", err);
          showMessage(
            "error",
            "Error al Eliminar",
            getHttpErrorMessage(err, "Error al eliminar el producto.")
          );
        } finally {
          fetchProducts();
        }
      }
    );
  };

  const filteredProducts = useMemo(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        product.author.toLowerCase().includes(lowerCaseSearchTerm) ||
        product.category.toLowerCase().includes(lowerCaseSearchTerm) ||
        product.description.toLowerCase().includes(lowerCaseSearchTerm) ||
        product.price.toString().includes(lowerCaseSearchTerm) ||
        product.stock.toString().includes(lowerCaseSearchTerm)
    );
  }, [products, searchTerm]);

  if (loading) {
    return (
      <div className="text-white text-center mt-5">Cargando productos...</div>
    );
  }

  return (
    <div>
      <div className={styles.adminContainer}>
        <h1>Administrar Productos</h1>

        <div className="d-flex justify-content-center flex-wrap gap-3 mb-3">
          <button className="btn btn-success" onClick={() => openModal(null)}>
            Nuevo Producto
          </button>
          <AdminMenu />
        </div>

        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por nombre, autor, categoría, descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {filteredProducts.length === 0 && !searchTerm ? (
          <p className="text-white text-center">
            No hay productos registrados.
          </p>
        ) : filteredProducts.length === 0 && searchTerm ? (
          <p className="text-white text-center">
            No hay productos que coincidan con la búsqueda.
          </p>
        ) : (
          <ProductTable
            products={filteredProducts}
            onDelete={handleDeleteProduct}
            onEdit={openModal}
          />
        )}
      </div>
      <AddProductModal
        isOpen={isModalOpen}
        onClose={closeModal}
        addProduct={handleAddProduct}
        updateProduct={handleUpdateProduct}
        productToEdit={productToEdit}
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

export default AdminPage;
