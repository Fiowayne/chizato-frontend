export const HTTP_ERROR_MESSAGES = {
  400: "Solicitud inválida. Revisá los datos ingresados.",
  401: "No autorizado. Iniciá sesión para continuar.",
  403: "No tenés permiso para realizar esta acción.",
  404: "El recurso solicitado no fue encontrado.",
  409: "Conflicto con el estado actual del recurso.",
  422: "Los datos enviados no son válidos.",
  500: "Error interno del servidor. Intentá más tarde.",
};

export const getHttpErrorMessage = (
  error,
  fallback = "Ocurrió un error inesperado."
) => {
  if (!error?.response) {
    return (
      error?.message ||
      "No se pudo conectar con el servidor. Verificá que el backend esté activo."
    );
  }

  const { status, data } = error.response;
  if (data?.message) return data.message;
  return HTTP_ERROR_MESSAGES[status] || fallback;
};

export const getHttpStatus = (error) => error?.response?.status || null;
