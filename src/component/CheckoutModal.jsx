import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";

const CheckoutModal = ({
  show,
  handleClose,
  onPurchaseSuccess,
  totalAmount,
}) => {
  const [deliveryOption, setDeliveryOption] = useState("");
  const [shippingAddress, setShippingAddress] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "",
    province: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [cvv, setCvv] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const resetFormStates = () => {
    setDeliveryOption("");
    setShippingAddress({
      address: "",
      city: "",
      postalCode: "",
      country: "",
      province: "",
    });
    setPaymentMethod("");
    setCardNumber("");
    setExpirationDate("");
    setCvv("");
    setError(null);
  };

  useEffect(() => {
    if (show) {
      resetFormStates();
    }
  }, [show]);

  const handleCloseModalAndReset = () => {
    resetFormStates();
    setLoading(false);
    handleClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "cardNumber") {
      const digitsOnly = value.replace(/\D/g, "");
      let formattedCardNumber = "";
      for (let i = 0; i < digitsOnly.length && i < 16; i++) {
        if (i > 0 && i % 4 === 0) {
          formattedCardNumber += " ";
        }
        formattedCardNumber += digitsOnly[i];
      }
      setCardNumber(formattedCardNumber);
    } else if (name === "expirationDate") {
      const formattedValue = value.replace(/\D/g, "");
      if (formattedValue.length > 2) {
        setExpirationDate(
          `${formattedValue.slice(0, 2)}/${formattedValue.slice(2, 4)}`
        );
      } else {
        setExpirationDate(formattedValue);
      }
    } else if (name === "cvv") {
      setCvv(value.replace(/\D/g, "").slice(0, 3));
    } else if (name === "deliveryOption") {
      setDeliveryOption(value);
      setShippingAddress({
        address: "",
        city: "",
        postalCode: "",
        country: "",
        province: "",
      });
      setPaymentMethod("");
      setCardNumber("");
      setExpirationDate("");
      setCvv("");
    } else if (
      ["address", "city", "postalCode", "country", "province"].includes(name)
    ) {
      let newValue = value;

      if (["city", "province", "country"].includes(name)) {
        newValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
      }

      if (name === "postalCode") {
        newValue = value.replace(/\D/g, "").slice(0, 4);
      }

      setShippingAddress({ ...shippingAddress, [name]: newValue });
    } else if (name === "paymentMethod") {
      setPaymentMethod(value);
      if (value !== "credit_card") {
        setCardNumber("");
        setExpirationDate("");
        setCvv("");
      }
    }
  };

  const validateForm = () => {
    setError(null);

    if (!deliveryOption) {
      setError("Por favor, seleccione una opción de entrega.");
      return false;
    }

    if (deliveryOption === "home_delivery") {
      const { address, city, province, postalCode, country } = shippingAddress;

      if (!address || !city || !postalCode || !country || !province) {
        setError(
          "Por favor, complete todos los campos de la dirección de envío."
        );
        return false;
      }

      const regexLetrasGenerico = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

      if (!regexLetrasGenerico.test(city)) {
        setError("La Ciudad solo puede contener letras y espacios.");
        return false;
      }
      if (city.length > 24) {
        setError("La Ciudad no puede superar los 24 caracteres.");
        return false;
      }

      if (!regexLetrasGenerico.test(province)) {
        setError("La Provincia solo puede contener letras y espacios.");
        return false;
      }
      if (province.length > 19) {
        setError("La Provincia no puede superar los 19 caracteres.");
        return false;
      }

      if (!regexLetrasGenerico.test(country)) {
        setError("El País solo puede contener letras y espacios.");
        return false;
      }
      if (country.length > 10) {
        setError("El País no puede superar los 10 caracteres.");
        return false;
      }

      if (address.length > 30) {
        setError("La dirección no puede superar los 30 caracteres.");
        return false;
      }

      const regexPostal = /^\d{4}$/;
      if (!regexPostal.test(postalCode)) {
        setError("El código postal debe tener exactamente 4 números.");
        return false;
      }
    }

    if (!paymentMethod) {
      setError("Por favor, seleccione un método de pago.");
      return false;
    }

    if (paymentMethod === "credit_card") {
      const cleanCardNumber = cardNumber.replace(/\s/g, "");
      if (!cleanCardNumber || cleanCardNumber.length < 16) {
        setError(
          "Por favor, ingrese un número de tarjeta válido (16 dígitos)."
        );
        return false;
      }
      if (!expirationDate || !/^\d{2}\/\d{2}$/.test(expirationDate)) {
        setError("Por favor, ingrese una fecha de expiración válida (MM/AA).");
        return false;
      }
      const [month, year] = expirationDate.split("/").map(Number);
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;

      if (month < 1 || month > 12) {
        setError("Mes de expiración no válido.");
        return false;
      }
      if (
        year < currentYear ||
        (year === currentYear && month < currentMonth)
      ) {
        setError("La tarjeta ha expirado.");
        return false;
      }

      if (!cvv || cvv.length < 3) {
        setError("Por favor, ingrese un CVV válido (3 dígitos).");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      let orderStatus = "completed";

      const orderDetails = {
        deliveryOption,
        shippingAddress:
          deliveryOption === "home_delivery" ? shippingAddress : undefined,
        paymentMethod,
        paymentDetails:
          paymentMethod === "credit_card"
            ? {
                cardNumber: cardNumber.replace(/\s/g, ""),
                expirationDate,
                cvv,
              }
            : undefined,
        status: orderStatus,
      };

      onPurchaseSuccess(orderDetails);
    } catch {
      setError("Error al procesar la compra. Por favor, inténtelo de nuevo.");
      handleCloseModalAndReset();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleCloseModalAndReset}
      centered
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header
        className="bg-dark text-white"
        closeButton
        onClick={handleCloseModalAndReset}
      >
        <Modal.Title>Finalizar Compra</Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-light text-dark">
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="deliveryOption">
            <Form.Label>¿Cómo deseas recibir tu pedido?</Form.Label>
            <Form.Control
              as="select"
              name="deliveryOption"
              value={deliveryOption}
              onChange={handleChange}
              required
              className="bg-info text-white border-primary"
            >
              <option value="">Seleccione una opción</option>
              <option value="home_delivery">Envío a domicilio</option>
              <option value="store_pickup">Retirar en el local</option>
            </Form.Control>
          </Form.Group>

          {deliveryOption === "home_delivery" && (
            <>
              <h5 className="mt-4 mb-3">Datos de Envío</h5>
              <Form.Group className="mb-3" controlId="address">
                <Form.Label>Dirección</Form.Label>
                <Form.Control
                  type="text"
                  name="address"
                  placeholder="Calle y número"
                  value={shippingAddress.address}
                  onChange={handleChange}
                  required
                  className="bg-info text-white border-primary"
                  maxLength={30}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="city">
                <Form.Label>Ciudad</Form.Label>
                <Form.Control
                  type="text"
                  name="city"
                  placeholder="Ciudad"
                  value={shippingAddress.city}
                  onChange={handleChange}
                  required
                  className="bg-info text-white border-primary"
                  maxLength={24}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="province">
                <Form.Label>Provincia</Form.Label>
                <Form.Control
                  type="text"
                  name="province"
                  placeholder="Provincia"
                  value={shippingAddress.province}
                  onChange={handleChange}
                  required
                  className="bg-info text-white border-primary"
                  maxLength={19}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="postalCode">
                <Form.Label>Código Postal</Form.Label>
                <Form.Control
                  type="text"
                  name="postalCode"
                  placeholder="Ej: 4000"
                  value={shippingAddress.postalCode}
                  onChange={handleChange}
                  required
                  className="bg-info text-white border-primary"
                  maxLength={4}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="country">
                <Form.Label>País</Form.Label>
                <Form.Control
                  type="text"
                  name="country"
                  placeholder="País"
                  value={shippingAddress.country}
                  onChange={handleChange}
                  required
                  className="bg-info text-white border-primary"
                  maxLength={10}
                />
              </Form.Group>
            </>
          )}

          {deliveryOption && (
            <Form.Group className="mb-3 mt-4" controlId="paymentMethod">
              <Form.Label>Método de Pago</Form.Label>
              <Form.Control
                as="select"
                name="paymentMethod"
                value={paymentMethod}
                onChange={handleChange}
                required
                className="bg-info text-white border-primary"
              >
                <option value="">Seleccione un método</option>
                {deliveryOption === "home_delivery" && (
                  <>
                    <option value="credit_card">Tarjeta de Crédito</option>

                    <option value="cash_on_delivery">
                      Pago Contra Entrega
                    </option>
                  </>
                )}
                {deliveryOption === "store_pickup" && (
                  <>
                    <option value="credit_card">Tarjeta de Crédito</option>
                    <option value="pay_at_store">Pagar en el Local</option>
                  </>
                )}
              </Form.Control>
            </Form.Group>
          )}

          {paymentMethod === "credit_card" && (
            <>
              <h5 className="mt-4 mb-3">Datos de Tarjeta de Crédito</h5>
              <Form.Group className="mb-3" controlId="cardNumber">
                <Form.Label>Número de Tarjeta</Form.Label>
                <Form.Control
                  type="text"
                  name="cardNumber"
                  placeholder="XXXX XXXX XXXX XXXX"
                  value={cardNumber}
                  onChange={handleChange}
                  required
                  className="bg-info text-white border-primary"
                  maxLength={19}
                />
              </Form.Group>
              <div className="d-flex justify-content-between">
                <Form.Group
                  className="mb-3 flex-grow-1 me-2"
                  controlId="expirationDate"
                >
                  <Form.Label>Fecha de Vencimiento (MM/AA)</Form.Label>
                  <Form.Control
                    type="text"
                    name="expirationDate"
                    placeholder="MM/AA"
                    value={expirationDate}
                    onChange={handleChange}
                    required
                    className="bg-info text-white border-primary"
                    maxLength={5}
                  />
                </Form.Group>
                <Form.Group className="mb-3 flex-grow-1 ms-2" controlId="cvv">
                  <Form.Label>CVV</Form.Label>
                  <Form.Control
                    type="text"
                    name="cvv"
                    placeholder="XXX"
                    value={cvv}
                    onChange={handleChange}
                    required
                    className="bg-info text-white border-primary"
                    maxLength={3}
                  />
                </Form.Group>
              </div>
            </>
          )}

          {error && (
            <Alert variant="danger" className="mt-2">
              {error}
            </Alert>
          )}

          <Button
            type="submit"
            className="btn btn-success mt-3"
            disabled={loading || !totalAmount || totalAmount <= 0}
            style={{ width: "100%", marginTop: "15px" }}
          >
            {loading
              ? "Procesando compra..."
              : `Pagar $${totalAmount?.toFixed(2) || "0.00"}`}
          </Button>
        </Form>
      </Modal.Body>
      <Modal.Footer className="bg-dark">
        <Button
          variant="secondary"
          onClick={handleCloseModalAndReset}
          disabled={loading}
        >
          Cancelar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CheckoutModal;
