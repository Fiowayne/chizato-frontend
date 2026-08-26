import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import * as orderService from "../../services/orderService";
import styles from "./AdminPage.module.css";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import AdminMenu from "./AdminMenu";
import MessageModal from "../MessageModal";

const orderStatuses = ["processing", "shipped", "completed", "cancelled"];

const AdminOrderHistoryPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
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
    } else {
      fetchOrders();
    }
  }, [navigate]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await orderService.getAllOrders();
      setOrders(data);
    } catch (err) {
      console.error("Error al obtener todas las órdenes:", err);
      showMessage(
        "error",
        "Error de Carga",
        "No se pudieron cargar las órdenes. Asegúrate de que el backend esté funcionando y tengas permisos de administrador."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const updatedOrder = await orderService.updateOrderStatus(
        orderId,
        newStatus
      );
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? { ...order, status: updatedOrder.status }
            : order
        )
      );
      showMessage(
        "success",
        "Estado Actualizado",
        "El estado de la orden ha sido actualizado con éxito."
      );
    } catch (error) {
      console.error("Error al actualizar el estado de la orden:", error);
      showMessage(
        "error",
        "Error al Actualizar",
        "No se pudo actualizar el estado de la orden. Intente nuevamente."
      );
    }
  };

  const filteredOrders = useMemo(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return orders.filter(
      (order) =>
        order._id.toLowerCase().includes(lowerCaseSearchTerm) ||
        order.user?.name?.toLowerCase().includes(lowerCaseSearchTerm) ||
        order.user?.email?.toLowerCase().includes(lowerCaseSearchTerm) ||
        order.status.toLowerCase().includes(lowerCaseSearchTerm) ||
        order.totalAmount.toString().includes(lowerCaseSearchTerm)
    );
  }, [orders, searchTerm]);

  const { topCustomers, totalRevenue } = useMemo(() => {
    const customerSpending = new Map();
    let totalRev = 0;

    orders.forEach((order) => {
      totalRev += order.totalAmount;
      const userId = order.user?._id;
      const userName = order.user?.name || order.user?.email || "Desconocido";
      const userEmail = order.user?.email || "N/A";

      if (!userId) return;

      if (!customerSpending.has(userId)) {
        customerSpending.set(userId, {
          name: userName,
          email: userEmail,
          totalSpent: 0,
          orderCount: 0,
        });
      }
      const current = customerSpending.get(userId);
      customerSpending.set(userId, {
        ...current,
        totalSpent: current.totalSpent + order.totalAmount,
        orderCount: current.orderCount + 1,
      });
    });

    const sortedCustomers = Array.from(customerSpending.values()).sort(
      (a, b) => b.totalSpent - a.totalSpent
    );

    return { topCustomers: sortedCustomers, totalRevenue: totalRev };
  }, [orders]);

  if (loading) {
    return (
      <div className="text-white text-center mt-5">
        Cargando historial de órdenes...
      </div>
    );
  }

  return (
    <div className={styles.adminContainer}>
      <div className="text-center mb-4">
        <h1>Historial de Órdenes (Administrador)</h1>
        <div className="d-flex justify-content-center mt-3">
          <AdminMenu />
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-white mb-3">Estadísticas Clave</h2>
        <div className="row">
          <div className="col-md-6 col-lg-4 mb-3">
            <div className="card bg-dark text-white p-3">
              <h5 className="card-title">Órdenes Totales</h5>
              <p className="card-text fs-4">{orders.length}</p>
            </div>
          </div>
          <div className="col-md-6 col-lg-4 mb-3">
            <div className="card bg-dark text-white p-3">
              <h5 className="card-title">Ingresos Totales</h5>
              <p className="card-text fs-4">${totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4">
  <h2 className="text-white mb-3">Clientes con Mayor Gasto</h2>
  {topCustomers.length > 0 ? (
    <div
      style={{
        maxHeight: "500px",
        overflowY: "auto",
        paddingRight: "1rem",
      }}
      className="d-flex flex-column gap-3"
    >
      {topCustomers.map((customer, index) => (
        <div key={index} className="card bg-dark text-white p-3">
          <div className="mb-2">
            <strong>Cliente:</strong> {customer.name}
          </div>
          <div className="mb-2">
            <strong>Email:</strong> {customer.email}
          </div>
          <div className="mb-2">
            <strong>Total Gastado:</strong> ${customer.totalSpent.toFixed(2)}
          </div>
          <div>
            <strong>Órdenes:</strong> {customer.orderCount}
          </div>
        </div>
      ))}
    </div>
  ) : (
    <p className="text-white">No hay datos de clientes aún.</p>
  )}
</div>


      <h2 className="text-white mb-3">Todas las Órdenes</h2>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar por ID de orden, cliente, email o estado..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredOrders.length === 0 ? (
        <p className="text-white">
          No hay órdenes que coincidan con la búsqueda.
        </p>
      ) : (
        <div
          style={{
            maxHeight: "700px",
            overflowY: "auto",
            paddingRight: "1rem",
          }}
          className="d-flex flex-column gap-3"
        >
          {filteredOrders.map((order) => (
            <div key={order._id} className="card bg-dark text-white p-3">
              <div className="mb-2">
                <strong>ID Orden:</strong> {order._id}
              </div>
              <div className="mb-2">
                <strong>Cliente:</strong>{" "}
                {order.user?.name || order.user?.email || "Desconocido"}
              </div>
              <div className="mb-2">
                <strong>Email:</strong> {order.user?.email || "N/A"}
              </div>
              <div className="mb-2">
                <strong>Fecha:</strong>{" "}
                {format(new Date(order.createdAt), "dd/MM/yyyy HH:mm", {
                  locale: es,
                })}
              </div>
              <div className="mb-2">
                <strong>Total:</strong> ${order.totalAmount.toFixed(2)}
              </div>
              <div>
                <strong>Estado:</strong>{" "}
                <select
                  value={order.status}
                  onChange={(e) =>
                    handleStatusChange(order._id, e.target.value)
                  }
                  className="form-select form-select-sm mt-1"
                  style={{ maxWidth: "200px" }}
                >
                  {orderStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}

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

export default AdminOrderHistoryPage;
