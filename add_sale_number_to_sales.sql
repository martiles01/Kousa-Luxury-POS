-- ============================================
-- MIGRACIÓN: Número de Venta Secuencial
-- ============================================

-- 1. Agregar columna SERIAL (autoincremental)
-- Esto poblará automáticamente las filas existentes.
ALTER TABLE sales 
ADD COLUMN IF NOT EXISTS sale_number SERIAL;

-- 2. Verificar
SELECT id, sale_number, created_at FROM sales ORDER BY sale_number DESC LIMIT 5;
