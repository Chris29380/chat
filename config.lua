Config = {
    Chat = {
        Position = {
            x = 'left',
            y = 'center'
        },
        Width = 400,
        MaxHeight = 500,
        OpenKey = 't'
    },
    
    Announcement = {
        System = 'native',
        Duration = 5000,
        Icon = 'CHAR_MULTIPLAYER'
    },
    
    Permissions = {
        announcementCommand = 'admin.announce'
    },
    
    MeCommand = {
        Range = 50.0,
        Duration = 5000,
        Font = 0,
        Scale = 0.4
    },
    
    DoCommand = {
        Range = 50.0,
        Duration = 5000,
        Font = 0,
        Scale = 0.4
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
        MuteDuration = 10,
        CaseSensitive = false
    },
    
    Language = {
        Default = 'fr',
        Available = {'fr', 'en', 'de', 'es', 'pt'}
    }
}
