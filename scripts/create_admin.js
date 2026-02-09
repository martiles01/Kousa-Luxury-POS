import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://quvhnjcrfeyofnkmwmot.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1dmhuamNyZmV5b2Zua213bW90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzMDEyNjcsImV4cCI6MjA4NTg3NzI2N30.szCC9l1ngvsAt7l3xBUi2vyTVPGwRCH21_n9qmJkZrs'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function createAdmin() {
    console.log('Creando usuario administrador...')
    const { data, error } = await supabase.auth.signUp({
        email: 'admin@kousa.com',
        password: 'admin-password-2026',
    })

    if (error) {
        if (error.message.includes('already registered')) {
            console.log('El usuario ya existe.')
        } else {
            console.error('Error al crear usuario:', error.message)
        }
    } else {
        console.log('Usuario admin creado con éxito:', data.user.email)
        console.log('NOTA: Si el email no está verificado en Supabase, es posible que el login falle dependiendo de la configuración del proyecto.')
    }
}

createAdmin()
