import React from 'react';
import { Clock, Baby, LogOut } from 'lucide-react';
import { useTimeEntries } from '../hooks/useTimeEntries';
import { formatTime, formatDate } from '../utils/timeCalculations';

export function RecentEntries() {
  const { entries, loading } = useTimeEntries();

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const recentEntries = entries.slice(0, 10);

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="flex items-center gap-3 mb-6">
        <Clock className="w-6 h-6 text-blue-600" />
        <h3 className="text-xl font-bold text-gray-900">Dernières Activités</h3>
      </div>

      {recentEntries.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Aucune activité enregistrée</p>
        </div>
      ) : (
        <div className="space-y-3">
          {recentEntries.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                entry.entry_type === 'arrival' 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-orange-100 text-orange-600'
              }`}>
                {entry.entry_type === 'arrival' ? (
                  <Baby className="w-5 h-5" />
                ) : (
                  <LogOut className="w-5 h-5" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-900">{entry.child_name}</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    entry.entry_type === 'arrival'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-orange-100 text-orange-800'
                  }`}>
                    {entry.entry_type === 'arrival' ? 'Arrivée' : 'Départ'}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  {formatDate(entry.timestamp.split('T')[0])} à {formatTime(entry.timestamp)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}