import React, { useState } from "react";
import "../../css/MainPage.css";
import ProductCatalog from "../ProductCatalog";
import ProductViewer from "./ProductViewer";
import LogoChisato from "../../assets/img/logo-main.png";

const ProductList = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);

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

      <div className="row mt-4 mb-3">
        <div className="col-12 text-center">
          <h2 className="text-warning display-4 fw-bold">Catálogo</h2>
          <p className="text-white-50 mt-2">
            Seleccioná un producto para ver el detalle
          </p>
        </div>
      </div>

      <div className="row my-4">
        <div className="col-12">
          <ProductCatalog
            selectedProductId={selectedProduct?._id}
            onSelectProduct={setSelectedProduct}
          />
        </div>
      </div>

      {selectedProduct && (
        <>
          <div className="row">
            <div className="col-12">
              <hr className="border-warning" style={{ borderTopWidth: "3px" }} />
            </div>
          </div>
          <div className="row my-4">
            <div className="col-12">
              <ProductViewer
                product={selectedProduct}
                onClose={() => setSelectedProduct(null)}
              />
            </div>
          </div>
        </>
      )}

      <div className="row">
        <div className="col-12">
          <hr className="border-warning" style={{ borderTopWidth: "3px" }} />
        </div>
      </div>
    </div>
  );
};

export default ProductList;
