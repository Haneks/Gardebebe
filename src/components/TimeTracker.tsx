import React, { useState } from 'react';
import { Clock, Baby, LogOut, AlertCircle } from 'lucide-react';
import { useTimeEntries } from '../hooks/useTimeEntries';
import { useChildren } from '../hooks/useChildren';

export function TimeTracker() {
  const [selectedChildId, setSelectedChildId] = useState('');
  const [notes, setNotes] = useState('');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const { addEntry, loading, useSupabase, isAuthenticated } = useTimeEntries();
  const { children } = useChildren();

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleEntry = async (entryType: 'arrival' | 'departure') => {
    if (!selectedChildId) {
      showNotification('Veuillez saisir le nom de l\'enfant', 'error');
      return;
    }

    const selectedChild = children.find(child => child.id === selectedChildId);
    if (!selectedChild) {
      showNotification('Enfant non trouvé', 'error');
      return;
    }

    const result = await addEntry(selectedChildId, selectedChild.name, entryType, notes.trim() || undefined);
    
    if (result.success) {
      const message = entryType === 'arrival' 
        ? `Arrivée de ${selectedChild.name} enregistrée à ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`
        : `Départ de ${selectedChild.name} enregistré à ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
      showNotification(message, 'success');
      setNotes('');
    } else {
      showNotification('Erreur lors de l\'enregistrement', 'error');
    }
  };

  // Show different UI for authenticated vs non-authenticated users
  if (useSupabase && !isAuthenticated) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto">
        <div className="text-center">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Connexion requise</h2>
          <p className="text-gray-600">Connectez-vous pour accéder au suivi des heures</p>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Suivi des Heures</h2>
        <p className="text-gray-600">Enregistrez les arrivées et départs</p>
      </div>
      
      {!useSupabase || !isAuthenticated ? (
        <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800 text-sm text-center">
            💾 Mode local - Les données sont sauvegardées dans votre navigateur
          </p>
        </div>
      ) : null}

      <div className="mb-6">
        <label htmlFor="childSelect" className="block text-sm font-medium text-gray-700 mb-2">
          Sélectionner un enfant
        </label>
        {isAuthenticated && useSupabase ? (
          <select
            id="childSelect"
            value={selectedChildId}
            onChange={(e) => setSelectedChildId(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            disabled={loading}
          >
            <option value="">Choisir un enfant...</option>
            {children.map((child) => (
              <option key={child.id} value={child.id}>
                {child.name}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            id="childName"
            value={selectedChildId}
            onChange={(e) => setSelectedChildId(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Saisissez le nom..."
            disabled={loading}
          />
        )}
      </div>

      <div className="mb-6">
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
          Notes (optionnel)
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
          placeholder="Informations supplémentaires..."
          rows={2}
          disabled={loading}
        />
      </div>

      <div className="space-y-4 mb-6">
        <button
          onClick={() => handleEntry('arrival')}
          disabled={loading || !selectedChildId}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-semibold py-4 px-6 rounded-lg transition-all transform hover:scale-[1.02] disabled:transform-none flex items-center justify-center gap-3"
        >
          <Baby className="w-5 h-5" />
          Bébé est arrivé
        </button>

        <button
          onClick={() => handleEntry('departure')}
          disabled={loading || !selectedChildId}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-semibold py-4 px-6 rounded-lg transition-all transform hover:scale-[1.02] disabled:transform-none flex items-center justify-center gap-3"
        >
          <LogOut className="w-5 h-5" />
          Bébé est parti
        </button>
      </div>

      {isAuthenticated && useSupabase && children.length === 0 && (
        <div className="mb-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 text-sm text-center">
            Aucun enfant enregistré. Ajoutez un enfant dans la section "Gestion des Enfants" pour commencer.
          </p>
        </div>
      )}

      {notification && (
        <div className={`p-4 rounded-lg flex items-center gap-3 ${
          notification.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">{notification.message}</span>
        </div>
      )}
    </div>
  );
}