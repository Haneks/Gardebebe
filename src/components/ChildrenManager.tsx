import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Baby, Phone, Mail, AlertTriangle } from 'lucide-react';
import { useChildren } from '../hooks/useChildren';
import { Child } from '../types';

export function ChildrenManager() {
  const { children, loading, addChild, updateChild, deleteChild } = useChildren();
  const [showForm, setShowForm] = useState(false);
  const [editingChild, setEditingChild] = useState<Child | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    date_of_birth: '',
    parent_name: '',
    parent_phone: '',
    parent_email: '',
    emergency_contact: '',
    emergency_phone: '',
    medical_notes: ''
  });

  const resetForm = () => {
    setFormData({
      name: '',
      date_of_birth: '',
      parent_name: '',
      parent_phone: '',
      parent_email: '',
      emergency_contact: '',
      emergency_phone: '',
      medical_notes: ''
    });
    setEditingChild(null);
    setShowForm(false);
  };

  const handleEdit = (child: Child) => {
    setFormData({
      name: child.name,
      date_of_birth: child.date_of_birth || '',
      parent_name: child.parent_name || '',
      parent_phone: child.parent_phone || '',
      parent_email: child.parent_email || '',
      emergency_contact: child.emergency_contact || '',
      emergency_phone: child.emergency_phone || '',
      medical_notes: child.medical_notes || ''
    });
    setEditingChild(child);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) return;

    try {
      if (editingChild) {
        await updateChild(editingChild.id, formData);
      } else {
        await addChild({ ...formData, is_active: true });
      }
      resetForm();
    } catch (error) {
      console.error('Error saving child:', error);
    }
  };

  const handleDelete = async (childId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet enfant ?')) {
      await deleteChild(childId);
    }
  };

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

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Baby className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-900">Gestion des Enfants</h3>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Ajouter un enfant
        </button>
      </div>

      {showForm && (
        <div className="mb-6 p-6 bg-gray-50 rounded-lg border">
          <h4 className="text-lg font-semibold mb-4">
            {editingChild ? 'Modifier l\'enfant' : 'Nouvel enfant'}
          </h4>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de l'enfant *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date de naissance
                </label>
                <input
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) => setFormData(prev => ({ ...prev, date_of_birth: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom du parent
                </label>
                <input
                  type="text"
                  value={formData.parent_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, parent_name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone parent
                </label>
                <input
                  type="tel"
                  value={formData.parent_phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, parent_phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email parent
                </label>
                <input
                  type="email"
                  value={formData.parent_email}
                  onChange={(e) => setFormData(prev => ({ ...prev, parent_email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact d'urgence
                </label>
                <input
                  type="text"
                  value={formData.emergency_contact}
                  onChange={(e) => setFormData(prev => ({ ...prev, emergency_contact: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone d'urgence
                </label>
                <input
                  type="tel"
                  value={formData.emergency_phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, emergency_phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes médicales
              </label>
              <textarea
                value={formData.medical_notes}
                onChange={(e) => setFormData(prev => ({ ...prev, medical_notes: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Allergies, médicaments, informations importantes..."
              />
            </div>
            
            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all"
              >
                {editingChild ? 'Modifier' : 'Ajouter'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-all"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {children.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Baby className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Aucun enfant enregistré</p>
          <p className="text-sm">Ajoutez un enfant pour commencer le suivi</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {children.map((child) => (
            <div key={child.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Baby className="w-5 h-5 text-blue-600" />
                  <h4 className="font-semibold text-gray-900">{child.name}</h4>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(child)}
                    className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(child.id)}
                    className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                {child.date_of_birth && (
                  <div>
                    <strong>Né(e) le:</strong> {new Date(child.date_of_birth).toLocaleDateString('fr-FR')}
                  </div>
                )}
                {child.parent_name && (
                  <div className="flex items-center gap-1">
                    <strong>Parent:</strong> {child.parent_name}
                  </div>
                )}
                {child.parent_phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {child.parent_phone}
                  </div>
                )}
                {child.parent_email && (
                  <div className="flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    {child.parent_email}
                  </div>
                )}
                {child.medical_notes && (
                  <div className="flex items-start gap-1 mt-2 p-2 bg-yellow-50 rounded">
                    <AlertTriangle className="w-3 h-3 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <span className="text-yellow-800 text-xs">{child.medical_notes}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}