-- ============================================
-- MIGRACIÓN: Campos Fiscales para Facturación
-- ============================================

-- 1. Agregar columnas a la tabla sales
ALTER TABLE sales 
ADD COLUMN IF NOT EXISTS client_name TEXT,
ADD COLUMN IF NOT EXISTS client_rnc TEXT,
ADD COLUMN IF NOT EXISTS invoice_type TEXT DEFAULT 'final'; -- 'final' (Consumidor Final) o 'fiscal' (Crédito Fiscal)

-- 2. Verificar columnas
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'sales';
