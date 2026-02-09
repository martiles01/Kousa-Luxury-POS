-- ============================================
-- SOLUCIÓN FINAL: Permisos de Inventario y Rol
-- ============================================

-- 1. Arreglar permisos de Inventario (Hacerlo público para lectura)
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read access for all users" ON inventory;
CREATE POLICY "Enable read access for all users" ON inventory
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON inventory;
CREATE POLICY "Enable insert for authenticated users only" ON inventory
  FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Enable update for authenticated users only" ON inventory;
CREATE POLICY "Enable update for authenticated users only" ON inventory
  FOR UPDATE TO authenticated USING (true);

DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON inventory;
CREATE POLICY "Enable delete for authenticated users only" ON inventory
  FOR DELETE TO authenticated USING (true);

-- 2. Arreglar permisos de Servicios (Hacerlo público para lectura)
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read access for all users" ON services;
CREATE POLICY "Enable read access for all users" ON services
  FOR SELECT USING (true);

-- 3. Asegurar Rol de Administrador para admin@kousa.com
-- Insertar o actualizar en user_profiles
INSERT INTO user_profiles (id, email, role, updated_at)
SELECT id, email, 'Administrador', NOW()
FROM auth.users
WHERE email = 'admin@kousa.com'
ON CONFLICT (id) DO UPDATE 
SET role = 'Administrador', updated_at = NOW();

-- 4. Actualizar metadata también (como respaldo)
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  '"Administrador"'
)
WHERE email = 'admin@kousa.com';

-- 5. Verificar estado final
SELECT 'Inventario' as check_type, count(*) as count FROM inventory
UNION ALL
SELECT 'Perfil Admin', count(*) FROM user_profiles WHERE email = 'admin@kousa.com' AND role = 'Administrador';
