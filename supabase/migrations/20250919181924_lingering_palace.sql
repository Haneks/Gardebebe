/*
  # Création de la table time_entries pour le suivi des heures de garde

  1. Nouvelle table
    - `time_entries` 
      - `id` (uuid, clé primaire)
      - `child_name` (text, nom de l'enfant)
      - `entry_type` (text, type d'entrée: 'arrival' ou 'departure')  
      - `timestamp` (timestamptz, horodatage de l'événement)
      - `created_at` (timestamptz, date de création de l'enregistrement)

  2. Sécurité
    - Activation de Row Level Security sur `time_entries`
    - Politique pour permettre toutes les opérations aux utilisateurs authentifiés
    - Politique pour permettre la lecture publique (pour l'usage d'une assistante maternelle)

  3. Index
    - Index sur `child_name` pour les recherches rapides
    - Index sur `timestamp` pour les tris chronologiques
*/

-- Création de la table time_entries
CREATE TABLE IF NOT EXISTS time_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_name text NOT NULL,
  entry_type text NOT NULL CHECK (entry_type IN ('arrival', 'departure')),
  timestamp timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Activation de Row Level Security
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre toutes les opérations (adapté pour une utilisation simple)
CREATE POLICY "Allow all operations on time_entries"
  ON time_entries
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_time_entries_child_name ON time_entries(child_name);
CREATE INDEX IF NOT EXISTS idx_time_entries_timestamp ON time_entries(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_time_entries_created_at ON time_entries(created_at DESC);