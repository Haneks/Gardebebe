import React, { useState } from 'react';
import { User, Building, Phone, MapPin, Save, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export function UserProfile() {
  const { user, profile, updateProfile, signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    business_name: profile?.business_name || '',
    phone: profile?.phone || '',
    address: profile?.address || ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <User className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-900">Profil Utilisateur</h3>
        </div>
        <button
          onClick={handleSignOut}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-all flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Déconnexion
        </button>
      </div>

      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="text-sm text-gray-600">Email</div>
        <div className="font-medium text-gray-900">{user?.email}</div>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom complet
            </label>
            <div className="relative">
              <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Votre nom complet"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom de l'entreprise
            </label>
            <div className="relative">
              <Building className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                value={formData.business_name}
                onChange={(e) => setFormData(prev => ({ ...prev, business_name: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nom de votre entreprise"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Téléphone
            </label>
            <div className="relative">
              <Phone className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Votre numéro de téléphone"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Adresse
            </label>
            <div className="relative">
              <MapPin className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
              <textarea
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Votre adresse complète"
                rows={3}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold py-2 px-4 rounded-lg transition-all flex items-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Sauvegarder
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-all"
            >
              Annuler
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600">Nom complet</div>
              <div className="font-medium text-gray-900">{profile?.full_name || 'Non renseigné'}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Entreprise</div>
              <div className="font-medium text-gray-900">{profile?.business_name || 'Non renseigné'}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Téléphone</div>
              <div className="font-medium text-gray-900">{profile?.phone || 'Non renseigné'}</div>
            </div>
          </div>
          
          {profile?.address && (
            <div>
              <div className="text-sm text-gray-600">Adresse</div>
              <div className="font-medium text-gray-900">{profile.address}</div>
            </div>
          )}

          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all"
          >
            Modifier le profil
          </button>
        </div>
      )}
    </div>
  );
}