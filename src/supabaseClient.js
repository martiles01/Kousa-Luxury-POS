import { createClient } from '@supabase/supabase-js'

// Usar variables de entorno en lugar de credenciales hardcodeadas
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validar que las variables de entorno existan
export const isSupabaseConfigured = !!supabaseUrl && !!supabaseAnonKey

// Si las variables no existen, exportar un cliente nulo para evitar errores de sintaxis
// pero manejar la lógica visualmente en App.jsx
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null