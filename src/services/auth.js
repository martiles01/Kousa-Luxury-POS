import { supabase } from '../supabaseClient';

export const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
};

export const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
};

export const resetPassword = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
    });
    if (error) throw error;
};

export const updatePassword = async (password) => {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
};

export const getSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
};

export const onAuthStateChange = (callback) => {
    return supabase.auth.onAuthStateChange(callback);
};

export const fetchUserProfile = async (id) => {
    const { data, error } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', id)
        .single();
    if (error) throw error;
    return data;
};
