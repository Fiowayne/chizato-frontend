import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import * as productService from "../../services/productService";
import { getProductImageUrl } from "../../utils/productImage";
import { getHttpErrorMessage } from "../../utils/httpErrors";

const AddProductModal = ({
  isOpen,
  onClose,
  addProduct,
  updateProduct,
  productToEdit,
}) => {
  const [productData, setProductData] = useState({
    name: "",
    stock: 0,
    description: "",
    category: "",
    author: "",
    image: "",
    rating: 1,
    price: 0,
  });
  const [imageSource, setImageSource] = useState("upload");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (productToEdit) {
      setProductData({
        ...productToEdit,
        rating: productToEdit.rating || 1,
        price: productToEdit.price || 0,
      });
      setImagePreview(getProductImageUrl(productToEdit.image));
      setImageSource(
        productToEdit.image?.startsWith("/uploads/") ? "upload" : "url"
      );
    } else {
      setProductData({
        name: "",
        stock: 0,
        description: "",
        category: "",
        author: "",
        image: "",
        rating: 1,
        price: 0,
      });
      setImagePreview("");
      setImageSource("upload");
    }
    setImageFile(null);
    setError("");
  }, [productToEdit, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
    if (name === "image") {
      setImagePreview(value);
    }
    setError("");
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setError("");
  };

  const resolveImageUrl = async () => {
    if (imageSource === "upload") {
      if (imageFile) {
        const result = await productService.uploadProductImage(imageFile);
        return result.imageUrl;
      }
      if (productToEdit?.image) {
        return productToEdit.image;
      }
      throw new Error("Debés seleccionar una imagen para el producto.");
    }

    if (!productData.image.trim()) {
      throw new Error("Debés ingresar la URL de la imagen o subir un archivo.");
    }
    return productData.image.trim();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setError("");

    try {
      const imageUrl = await resolveImageUrl();
      const productToSubmit = {
        ...productData,
        image: imageUrl,
        stock: parseInt(productData.stock, 10),
        rating: parseInt(productData.rating, 10),
        price: parseFloat(productData.price),
      };

      if (isEditMode) {
        await updateProduct(productToSubmit);
      } else {
        await addProduct(productToSubmit);
      }
      onClose();
    } catch (err) {
      setError(getHttpErrorMessage(err, err.message));
    } finally {
      setUploading(false);
    }
  };

  const isEditMode = !!productToEdit;

  return (
    <Modal show={isOpen} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {isEditMode ? "Editar Producto" : "Agregar Nuevo Producto"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={productData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Stock</Form.Label>
            <Form.Control
              type="number"
              name="stock"
              value={productData.stock}
              onChange={handleChange}
              min="0"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              value={productData.description}
              onChange={handleChange}
              rows={3}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Categoría</Form.Label>
            <Form.Control
              type="text"
              name="category"
              value={productData.category}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Autor</Form.Label>
            <Form.Control
              type="text"
              name="author"
              value={productData.author}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Imagen del producto</Form.Label>
            <div className="d-flex gap-3 mb-2">
              <Form.Check
                type="radio"
                id="imageUpload"
                label="Subir archivo"
                name="imageSource"
                checked={imageSource === "upload"}
                onChange={() => setImageSource("upload")}
              />
              <Form.Check
                type="radio"
                id="imageUrl"
                label="URL externa"
                name="imageSource"
                checked={imageSource === "url"}
                onChange={() => setImageSource("url")}
              />
            </div>

            {imageSource === "upload" ? (
              <>
                <Form.Control
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleFileChange}
                />
                <Form.Text className="text-muted">
                  JPG, PNG, WEBP o GIF. Máximo 5 MB. Se guarda en el servidor.
                </Form.Text>
              </>
            ) : (
              <Form.Control
                type="url"
                name="image"
                value={productData.image}
                onChange={handleChange}
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            )}

            {imagePreview && (
              <div className="mt-3 text-center">
                <img
                  src={
                    imageSource === "upload" && imageFile
                      ? imagePreview
                      : getProductImageUrl(imagePreview)
                  }
                  alt="Vista previa"
                  style={{
                    maxWidth: "150px",
                    maxHeight: "150px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              </div>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Rating (1-5)</Form.Label>
            <Form.Control
              type="number"
              name="rating"
              value={productData.rating}
              onChange={handleChange}
              min="1"
              max="5"
              step="1"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Precio (ARS)</Form.Label>
            <Form.Control
              type="number"
              name="price"
              value={productData.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
            />
          </Form.Group>

          {error && <p className="text-danger small">{error}</p>}

          <Button variant="primary" type="submit" disabled={uploading}>
            {uploading
              ? "Guardando..."
              : isEditMode
                ? "Guardar Cambios"
                : "Agregar Producto"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddProductModal;
