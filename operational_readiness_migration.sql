-- ============================================
-- MIGRACIÓN FINAL: Operatividad de Flotillas y Empleados
-- ============================================

-- 1. Tabla de Empleados
CREATE TABLE IF NOT EXISTS employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    role TEXT DEFAULT 'Lavador',
    commission_rate DECIMAL(5, 2) DEFAULT 0.00,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabla de Empresas (Flotillas)
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    rnc TEXT,
    credit_limit DECIMAL(12, 2) DEFAULT 0.00,
    debt DECIMAL(12, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabla de Vehículos de Flota
CREATE TABLE IF NOT EXISTS fleet_vehicles (
    plate TEXT PRIMARY KEY,
    model TEXT,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tabla de Pagos de Flota
CREATE TABLE IF NOT EXISTS fleet_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    amount DECIMAL(12, 2) NOT NULL,
    payment_method TEXT DEFAULT 'Transferencia',
    reference TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Actualizaciones en tablas existentes
ALTER TABLE wash_queue ADD COLUMN IF NOT EXISTS employee_id UUID REFERENCES employees(id);
ALTER TABLE sales ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES companies(id);

-- 6. Habilitar RLS
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE fleet_vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE fleet_payments ENABLE ROW LEVEL SECURITY;

-- 7. Políticas RLS (Acceso para usuarios autenticados)
DO $$ 
BEGIN
    -- Employees
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can manage employees') THEN
        CREATE POLICY "Authenticated users can manage employees" ON employees FOR ALL TO authenticated USING (true);
    END IF;

    -- Companies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can manage companies') THEN
        CREATE POLICY "Authenticated users can manage companies" ON companies FOR ALL TO authenticated USING (true);
    END IF;

    -- Fleet Vehicles
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can manage fleet vehicles') THEN
        CREATE POLICY "Authenticated users can manage fleet vehicles" ON fleet_vehicles FOR ALL TO authenticated USING (true);
    END IF;

    -- Fleet Payments
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can manage fleet payments') THEN
        CREATE POLICY "Authenticated users can manage fleet payments" ON fleet_payments FOR ALL TO authenticated USING (true);
    END IF;
END $$;

-- 8. Datos Iniciales de Prueba (Opcional)
-- INSERT INTO employees (name, role, commission_rate) VALUES ('Juan Pérez', 'Lavador Especialista', 10.00);
-- INSERT INTO companies (name, rnc, credit_limit) VALUES ('Transporte Dominicano SAS', '131-12345-6', 50000.00);
