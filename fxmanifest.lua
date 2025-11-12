fx_version 'cerulean'
game 'gta5'

author 'CDT'
description 'CDT Custom Chat System - Override for chat with /me, /do, /annonce commands'
version '1.0.0'

dependencies { 'oxmysql' }

ui_page 'html/index.html'

client_scripts {
    'config.lua',
    'client/cl_chat.lua',
    'client/cl_suggestions.lua'
}

server_scripts {
    'config.lua',
    'server/sv_chat.lua'
}

files {
    'html/index.html',
    'html/css/styles.css',
    'html/js/locales.js',
    'html/js/app.js'
}
