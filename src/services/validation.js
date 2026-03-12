/**
 * Utilidades de validación para el sistema de Carwash
 */

import { CarWashError } from './errorHandling';

export const validateSale = (data) => {
  if (!data.total_amount || isNaN(data.total_amount) || Number(data.total_amount) <= 0) {
    throw CarWashError.validationError('El monto total de la venta debe ser mayor a cero.');
  }

  if (!data.payment_method) {
    throw CarWashError.validationError('Se debe especificar un método de pago.');
  }

  if (!data.sale_items || !Array.isArray(data.sale_items) || data.sale_items.length === 0) {
    throw CarWashError.validationError('La venta debe incluir al menos un producto.');
  }

  // Validar cada ítem
  data.sale_items.forEach((item, index) => {
    if (!item.inventory_id) {
      throw CarWashError.validationError(`El ítem en la posición ${index + 1} no tiene un ID de inventario válido.`);
    }
    if (!item.quantity || item.quantity <= 0) {
      throw CarWashError.validationError(`La cantidad del ítem ${index + 1} debe ser mayor a cero.`);
    }
    if (!item.unit_price || item.unit_price < 0) {
      throw CarWashError.validationError(`El precio unitario del ítem ${index + 1} no puede ser negativo.`);
    }
  });

  return {
    ...data,
    total_amount: Number(data.total_amount),
    client_name: data.client_name || 'CLIENTE FINAL',
    client_rnc: data.client_rnc || '',
    invoice_type: data.invoice_type || 'final'
  };
};

export const validateWash = (data) => {
  if (!data.vehicle_plate || data.vehicle_plate.trim().length < 3) {
    throw CarWashError.validationError('La placa del vehículo es obligatoria (mínimo 3 caracteres).');
  }

  if (!data.service_id) {
    throw CarWashError.validationError('Debe seleccionar un servicio de lavado.');
  }

  if (!data.vehicle_model) {
    throw CarWashError.validationError('El modelo del vehículo es obligatorio.');
  }

  return {
    ...data,
    vehicle_plate: data.vehicle_plate.toUpperCase().trim(),
    vehicle_model: data.vehicle_model.trim(),
    client_phone: data.client_phone || '',
    type: data.type || 'car',
    gama: data.gama || 'estandar'
  };
};

export const validateInventory = (data) => {
  if (data.name !== undefined && data.name.trim().length === 0) {
    throw CarWashError.validationError('El nombre del producto no puede estar vacío.');
  }

  if (data.price !== undefined && (isNaN(data.price) || Number(data.price) < 0)) {
    throw CarWashError.validationError('El precio del producto no puede ser negativo.');
  }

  if (data.stock !== undefined && (isNaN(data.stock) || Number(data.stock) < 0)) {
    throw CarWashError.validationError('El stock inicial no puede ser negativo.');
  }

  return {
    ...data,
    name: data.name ? data.name.trim() : undefined,
    price: data.price !== undefined ? Number(data.price) : undefined,
    stock: data.stock !== undefined ? Number(data.stock) : undefined
  };
};

export const validateUser = (data) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!data.email || !emailRegex.test(data.email)) {
    throw CarWashError.validationError('Debe proporcionar un correo electrónico válido.');
  }

  if (!data.password || data.password.length < 6) {
    throw CarWashError.validationError('La contraseña debe tener al menos 6 caracteres.');
  }

  if (!data.role || !['Administrador', 'Agente'].includes(data.role)) {
    throw CarWashError.validationError('El rol especificado no es válido.');
  }

  return data;
};
