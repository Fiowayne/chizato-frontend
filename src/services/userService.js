import apiClient from "./api";

// Obtener todos los usuarios (solo para administradores)
export const getAllUsers = async () => {
  try {
    const response = await apiClient.get("/api/users");
    return response.data;
  } catch (error) {
    console.error("Error en getAllUsers:", error);
    throw error;
  }
};

// Eliminar un usuario por ID (solo para administradores)
export const deleteUser = async (id) => {
  try {
    const response = await apiClient.delete(`/api/users/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error en deleteUser para ID ${id}:`, error);
    throw error;
  }
};

// Actualizar un usuario por ID (solo para administradores)
export const updateUser = async (id, userData) => {
  try {
    const response = await apiClient.put(`/api/users/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error(`Error en updateUser para ID ${id}:`, error);
    throw error;
  }
};
