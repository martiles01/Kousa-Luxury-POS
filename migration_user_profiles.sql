-- ============================================
-- MIGRACIÓN: Sistema de Roles con user_profiles
-- ============================================
-- Ejecuta este script completo en el SQL Editor de Supabase

-- PASO 1: Crear tabla user_profiles
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'Agente',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PASO 2: Habilitar Row Level Security (RLS)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- PASO 3: Crear políticas de seguridad
-- Permitir que todos los usuarios autenticados lean los perfiles
CREATE POLICY "Users can view all profiles"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (true);

-- Permitir que los usuarios actualicen su propio perfil
CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Permitir insertar perfiles (para el trigger)
CREATE POLICY "Enable insert for authenticated users"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- PASO 4: Migrar usuarios existentes desde auth.users
INSERT INTO user_profiles (id, email, role, created_at)
SELECT 
  id,
  email,
  COALESCE(raw_user_meta_data->>'role', 'Agente') as role,
  created_at
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- PASO 5: Asignar rol de Administrador a admin@kousa.com
UPDATE user_profiles
SET role = 'Administrador', updated_at = NOW()
WHERE email = 'admin@kousa.com';

-- Si el usuario no existe, créalo (ajusta la contraseña según necesites)
-- INSERT INTO user_profiles (id, email, role)
-- SELECT id, email, 'Administrador'
-- FROM auth.users
-- WHERE email = 'admin@kousa.com'
-- ON CONFLICT (id) DO UPDATE SET role = 'Administrador';

-- PASO 6: Crear función para auto-crear perfil al registrar usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, role)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'role', 'Agente'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PASO 7: Crear trigger para ejecutar la función
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- PASO 8: Crear función para actualizar timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- PASO 9: Crear trigger para actualizar timestamp automáticamente
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- VERIFICACIÓN
-- ============================================

-- Ver todos los perfiles de usuario
SELECT 
  email,
  role,
  created_at,
  updated_at
FROM user_profiles
ORDER BY created_at DESC;

-- Verificar específicamente admin@kousa.com
SELECT 
  email,
  role,
  created_at
FROM user_profiles
WHERE email = 'admin@kousa.com';

-- El resultado debe mostrar:
-- email: admin@kousa.com
-- role: Administrador
