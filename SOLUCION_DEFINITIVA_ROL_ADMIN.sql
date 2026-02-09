-- ============================================
-- SOLUCIÓN DEFINITIVA: Actualizar rol de admin@kousa.com
-- ============================================

-- PASO 1: Actualizar el rol en la base de datos
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  '"Administrador"'
)
WHERE email = 'admin@kousa.com';

-- PASO 2: Verificar que se actualizó correctamente
SELECT 
  email,
  raw_user_meta_data->>'role' as role_in_database,
  raw_user_meta_data
FROM auth.users 
WHERE email = 'admin@kousa.com';

-- ============================================
-- IMPORTANTE: PASOS DESPUÉS DE EJECUTAR EL SQL
-- ============================================

-- 1. En la aplicación web, haz clic en "Cerrar Sesión" (ícono de LogOut)
-- 2. Vuelve a iniciar sesión con admin@kousa.com
-- 3. Ve a la sección "Configuración" (último ícono del menú)
-- 4. En la parte inferior verás: "Rol / Sesión"
-- 5. Debería aparecer "ADMINISTRADOR" en rojo

-- ============================================
-- SI AÚN NO FUNCIONA, ejecuta esto:
-- ============================================

-- Forzar actualización del metadata
UPDATE auth.users
SET 
  raw_user_meta_data = '{"role": "Administrador"}'::jsonb,
  updated_at = now()
WHERE email = 'admin@kousa.com';

-- Verificación final
SELECT 
  id,
  email,
  raw_user_meta_data,
  created_at,
  updated_at
FROM auth.users 
WHERE email = 'admin@kousa.com';
