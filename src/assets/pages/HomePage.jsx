import React from "react";
import "../../css/MainPage.css";
import FeaturedBooksSection from "../../component/FeaturedBooksSection";
import ProductCatalog from "../../component/ProductCatalog";
import LogoChisato from "../../assets/img/logo-main.png";

export const HomePage = () => {
  return (
    <div className="container text-white">
      <div className="row">
        <div className="col-12 text-center py-4">
          <img
            src={LogoChisato}
            alt="Logo principal"
            className="img-fluid"
            style={{ maxWidth: "150px" }}
          />
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <hr className="border-warning" style={{ borderTopWidth: "3px" }} />
        </div>
      </div>

      <div className="row mt-5 mb-3">
        <div className="col-12 text-center">
          <h2 className="text-warning display-4 fw-bold">Destacados</h2>
        </div>
      </div>

      <div className="row my-4">
        <div className="col-12 d-flex justify-content-center align-items-center">
          <FeaturedBooksSection />
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <hr className="border-warning" style={{ borderTopWidth: "3px" }} />
        </div>
      </div>

      <div className="row my-5">
        <div className="col-12">
          <ProductCatalog />
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <hr className="border-warning" style={{ borderTopWidth: "3px" }} />
        </div>
      </div>
    </div>
  );
};
