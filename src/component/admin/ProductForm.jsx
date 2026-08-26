import React, { useState, useEffect } from "react";

const ProductForm = ({ productToEdit, onSave, onCancel }) => {
  const initialState = {
    name: "",
    author: "",
    description: "",
    price: "",
    genre: "",
    stock: "",
    image: "",
  };
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (productToEdit) {
      setFormData(productToEdit);
    } else {
      setFormData(initialState);
    }
  }, [productToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validate = () => {
    let newErrors = {};
    if (!formData.name) newErrors.name = "El nombre es requerido";
    if (!formData.author) newErrors.author = "El autor es requerido";
    if (!formData.description)
      newErrors.description = "La descripción es requerida";
    if (
      !formData.price ||
      isNaN(formData.price) ||
      parseFloat(formData.price) <= 0
    )
      newErrors.price = "El precio debe ser un número positivo";
    if (!formData.genre) newErrors.genre = "El género es requerido";
    if (
      !formData.stock ||
      isNaN(formData.stock) ||
      parseInt(formData.stock) < 0
    )
      newErrors.stock = "El stock debe ser un número no negativo";
    if (!formData.image) newErrors.image = "La URL de la imagen es requerida";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="row g-3 text-white">
      <h4 className="text-warning text-center mb-3">
        {productToEdit ? "Editar Libro" : "Agregar Nuevo Libro"}
      </h4>

      <div className="col-md-6">
        <label htmlFor="name" className="form-label">
          Nombre del Libro
        </label>
        <input
          type="text"
          className={`form-control ${errors.name ? "is-invalid" : ""}`}
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
      </div>

      <div className="col-md-6">
        <label htmlFor="author" className="form-label">
          Autor
        </label>
        <input
          type="text"
          className={`form-control ${errors.author ? "is-invalid" : ""}`}
          id="author"
          name="author"
          value={formData.author}
          onChange={handleChange}
        />
        {errors.author && (
          <div className="invalid-feedback">{errors.author}</div>
        )}
      </div>

      <div className="col-12">
        <label htmlFor="description" className="form-label">
          Descripción
        </label>
        <textarea
          className={`form-control ${errors.description ? "is-invalid" : ""}`}
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
        ></textarea>
        {errors.description && (
          <div className="invalid-feedback">{errors.description}</div>
        )}
      </div>

      <div className="col-md-4">
        <label htmlFor="price" className="form-label">
          Precio
        </label>
        <input
          type="number"
          step="0.01"
          className={`form-control ${errors.price ? "is-invalid" : ""}`}
          id="price"
          name="price"
          value={formData.price}
          onChange={handleChange}
        />
        {errors.price && <div className="invalid-feedback">{errors.price}</div>}
      </div>

      <div className="col-md-4">
        <label htmlFor="genre" className="form-label">
          Género
        </label>
        <input
          type="text"
          className={`form-control ${errors.genre ? "is-invalid" : ""}`}
          id="genre"
          name="genre"
          value={formData.genre}
          onChange={handleChange}
        />
        {errors.genre && <div className="invalid-feedback">{errors.genre}</div>}
      </div>

      <div className="col-md-4">
        <label htmlFor="stock" className="form-label">
          Stock
        </label>
        <input
          type="number"
          className={`form-control ${errors.stock ? "is-invalid" : ""}`}
          id="stock"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
        />
        {errors.stock && <div className="invalid-feedback">{errors.stock}</div>}
      </div>

      <div className="col-12">
        <label htmlFor="image" className="form-label">
          URL de Imagen
        </label>
        <input
          type="text"
          className={`form-control ${errors.image ? "is-invalid" : ""}`}
          id="image"
          name="image"
          value={formData.image}
          onChange={handleChange}
        />
        {errors.image && <div className="invalid-feedback">{errors.image}</div>}
      </div>

      <div className="col-12 d-flex justify-content-end gap-2 mt-4">
        <button type="submit" className="btn btn-primary">
          <i className="bi bi-save me-2"></i>
          {productToEdit ? "Actualizar" : "Agregar"}
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          <i className="bi bi-x-circle me-2"></i>Cancelar
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
