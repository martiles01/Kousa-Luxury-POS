import { z } from 'zod';

// Schema para validación de ventas
const saleSchema = z.object({
  total_amount: z.number()
    .positive("El monto debe ser positivo")
    .max(999999, "El monto no puede exceder RD$999,999")
    .refine(val => (val * 100) % 1 === 0, "El monto debe tener máximo 2 decimales"),
  
  payment_method: z.enum(['Efectivo', 'Tarjeta', 'Transferencia'], {
    errorMap: () => ({ message: "Método de pago inválido. Debe ser: Efectivo, Tarjeta o Transferencia" })
  }),
  
  client_name: z.string()
    .min(1, "El nombre del cliente es requerido")
    .max(100, "El nombre no puede exceder 100 caracteres")
    .transform(val => val.trim().toUpperCase()),
  
  client_rnc: z.string()
    .max(20, "El RNC/Cédula no puede exceder 20 caracteres")
    .optional()
    .refine(val => {
      if (!val) return true; // Opcional para consumidor final
      // Validar formato RNC/Cédula dominicana
      return /^[0-9]{9}$|^[0-9]{11}$/.test(val.replace(/\D/g, ''));
    }, "RNC/Cédula inválida. Debe tener 9 o 11 dígitos"),
  
  invoice_type: z.enum(['final', 'fiscal'], {
    errorMap: () => ({ message: "Tipo de factura inválido. Debe ser: final o fiscal" })
  })
});

// Schema para validación de ítems de venta
const saleItemSchema = z.object({
  inventory_id: z.string().uuid("ID de inventario inválido"),
  quantity: z.number()
    .positive("La cantidad debe ser positiva")
    .max(999, "La cantidad no puede exceder 999")
    .int("La cantidad debe ser un número entero"),
  unit_price: z.number()
    .positive("El precio unitario debe ser positivo")
    .max(99999, "El precio unitario no puede exceder RD$99,999")
    .refine(val => (val * 100) % 1 === 0, "El precio debe tener máximo 2 decimales")
});

// Schema para validación completa de venta con ítems
const completeSaleSchema = saleSchema.extend({
  sale_items: z.array(saleItemSchema)
    .min(1, "Debe agregar al menos un producto a la venta")
    .max(50, "No puede agregar más de 50 productos en una sola venta")
});

// Schema para validación de lavado
const washSchema = z.object({
  vehicle_plate: z.string()
    .min(3, "La placa debe tener al menos 3 caracteres")
    .max(10, "La placa no puede exceder 10 caracteres")
    .transform(val => val.trim().toUpperCase()),
  
  vehicle_model: z.string()
    .min(1, "El modelo del vehículo es requerido")
    .max(50, "El modelo no puede exceder 50 caracteres")
    .transform(val => val.trim()),
  
  service_id: z.string().uuid("ID de servicio inválido"),
  
  client_phone: z.string()
    .max(20, "El teléfono no puede exceder 20 caracteres")
    .optional()
    .refine(val => {
      if (!val) return true; // Opcional
      return /^[0-9]{10}$/.test(val.replace(/\D/g, ''));
    }, "El teléfono debe tener 10 dígitos"),
  
  type: z.enum(['car', 'suv', 'truck', 'motorcycle'], {
    errorMap: () => ({ message: "Tipo de vehículo inválido. Debe ser: car, suv, truck o motorcycle" })
  }),
  
  gama: z.enum(['estandar', 'premium', 'luxury'], {
    errorMap: () => ({ message: "Gama inválida. Debe ser: estandar, premium o luxury" })
  })
});

// Schema para validación de inventario
const inventorySchema = z.object({
  name: z.string()
    .min(1, "El nombre es requerido")
    .max(100, "El nombre no puede exceder 100 caracteres")
    .transform(val => val.trim()),
  
  price: z.number()
    .positive("El precio debe ser positivo")
    .max(99999, "El precio no puede exceder RD$99,999")
    .refine(val => (val * 100) % 1 === 0, "El precio debe tener máximo 2 decimales"),
  
  stock: z.number()
    .int("El stock debe ser un número entero")
    .min(0, "El stock no puede ser negativo")
    .max(9999, "El stock no puede exceder 9999 unidades"),
  
  category: z.string()
    .min(1, "La categoría es requerida")
    .max(50, "La categoría no puede exceder 50 caracteres"),
  
  icon: z.string()
    .max(2, "El icono no puede exceder 2 caracteres")
    .optional()
});

// Schema para validación de usuarios
const userSchema = z.object({
  email: z.string()
    .email("Correo electrónico inválido")
    .max(100, "El correo no puede exceder 100 caracteres")
    .transform(val => val.toLowerCase().trim()),
  
  password: z.string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(128, "La contraseña no puede exceder 128 caracteres")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
      "La contraseña debe contener al menos una letra minúscula, una mayúscula y un número"),
  
  role: z.enum(['Administrador', 'Agente'], {
    errorMap: () => ({ message: "Rol inválido. Debe ser: Administrador o Agente" })
  })
});

// Schema para validación de reportes
const reportFilterSchema = z.object({
  start_date: z.string()
    .datetime("Fecha de inicio inválida")
    .optional(),
  
  end_date: z.string()
    .datetime("Fecha de fin inválida")
    .optional(),
  
  type_filter: z.enum(['all', 'services', 'products'], {
    errorMap: () => ({ message: "Filtro inválido. Debe ser: all, services o products" })
  }).default('all'),
  
  payment_method: z.enum(['all', 'Efectivo', 'Tarjeta', 'Transferencia'], {
    errorMap: () => ({ message: "Método de pago inválido" })
  }).default('all')
}).refine(data => {
  if (data.start_date && data.end_date) {
    return new Date(data.start_date) <= new Date(data.end_date);
  }
  return true;
}, {
  message: "La fecha de inicio debe ser anterior a la fecha de fin"
});

// Función de validación exportada
export const validateSale = (data) => {
  try {
    return completeSaleSchema.parse(data);
  } catch (error) {
    throw new ValidationError(error.errors);
  }
};

export const validateWash = (data) => {
  try {
    return washSchema.parse(data);
  } catch (error) {
    throw new ValidationError(error.errors);
  }
};

export const validateInventory = (data) => {
  try {
    return inventorySchema.parse(data);
  } catch (error) {
    throw new ValidationError(error.errors);
  }
};

export const validateUser = (data) => {
  try {
    return userSchema.parse(data);
  } catch (error) {
    throw new ValidationError(error.errors);
  }
};

export const validateReportFilter = (data) => {
  try {
    return reportFilterSchema.parse(data);
  } catch (error) {
    throw new ValidationError(error.errors);
  }
};

// Clase personalizada para errores de validación
export class ValidationError extends Error {
  constructor(errors) {
    super('Validation failed');
    this.errors = errors;
    this.name = 'ValidationError';
  }

  getFieldError(field) {
    const error = this.errors.find(err => err.path.includes(field));
    return error ? error.message : null;
  }

  getFirstError() {
    return this.errors[0]?.message || 'Error de validación';
  }

  getAllErrors() {
    return this.errors.reduce((acc, error) => {
      const field = error.path.join('.');
      if (!acc[field]) acc[field] = [];
      acc[field].push(error.message);
      return acc;
    }, {});
  }
}