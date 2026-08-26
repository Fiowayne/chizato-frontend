import apiClient from "./api";

export const uploadProductImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);
  const response = await apiClient.post("/api/products/upload-image", formData);
  return response.data;
};

// Obtener todos los productos
export const getAllProducts = async () => {
  try {
    const response = await apiClient.get("/api/products"); // <-- CAMBIO AQUÍ
    return response.data;
  } catch (error) {
    console.error("Error en getAllProducts:", error);
    throw error;
  }
};

// Agregar un nuevo producto
export const addProduct = async (product) => {
  try {
    const response = await apiClient.post("/api/products", product); // <-- CAMBIO AQUÍ
    return response.data;
  } catch (error) {
    console.error("Error en addProduct:", error);
    throw error;
  }
};

// Actualizar un producto existente
export const updateProduct = async (id, product) => {
  try {
    const response = await apiClient.put(`/api/products/${id}`, product); // <-- CAMBIO AQUÍ
    return response.data;
  } catch (error) {
    console.error("Error en updateProduct:", error);
    throw error;
  }
};

// Eliminar un producto
export const deleteProduct = async (id) => {
  try {
    const response = await apiClient.delete(`/api/products/${id}`); // <-- CAMBIO AQUÍ
    return response.data;
  } catch (error) {
    console.error("Error en deleteProduct:", error);
    throw error;
  }
};

// Obtener un producto por ID
export const getProductById = async (id) => {
  try {
    const response = await apiClient.get(`/api/products/${id}`); // <-- CAMBIO AQUÍ
    return response.data;
  } catch (error) {
    console.error(`Error en getProductById para ID ${id}:`, error);
    throw error;
  }
};

// Buscar productos por término
export const searchProducts = async (query) => {
  try {
    const encodedQuery = encodeURIComponent(query);
    const response = await apiClient.get(
      `/api/products/search?q=${encodedQuery}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error en searchProducts para query "${query}":`, error);
    throw error;
  }
};
