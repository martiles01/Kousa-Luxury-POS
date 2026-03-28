import { supabase } from '../supabaseClient';

export const fetchInventory = async () => {
    const { data, error } = await supabase.from('inventory').select('*').order('name');
    if (error) throw error;
    return data;
};

export const fetchServices = async () => {
    const { data, error } = await supabase.from('services').select('*').order('price');
    if (error) throw error;
    return data;
};

export const fetchWashQueue = async () => {
    const { data, error } = await supabase.from('wash_queue')
        .select('*, services(name, price), employees(name)')
        .order('created_at', { ascending: false })
        .limit(20);
    if (error) throw error;
    return data;
};

export const fetchSales = async (filterDate) => {
    const { data, error } = await supabase.from('sales')
        .select('*, sale_items(*, inventory(name)), services(name, price)')
        .gte('created_at', filterDate.toISOString());
    if (error) throw error;
    return data;
};

export const fetchEmployees = async () => {
    const { data, error } = await supabase.from('employees').select('*').order('name');
    if (error) throw error;
    return data;
};

export const fetchCompanies = async () => {
    const { data, error } = await supabase.from('companies').select('*').order('name');
    if (error) throw error;
    return data;
};

export const fetchFleetVehicles = async () => {
    const { data, error } = await supabase.from('fleet_vehicles').select('*');
    if (error) throw error;
    return data;
};

export const fetchNCFSequences = async () => {
    const { data, error } = await supabase.from('ncf_sequences').select('*').order('id');
    if (error) throw error;
    return data;
};

export const fetchUserProfiles = async () => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
};

export const updateWashProgress = async (id, newProgress) => {
    const { error } = await supabase.from('wash_queue').update({
        progress: newProgress,
        status: newProgress === 100 ? 'completed' : 'in_progress',
        completed_at: newProgress === 100 ? new Date().toISOString() : null
    }).eq('id', id);
    if (error) throw error;
};

export const deleteWash = async (id) => {
    const { error } = await supabase.from('wash_queue').delete().eq('id', id);
    if (error) throw error;
};