import axios from "./api";

const API_URL = "/api/orders";

// Función para crear una nueva orden (finalizar compra)
export const createOrder = async (orderData) => {
  try {
    const response = await axios.post(API_URL, orderData);
    return response.data;
  } catch (error) {
    console.error(
      "Error al crear la orden:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Función para obtener las órdenes del usuario actual
export const getUserOrders = async () => {
  try {
    // El backend usará req.user.id para obtener las órdenes del usuario logueado
    const response = await axios.get(`${API_URL}/myorders`);
    return response.data;
  } catch (error) {
    console.error(
      "Error al obtener las órdenes del usuario:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Función para obtener una orden específica por ID (útil para ver detalles)
export const getOrderById = async (orderId) => {
  try {
    const response = await axios.get(`${API_URL}/${orderId}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error al obtener la orden por ID:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// --- Funciones para ADMINISTRADORES ---

// Función para obtener todas las órdenes (solo admin)
export const getAllOrders = async () => {
  try {
    const response = await axios.get(API_URL); // GET /api/orders
    return response.data;
  } catch (error) {
    console.error(
      "Error al obtener todas las órdenes (Admin):",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Función para actualizar el estado de una orden (solo admin)
export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await axios.put(`${API_URL}/${orderId}/status`, {
      status,
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error al actualizar el estado de la orden (Admin):",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Función para eliminar una orden (solo admin)
export const deleteOrder = async (orderId) => {
  try {
    const response = await axios.delete(`${API_URL}/${orderId}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error al eliminar la orden (Admin):",
      error.response?.data || error.message
    );
    throw error;
  }
};
