// src/component/MyPurchases.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserOrders } from "../services/orderService";
import "../css/MyPurchases.css";

const MyPurchases = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Función para traducir los estados del backend a español
  const translateStatus = (status) => {
    switch (status) {
      case "pending":
        return "Pendiente (a pagar/retirar)";
      case "processing":
        return "En Proceso";
      case "shipped":
        return "Enviado";
      case "completed":
        return "Completada";
      case "cancelled":
        return "Cancelada";
      default:
        return status;
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
          navigate("/login");
          return;
        }

        const data = await getUserOrders();
        setOrders(data);
      } catch (err) {
        console.error("Error fetching user orders:", err);
        setError("Error al cargar tus compras. Inténtalo de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  if (loading) {
    return (
      <div className="text-center mt-5 text-white">Cargando tus compras...</div>
    );
  }

  if (error) {
    return <div className="alert alert-danger text-center mt-5">{error}</div>;
  }

  return (
    <div className="container mt-5 text-white">
      <h2>Mis Compras</h2>
      {orders.length === 0 ? (
        <p className="text-center">No has realizado ninguna compra todavía.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="card mb-3 bg-dark text-white">
              <div className="card-body">
                <h5 className="card-title">Orden ID: {order._id}</h5>
                <p className="card-text">
                  Fecha: {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <p className="card-text">
                  Estado: <strong>{translateStatus(order.status)}</strong>
                </p>
                <p className="card-text">
                  Total: ${order.totalAmount?.toFixed(2) || "0.00"}
                </p>
                <h6>Productos:</h6>
                <ul className="list-group list-group-flush">
                  {order.items?.filter(item => item && item.product).map((item, index) => (
                    <li
                      key={item.product._id || index}
                      className="list-group-item bg-secondary text-white"
                    >
                      {item.product.name || "Producto sin nombre"} - Cantidad: {item.quantity} - Precio Unitario: ${item.priceAtPurchase?.toFixed(2) || "0.00"}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPurchases;
