export interface TimeEntry {
  id: string;
  user_id?: string;
  child_id?: string;
  child_name: string;
  entry_type: 'arrival' | 'departure';
  timestamp: string;
  created_at: string;
  notes?: string;
}

export interface Child {
  id: string;
  user_id: string;
  name: string;
  date_of_birth?: string;
  parent_name?: string;
  parent_phone?: string;
  parent_email?: string;
  emergency_contact?: string;
  emergency_phone?: string;
  medical_notes?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  full_name?: string;
  business_name?: string;
  phone?: string;
  address?: string;
  preferences: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  profile?: UserProfile;
}

export interface DailyRecord {
  date: string;
  child_name: string;
  arrival_time: string | null;
  departure_time: string | null;
  duration_hours: number;
}

export interface Report {
  period: string;
  total_days: number;
  total_hours: number;
  records: DailyRecord[];
}