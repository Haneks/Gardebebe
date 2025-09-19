import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { TimeEntry } from '../types';

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
  const useSupabase = isSupabaseConfigured();

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    setLoading(true);
    try {
      if (useSupabase) {
        try {
          const { data, error } = await supabase
            .from('time_entries')
            .select('*')
            .order('created_at', { ascending: false });

          if (error) throw error;
          setEntries(data || []);
        } catch (supabaseError) {
          console.warn('Supabase error, falling back to localStorage:', supabaseError);
          // Fallback to localStorage if Supabase fails
          const localEntries = getEntriesFromStorage();
          setEntries(localEntries.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
        }
      } else {
        // Use localStorage fallback
        const localEntries = getEntriesFromStorage();
        setEntries(localEntries.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
      }
    } catch (error) {
      console.warn('Error loading entries, using localStorage fallback:', error);
      // Fallback to localStorage even if Supabase fails
      const localEntries = getEntriesFromStorage();
      setEntries(localEntries.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
    } finally {
      setLoading(false);
    }
  };

  const addEntry = async (childName: string, entryType: 'arrival' | 'departure') => {
    try {
      const now = new Date();
      const newEntry: TimeEntry = {
        id: crypto.randomUUID(),
        child_name: childName,
        entry_type: entryType,
        timestamp: now.toISOString(),
        created_at: now.toISOString(),
      };

      if (useSupabase) {
        try {
          const { data, error } = await supabase
            .from('time_entries')
            .insert({
              child_name: childName,
              entry_type: entryType,
              timestamp: now.toISOString(),
            })
            .select()
            .single();

          if (error) throw error;
          setEntries(prev => [data, ...prev]);
        } catch (supabaseError) {
          console.warn('Supabase error, falling back to localStorage:', supabaseError);
          // Fallback to localStorage if Supabase fails
          const newEntry: TimeEntry = {
            id: crypto.randomUUID(),
            child_name: childName,
            entry_type: entryType,
            timestamp: now.toISOString(),
            created_at: now.toISOString(),
          };
          const updatedEntries = [newEntry, ...entries];
          setEntries(updatedEntries);
          saveEntriesToStorage(updatedEntries);
        }
      } else {
        // Use localStorage fallback
        const updatedEntries = [newEntry, ...entries];
        setEntries(updatedEntries);
        saveEntriesToStorage(updatedEntries);
      }
      
      return { success: true };
    } catch (error) {
      console.warn('Error adding entry, trying localStorage fallback:', error);
      
      // Try localStorage fallback even if Supabase fails
      try {
        const now = new Date();
        const newEntry: TimeEntry = {
          id: crypto.randomUUID(),
          child_name: childName,
          entry_type: entryType,
          timestamp: now.toISOString(),
          created_at: now.toISOString(),
        };
        const updatedEntries = [newEntry, ...entries];
        setEntries(updatedEntries);
        saveEntriesToStorage(updatedEntries);
        return { success: true };
      } catch (fallbackError) {
        return { success: false, error: fallbackError };
      }
    }
  };

  return { entries, loading, addEntry, refetch: fetchEntries, useSupabase };
}