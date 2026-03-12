-- Create tables for Kousa Luxury CarWash POS

-- 1. Inventory Items
CREATE TABLE IF NOT EXISTS inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  stock INTEGER DEFAULT 0,
  category TEXT,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Services (Wash types)
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  duration_minutes INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Wash Queue
CREATE TABLE IF NOT EXISTS wash_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_plate TEXT NOT NULL,
  vehicle_model TEXT,
  service_id UUID REFERENCES services(id),
  status TEXT DEFAULT 'pending', -- pending, in_progress, completed, cancelled
  progress INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE
);

-- 4. Sales
CREATE TABLE IF NOT EXISTS sales (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  total_amount DECIMAL(10, 2) NOT NULL,
  payment_method TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Sale Items (Join table for POS)
CREATE TABLE IF NOT EXISTS sale_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sale_id UUID REFERENCES sales(id) ON DELETE CASCADE,
  inventory_id UUID REFERENCES inventory(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL
);

-- Initial Data
INSERT INTO inventory (name, price, stock, category, icon) VALUES
('Agua Mineral', 25.00, 100, 'Bebidas', '🥤'),
('Aromatizante', 150.00, 50, 'Accesorio', '🌲'),
('Paño Microfibra', 350.00, 20, 'Limpieza', '🧼'),
('Limpia Vidrios', 200.00, 30, 'Químicos', '✨');

INSERT INTO services (name, price, duration_minutes) VALUES
('Lavado Motor (Básico)', 200.00, 20),
('Lavado Motor (Full)', 450.00, 40),
('Lavado Express Carro', 500.00, 30),
('Premium Wash (SUV/Jeepeta)', 1200.00, 50),
('Lavado VIP & Encerado', 2500.00, 90),
('Interior Detail (Full)', 4500.00, 180),
('Lavado de Motor (Vehículo)', 800.00, 45),
('Tratamiento Cerámico (Luxury)', 15000.00, 480),
('Hidratación Piel (Premium)', 3500.00, 120),
('Corrección de Pintura (Gama Alta)', 8500.00, 360),
('Limpieza de Techo y Chasis', 2800.00, 150);
