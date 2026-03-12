import React from 'react';

// Clase personalizada para errores de manejo centralizado
export class CarWashError extends Error {
  constructor(message, code, statusCode = 400, details = null) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.name = 'CarWashError';
    this.timestamp = new Date().toISOString();
  }

  // Método para obtener el error en formato JSON
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      details: this.details,
      timestamp: this.timestamp
    };
  }

  // Método estático para crear errores comunes
  static databaseError(message = 'Error de base de datos', details = null) {
    return new CarWashError(message, 'DATABASE_ERROR', 500, details);
  }

  static networkError(message = 'Error de conexión', details = null) {
    return new CarWashError(message, 'NETWORK_ERROR', 503, details);
  }

  static notFound(resource = 'Recurso', id = null) {
    const message = id ? `${resource} con ID ${id} no encontrado` : `${resource} no encontrado`;
    return new CarWashError(message, 'NOT_FOUND', 404);
  }

  static unauthorized(message = 'No autorizado') {
    return new CarWashError(message, 'UNAUTHORIZED', 401);
  }

  static forbidden(message = 'Acceso denegado') {
    return new CarWashError(message, 'FORBIDDEN', 403);
  }

  static validationError(message = 'Error de validación', details = null) {
    return new CarWashError(message, 'VALIDATION_ERROR', 400, details);
  }

  static insufficientStock(productId, requested, available) {
    const message = `Stock insuficiente. Producto ID: ${productId}. Solicitado: ${requested}, Disponible: ${available}`;
    return new CarWashError(message, 'INSUFFICIENT_STOCK', 400, {
      productId,
      requested,
      available
    });
  }

  static duplicateResource(resource, field, value) {
    const message = `${resource} con ${field} '${value}' ya existe`;
    return new CarWashError(message, 'DUPLICATE_RESOURCE', 409, { field, value });
  }

  static invalidService(serviceId) {
    return new CarWashError(`Servicio inválido: ${serviceId}`, 'INVALID_SERVICE', 400);
  }

  static invalidPaymentMethod(method) {
    return new CarWashError(`Método de pago inválido: ${method}`, 'INVALID_PAYMENT_METHOD', 400);
  }

  static operationFailed(operation, details = null) {
    return new CarWashError(`Operación fallida: ${operation}`, 'OPERATION_FAILED', 500, details);
  }
}

// Función wrapper para manejo de errores asíncronos
export const withErrorHandling = async (operation, context = '') => {
  try {
    return await operation();
  } catch (error) {
    console.error(`Error en ${context}:`, error);
    
    // Si ya es un CarWashError, relanzarlo
    if (error instanceof CarWashError) {
      throw error;
    }
    
    // Manejar errores de Supabase específicos
    if (error.code) {
      switch (error.code) {
        case '23505': // Unique violation
          throw CarWashError.duplicateResource('Registro', 'valor', error.details);
        case '23503': // Foreign key violation
          throw CarWashError.databaseError('Violación de llave foránea', error.details);
        case '23502': // Not null violation
          throw CarWashError.validationError('Campo requerido faltante', error.details);
        case 'PGRST116': // Not found en Supabase
          throw CarWashError.notFound();
        case 'PGRST301': // Permission denied en Supabase
          throw CarWashError.forbidden('Permiso denegado');
        default:
          throw CarWashError.databaseError('Error de base de datos', error);
      }
    }
    
    // Errores de red
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw CarWashError.networkError('No se pudo conectar al servidor');
    }
    
    // Error genérico
    throw CarWashError.operationFailed(context, error.message);
  }
};

// Hook personalizado para manejo de errores en React
export const useErrorHandler = () => {
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const executeOperation = React.useCallback(async (operation, context = '') => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await withErrorHandling(operation, context);
      return { success: true, data: result };
    } catch (err) {
      setError(err);
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = React.useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    loading,
    executeOperation,
    clearError
  };
};

// Logger de errores para debugging y monitoreo
export const logError = (error, context = '', additionalInfo = {}) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    context,
    error: error instanceof Error ? error.toJSON ? error.toJSON() : {
      name: error.name,
      message: error.message,
      stack: error.stack
    },
    additionalInfo,
    userAgent: navigator.userAgent,
    url: window.location.href
  };

  // En desarrollo, mostrar en consola
  if (import.meta.env.DEV) {
    console.group(`🚨 Error en ${context}`);
    console.error(error);
    console.table(logEntry);
    console.groupEnd();
  }

  // En producción, enviar a servicio de monitoreo
  if (!import.meta.env.DEV) {
    // Aquí se podría integrar con Sentry, LogRocket, etc.
    // Ejemplo: Sentry.captureException(error, { extra: additionalInfo });
    console.warn('Error logged:', logEntry);
  }

  return logEntry;
};

// Función para mostrar errores amigables al usuario
export const getErrorMessage = (error, fallbackMessage = 'Ocurrió un error inesperado') => {
  if (!error) return fallbackMessage;

  // Si es un CarWashError, usar su mensaje
  if (error instanceof CarWashError) {
    return error.message;
  }

  // Mensajes específicos para errores comunes
  if (error.message) {
    if (error.message.includes('Network request failed')) {
      return 'Error de conexión. Verifica tu conexión a internet.';
    }
    
    if (error.message.includes('JWT')) {
      return 'Tu sesión ha expirado. Por favor inicia sesión nuevamente.';
    }
    
    if (error.message.includes('Invalid login credentials')) {
      return 'Correo o contraseña incorrectos.';
    }
    
    if (error.message.includes('Email not confirmed')) {
      return 'Por favor confirma tu correo electrónico antes de continuar.';
    }
  }

  return fallbackMessage;
};

// Componente de error boundary para capturar errores de React
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    logError(error, 'React Error Boundary', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="mb-4">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Algo salió mal
            </h2>
            <p className="text-gray-600 mb-6">
              {getErrorMessage(this.state.error, 'Ocurrió un error inesperado en la aplicación.')}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Recargar página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}