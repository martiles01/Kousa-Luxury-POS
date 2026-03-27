import { createClient } from '@supabase/supabase-js'

// Usar variables de entorno en lugar de credenciales hardcodeadas
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validar que las variables de entorno existan
const supabaseUrlDetected = !!supabaseUrl
const supabaseAnonKeyDetected = !!supabaseAnonKey
export const isSupabaseConfigured = supabaseUrlDetected && supabaseAnonKeyDetected

// Diagnóstico (solo nombres y longitud parcial para seguridad)
export const envDebug = {
  url: supabaseUrlDetected ? `${supabaseUrl.substring(0, 15)}...` : 'Faltante',
  key: supabaseAnonKeyDetected ? `${supabaseAnonKey.substring(0, 10)}...` : 'Faltante'
}

// Si las variables no existen, exportar un cliente nulo para evitar errores de sintaxis
// pero manejar la lógica visualmente en App.jsx
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null