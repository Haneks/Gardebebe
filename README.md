# Application de Suivi des Heures de Garde

Une application web complète pour le suivi professionnel des heures de garde d'assistante maternelle.

## 🚀 Fonctionnalités

### Interface Principale
- **Deux boutons simples** : "Bébé est arrivé" et "Bébé est parti"
- **Enregistrement automatique** des heures d'arrivée et de départ
- **Notifications visuelles** pour confirmer les actions
- **Interface responsive** adaptée à tous les appareils

### Système de Rapports
- **Génération de rapports** pour 10, 20 ou 30 derniers jours
- **Calcul automatique** des heures de garde par jour
- **Totaux et statistiques** détaillés
- **Export CSV** pour archivage ou comptabilité

### Fonctionnalités Avancées
- **Historique complet** des dernières activités
- **Validation des données** et gestion des erreurs
- **Envoi par email** des rapports générés
- **Stockage sécurisé** avec Supabase

## 🛠️ Technologies Utilisées

- **React 18** avec TypeScript
- **Tailwind CSS** pour le design responsive
- **Supabase** pour la base de données
- **Lucide React** pour les icônes
- **Vite** comme bundler

## 📦 Installation

### Prérequis
- Node.js (version 18 ou supérieure)
- Un projet Supabase (gratuit)

### Configuration

1. **Cloner le projet** (si applicable)
```bash
git clone [url-du-repo]
cd childcare-tracking
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer Supabase**
   - Créer un compte sur [Supabase](https://supabase.com)
   - Créer un nouveau projet
   - Copier l'URL du projet et la clé anonyme

4. **Variables d'environnement**
```bash
cp .env.example .env
```
Puis remplir les valeurs dans `.env` :
```
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre_cle_anonyme
```

5. **Base de données**
   - Les migrations sont dans `supabase/migrations/`
   - Elles seront appliquées automatiquement si vous utilisez le CLI Supabase
   - Ou exécuter manuellement le SQL dans l'éditeur Supabase

## 🎯 Utilisation

### Démarrage
```bash
npm run dev
```
L'application sera accessible sur `http://localhost:5173`

### Enregistrement des heures
1. **Saisir le nom de l'enfant** dans le champ prévu
2. **Cliquer sur "Bébé est arrivé"** lors de l'arrivée
3. **Cliquer sur "Bébé est parti"** lors du départ
4. **Consulter l'historique** des dernières activités

### Génération de rapports
1. **Choisir la période** (10, 20 ou 30 jours)
2. **Cliquer sur "Générer le rapport"** pour voir le détail
3. **Exporter en CSV** pour sauvegarder
4. **Envoyer par email** directement depuis l'application

## 📊 Structure des Données

### Table `time_entries`
```sql
- id: uuid (clé primaire)
- child_name: text (nom de l'enfant)
- entry_type: 'arrival' | 'departure' (type d'entrée)
- timestamp: timestamptz (horodatage)
- created_at: timestamptz (date de création)
```

### Calculs Automatiques
- **Durée par jour** : Différence entre l'heure d'arrivée et de départ
- **Total par période** : Somme de toutes les heures de garde
- **Nombre de jours** : Jours effectifs avec garde

## 🔒 Sécurité et Confidentialité

- **Données personnelles** : Seuls les prénoms sont stockés
- **Chiffrement** : Données chiffrées par Supabase
- **Sauvegarde** : Données sauvegardées automatiquement
- **RGPD** : Respect de la réglementation sur la protection des données

## 📱 Responsive Design

L'application s'adapte automatiquement à :
- **Mobile** (smartphones)
- **Tablette** (iPads, tablettes Android)
- **Desktop** (ordinateurs)

## 🆘 Support et Dépannage

### Problèmes courants

**L'application ne se charge pas**
- Vérifier les variables d'environnement
- S'assurer que Supabase est configuré
- Contrôler la connexion internet

**Erreur lors de l'enregistrement**
- Vérifier la configuration de la base de données
- S'assurer que les migrations sont appliquées
- Vérifier les permissions Supabase

**Les rapports sont vides**
- S'assurer qu'il y a des données enregistrées
- Vérifier la période sélectionnée
- Contrôler les calculs de dates

### Logs et Debug
```bash
# Voir les logs en développement
npm run dev

# Build pour la production
npm run build
```

## 📈 Améliorations Futures

- **Multi-utilisateurs** : Gestion de plusieurs assistantes maternelles
- **Planning** : Vue calendrier des heures de garde
- **Statistiques avancées** : Graphiques et analyses
- **Notifications** : Rappels automatiques
- **API** : Interface pour d'autres applications
- **Mode hors-ligne** : Fonctionnement sans internet

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---

**Note** : Cette application a été conçue spécifiquement pour les besoins des assistantes maternelles en France, en respectant les réglementations en vigueur.