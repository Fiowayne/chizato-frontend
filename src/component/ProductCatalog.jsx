import React, { useState, useEffect, useMemo } from "react";
import { getAllProducts } from "../services/productService";
import ProductCard from "./products/ProductCard";

const ProductCatalog = ({
  selectedProductId = null,
  onSelectProduct = null,
  title = "Nuestro Catálogo",
}) => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllProducts();
        setProducts(data);
      } catch (err) {
        console.error("Error al cargar productos:", err);
        setError("No se pudieron cargar los productos.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = useMemo(() => {
    const unique = [...new Set(products.map((p) => p.category).filter(Boolean))];
    return ["Todas", ...unique.sort()];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "Todas") return products;
    return products.filter((p) => p.category === selectedCategory);
  }, [products, selectedCategory]);

  if (loading) {
    return (
      <div className="text-white text-center py-4">Cargando catálogo...</div>
    );
  }

  if (error) {
    return <div className="text-danger text-center py-4">{error}</div>;
  }

  return (
    <div className="py-3">
      <div className="row mb-4 align-items-end">
        <div className="col-12 col-md-8 text-center text-md-start mb-3 mb-md-0">
          <h2 className="text-warning display-6 fw-bold mb-0">{title}</h2>
        </div>
        <div className="col-12 col-md-4">
          <label htmlFor="categoryFilter" className="form-label text-white">
            Filtrar por categoría
          </label>
          <select
            id="categoryFilter"
            className="form-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <p className="text-white text-center">
          No hay productos en esta categoría.
        </p>
      ) : (
        <div className="row justify-content-center">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              isSelected={selectedProductId === product._id}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductCatalog;
