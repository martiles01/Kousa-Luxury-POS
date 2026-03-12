import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { createWash as apiCreateWash, updateWashProgress as apiUpdateWashProgress } from '../services/api';

export const useWashQueue = (session) => {
  const [washQueue, setWashQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ activeWashes: 0, activeBays: 0 });

  const fetchWashQueue = async () => {
    try {
      const { data, error } = await supabase
        .from('wash_queue')
        .select('*, services(name, price)')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      
      if (data) {
        setWashQueue(data);
        setStats({
          activeWashes: data.filter(q => q.status !== 'completed').length,
          activeBays: data.filter(q => q.status === 'in_progress').length
        });
      }
    } catch (error) {
      console.error('Error fetching wash queue:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchWashQueue();

      const channel = supabase
        .channel('wash-queue-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'wash_queue' }, () => {
          fetchWashQueue();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [session]);

  const addWash = async (washData) => {
    const result = await apiCreateWash(washData);
    if (result) fetchWashQueue();
    return result;
  };

  const updateProgress = async (washId, currentProgress) => {
    const newProgress = Math.min(100, Number(currentProgress) + 20);
    const result = await apiUpdateWashProgress(washId, newProgress);
    if (result) fetchWashQueue();
    return result;
  };

  const deleteWash = async (washId) => {
    const { error } = await supabase
      .from('wash_queue')
      .delete()
      .eq('id', washId);
    
    if (error) {
      console.error('Error deleting wash:', error);
      return false;
    }
    fetchWashQueue();
    return true;
  };

  return {
    washQueue,
    stats,
    loading,
    refreshQueue: fetchWashQueue,
    addWash,
    updateProgress,
    deleteWash
  };
};
