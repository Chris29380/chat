const LOCALES = {
    fr: {
        chat: {
            title: 'Chat',
            placeholder: 'Tapez votre message...',
            send: 'Envoyer',
            cancel: 'Annuler',
            hide: 'Masquer/Afficher les retours'
        },
        buttons: {
            meCommand: '/me',
            doCommand: '/do',
            announceCommand: '/annonce',
            editMode: 'Mode édition',
            mute: 'Mute',
            unmute: 'Démute',
            reset: 'Réinitialiser',
            refresh: 'Rafraîchir les données'
        },
        settings: {
            autoShow: 'Afficher automatiquement',
            showMessages: 'Afficher la zone de messages',
            serverPrint: 'Afficher les messages serveur',
            color: 'Couleur',
            transparency: 'Transparence',
            font: 'Police',
            fontSize: 'Taille',
            language: 'Langue'
        },
        admin: {
            title: 'Chat - Panneau d\'Administration',
            history: 'Historique du chat',
            selectedPlayer: 'Sélectionnez un joueur',
            muteDuration: 'Durée (minutes)',
            muteReason: 'Raison du mute',
            search: 'Rechercher par ID ou nom...',
            filters: {
                all: 'Tous',
                muted: 'Muets',
                unmuted: 'Non muets'
            }
        },
        modals: {
            createAnnounce: 'Créer une annonce',
            announcePlaceholder: 'Votre annonce...'
        },
        announce: {
            title: 'Créer une annonce',
            importance: 'Niveau d\'importance',
            target: 'Ciblage',
            duration: 'Durée d\'affichage (s)',
            formatting: 'Formatage',
            message: 'Message',
            send: 'Envoyer',
            cancel: 'Annuler',
            importanceLevels: {
                info: 'Info',
                success: 'Succès',
                warning: 'Attention',
                error: 'Erreur',
                critical: 'Critique'
            },
            targetOptions: {
                all: 'Tous les joueurs',
                specific: 'Joueur spécifique'
            },
            selectPlayer: 'Sélectionnez un joueur...'
        },
        messages: {
            muted: 'Vous avez été mute pendant {duration} minutes pour tentative d\'utilisation de commande admin.',
            muteWarning: 'Vous êtes mute pour {remaining} secondes encore',
            noMessages: 'Aucun message trouvé'
        },
        tooltips: {
            autoShow: 'Affiche automatiquement la zone de messages quand un nouveau message arrive',
            serverPrint: 'Affiche les messages du serveur dans le chat',
            color: 'Changer la couleur de fond de la zone',
            transparency: 'Ajuster la transparence (0% = invisible, 100% = opaque)',
            font: 'Sélectionner la police de caractères',
            fontSize: 'Ajuster la taille du texte (8-20 pixels)',
            language: 'Sélectionner la langue de l\'interface',
            showMessages: 'Affiche ou masque la zone de messages',
            reset: 'Restaure tous les paramètres par défaut'
        },
        footer: 'Chat FiveM - Développé par CdtFivem - www.cdtfivem.com'
    },
    en: {
        chat: {
            title: 'Chat',
            placeholder: 'Type your message...',
            send: 'Send',
            cancel: 'Cancel',
            hide: 'Hide/Show messages'
        },
        buttons: {
            meCommand: '/me',
            doCommand: '/do',
            announceCommand: '/announce',
            editMode: 'Edit mode',
            mute: 'Mute',
            unmute: 'Unmute',
            reset: 'Reset',
            refresh: 'Refresh data'
        },
        settings: {
            autoShow: 'Auto-show',
            showMessages: 'Show messages zone',
            serverPrint: 'Show server messages',
            color: 'Color',
            transparency: 'Transparency',
            font: 'Font',
            fontSize: 'Size',
            language: 'Language'
        },
        admin: {
            title: 'Chat - Admin Panel',
            history: 'Chat history',
            selectedPlayer: 'Select a player',
            muteDuration: 'Duration (minutes)',
            muteReason: 'Mute reason',
            search: 'Search by ID or name...',
            filters: {
                all: 'All',
                muted: 'Muted',
                unmuted: 'Unmuted'
            }
        },
        modals: {
            createAnnounce: 'Create announcement',
            announcePlaceholder: 'Your announcement...'
        },
        announce: {
            title: 'Create announcement',
            importance: 'Importance level',
            target: 'Target',
            duration: 'Display duration (s)',
            formatting: 'Formatting',
            message: 'Message',
            send: 'Send',
            cancel: 'Cancel',
            importanceLevels: {
                info: 'Info',
                success: 'Success',
                warning: 'Warning',
                error: 'Error',
                critical: 'Critical'
            },
            targetOptions: {
                all: 'All players',
                specific: 'Specific player'
            },
            selectPlayer: 'Select a player...'
        },
        messages: {
            muted: 'You have been muted for {duration} minutes for attempting to use admin commands.',
            muteWarning: 'You are muted for {remaining} seconds',
            noMessages: 'No messages found'
        },
        tooltips: {
            autoShow: 'Automatically displays the messages zone when a new message arrives',
            serverPrint: 'Displays server messages in the chat',
            color: 'Change the background color of the zone',
            transparency: 'Adjust transparency (0% = invisible, 100% = opaque)',
            font: 'Select the font family',
            fontSize: 'Adjust text size (8-20 pixels)',
            language: 'Select interface language',
            showMessages: 'Show or hide the messages zone',
            reset: 'Restore all default settings'
        },
        footer: 'Chat FiveM - Developed by CdtFivem - www.cdtfivem.com'
    },
    de: {
        chat: {
            title: 'Chat',
            placeholder: 'Geben Sie Ihre Nachricht ein...',
            send: 'Senden',
            cancel: 'Abbrechen',
            hide: 'Nachrichten ausblenden/anzeigen'
        },
        buttons: {
            meCommand: '/me',
            doCommand: '/do',
            announceCommand: '/ankündigung',
            editMode: 'Bearbeitungsmodus',
            mute: 'Stummschalten',
            unmute: 'Freischalten',
            reset: 'Zurücksetzen',
            refresh: 'Daten aktualisieren'
        },
        settings: {
            autoShow: 'Automatisch anzeigen',
            showMessages: 'Nachrichtenbereich anzeigen',
            serverPrint: 'Servermeldungen anzeigen',
            color: 'Farbe',
            transparency: 'Transparenz',
            font: 'Schrift',
            fontSize: 'Größe',
            language: 'Sprache'
        },
        admin: {
            title: 'Chat - Admin-Bereich',
            history: 'Chat-Verlauf',
            selectedPlayer: 'Wählen Sie einen Spieler',
            muteDuration: 'Dauer (Minuten)',
            muteReason: 'Grund für Stummschaltung',
            search: 'Nach ID oder Name suchen...',
            filters: {
                all: 'Alle',
                muted: 'Stummgeschaltet',
                unmuted: 'Nicht stummgeschaltet'
            }
        },
        modals: {
            createAnnounce: 'Ankündigung erstellen',
            announcePlaceholder: 'Ihre Ankündigung...'
        },
        announce: {
            title: 'Ankündigung erstellen',
            importance: 'Wichtigkeitsstufe',
            target: 'Ziel',
            duration: 'Anzeigedauer (s)',
            formatting: 'Formatierung',
            message: 'Nachricht',
            send: 'Senden',
            cancel: 'Abbrechen',
            importanceLevels: {
                info: 'Info',
                success: 'Erfolg',
                warning: 'Warnung',
                error: 'Fehler',
                critical: 'Kritisch'
            },
            targetOptions: {
                all: 'Alle Spieler',
                specific: 'Bestimmter Spieler'
            },
            selectPlayer: 'Wählen Sie einen Spieler...'
        },
        messages: {
            muted: 'Sie wurden für {duration} Minuten stummgeschaltet, weil Sie versucht haben, Admin-Befehle zu verwenden.',
            muteWarning: 'Sie sind noch {remaining} Sekunden stummgeschaltet',
            noMessages: 'Keine Meldungen gefunden'
        },
        tooltips: {
            autoShow: 'Zeigt die Nachrichtenzone automatisch an, wenn eine neue Nachricht ankommt',
            serverPrint: 'Zeigt Servermeldungen im Chat an',
            color: 'Ändern Sie die Hintergrundfarbe der Zone',
            transparency: 'Passen Sie die Transparenz an (0% = unsichtbar, 100% = deckend)',
            font: 'Wählen Sie die Schriftart',
            fontSize: 'Passen Sie die Textgröße an (8-20 Pixel)',
            language: 'Wählen Sie die Oberflächensprache',
            showMessages: 'Nachrichtenzone anzeigen oder ausblenden',
            reset: 'Alle Standardeinstellungen wiederherstellen'
        },
        footer: 'Chat FiveM - Entwickelt von CdtFivem - www.cdtfivem.com'
    },
    es: {
        chat: {
            title: 'Chat',
            placeholder: 'Escriba su mensaje...',
            send: 'Enviar',
            cancel: 'Cancelar',
            hide: 'Ocultar/Mostrar mensajes'
        },
        buttons: {
            meCommand: '/me',
            doCommand: '/do',
            announceCommand: '/anuncio',
            editMode: 'Modo de edición',
            mute: 'Silenciar',
            unmute: 'Desmutecar',
            reset: 'Restablecer',
            refresh: 'Actualizar datos'
        },
        settings: {
            autoShow: 'Mostrar automáticamente',
            showMessages: 'Mostrar zona de mensajes',
            serverPrint: 'Mostrar mensajes del servidor',
            color: 'Color',
            transparency: 'Transparencia',
            font: 'Fuente',
            fontSize: 'Tamaño',
            language: 'Idioma'
        },
        admin: {
            title: 'Chat - Panel de Administración',
            history: 'Historial de chat',
            selectedPlayer: 'Seleccione un jugador',
            muteDuration: 'Duración (minutos)',
            muteReason: 'Razón del silenciamiento',
            search: 'Buscar por ID o nombre...',
            filters: {
                all: 'Todos',
                muted: 'Silenciados',
                unmuted: 'No silenciados'
            }
        },
        modals: {
            createAnnounce: 'Crear anuncio',
            announcePlaceholder: 'Su anuncio...'
        },
        announce: {
            title: 'Crear anuncio',
            importance: 'Nivel de importancia',
            target: 'Destino',
            duration: 'Duración de la visualización (s)',
            formatting: 'Formato',
            message: 'Mensaje',
            send: 'Enviar',
            cancel: 'Cancelar',
            importanceLevels: {
                info: 'Información',
                success: 'Éxito',
                warning: 'Advertencia',
                error: 'Error',
                critical: 'Crítico'
            },
            targetOptions: {
                all: 'Todos los jugadores',
                specific: 'Jugador específico'
            },
            selectPlayer: 'Seleccionar un jugador...'
        },
        messages: {
            muted: 'Ha sido silenciado durante {duration} minutos por intentar usar comandos de administrador.',
            muteWarning: 'Está silenciado por {remaining} segundos más',
            noMessages: 'No se encontraron mensajes'
        },
        tooltips: {
            autoShow: 'Muestra automáticamente la zona de mensajes cuando llega un nuevo mensaje',
            serverPrint: 'Muestra los mensajes del servidor en el chat',
            color: 'Cambiar el color de fondo de la zona',
            transparency: 'Ajustar la transparencia (0% = invisible, 100% = opaco)',
            font: 'Seleccionar la familia de fuentes',
            fontSize: 'Ajustar el tamaño del texto (8-20 píxeles)',
            language: 'Seleccionar idioma de la interfaz',
            showMessages: 'Mostrar u ocultar la zona de mensajes',
            reset: 'Restaurar todos los valores predeterminados'
        },
        footer: 'Chat FiveM - Desarrollado por CdtFivem - www.cdtfivem.com'
    },
    pt: {
        chat: {
            title: 'Chat',
            placeholder: 'Digite sua mensagem...',
            send: 'Enviar',
            cancel: 'Cancelar',
            hide: 'Ocultar/Mostrar mensagens'
        },
        buttons: {
            meCommand: '/me',
            doCommand: '/do',
            announceCommand: '/anúncio',
            editMode: 'Modo de edição',
            mute: 'Silenciar',
            unmute: 'Desmutar',
            reset: 'Redefinir',
            refresh: 'Atualizar dados'
        },
        settings: {
            autoShow: 'Mostrar automaticamente',
            showMessages: 'Mostrar zona de mensagens',
            serverPrint: 'Mostrar mensagens do servidor',
            color: 'Cor',
            transparency: 'Transparência',
            font: 'Fonte',
            fontSize: 'Tamanho',
            language: 'Idioma'
        },
        admin: {
            title: 'Chat - Painel de Administração',
            history: 'Histórico do chat',
            selectedPlayer: 'Selecione um jogador',
            muteDuration: 'Duração (minutos)',
            muteReason: 'Razão do silenciamento',
            search: 'Procurar por ID ou nome...',
            filters: {
                all: 'Todos',
                muted: 'Silenciados',
                unmuted: 'Não silenciados'
            }
        },
        modals: {
            createAnnounce: 'Criar anúncio',
            announcePlaceholder: 'Seu anúncio...'
        },
        announce: {
            title: 'Criar anúncio',
            importance: 'Nível de importância',
            target: 'Alvo',
            duration: 'Duração da exibição (s)',
            formatting: 'Formatação',
            message: 'Mensagem',
            send: 'Enviar',
            cancel: 'Cancelar',
            importanceLevels: {
                info: 'Informação',
                success: 'Sucesso',
                warning: 'Aviso',
                error: 'Erro',
                critical: 'Crítico'
            },
            targetOptions: {
                all: 'Todos os jogadores',
                specific: 'Jogador específico'
            },
            selectPlayer: 'Selecione um jogador...'
        },
        messages: {
            muted: 'Você foi silenciado por {duration} minutos por tentar usar comandos de administrador.',
            muteWarning: 'Você está silenciado por mais {remaining} segundos',
            noMessages: 'Nenhuma mensagem encontrada'
        },
        tooltips: {
            autoShow: 'Exibe automaticamente a zona de mensagens quando uma nova mensagem chega',
            serverPrint: 'Exibe mensagens do servidor no chat',
            color: 'Alterar a cor de fundo da zona',
            transparency: 'Ajustar a transparência (0% = invisível, 100% = opaco)',
            font: 'Selecionar a família de fontes',
            fontSize: 'Ajustar o tamanho do texto (8-20 pixels)',
            language: 'Selecionar idioma da interface',
            showMessages: 'Mostrar ou ocultar a zona de mensagens',
            reset: 'Restaurar todas as configurações padrão'
        },
        footer: 'Chat FiveM - Desenvolvido por CdtFivem - www.cdtfivem.com'
    }
};

