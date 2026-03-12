-- 1. TABLA DE PAGOS DE FLOTILLA
CREATE TABLE IF NOT EXISTS fleet_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    amount DECIMAL(12,2) NOT NULL,
    payment_method TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. HABILITAR RLS EN PAGOS
ALTER TABLE fleet_payments ENABLE ROW LEVEL SECURITY;

-- 3. POLÍTICAS PARA PAGOS
DROP POLICY IF EXISTS "Permitir lectura pública de pagos" ON fleet_payments;
CREATE POLICY "Permitir lectura pública de pagos" ON fleet_payments
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir gestión de pagos a usuarios autenticados" ON fleet_payments;
CREATE POLICY "Permitir gestión de pagos a usuarios autenticados" ON fleet_payments
    FOR ALL USING (auth.role() = 'authenticated');

-- 4. RECARGAR SCHEMA
NOTIFY pgrst, 'reload schema';
