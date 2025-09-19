export interface TimeEntry {
  id: string;
  child_name: string;
  entry_type: 'arrival' | 'departure';
  timestamp: string;
  created_at: string;
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