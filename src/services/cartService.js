import apiClient from "./api";

const emptyCart = () => ({ items: [] });

export const getMyCart = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return emptyCart();
  }

  try {
    const response = await apiClient.get("/api/cart");
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      return emptyCart();
    }
    console.error("Error en getMyCart:", error);
    throw error;
  }
};

export const addOrUpdateItemInCart = async (productId, quantity) => {
  const token = localStorage.getItem("token");
  if (!token) {
    const err = new Error("No autorizado");
    err.response = { status: 401, data: { message: "Debés iniciar sesión." } };
    throw err;
  }

  try {
    const response = await apiClient.post("/api/cart", { productId, quantity });
    return response.data;
  } catch (error) {
    console.error("Error en addOrUpdateItemInCart:", error);
    throw error;
  }
};

export const removeItemFromCart = async (productId) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return emptyCart();
  }

  try {
    const response = await apiClient.delete(`/api/cart/${productId}`);
    return response.data;
  } catch (error) {
    console.error("Error en removeItemFromCart:", error);
    throw error;
  }
};

export const clearMyCart = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return emptyCart();
  }

  try {
    const response = await apiClient.delete("/api/cart");
    return response.data;
  } catch (error) {
    console.error("Error en clearMyCart:", error);
    throw error;
  }
};
