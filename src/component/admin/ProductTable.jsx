import React from "react";
import styles from "./ProductTable.module.css";
import { getProductImageUrl } from "../../utils/productImage";

const ProductTable = ({ products, onEdit, onDelete }) => {
  return (
    <div className={styles.tableContainer}>
      {/* Tabla visible en desktop */}
      <div className={`table-responsive d-none d-md-block`} style={{ maxHeight: "600px", overflowY: "auto" }}>
        <table className="table table-dark table-striped table-hover mt-4">
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Stock</th>
              <th>Descripción</th>
              <th>Categoría</th>
              <th>Autor</th>
              <th>Último Control</th>
              <th>Rating</th>
              <th>Precio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>
                  <img
                    src={getProductImageUrl(product.image)}
                    alt={product.name}
                    style={{
                      width: "50px",
                      height: "auto",
                      objectFit: "cover",
                    }}
                  />
                </td>
                <td>{product.name}</td>
                <td>{product.stock}</td>
                <td>{product.description}</td>
                <td>{product.category}</td>
                <td>{product.author}</td>
                <td>
                  {product.lastStockControlDate
                    ? new Date(product.lastStockControlDate).toLocaleDateString()
                    : "N/A"}
                </td>
                <td>{product.rating ? `${product.rating}/5` : "N/A"}</td>
                <td>
                  {new Intl.NumberFormat("es-AR", {
                    style: "currency",
                    currency: "ARS",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(product.price)}
                </td>
                <td>
                  <div className="d-flex flex-column">
                    <button
                      className="btn btn-warning btn-sm mb-2"
                      onClick={() => onEdit(product)}
                    >
                      <i className="bi bi-pencil-square"></i> Editar
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => onDelete(product._id)}
                    >
                      <i className="bi bi-trash"></i> Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Vista móvil/tablet: filas como tarjetas verticales */}
      <div className={`d-block d-md-none`} style={{ maxHeight: "600px", overflowY: "auto" }}>
        {products.map((product) => (
          <div key={product._id} className={`${styles.productCard} card bg-dark text-white mb-3 p-3`}>
            <div className="d-flex mb-3">
              <img
                src={getProductImageUrl(product.image)}
                alt={product.name}
                style={{
                  width: "80px",
                  height: "80px",
                  objectFit: "cover",
                  marginRight: "1rem",
                  borderRadius: "4px",
                }}
              />
              <div>
                <h5>{product.name}</h5>
                <p className="mb-1"><strong>Stock:</strong> {product.stock}</p>
                <p className="mb-1"><strong>Categoría:</strong> {product.category}</p>
                <p className="mb-1"><strong>Autor:</strong> {product.author}</p>
              </div>
            </div>

            <p><strong>Descripción:</strong> {product.description}</p>
            <p><strong>Último Control:</strong> {product.lastStockControlDate ? new Date(product.lastStockControlDate).toLocaleDateString() : "N/A"}</p>
            <p><strong>Rating:</strong> {product.rating ? `${product.rating}/5` : "N/A"}</p>
            <p><strong>Precio:</strong> {new Intl.NumberFormat("es-AR", {
                style: "currency",
                currency: "ARS",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(product.price)}</p>

            <div className="d-flex justify-content-between mt-3">
              <button className="btn btn-warning btn-sm" onClick={() => onEdit(product)}>
                <i className="bi bi-pencil-square"></i> Editar
              </button>
              <button className="btn btn-danger btn-sm" onClick={() => onDelete(product._id)}>
                <i className="bi bi-trash"></i> Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductTable;
