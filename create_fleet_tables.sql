-- ============================================
-- MIGRACIÓN: Gestión de Flotillas Corporativas
-- ============================================

-- 1. Tabla de Empresas (Clientes Corporativos)
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    rnc TEXT,
    phone TEXT,
    email TEXT,
    credit_limit DECIMAL(12,2) DEFAULT 0.00,
    current_balance DECIMAL(12,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabla de Vehículos de Flota
CREATE TABLE IF NOT EXISTS fleet_vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    plate TEXT NOT NULL UNIQUE,
    model TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Agregar company_id a la tabla sales para rastrear deudas corporativas
ALTER TABLE sales 
ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES companies(id);

-- 4. Habilitar RLS
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE fleet_vehicles ENABLE ROW LEVEL SECURITY;

-- 5. Políticas de Acceso (Lectura pública, Gestión autenticada)
DROP POLICY IF EXISTS "Permitir lectura pública de empresas" ON companies;
CREATE POLICY "Permitir lectura pública de empresas" ON companies
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir gestión de empresas a usuarios autenticados" ON companies;
CREATE POLICY "Permitir gestión de empresas a usuarios autenticados" ON companies
    FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Permitir lectura pública de vehículos de flota" ON fleet_vehicles;
CREATE POLICY "Permitir lectura pública de vehículos de flota" ON fleet_vehicles
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir gestión de vehículos a usuarios autenticados" ON fleet_vehicles;
CREATE POLICY "Permitir gestión de vehículos a usuarios autenticados" ON fleet_vehicles
    FOR ALL USING (auth.role() = 'authenticated');

-- 6. Insertar datos de prueba opcionales
-- INSERT INTO companies (name, rnc, credit_limit) VALUES ('Rent-a-Car Santiago', '123456789', 50000.00);
