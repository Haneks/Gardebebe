import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { TimeEntry } from '../types';
import { useAuth } from './useAuth';

// LocalStorage fallback functions
const getEntriesFromStorage = (): TimeEntry[] => {
  try {
    const stored = localStorage.getItem('timeEntries');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveEntriesToStorage = (entries: TimeEntry[]) => {
  try {
    localStorage.setItem('timeEntries', JSON.stringify(entries));
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error);
  }
};

export function useTimeEntries() {
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();
  const useSupabase = isSupabaseConfigured();

  useEffect(() => {
    if (isAuthenticated && useSupabase) {
      fetchEntries();
    } else if (!useSupabase) {
      // Use localStorage fallback for non-authenticated mode
      const localEntries = getEntriesFromStorage();
      setEntries(localEntries.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
      setLoading(false);
    } else {
      setEntries([]);
      setLoading(false);
    }
  }, [isAuthenticated, useSupabase]);

  const fetchEntries = async () => {
    if (!useSupabase || !user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('time_entries')
        .select(`
          *,
          children (
            id,
            name
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error('Error fetching entries:', error);
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  const addEntry = async (childId: string, childName: string, entryType: 'arrival' | 'departure', notes?: string) => {
    try {
      const now = new Date();

      if (useSupabase && user) {
        const { data, error } = await supabase
          .from('time_entries')
          .insert({
            user_id: user.id,
            child_id: childId,
            child_name: childName,
            entry_type: entryType,
            timestamp: now.toISOString(),
            notes: notes || null
          })
          .select(`
            *,
            children (
              id,
              name
            )
          `)
          .single();

        if (error) throw error;
        setEntries(prev => [data, ...prev]);
      } else {
        // Use localStorage fallback
        const newEntry: TimeEntry = {
          id: crypto.randomUUID(),
          child_name: childName,
          entry_type: entryType,
          timestamp: now.toISOString(),
          created_at: now.toISOString(),
          notes
        };
        const updatedEntries = [newEntry, ...entries];
        setEntries(updatedEntries);
        saveEntriesToStorage(updatedEntries);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error adding entry:', error);
      return { success: false, error };
    }
  };

  return { 
    entries, 
    loading, 
    addEntry, 
    refetch: fetchEntries, 
    useSupabase,
    isAuthenticated 
  };
}