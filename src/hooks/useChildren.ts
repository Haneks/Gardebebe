import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Child } from '../types';
import { useAuth } from './useAuth';

export function useChildren() {
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();
  const useSupabase = isSupabaseConfigured();

  useEffect(() => {
    if (isAuthenticated && useSupabase) {
      fetchChildren();
    } else {
      setChildren([]);
      setLoading(false);
    }
  }, [isAuthenticated, useSupabase]);

  const fetchChildren = async () => {
    if (!useSupabase || !user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('children')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setChildren(data || []);
    } catch (error) {
      console.error('Error fetching children:', error);
      setChildren([]);
    } finally {
      setLoading(false);
    }
  };

  const addChild = async (childData: Omit<Child, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!useSupabase || !user) {
      throw new Error('User must be authenticated');
    }

    try {
      const { data, error } = await supabase
        .from('children')
        .insert({
          ...childData,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      setChildren(prev => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)));
      return { success: true, data };
    } catch (error) {
      console.error('Error adding child:', error);
      return { success: false, error };
    }
  };

  const updateChild = async (childId: string, updates: Partial<Child>) => {
    if (!useSupabase || !user) {
      throw new Error('User must be authenticated');
    }

    try {
      const { data, error } = await supabase
        .from('children')
        .update(updates)
        .eq('id', childId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      setChildren(prev => prev.map(child => child.id === childId ? data : child));
      return { success: true, data };
    } catch (error) {
      console.error('Error updating child:', error);
      return { success: false, error };
    }
  };

  const deleteChild = async (childId: string) => {
    if (!useSupabase || !user) {
      throw new Error('User must be authenticated');
    }

    try {
      const { error } = await supabase
        .from('children')
        .update({ is_active: false })
        .eq('id', childId)
        .eq('user_id', user.id);

      if (error) throw error;
      setChildren(prev => prev.filter(child => child.id !== childId));
      return { success: true };
    } catch (error) {
      console.error('Error deleting child:', error);
      return { success: false, error };
    }
  };

  return {
    children,
    loading,
    addChild,
    updateChild,
    deleteChild,
    refetch: fetchChildren
  };
}