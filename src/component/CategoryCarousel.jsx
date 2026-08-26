// src/component/CategoryCarousel.jsx
import React, { useState, useEffect } from "react";
import { getAllProducts } from "../services/productService";
import ProductCard from "./products/ProductCard";
import "../css/CategoryCarousel.css";

const CategoryCarousel = () => {
  const [categories, setCategories] = useState([]);
  const [booksByCategory, setBooksByCategory] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategoriesAndBooks = async () => {
      setLoading(true);
      setError(null);
      try {
        const allBooks = await getAllProducts();

        const uniqueCategories = [
          ...new Set(allBooks.map((book) => book.category)),
        ];
        setCategories(uniqueCategories);

        const groupedBooks = uniqueCategories.reduce((acc, category) => {
          // Filtrar libros por categoría
          let categoryBooks = allBooks.filter(
            (book) => book.category === category
          );

          // ORDENAR LIBROS POR RATING DE FORMA DESCENDENTE (5 a 1)
          categoryBooks.sort((a, b) => b.rating - a.rating);

          acc[category] = categoryBooks;
          return acc;
        }, {});
        setBooksByCategory(groupedBooks);
      } catch (err) {
        console.error("Error al cargar categorías y libros:", err);
        setError("No se pudieron cargar las categorías o los libros.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoriesAndBooks();
  }, []);

  if (loading) {
    return (
      <div className="text-white text-center mt-5">Cargando categorías...</div>
    );
  }

  if (error) {
    return <div className="text-danger text-center mt-5">Error: {error}</div>;
  }

  if (categories.length === 0) {
    return (
      <div className="text-white text-center mt-5">
        No hay categorías disponibles.
      </div>
    );
  }

  return (
    <div className="category-carousel-container">
      {categories.map((category) => (
        <div key={category} className="category-section mb-5">
          <h3 className="text-warning text-center mb-4">{category}</h3>
          <div className="carousel-track">
            {booksByCategory[category] &&
              booksByCategory[category].map((book) => (
                <ProductCard key={book._id} product={book} />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryCarousel;
