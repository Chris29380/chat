Config = {
    Chat = {
        Position = {
            x = 'left', -- Horizontal position: 'left', 'center', 'right' (used in cl_chat.lua SendNUIMessage)
            y = 'center' -- Vertical position: 'top', 'center', 'bottom' (used in cl_chat.lua SendNUIMessage)
        },
        Width = 400, -- Chat window width in pixels (sent to UI in cl_chat.lua line 325)
        MaxHeight = 500, -- Chat window maximum height in pixels (sent to UI in cl_chat.lua line 325)
        OpenKey = 't', -- Key binding to toggle chat open/close (used in cl_chat.lua RegisterKeyMapping line 356)
        MessageTimeout = 500, -- Timeout for command feedback messages in milliseconds (used in cl_chat.lua line 8)
        
        Styling = {
            BorderRadius = 4, -- Chat window border radius in pixels (CSS styling)
            EditableBorderColor = '#ff6b35', -- Border color when chat is editable (CSS styling)
            ResizeHandleColor = '#ff6b35', -- Resize handle color (CSS styling)
            ResizeHandleOpacity = 0.7, -- Resize handle opacity (CSS styling)
            ResizeHandleWidth = 8 -- Resize handle width in pixels (CSS styling)
        }
    },
    
    Announcement = {
        System = 'native', -- System for displaying announcements (UI page)
        Duration = 5000, -- Announcement display duration in milliseconds (sent to UI in cl_chat.lua line 326)
        Icon = 'CHAR_MULTIPLAYER', -- GTA icon to display with announcement
        
        DefaultFormatting = {
            bold = false, -- Default bold formatting for announcements (used in sv_chat.lua line 89)
            italic = false, -- Default italic formatting for announcements (used in sv_chat.lua line 89)
            underline = false, -- Default underline formatting for announcements (used in sv_chat.lua line 89)
            color = '#ffffff' -- Default text color for announcements (used in sv_chat.lua line 89)
        }
    },
    
    Permissions = {
        announcementCommand = 'admin.announce', -- ACE permission for /annonce command (checked in sv_chat.lua lines 50, 70)
        adminCommand = 'chat.admin' -- ACE permission for admin commands: mute, unmute, chathistory, adminchat (checked in sv_chat.lua multiple lines)
    },
    
    MeCommand = {
        Range = 50.0, -- Range in units where /me message is visible (used in cl_chat.lua line 177)
        Duration = 5000, -- Duration in milliseconds to show /me message (used in cl_chat.lua line 177)
        Font = 0, -- Font style 0-4 for text rendering
        Scale = 0.4, -- Text scale multiplier (1.0 = normal size)
        HeadOffset = 1.2 -- Height offset above player's head in units (used in cl_chat.lua line 131)
    },
    
    DoCommand = {
        Range = 50.0, -- Range in units where /do message is visible (used in cl_chat.lua line 188)
        Duration = 5000, -- Duration in milliseconds to show /do message (used in cl_chat.lua line 188)
        Font = 0, -- Font style 0-4 for text rendering
        Scale = 0.4, -- Text scale multiplier (1.0 = normal size)
        HeadOffset = 1.2 -- Height offset above player's head in units (used in cl_chat.lua line 131)
    },
    
    BlockedWords = {
        '/stop',
        '/restart',
        '/quit',
        '/kill',
        '/kick',
        '/ban',
        '/unban',
        '/op',
        '/deop',
        '/whitelist',
        '/blacklist',
        '/give',
        '/setblock',
        '/teleport',
        '/tp',
        '/execute',
        '/say',
        '/tell',
        '/msg',
        '/summon',
        '/setworldspawn',
        '/gamemode',
        '/difficulty',
        '/time',
        '/weather',
        'bypass',
        'exploit',
        'cheat',
        'hack'
    },
    
    BlockedWordsConfig = {
        MuteDuration = 10, -- Duration in minutes to mute player who uses blocked words (used in sv_chat.lua line 328)
        CaseSensitive = false, -- Whether blocked word check is case-sensitive (used in sv_chat.lua lines 301, 307)
        Enabled = true -- Enable/disable blocked words filter (checked in sv_chat.lua line 296)
    },
    
    Database = {
        Enabled = true, -- Enable database features (requires oxmysql resource)
        
        History = {
            Enabled = true, -- Enable chat history recording
            RecordAllMessages = true, -- Record all messages to database
            RecordCommands = true, -- Record commands to database
            Limit = 100 -- Maximum number of messages to store per player (used in sv_chat.lua lines 265, 276)
        },
        
        AdminPanel = {
            HistoryLimit = 30 -- Number of history messages shown in admin panel (used in sv_chat.lua lines 380, 447)
        }
    },
    
    Mute = {
        Enabled = true, -- Enable/disable mute system
        DefaultDuration = 30, -- Default mute duration in minutes (used in sv_chat.lua line 346)
        PersistentStorage = true -- Store mutes in database permanently
    },
    
    Language = {
        Default = 'fr', -- Default language code (used in sv_chat.lua, cl_chat.lua for message selection)
        Available = {'fr', 'en', 'de', 'es', 'pt'} -- Available language codes for messages
    },
    
    Messages = {
        fr = {
            PermissionDenied = 'Vous n\'avez pas la permission d\'utiliser cette commande.', -- Shown when lacking permission (sv_chat.lua line 52)
            AnnouncementSent = 'Annonce envoyée avec succès.', -- Shown after announcement sent (sv_chat.lua line 107)
            MuteNotification = 'Vous êtes mute pour %d secondes encore', -- %d = seconds remaining (cl_chat.lua line 365)
            MuteReason = 'Utilisation de mot/commande interdite: %s', -- %s = blocked word (sv_chat.lua line 326)
            MuteAdminMessage = 'Joueur %s mute pour %d minutes', -- %s = player name, %d = duration (sv_chat.lua lines 351, 399)
            UnmuteAdminMessage = 'Joueur %s demute', -- %s = player name (sv_chat.lua lines 367, 414)
            AutoMuteMessage = 'Vous avez été mute pendant %d minutes pour tentative d\'utilisation de commande admin.', -- %d = duration (sv_chat.lua line 329)
            CommandExecuted = '[EXÉCUTÉE] %s', -- %s = command (sv_chat.lua line 127)
            MeCommand = '[ME] %s', -- %s = message text (not currently used)
            DoCommand = '[DO] %s', -- %s = message text (not currently used)
            AdminPermissionDenied = 'Vous n\'avez pas les permissions pour utiliser cette commande.' -- Shown to non-admins (sv_chat.lua line 494)
        },
        en = {
            PermissionDenied = 'You don\'t have permission to use this command.', -- Shown when lacking permission
            AnnouncementSent = 'Announcement sent successfully.', -- Shown after announcement sent
            MuteNotification = 'You are muted for %d seconds remaining', -- %d = seconds remaining
            MuteReason = 'Use of blocked word/command: %s', -- %s = blocked word
            MuteAdminMessage = 'Player %s muted for %d minutes', -- %s = player name, %d = duration
            UnmuteAdminMessage = 'Player %s unmuted', -- %s = player name
            AutoMuteMessage = 'You have been muted for %d minutes for attempting to use an admin command.', -- %d = duration
            CommandExecuted = '[EXECUTED] %s', -- %s = command
            MeCommand = '[ME] %s', -- %s = message text
            DoCommand = '[DO] %s', -- %s = message text
            AdminPermissionDenied = 'You don\'t have permissions to use this command.' -- Shown to non-admins
        },
        de = {
            PermissionDenied = 'Sie haben keine Berechtigung, diesen Befehl zu verwenden.', -- Shown when lacking permission
            AnnouncementSent = 'Ankündigung erfolgreich gesendet.', -- Shown after announcement sent
            MuteNotification = 'Sie sind noch %d Sekunden lang stummgeschaltet', -- %d = seconds remaining
            MuteReason = 'Verwendung von blockiertem Wort/Befehl: %s', -- %s = blocked word
            MuteAdminMessage = 'Spieler %s für %d Minuten stummgeschaltet', -- %s = player name, %d = duration
            UnmuteAdminMessage = 'Spieler %s aktiviert', -- %s = player name
            AutoMuteMessage = 'Sie wurden für %d Minuten stummgeschaltet, weil Sie versucht haben, einen Admin-Befehl zu verwenden.', -- %d = duration
            CommandExecuted = '[AUSGEFÜHRT] %s', -- %s = command
            MeCommand = '[ME] %s', -- %s = message text
            DoCommand = '[DO] %s', -- %s = message text
            AdminPermissionDenied = 'Sie haben keine Berechtigung zur Verwendung dieses Befehls.' -- Shown to non-admins
        },
        es = {
            PermissionDenied = 'No tienes permiso para usar este comando.', -- Shown when lacking permission
            AnnouncementSent = 'Anuncio enviado correctamente.', -- Shown after announcement sent
            MuteNotification = 'Estás silenciado por %d segundos más', -- %d = seconds remaining
            MuteReason = 'Uso de palabra/comando bloqueado: %s', -- %s = blocked word
            MuteAdminMessage = 'Jugador %s silenciado por %d minutos', -- %s = player name, %d = duration
            UnmuteAdminMessage = 'Jugador %s reactivado', -- %s = player name
            AutoMuteMessage = 'Has sido silenciado por %d minutos por intentar usar un comando de administrador.', -- %d = duration
            CommandExecuted = '[EJECUTADO] %s', -- %s = command
            MeCommand = '[ME] %s', -- %s = message text
            DoCommand = '[DO] %s', -- %s = message text
            AdminPermissionDenied = 'No tienes permisos para usar este comando.' -- Shown to non-admins
        },
        pt = {
            PermissionDenied = 'Você não tem permissão para usar este comando.', -- Shown when lacking permission
            AnnouncementSent = 'Anúncio enviado com sucesso.', -- Shown after announcement sent
            MuteNotification = 'Você está mudo por %d segundos restantes', -- %d = seconds remaining
            MuteReason = 'Uso de palavra/comando bloqueado: %s', -- %s = blocked word
            MuteAdminMessage = 'Jogador %s mutado por %d minutos', -- %s = player name, %d = duration
            UnmuteAdminMessage = 'Jogador %s desmutado', -- %s = player name
            AutoMuteMessage = 'Você foi mutado por %d minutos ao tentar usar um comando de administrador.', -- %d = duration
            CommandExecuted = '[EXECUTADO] %s', -- %s = command
            MeCommand = '[ME] %s', -- %s = message text
            DoCommand = '[DO] %s', -- %s = message text
            AdminPermissionDenied = 'Você não tem permissões para usar este comando.' -- Shown to non-admins
        }
    },
    
    ScreenCoordinates = {
        BaseWidth = 1920, -- Base game resolution width for coordinate calculations (used in cl_chat.lua line 118)
        BaseHeight = 1080 -- Base game resolution height for coordinate calculations (used in cl_chat.lua line 119)
    },
    
    AdminPanel = {
        Enabled = true, -- Enable/disable admin panel feature
        Command = 'adminchat', -- Command to open admin panel (used in cl_chat.lua RegisterCommand)
        RefreshInterval = 5000 -- Auto-refresh interval in milliseconds for admin panel data
    },
    
    SystemMessages = {
        Enabled = true, -- Enable system messages for admin view (used in sv_chat.lua for sending to admins)
        ShowInAdminChat = true, -- Show system messages in admin chat (used in cl_chat.lua line 4)
        Types = {
            Commands = true, -- Show command execution feedback (refresh, restart, etc.)
            Warnings = true, -- Show warning messages
            Errors = true, -- Show error messages
            Info = true -- Show informational messages
        }
    },
    
    Debug = {
        Enabled = false, -- Enable debug mode for development
        PrintInitialization = true, -- Print initialization messages to console
        PrintDatabaseQueries = false, -- Print database queries to console
        PrintPermissions = false -- Print permission checks to console
    }
}
