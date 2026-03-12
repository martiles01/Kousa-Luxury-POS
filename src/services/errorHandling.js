export class CarWashError extends Error {
  constructor(message, code, details = {}) {
    super(message);
    this.name = 'CarWashError';
    this.code = code;
    this.details = details;
  }

  static notFound(resource, id) {
    return new CarWashError(
      `${resource} con ID "${id}" no encontrado.`,
      'NOT_FOUND',
      { resource, id }
    );
  }

  static insufficientStock(id, requested, available) {
    return new CarWashError(
      `Stock insuficiente para el producto "${id}". Solicitado: ${requested}, Disponible: ${available}`,
      'INSUFFICIENT_STOCK',
      { id, requested, available }
    );
  }

  static invalidService(id) {
    return new CarWashError(
      `El servicio con ID "${id}" no es válido o no existe.`,
      'INVALID_SERVICE',
      { id }
    );
  }

  static duplicateResource(resource, field, value) {
    return new CarWashError(
      `Ya existe un ${resource.toLowerCase()} con ese ${field}: "${value}".`,
      'DUPLICATE_RESOURCE',
      { resource, field, value }
    );
  }

  static validationError(message) {
    return new CarWashError(message, 'VALIDATION_ERROR');
  }
}

export const withErrorHandling = async (fn, contextLabel = 'Operación') => {
  try {
    return await fn();
  } catch (error) {
    console.error(`Error en [${contextLabel}]:`, error);
    
    // Aquí podrías integrar una librería de notificaciones como react-hot-toast o similar
    // Por ahora usamos un alert simple para visibilidad inmediata si estamos en el browser,
    // o simplemente relanzamos el error para que el componente lo maneje.
    
    let userMessage = `Error al realizar la operación: ${contextLabel}`;
    
    if (error instanceof CarWashError) {
      userMessage = error.message;
    } else if (error.message) {
      userMessage = error.message;
    }
    
    // Alert para feedback inmediato (asumiendo que corre en el cliente)
    if (typeof window !== 'undefined') {
      alert(userMessage);
    }
    
    return null; // O relanzar si se prefiere: throw error;
  }
};
