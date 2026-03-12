import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { createUser as apiCreateUser } from '../services/api';

export const useAuth = () => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');
  const [userProfiles, setUserProfiles] = useState([]);
  const [currentUserRole, setCurrentUserRole] = useState('Agente');

  const fetchUserProfiles = async () => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .order('email');
    if (error) console.error('Error fetching user profiles:', error);
    else setUserProfiles(data || []);
  };

  const checkUserRole = async (currentSession) => {
    if (!currentSession) {
      setCurrentUserRole('Agente');
      return;
    }

    const email = currentSession.user.email?.toLowerCase();

    // FAILSAFE: Hardcode admin access for owner
    if (email === 'admin@kousa.com') {
      setCurrentUserRole('Administrador');
      return;
    }

    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', currentSession.user.id)
      .single();

    if (error) console.error('Error fetching profile:', error);
    setCurrentUserRole(profile?.role || 'Agente');
  };

  useEffect(() => {
    // Check session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session) checkUserRole(session);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session) checkUserRole(session);
      else setCurrentUserRole('Agente');
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session && currentUserRole === 'Administrador') {
      fetchUserProfiles();
    }
  }, [session, currentUserRole]);

  const login = async (email, password) => {
    setLoading(true);
    setAuthError('');
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Email not confirmed')) {
          setAuthError('Email no verificado. Revisa tu correo o el panel de Supabase.');
        } else if (error.message.includes('Invalid login credentials')) {
          setAuthError('Correo o contraseña incorrectos.');
        } else {
          setAuthError(`Error: ${error.message}`);
        }
        return { success: false, error };
      }
      return { success: true };
    } catch (err) {
      if (err.message === 'Failed to fetch' || err.message.includes('network')) {
        setAuthError('Error de conexión: No se pudo contactar con el servidor. Verifica tu internet o si el proyecto de Supabase está activo.');
      } else {
        setAuthError(`Error inesperado: ${err.message}`);
      }
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      setSession(null);
      setUser(null);
      setCurrentUserRole('Agente');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (userData) => {
    const result = await apiCreateUser(userData);
    if (result) fetchUserProfiles();
    return result;
  };

  const updateUserRole = async (userId, role) => {
    const { error } = await supabase
      .from('user_profiles')
      .update({ role })
      .eq('id', userId);
    
    if (!error) {
      fetchUserProfiles();
      return true;
    }
    console.error('Error updating role:', error);
    return false;
  };

  const deleteUser = async (userId) => {
    // Note: This only deletes the profile, not the Auth user (requires admin API)
    const { error } = await supabase
      .from('user_profiles')
      .delete()
      .eq('id', userId);
    
    if (!error) {
      fetchUserProfiles();
      return true;
    }
    console.error('Error deleting user:', error);
    return false;
  };

  return {
    session,
    user,
    loading,
    authError,
    userProfiles,
    currentUserRole,
    login,
    logout,
    createUser,
    updateUserRole,
    deleteUser,
    refreshProfiles: fetchUserProfiles
  };
};