let currentLanguage = 'fr';

function setLanguage(lang) {
    if (LOCALES[lang]) {
        currentLanguage = lang;
        localStorage.setItem('chatLanguage', lang);
        return true;
    }
    return false;
}

function t(path, replacements = {}) {
    let value = LOCALES[currentLanguage];
    const keys = path.split('.');
    
    for (const key of keys) {
        if (value && typeof value === 'object' && key in value) {
            value = value[key];
        } else {
            console.warn(`Translation not found: ${path}`);
            return path;
        }
    }
    
    if (typeof value === 'string') {
        let result = value;
        for (const [key, val] of Object.entries(replacements)) {
            result = result.replace(`{${key}}`, val);
        }
        return result;
    }
    
    return value;
}

function getAvailableLanguages() {
    return Object.keys(LOCALES).map(code => ({
        code: code,
        name: {
            fr: { fr: 'Français', en: 'English', de: 'Deutsch', es: 'Español', pt: 'Português' },
            en: { fr: 'French', en: 'English', de: 'German', es: 'Spanish', pt: 'Portuguese' },
            de: { fr: 'Französisch', en: 'Englisch', de: 'Deutsch', es: 'Spanisch', pt: 'Portugiesisch' },
            es: { fr: 'Francés', en: 'Inglés', de: 'Alemán', es: 'Español', pt: 'Portugués' },
            pt: { fr: 'Francês', en: 'Inglês', de: 'Alemão', es: 'Espanhol', pt: 'Português' }
        }[code][currentLanguage]
    }));
}
