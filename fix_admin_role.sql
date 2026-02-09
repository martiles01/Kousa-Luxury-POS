-- Script SIMPLIFICADO para actualizar el rol de admin@kousa.com a Administrador
-- Ejecuta esto en el SQL Editor de Supabase

-- Opción 1: Actualizar directamente en auth.users
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  '"Administrador"'
)
WHERE email = 'admin@kousa.com';

-- Verificar el cambio
SELECT 
  email, 
  raw_user_meta_data->>'role' as role,
  raw_user_meta_data
FROM auth.users 
WHERE email = 'admin@kousa.com';

-- Si el UPDATE no funciona, usa este método alternativo:
-- UPDATE auth.users
-- SET raw_user_meta_data = '{"role": "Administrador"}'::jsonb
-- WHERE email = 'admin@kousa.com';
