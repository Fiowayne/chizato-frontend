import React from "react";
import "../css/TermsOfService.css";
import termsImage from "../assets/img/ChatGPT Image 23 abr 2025, 08_08_19 a.m..png";

const AboutUs = () => {
  return (
    <div className="terms-container">
      <div className="terms-image-container">
        <img src={termsImage} alt="Acerca de nosotros" className="terms-image" />
      </div>
      <div className="terms-content-wrapper">
        <div className="terms-content">
          <h1 className="terms-title">Acerca de Nosotros</h1>
          <hr className="terms-divider" />
          <div className="terms-scrollable">
            <p>
              <strong>Chisato Zone</strong>
              <br />

            </p>

            <p>
              En Chisato Zone nos dedicamos a ofrecer una amplia variedad de libros para todos los gustos y edades. Nuestro catálogo incluye desde clásicos de la literatura hasta las últimas novedades en distintos géneros.
            </p>

            <p>
              Nuestro objetivo es fomentar el amor por la lectura y facilitar el acceso a los mejores títulos mediante una plataforma fácil de usar y con envíos rápidos a todo el país.
            </p>

            <p>
              Ofrecemos un servicio de entrega confiable, con seguimiento en tiempo real para que puedas recibir tus libros cómodamente en la puerta de tu casa.
            </p>

            <p>
              Además, contamos con atención personalizada para ayudarte a elegir la mejor opción según tus intereses y necesidades.
            </p>

            <p>
              Gracias por elegir Chisato Zone. Estamos aquí para acompañarte en cada página.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
