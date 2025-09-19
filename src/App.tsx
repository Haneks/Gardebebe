import React from 'react';
import { Baby, AlertTriangle } from 'lucide-react';
import { TimeTracker } from './components/TimeTracker';
import { RecentEntries } from './components/RecentEntries';
import { Reports } from './components/Reports';
import { isSupabaseConfigured } from './lib/supabase';

function App() {
  const supabaseConfigured = isSupabaseConfigured();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="bg-blue-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Baby className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Suivi des Heures de Garde
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Application complète pour le suivi professionnel des heures de garde d'assistante maternelle
          </p>
          
          {!supabaseConfigured && (
            <div className="mt-6 max-w-2xl mx-auto">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-left">
                  <p className="text-amber-800 font-medium mb-1">Mode démonstration</p>
                  <p className="text-amber-700 text-sm">
                    L'application fonctionne actuellement avec le stockage local. 
                    Pour une utilisation professionnelle avec sauvegarde cloud, 
                    configurez Supabase en cliquant sur "Connect to Supabase" en haut à droite.
                  </p>
                </div>
              </div>
            </div>
          )}
        </header>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Time Tracker */}
          <div className="lg:col-span-1">
            <TimeTracker />
          </div>

          {/* Recent Entries */}
          <div className="lg:col-span-2">
            <RecentEntries />
          </div>

          {/* Reports */}
          <div className="lg:col-span-3">
            <Reports />
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-16 py-8 border-t border-gray-200">
          <p className="text-gray-600">
            Application de suivi des heures de garde - Version 1.0
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {supabaseConfigured 
              ? 'Données stockées de manière sécurisée et conforme RGPD' 
              : 'Données stockées localement dans votre navigateur'
            }
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;