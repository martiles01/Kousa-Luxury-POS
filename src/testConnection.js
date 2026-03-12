import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Error: Missing environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
    console.log('Testing Supabase connection...');

    const { data: inventory, error: invError } = await supabase.from('inventory').select('*');
    if (invError) {
        console.error('Error fetching inventory:', invError.message);
    } else {
        console.log(`Inventory found: ${inventory.length} items`);
        console.table(inventory);
    }

    const { data: services, error: serError } = await supabase.from('services').select('*');
    if (serError) {
        console.error('Error fetching services:', serError.message);
    } else {
        console.log(`Services found: ${services.length} items`);
        console.table(services);
    }
}

testConnection();
