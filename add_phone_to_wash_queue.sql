-- ============================================
-- MIGRACIÓN: Agregar Teléfono de Cliente
-- ============================================

-- 1. Agregar columna client_phone a la tabla wash_queue
ALTER TABLE wash_queue 
ADD COLUMN IF NOT EXISTS client_phone TEXT;

-- 2. Verificar que se agregó correctamente
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'wash_queue' AND column_name = 'client_phone';
