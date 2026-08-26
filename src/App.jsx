import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

// Componentes de autenticación y protección
import Login from "./component/Login";
import Register from "./component/Register";
import { ProtectedUserAdmin } from "./component/ProtectedUserAdmin";

// Componentes de Layout y Páginas principales
import NotFound from "./assets/pages/Error404";
import ResourceErrorPage from "./assets/pages/ResourceErrorPage";
import Navbar from "./assets/layout/navbar";
import Footer from "./assets/layout/Footer";
import { HomePage } from "./assets/pages/HomePage";
import AboutUs from "./component/AboutUs";
import Contact from "./component/Contact";
import { TermsofService } from "./component/TermsofService";

// Componentes de Productos (parte pública)
import ProductList from "./component/products/ProductList";
import ProductDetail from "./component/products/ProductDetail";
import SearchResultsPage from "./component/products/SearchResultsPage";

// Componentes de administración
import AdminPage from "./component/admin/AdminPage";
import StockManagementPage from "./component/admin/StockManagementPage";
import UserManagementPage from "./component/admin/UserManagementPage";
import AdminOrderHistoryPage from "./component/admin/AdminOrderHistoryPage";

// Componente carrito
import CartPage from "./component/CartPage";

// Compras
import MyPurchases from "./component/MyPurchases";

// Perfil
import Profile from "./component/Profile";

// Olvidaste tu contraseña

import ForgotPassword from "./component/ForgotPassword";

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <main
          style={{ backgroundColor: "black" }}
          className="d-flex flex-column flex-grow-1"
        >
          <div className="container py-lg-5 py-3 border border-white rounded mt-4 mb-4 flex-grow-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductList />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/cart" element={<CartPage />} />
              <Route
                path="/search/books/:query"
                element={<SearchResultsPage />}
              />
              <Route path="/mypurchases" element={<MyPurchases />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/terms" element={<TermsofService />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/profile" element={<Profile />} />
              <Route
                path="/admin/stock"
                element={
                  <ProtectedUserAdmin>
                    <StockManagementPage />
                  </ProtectedUserAdmin>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedUserAdmin>
                    <AdminPage />
                  </ProtectedUserAdmin>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedUserAdmin>
                    <UserManagementPage />
                  </ProtectedUserAdmin>
                }
              />
              <Route
                path="/admin/orders"
                element={
                  <ProtectedUserAdmin>
                    <AdminOrderHistoryPage />
                  </ProtectedUserAdmin>
                }
              />
              <Route path="/recurso-no-encontrado" element={<ResourceErrorPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
