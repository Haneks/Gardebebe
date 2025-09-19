import { TimeEntry, DailyRecord } from '../types';

export function calculateDailyRecords(entries: TimeEntry[], days: number): DailyRecord[] {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - days + 1);
  
  // Filtrer les entrées dans la période
  const filteredEntries = entries.filter(entry => {
    const entryDate = new Date(entry.timestamp);
    return entryDate >= startDate && entryDate <= endDate;
  });

  // Grouper par date et nom d'enfant
  const groupedByDate = new Map<string, Map<string, TimeEntry[]>>();
  
  filteredEntries.forEach(entry => {
    const date = new Date(entry.timestamp).toISOString().split('T')[0];
    
    if (!groupedByDate.has(date)) {
      groupedByDate.set(date, new Map());
    }
    
    const dayMap = groupedByDate.get(date)!;
    if (!dayMap.has(entry.child_name)) {
      dayMap.set(entry.child_name, []);
    }
    
    dayMap.get(entry.child_name)!.push(entry);
  });

  const records: DailyRecord[] = [];
  
  // Générer les enregistrements pour chaque jour
  for (let i = days - 1; i >= 0; i--) {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - i);
    const dateStr = currentDate.toISOString().split('T')[0];
    
    const dayEntries = groupedByDate.get(dateStr);
    
    if (dayEntries) {
      dayEntries.forEach((entries, childName) => {
        const arrivals = entries.filter(e => e.entry_type === 'arrival');
        const departures = entries.filter(e => e.entry_type === 'departure');
        
        // Associer les arrivées et départs
        arrivals.forEach(arrival => {
          const arrivalTime = new Date(arrival.timestamp);
          
          // Trouver le départ correspondant (le plus proche après l'arrivée)
          const matchingDeparture = departures
            .filter(dep => new Date(dep.timestamp) > arrivalTime)
            .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())[0];
          
          let duration = 0;
          let departureTime: string | null = null;
          
          if (matchingDeparture) {
            departureTime = matchingDeparture.timestamp;
            duration = (new Date(matchingDeparture.timestamp).getTime() - arrivalTime.getTime()) / (1000 * 60 * 60);
          }
          
          records.push({
            date: dateStr,
            child_name: childName,
            arrival_time: arrival.timestamp,
            departure_time: departureTime,
            duration_hours: Math.max(0, duration)
          });
        });
      });
    }
  }
  
  return records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function formatTime(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function formatDuration(hours: number): string {
  if (hours === 0) return '--';
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);
  return `${wholeHours}h${minutes.toString().padStart(2, '0')}`;
}