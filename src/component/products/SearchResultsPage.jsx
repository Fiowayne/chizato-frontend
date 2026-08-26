// src/component/products/SearchResultsPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { searchProducts } from "../../services/productService"; 
import ProductCard from "./ProductCard"; 
import "../../css/SearchResultsPage.css"; 

const SearchResultsPage = () => {
  const { query: urlQuery } = useParams(); // Obtiene el parámetro 'query' de la URL
  const location = useLocation(); // Para detectar cambios de URL y forzar re-búsqueda
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda actual

  useEffect(() => {
    // Decodifica el término de búsqueda de la URL
    const decodedQuery = decodeURIComponent(urlQuery || "");
    setSearchTerm(decodedQuery); // Actualiza el estado del término de búsqueda

    const fetchSearchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        if (decodedQuery.trim()) {
          // Solo busca si hay un término válido
          const data = await searchProducts(decodedQuery);
          setProducts(data);
        } else {
          setProducts([]); // Si el query está vacío, no hay resultados
        }
      } catch (err) {
        console.error("Error al buscar productos:", err);
        setError(
          err.message ||
            "No se pudieron cargar los resultados de la búsqueda. Intenta de nuevo más tarde."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [urlQuery, location]); // Dependencias: urlQuery y location para re-ejecutar cuando cambia la URL

  if (loading) {
    return (
      <div className="text-white text-center mt-5">
        Buscando libros para "{searchTerm}"...
      </div>
    );
  }

  if (error) {
    return <div className="text-danger text-center mt-5">Error: {error}</div>;
  }

  return (
    <div className="container mt-5">
      <h2 className="text-white mb-4 text-center">
        Resultados de búsqueda para: "{searchTerm}"
      </h2>
      {products.length === 0 ? (
        <div className="text-white text-center">
          No se encontraron libros que coincidan con "{searchTerm}".
        </div>
      ) : (
        <div className="row justify-content-center">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;
