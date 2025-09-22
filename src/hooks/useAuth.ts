import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { UserProfile } from '../types';

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  initialized: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
    initialized: false
  });

  const useSupabase = isSupabaseConfigured();

  useEffect(() => {
    if (!useSupabase) {
      setAuthState({
        user: null,
        profile: null,
        loading: false,
        initialized: true
      });
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthState(prev => ({
        ...prev,
        user: session?.user ?? null,
        loading: false,
        initialized: true
      }));

      if (session?.user) {
        fetchProfile(session.user.id);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setAuthState(prev => ({
          ...prev,
          user: session?.user ?? null,
          loading: false
        }));

        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setAuthState(prev => ({
            ...prev,
            profile: null
          }));
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [useSupabase]);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return;
      }

      setAuthState(prev => ({
        ...prev,
        profile: data
      }));
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    if (!useSupabase) {
      throw new Error('Authentication requires Supabase configuration');
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    });

    if (error) throw error;
    return data;
  };

  const signIn = async (email: string, password: string) => {
    if (!useSupabase) {
      throw new Error('Authentication requires Supabase configuration');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    if (!useSupabase) return;

    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!useSupabase || !authState.user) {
      throw new Error('User must be authenticated');
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('user_id', authState.user.id)
      .select()
      .single();

    if (error) throw error;

    setAuthState(prev => ({
      ...prev,
      profile: data
    }));

    return data;
  };

  return {
    user: authState.user,
    profile: authState.profile,
    loading: authState.loading,
    initialized: authState.initialized,
    isAuthenticated: !!authState.user,
    useSupabase,
    signUp,
    signIn,
    signOut,
    updateProfile,
    refetchProfile: () => authState.user && fetchProfile(authState.user.id)
  };
}