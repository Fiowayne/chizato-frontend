import React from "react";
import "../css/TermsOfService.css";
import termsImage from "../assets/img/ChatGPT Image 23 abr 2025, 08_08_19 a.m..png";

export const TermsofService = () => {
  return (
    <div className="terms-container">
      <div className="terms-image-container">
        <img src={termsImage} alt="Términos y Condiciones" className="terms-image" />
      </div>
      <div className="terms-content-wrapper">
        <div className="terms-content">
          <h1 className="terms-title">Términos y Condiciones</h1>
          <hr className="terms-divider" />
          <div className="terms-scrollable">
            <p>
              <strong>Chisato Zone</strong>
              <br />
              Última actualización: [25 de abril de 2025]
            </p>

            <h5 className="terms-subtitle">1. Aceptación de los Términos</h5>
            <p>
              Al acceder y utilizar nuestros Servicios, aceptas cumplir con estos Términos y Condiciones, así como con nuestra Política de Privacidad...
            </p>

            <h5 className="terms-subtitle">2. Modificación de los Términos</h5>
            <p>
              Nos reservamos el derecho de modificar, actualizar o cambiar estos Términos en cualquier momento...
            </p>

            <h5 className="terms-subtitle">3. Uso de los Servicios</h5>
            <p>
              <strong>3.1 Acceso y Registro:</strong> Para utilizar algunos de nuestros Servicios, puede que debas crear una cuenta...
            </p>
            <p>
              <strong>3.2 Restricciones:</strong> Aceptas no usar nuestros Servicios para actividades ilegales, acoso, transmisión de material no autorizado, etc.
            </p>

            <h5 className="terms-subtitle">4. Propiedad Intelectual</h5>
            <p>
              Los derechos de propiedad intelectual del contenido son propiedad de Chisato Zone o sus licenciantes...
            </p>

            <h5 className="terms-subtitle">5. Pagos y Facturación</h5>
            <p>
              <strong>5.1 Precios y Facturación:</strong> Algunos Servicios pueden tener costos asociados...
            </p>
            <p>
              <strong>5.2 Métodos de Pago:</strong> Aceptamos [Visa, MasterCard, PayPal, etc.]...
            </p>
            <p>
              <strong>5.3 Política de Reembolso:</strong> Todos los pagos realizados son finales, salvo indicación contraria...
            </p>

            <h5 className="terms-subtitle">6. Privacidad y Seguridad</h5>
            <p>
              <strong>6.1 Protección de Datos:</strong> Estamos comprometidos con la protección de tu privacidad...
            </p>
            <p>
              <strong>6.2 Uso de la Información:</strong> Podemos recopilar y utilizar datos personales para proveer nuestros Servicios...
            </p>

            <h5 className="terms-subtitle">7. Responsabilidades del Usuario</h5>
            <p>
              Eres responsable de usar nuestros Servicios conforme a estos Términos...
            </p>

            <h5 className="terms-subtitle">8. Exención de Responsabilidad</h5>
            <p>
              <strong>8.1 Limitación de Responsabilidad:</strong> Chisato Zone no será responsable por daños indirectos, incidentales, etc...
            </p>
            <p>
              <strong>8.2 Sin Garantías:</strong> Nuestros Servicios se proporcionan "tal cual"...
            </p>

            <h5 className="terms-subtitle">9. Terminación</h5>
            <p>
              Podemos suspender o terminar tu acceso a los Servicios si violas estos Términos...
            </p>

            <h5 className="terms-subtitle">10. Fuerza Mayor</h5>
            <p>
              No seremos responsables por retrasos o fallas causados por eventos fuera de nuestro control razonable...
            </p>

            <h5 className="terms-subtitle">
              11. Ley Aplicable y Jurisdicción
            </h5>
            <p>
              Estos Términos se rigen por las leyes de [país o jurisdicción]...
            </p>

            <h5 className="terms-subtitle">12. Indemnización</h5>
            <p>
              Aceptas indemnizar y mantener a Chisato Zone libre de cualquier reclamo, daño, gasto, etc...
            </p>

            <h5 className="terms-subtitle">13. Disposiciones Generales</h5>
            <p>
              <strong>13.1 Acuerdo Completo:</strong> Estos Términos constituyen el acuerdo completo entre tú y Chisato Zone...
            </p>
            <p>
              <strong>13.2 Divisibilidad:</strong> Si alguna disposición es declarada inválida, el resto permanecerá válido...
            </p>
            <p>
              <strong>13.3 Cesión:</strong> Chisato Zone puede ceder sus derechos sin consentimiento previo...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

