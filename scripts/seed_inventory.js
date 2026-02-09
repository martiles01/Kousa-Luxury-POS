import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://quvhnjcrfeyofnkmwmot.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1dmhuamNyZmV5b2Zua213bW90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzMDEyNjcsImV4cCI6MjA4NTg3NzI2N30.szCC9l1ngvsAt7l3xBUi2vyTVPGwRCH21_n9qmJkZrs'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

const commonProducts = [
    { name: 'Coca-Cola 20oz', price: 50.00, stock: 48, category: 'Refrescos', icon: '🥤' },
    { name: 'Agua Dasani', price: 25.00, stock: 100, category: 'Refrescos', icon: '💧' },
    { name: 'Pringles Original', price: 125.00, stock: 20, category: 'Snacks', icon: '🥔' },
    { name: 'Aromatizante Little Trees', price: 150.00, stock: 35, category: 'Accesorios', icon: '🌲' },
    { name: 'Paño Microfibra Premium', price: 200.00, stock: 50, category: 'Protección', icon: '🧼' },
    { name: 'Red Bull 250ml', price: 150.00, stock: 24, category: 'Refrescos', icon: '⚡' },
    { name: 'Snickers Bar', price: 60.00, stock: 30, category: 'Snacks', icon: '🍫' }
]

async function seed() {
    console.log('Verificando productos existentes...')
    const { data: existing } = await supabase.from('inventory').select('name')
    const existingNames = existing?.map(i => i.name) || []

    for (const product of commonProducts) {
        if (!existingNames.includes(product.name)) {
            const { error } = await supabase.from('inventory').insert(product)
            if (error) console.error(`Error con ${product.name}:`, error.message)
            else console.log(`Insertado: ${product.name}`)
        } else {
            console.log(`Ya existe: ${product.name}, saltando...`)
        }
    }
    console.log('Proceso de seed finalizado')
}

seed()
