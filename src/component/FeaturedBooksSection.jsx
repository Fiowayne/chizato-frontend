// src/component/FeaturedBooksSection.jsx
import React, { useState, useEffect } from "react";
import { getAllProducts } from "../services/productService";
import "../css/FeaturedBooksSection.css";
import { Carousel, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getProductImageUrl } from "../utils/productImage";

const FeaturedBooksSection = () => {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chunkSize, setChunkSize] = useState(3);

  // Función auxiliar para mezclar un array (algoritmo de Fisher-Yates)
  const shuffleArray = (array) => {
    let currentIndex = array.length,
      randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
    return array;
  };

  useEffect(() => {
    const fetchFeaturedBooks = async () => {
      setLoading(true);
      setError(null);
      try {
        const allBooks = await getAllProducts();

        const booksWithFiveRating = allBooks.filter(
          (book) => book.rating === 5
        );

        const shuffledBooks = shuffleArray([...booksWithFiveRating]);
        const selectedFeaturedBooks = shuffledBooks.slice(0, 12);

        setFeaturedBooks(selectedFeaturedBooks);
      } catch {
        setError("No se pudieron cargar los libros destacados.");
      } finally {
        setLoading(false);
      }
    };

    // Función para actualizar el chunkSize basado en el tamaño de la ventana
    const updateChunkSize = () => {
      if (window.innerWidth >= 992) {
        setChunkSize(3); // 3 tarjetas en pantallas grandes (Lg y Xl)
      } else if (window.innerWidth >= 768) {
        setChunkSize(2); // 2 tarjetas en pantallas medianas (Md)
      } else {
        setChunkSize(1); // 1 tarjeta en pantallas pequeñas (Sm y Xs)
      }
    };

    // Escuchar el evento de redimensionamiento de la ventana
    window.addEventListener("resize", updateChunkSize);

    // Llamar una vez al inicio para establecer el chunkSize inicial
    updateChunkSize();
    fetchFeaturedBooks();

    // Limpiar el event listener al desmontar el componente
    return () => window.removeEventListener("resize", updateChunkSize);
  }, []);

  if (loading) {
    return (
      <div className="featured-books-container text-center text-white">
        Cargando libros destacados...
      </div>
    );
  }

  if (error) {
    return (
      <div className="featured-books-container text-center text-danger">
        Error: {error}
      </div>
    );
  }

  if (featuredBooks.length === 0) {
    return (
      <div className="featured-books-container text-center text-white">
        No hay libros destacados con rating 5 disponibles.
      </div>
    );
  }

  const chunkArray = (array, chunkSize) => {
    const result = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      result.push(array.slice(i, i + chunkSize));
    }
    return result;
  };

  const bookChunks = chunkArray(featuredBooks, chunkSize);

  return (
    <div className="featured-books-carousel-wrapper">
      <Carousel interval={null} indicators={false}>
        {bookChunks.map((chunk, index) => (
          <Carousel.Item key={index}>
            <div className="d-flex justify-content-center align-items-stretch gap-4 featured-books-row">
              {chunk.map((book) => (
                <Card
                  key={book._id}
                  className="featured-book-item bg-dark text-white p-0 overflow-hidden"
                >
                  <div className="card-image-wrapper">
                    <Link to={`/products/${book._id}`}>
                      <Card.Img
                        variant="top"
                        src={getProductImageUrl(book.image)}
                        alt={book.name}
                        className="featured-book-image"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://via.placeholder.com/300x450?text=Imagen+no+disponible";
                          e.target.alt = "Imagen no disponible";
                        }}
                      />
                    </Link>

                    <div className="featured-book-info-overlay">
                      <h5 className="card-title text-warning">{book.name}</h5>
                      <p className="card-text">
                        <small>{book.author}</small>
                      </p>

                      <p className="card-text featured-description text-truncate-lines-2">
                        {book.description}
                      </p>
                      <h5 className="text-success mt-2">
                        {new Intl.NumberFormat("es-AR", {
                          style: "currency",
                          currency: "ARS",
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(book.price)}
                      </h5>

                      <div className="category-tag bg-warning text-dark px-2 py-1 rounded">
                        {book.category}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default FeaturedBooksSection;
