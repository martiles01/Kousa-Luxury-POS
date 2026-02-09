-- ============================================
-- MIGRACIÓN: Campos de Servicio en Ventas
-- ============================================

-- 1. Agregar columnas para vincular servicios y vehículos a la venta
ALTER TABLE sales 
ADD COLUMN IF NOT EXISTS service_id UUID REFERENCES services(id),
ADD COLUMN IF NOT EXISTS vehicle_plate TEXT;

-- 2. Verificar
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'sales';
