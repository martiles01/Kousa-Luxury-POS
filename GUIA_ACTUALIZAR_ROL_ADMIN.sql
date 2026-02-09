-- GUÍA COMPLETA: Actualizar rol de admin@kousa.com a Administrador

-- ============================================
-- MÉTODO 1: Actualización directa (RECOMENDADO)
-- ============================================
-- Ejecuta este comando en el SQL Editor de Supabase

UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  '"Administrador"'
)
WHERE email = 'admin@kousa.com';

-- Verificar que funcionó:
SELECT 
  id,
  email, 
  raw_user_meta_data->>'role' as role,
  raw_user_meta_data
FROM auth.users 
WHERE email = 'admin@kousa.com';

-- ============================================
-- MÉTODO 2: Si el método 1 no funciona
-- ============================================
-- Reemplaza completamente el metadata

UPDATE auth.users
SET raw_user_meta_data = '{"role": "Administrador"}'::jsonb
WHERE email = 'admin@kousa.com';

-- ============================================
-- MÉTODO 3: Usando la función de Supabase
-- ============================================
-- Si tienes acceso a funciones de Supabase

SELECT auth.update_user_metadata(
  (SELECT id FROM auth.users WHERE email = 'admin@kousa.com'),
  '{"role": "Administrador"}'::jsonb
);

-- ============================================
-- VERIFICACIÓN FINAL
-- ============================================
-- Después de ejecutar cualquiera de los métodos anteriores,
-- verifica que el cambio se aplicó correctamente:

SELECT 
  email,
  raw_user_meta_data->>'role' as current_role,
  created_at,
  updated_at
FROM auth.users 
WHERE email = 'admin@kousa.com';

-- El resultado debe mostrar: current_role = 'Administrador'

-- ============================================
-- IMPORTANTE: Cerrar sesión y volver a iniciar
-- ============================================
-- Después de ejecutar el script:
-- 1. Cierra sesión en la aplicación
-- 2. Vuelve a iniciar sesión con admin@kousa.com
-- 3. El rol debería aparecer como "Administrador" en la UI
