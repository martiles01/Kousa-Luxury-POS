-- Script para corregir el rol de admin@kousa.com y preparar la integración de servicios en facturas

-- 1. Actualizar el rol del usuario admin@kousa.com a Administrador
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  '"Administrador"'
)
WHERE email = 'admin@kousa.com';

-- 2. Agregar columna service_id a la tabla sales para vincular servicios de lavado
ALTER TABLE sales
ADD COLUMN IF NOT EXISTS service_id UUID REFERENCES services(id);

-- 3. Agregar columna vehicle_plate para identificar el vehículo en la factura
ALTER TABLE sales
ADD COLUMN IF NOT EXISTS vehicle_plate TEXT;

-- Verificar los cambios
SELECT email, raw_user_meta_data->>'role' as role FROM auth.users WHERE email = 'admin@kousa.com';
