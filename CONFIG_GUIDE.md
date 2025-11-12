# Configuration Guide - CDT Chat Resource

## Overview

The `config.lua` file contains all configurable settings for the CDT Chat resource. This guide explains each configuration section and how to use it.

---

## Configuration Sections

### 1. Chat Configuration (`Config.Chat`)

Controls chat window appearance and behavior.

```lua
Chat = {
    Position = {
        x = 'left',      -- 'left', 'center', 'right'
        y = 'center'     -- 'top', 'center', 'bottom'
    },
    Width = 400,         -- Width in pixels
    MaxHeight = 500,     -- Maximum height in pixels
    OpenKey = 't',       -- Key to open/close chat
    MessageTimeout = 500, -- Timeout for command messages (ms)
    
    Styling = {
        BorderRadius = 4,
        EditableBorderColor = '#ff6b35',
        ResizeHandleColor = '#ff6b35',
        ResizeHandleOpacity = 0.7,
        ResizeHandleWidth = 8
    }
}
```

### 2. Announcement Configuration (`Config.Announcement`)

Controls how announcements are displayed.

```lua
Announcement = {
    System = 'native',   -- System for displaying announcements
    Duration = 5000,     -- Duration in milliseconds
    Icon = 'CHAR_MULTIPLAYER',
    
    DefaultFormatting = {
        bold = false,
        italic = false,
        underline = false,
        color = '#ffffff'  -- Default text color
    }
}
```

### 3. Permissions (`Config.Permissions`)

Defines ACE permissions required for commands.

```lua
Permissions = {
    announcementCommand = 'admin.announce',  -- Permission for /annonce command
    adminCommand = 'chat.admin'              -- Permission for admin commands
}
```

### 4. /me Command Configuration (`Config.MeCommand`)

Controls the /me command behavior.

```lua
MeCommand = {
    Range = 50.0,        -- Range to see the message (distance units)
    Duration = 5000,     -- Duration to show the message (ms)
    Font = 0,            -- Font style (0-4)
    Scale = 0.4,         -- Text scale
    HeadOffset = 1.2     -- Height offset above player's head
}
```

### 5. /do Command Configuration (`Config.DoCommand`)

Controls the /do command behavior.

```lua
DoCommand = {
    Range = 50.0,        -- Range to see the message (distance units)
    Duration = 5000,     -- Duration to show the message (ms)
    Font = 0,            -- Font style (0-4)
    Scale = 0.4,         -- Text scale
    HeadOffset = 1.2     -- Height offset above player's head
}
```

### 6. Blocked Words (`Config.BlockedWords`)

List of words/commands that trigger automatic mute.

```lua
BlockedWords = {
    '/stop',
    '/restart',
    -- ... add more words/commands to block
}
```

### 7. Blocked Words Configuration (`Config.BlockedWordsConfig`)

Controls automatic mute behavior.

```lua
BlockedWordsConfig = {
    MuteDuration = 10,      -- Mute duration in minutes
    CaseSensitive = false,  -- Whether checks are case-sensitive
    Enabled = true          -- Enable/disable blocking
}
```

### 8. Database Configuration (`Config.Database`)

Controls database features (requires oxmysql).

```lua
Database = {
    Enabled = true,
    
    History = {
        Enabled = true,
        RecordAllMessages = true,
        RecordCommands = true,
        Limit = 100         -- Maximum messages to store per player
    },
    
    AdminPanel = {
        HistoryLimit = 30   -- Messages shown in admin panel
    }
}
```

### 9. Mute Configuration (`Config.Mute`)

Controls player mute settings.

```lua
Mute = {
    Enabled = true,
    DefaultDuration = 30,          -- Default mute duration in minutes
    PersistentStorage = true       -- Save mutes to database
}
```

### 10. Language Configuration (`Config.Language`)

Controls available languages.

```lua
Language = {
    Default = 'fr',                     -- Default language
    Available = {'fr', 'en', 'de', 'es', 'pt'}
}
```

### 11. Messages (`Config.Messages`)

Configurable message strings in multiple languages.

```lua
Messages = {
    fr = {
        PermissionDenied = 'Vous n\'avez pas la permission d\'utiliser cette commande.',
        AnnouncementSent = 'Annonce envoyée avec succès.',
        MuteNotification = 'Vous êtes mute pour %d secondes encore',
        MuteReason = 'Utilisation de mot/commande interdite: %s',
        MuteAdminMessage = 'Joueur %s mute pour %d minutes',
        UnmuteAdminMessage = 'Joueur %s demute',
        AutoMuteMessage = 'Vous avez été mute pendant %d minutes pour tentative d\'utilisation de commande admin.',
        CommandExecuted = '[EXÉCUTÉE] %s',
        MeCommand = '[ME] %s',
        DoCommand = '[DO] %s',
        AdminPermissionDenied = 'Vous n\'avez pas les permissions pour utiliser cette commande.'
    },
    en = {
        -- English translations...
    },
    -- Additional languages (de, es, pt)
}
```

### 12. Screen Coordinates (`Config.ScreenCoordinates`)

Base resolution for coordinate calculations.

```lua
ScreenCoordinates = {
    BaseWidth = 1920,   -- Game resolution width
    BaseHeight = 1080   -- Game resolution height
}
```

### 13. Admin Panel (`Config.AdminPanel`)

Controls admin panel settings.

```lua
AdminPanel = {
    Enabled = true,
    Command = 'adminchat',  -- Command to open admin panel
    RefreshInterval = 5000  -- Refresh interval in milliseconds
}
```

### 14. Debug (`Config.Debug`)

Debug options for development.

```lua
Debug = {
    Enabled = false,
    PrintInitialization = true,
    PrintDatabaseQueries = false,
    PrintPermissions = false
}
```

---

## Examples

### Example 1: Increase /me Range

```lua
MeCommand = {
    Range = 100.0,  -- Changed from 50.0
    -- ... other settings
}
```

### Example 2: Change Default Language to English

```lua
Language = {
    Default = 'en',  -- Changed from 'fr'
    Available = {'fr', 'en', 'de', 'es', 'pt'}
}
```

### Example 3: Disable Blocked Words Filter

```lua
BlockedWordsConfig = {
    MuteDuration = 10,
    CaseSensitive = false,
    Enabled = false  -- Disable blocking
}
```

### Example 4: Customize Chat Position

```lua
Chat = {
    Position = {
        x = 'right',   -- Move to right
        y = 'bottom'   -- Move to bottom
    },
    -- ... other settings
}
```

---

## Message Format Strings

Some messages use format strings with `%s` and `%d` placeholders:

- `%s` - String placeholder (for player names, words, etc.)
- `%d` - Integer placeholder (for durations, counts, etc.)

Example:
```lua
MuteAdminMessage = 'Joueur %s mute pour %d minutes'
-- Will be formatted as: "Joueur John mute pour 30 minutes"
```

---

## Notes

- All changes to `config.lua` require a resource restart to take effect
- The `config.lua` file is loaded **before** other scripts, ensuring Config is available globally
- Messages are organized by language code (fr, en, de, es, pt)
- ACE permissions can be customized but must match your server's ACE configuration
- Database features require `oxmysql` resource to be running

---

## Support

For additional help or feature requests, contact the CDT team.
