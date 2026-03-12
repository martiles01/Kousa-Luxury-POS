import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { updateInventoryItem, deleteInventoryItem as apiDeleteInventoryItem } from '../services/api';

export const useInventory = (session) => {
  const [inventory, setInventory] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInventory = async () => {
    try {
      const { data, error } = await supabase.from('inventory').select('*').order('name');
      if (error) throw error;
      setInventory(data || []);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  };

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase.from('services').select('*').order('price');
      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchInventory(), fetchServices()]);
    setLoading(false);
  };

  useEffect(() => {
    if (session) {
      fetchData();

      const channel = supabase
        .channel('inventory-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'inventory' }, () => {
          fetchInventory();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [session]);

  const addStock = async (id, currentStock) => {
    const { error } = await supabase
      .from('inventory')
      .update({ stock: currentStock + 10 })
      .eq('id', id);
    
    if (error) {
      console.error('Error adding stock:', error);
      return false;
    }
    return true;
  };

  const addItem = async (itemData) => {
    const { error } = await supabase.from('inventory').insert([itemData]);
    if (error) {
      console.error('Error adding inventory item:', error);
      return false;
    }
    return true;
  };

  const deleteItem = async (itemId) => {
    const result = await apiDeleteInventoryItem(itemId);
    if (result) fetchInventory();
    return !!result;
  };

  const updateItem = async (itemId, data) => {
    const result = await updateInventoryItem(itemId, data);
    if (result) fetchInventory();
    return !!result;
  };

  return {
    inventory,
    services,
    loading,
    refreshInventory: fetchInventory,
    refreshServices: fetchServices,
    addStock,
    addItem,
    updateItem,
    deleteItem
  };
};
