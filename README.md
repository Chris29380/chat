# CDT Chat System

[🇫🇷 Français](#français) | [🇬🇧 English](#english)

---

## Français

### 📋 Description

**CDT Chat System** est une ressource FiveM personnalisée offrant un système de chat avancé avec support complet des commandes de roleplay. Cette ressource remplace le système de chat par défaut de FiveM avec une interface moderne et des fonctionnalités complètes.

### ✨ Fonctionnalités

- **Système de Chat Personnalisé** - Interface UI moderne et configurable
- **Commandes de Roleplay** 
  - `/me` - Action visible par les joueurs à proximité
  - `/do` - Narrative visible par les joueurs à proximité
  - `/annonce` - Annonces serveur avec permissions ACE
- **Système de Mute** - Mutipage automatique et manuel des joueurs
- **Filtre de Mots** - Blocage automatique des mots et commandes non autorisées
- **Historique Chat** - Enregistrement complet des messages en base de données
- **Panel Admin** - Interface d'administration avec accès à l'historique
- **Support Multilingue** - Français, Anglais, Allemand, Espagnol, Portugais
- **Base de Données** - Intégration oxmysql pour la persistance des données

### 🚀 Installation

1. **Prérequis**
   - FiveM Server
   - Ressource `oxmysql` pour les fonctionnalités de base de données

2. **Installation**
   ```bash
   # Copier le dossier chat dans le répertoire resources
   cp -r chat c:/path/to/server/resources/
   ```

3. **Configuration du serveur**
   - Ajouter `ensure chat` dans votre `server.cfg`
   - Configurer les permissions ACE si nécessaire

4. **Base de Données**
   - La ressource crée les tables automatiquement si `Database.Enabled = true`

### ⚙️ Configuration

La plupart des paramètres se configurent dans `config.lua` :

#### Position et Apparence du Chat
```lua
Config.Chat = {
    Position = { x = 'left', y = 'center' },
    Width = 400,
    MaxHeight = 500,
    OpenKey = 't'  -- Touche pour ouvrir/fermer le chat
}
```

#### Commandes /me et /do
```lua
Config.MeCommand = {
    Range = 50.0,      -- Portée de visibilité
    Duration = 5000,   -- Durée d'affichage (ms)
    Scale = 0.4        -- Échelle du texte
}
```

#### Système de Mute
```lua
Config.Mute = {
    Enabled = true,
    DefaultDuration = 30  -- Durée par défaut en minutes
}
```

#### Filtre de Mots
```lua
Config.BlockedWordsConfig = {
    Enabled = true,
    MuteDuration = 10,
    CaseSensitive = false
}
```

Plus de détails dans `CONFIG_GUIDE.md`

### 🔐 Permissions ACE

| Permission | Utilisation |
|-----------|------------|
| `admin.announce` | Accès à la commande `/annonce` |
| `chat.admin` | Accès aux commandes admin (mute, unmute, etc.) |

Exemple d'ajout de permission :
```
add_ace identifier.discord:123456789 admin.announce allow
add_ace identifier.discord:123456789 chat.admin allow
```

### 💬 Commandes

| Commande | Description | Permission |
|----------|------------|-----------|
| `/me [message]` | Affiche une action en roleplay | Aucune |
| `/do [message]` | Affiche une narrative | Aucune |
| `/annonce [message]` | Envoie une annonce serveur | `admin.announce` |
| `/adminchat` | Ouvre le panel d'administration | `chat.admin` |
| `/mute [id] [durée]` | Rend muet un joueur | `chat.admin` |
| `/unmute [id]` | Enlève le mute d'un joueur | `chat.admin` |

### 🗂️ Structure des Fichiers

```
chat/
├── client/
│   ├── cl_chat.lua           # Logique client du chat
│   └── cl_suggestions.lua    # Suggestions de commandes
├── server/
│   └── sv_chat.lua           # Logique serveur du chat
├── html/
│   ├── index.html            # Interface UI
│   ├── css/
│   │   └── styles.css        # Styles CSS
│   └── js/
│       ├── app.js            # Logique JavaScript
│       └── locales.js        # Traductions
├── config.lua                # Configuration globale
├── fxmanifest.lua            # Manifest FiveM
└── CONFIG_GUIDE.md           # Guide de configuration détaillé
```

### 🐛 Débogage

Activer le mode debug dans `config.lua` :
```lua
Config.Debug = {
    Enabled = true,
    PrintInitialization = true,
    PrintDatabaseQueries = true,
    PrintPermissions = true
}
```

### 📝 Exemple de Configuration Personnalisée

```lua
-- Augmenter la portée des commandes /me et /do
Config.MeCommand.Range = 100.0
Config.DoCommand.Range = 100.0

-- Modifier la position du chat
Config.Chat.Position = { x = 'right', y = 'bottom' }

-- Changer la langue par défaut
Config.Language.Default = 'en'

-- Ajouter un mot interdit
table.insert(Config.BlockedWords, 'motinterdite')
```

### 🤝 Support

Pour toute question ou problème, contactez l'équipe CDT.

---

## English

### 📋 Description

**CDT Chat System** is a custom FiveM resource offering an advanced chat system with full support for roleplay commands. This resource replaces FiveM's default chat system with a modern interface and complete functionality.

### ✨ Features

- **Custom Chat System** - Modern and configurable UI interface
- **Roleplay Commands**
  - `/me` - Action visible to nearby players
  - `/do` - Narrative visible to nearby players
  - `/annonce` - Server announcements with ACE permissions
- **Mute System** - Automatic and manual player muting
- **Word Filter** - Automatic blocking of unauthorized words and commands
- **Chat History** - Complete message logging in database
- **Admin Panel** - Administration interface with history access
- **Multilingual Support** - French, English, German, Spanish, Portuguese
- **Database Integration** - oxmysql integration for data persistence

### 🚀 Installation

1. **Requirements**
   - FiveM Server
   - `oxmysql` resource for database features

2. **Installation**
   ```bash
   # Copy the chat folder to your resources directory
   cp -r chat c:/path/to/server/resources/
   ```

3. **Server Configuration**
   - Add `ensure chat` to your `server.cfg`
   - Configure ACE permissions if needed

4. **Database**
   - The resource automatically creates tables if `Database.Enabled = true`

### ⚙️ Configuration

Most settings are configured in `config.lua`:

#### Chat Position and Appearance
```lua
Config.Chat = {
    Position = { x = 'left', y = 'center' },
    Width = 400,
    MaxHeight = 500,
    OpenKey = 't'  -- Key to open/close chat
}
```

#### /me and /do Commands
```lua
Config.MeCommand = {
    Range = 50.0,      -- Visibility range
    Duration = 5000,   -- Display duration (ms)
    Scale = 0.4        -- Text scale
}
```

#### Mute System
```lua
Config.Mute = {
    Enabled = true,
    DefaultDuration = 30  -- Default duration in minutes
}
```

#### Word Filter
```lua
Config.BlockedWordsConfig = {
    Enabled = true,
    MuteDuration = 10,
    CaseSensitive = false
}
```

For more details, see `CONFIG_GUIDE.md`

### 🔐 ACE Permissions

| Permission | Usage |
|-----------|-------|
| `admin.announce` | Access to `/annonce` command |
| `chat.admin` | Access to admin commands (mute, unmute, etc.) |

Example of adding permission:
```
add_ace identifier.discord:123456789 admin.announce allow
add_ace identifier.discord:123456789 chat.admin allow
```

### 💬 Commands

| Command | Description | Permission |
|---------|------------|-----------|
| `/me [message]` | Display a roleplay action | None |
| `/do [message]` | Display a narrative | None |
| `/annonce [message]` | Send a server announcement | `admin.announce` |
| `/adminchat` | Open the administration panel | `chat.admin` |
| `/mute [id] [duration]` | Mute a player | `chat.admin` |
| `/unmute [id]` | Unmute a player | `chat.admin` |

### 🗂️ File Structure

```
chat/
├── client/
│   ├── cl_chat.lua           # Client chat logic
│   └── cl_suggestions.lua    # Command suggestions
├── server/
│   └── sv_chat.lua           # Server chat logic
├── html/
│   ├── index.html            # UI interface
│   ├── css/
│   │   └── styles.css        # CSS styles
│   └── js/
│       ├── app.js            # JavaScript logic
│       └── locales.js        # Translations
├── config.lua                # Global configuration
├── fxmanifest.lua            # FiveM manifest
└── CONFIG_GUIDE.md           # Detailed configuration guide
```

### 🐛 Debugging

Enable debug mode in `config.lua`:
```lua
Config.Debug = {
    Enabled = true,
    PrintInitialization = true,
    PrintDatabaseQueries = true,
    PrintPermissions = true
}
```

### 📝 Custom Configuration Example

```lua
-- Increase /me and /do command range
Config.MeCommand.Range = 100.0
Config.DoCommand.Range = 100.0

-- Change chat position
Config.Chat.Position = { x = 'right', y = 'bottom' }

-- Change default language
Config.Language.Default = 'en'

-- Add a blocked word
table.insert(Config.BlockedWords, 'forbiddenword')
```

### 🤝 Support

For any questions or issues, contact the CDT team.

---

**Version**: 1.0.0 | **Author**: CDT
