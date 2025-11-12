const CHAT_EVENTS = {
    OPEN: 'OPEN',
    CLOSE: 'CLOSE',
    OPEN_WITH_PREFIX: 'OPEN_WITH_PREFIX',
    OPEN_ANNOUNCE: 'OPEN_ANNOUNCE',
    UPDATE_PERMISSIONS: 'UPDATE_PERMISSIONS',
    SHOW_ANNOUNCEMENT: 'SHOW_ANNOUNCEMENT',
    UPDATE_CONFIG: 'UPDATE_CONFIG',
    UPDATE_TEXT_POSITION: 'UPDATE_TEXT_POSITION',
    REMOVE_TEXT: 'REMOVE_TEXT',
    ADD_SUGGESTION: 'ADD_SUGGESTION',
    REMOVE_SUGGESTION: 'REMOVE_SUGGESTION',
    ADD_MESSAGE: 'ADD_MESSAGE',
    SHOW_MUTE_MESSAGE: 'SHOW_MUTE_MESSAGE',
    SHOW_ADMIN_HISTORY: 'SHOW_ADMIN_HISTORY',
    OPEN_ADMIN_PANEL: 'OPEN_ADMIN_PANEL'
};

if (typeof currentLanguage === 'undefined') {
    window.currentLanguage = 'fr';
}

if (typeof t !== 'function') {
    window.t = function(path, replacements = {}) {
        if (typeof LOCALES !== 'undefined' && LOCALES[currentLanguage]) {
            let value = LOCALES[currentLanguage];
            const keys = path.split('.');
            for (const key of keys) {
                if (value && typeof value === 'object' && key in value) {
                    value = value[key];
                } else {
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
        return path;
    };
}

let chatVisible = false;
let inputPrefix = '';
let chatMode = null;
let focusInInput = false;
let hasAnnouncePermission = false;
let isAdmin = false;
let showServerPrint = localStorage.getItem('showServerPrint') === 'true';
let messagesVisible = localStorage.getItem('chatMessagesVisible') !== 'false';
let showMessagesZone = localStorage.getItem('showMessagesZone') !== 'false';
let autoHideTimeout = null;
let editModeActive = false;
let currentEditZone = null;
let draggedZone = null;
let dragOffsetX = 0;
let dragOffsetY = 0;
let resizingZone = null;
let resizeType = null;
let resizeStartX = 0;
let resizeStartY = 0;
let resizeStartWidth = 0;
let resizeStartHeight = 0;
let config = {
    Position: { x: 0, y: 0 },
    AnnouncementDuration: 5000
};

const activeTexts = new Map();
const suggestions = new Map();
const chatHistory = [];

const chatContainer = document.getElementById('chat-container');
const messagesZone = document.getElementById('messages-zone');
const chatMessages = document.getElementById('chat-messages');
const chatInputContainer = document.getElementById('chat-input-container');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const meBtn = document.getElementById('me-btn');
const doBtn = document.getElementById('do-btn');
const announceBtn = document.getElementById('announce-btn');
const editModeBtn = document.getElementById('edit-mode-btn');
const buttonsContainer = document.getElementById('buttons-container');
const announceSection = document.getElementById('announce-section');
const announceTextarea = document.getElementById('announce-textarea');
const announceSendBtn = document.getElementById('announce-send');
const announceCancelBtn = document.getElementById('announce-cancel');
const messagesEditControls = document.getElementById('messages-edit-controls');
const messagesAutoShow = document.getElementById('messages-auto-show');
const messagesServerPrint = document.getElementById('messages-server-print');
const serverPrintControl = document.getElementById('server-print-control');
const messagesEditColor = document.getElementById('messages-edit-color');
const messagesEditOpacity = document.getElementById('messages-edit-opacity');
const messagesEditOpacityValue = document.getElementById('messages-edit-opacity-value');
const messagesEditFont = document.getElementById('messages-edit-font');
const messagesEditFontSize = document.getElementById('messages-edit-font-size');
const messagesEditFontSizeValue = document.getElementById('messages-edit-font-size-value');
const messagesEditReset = document.getElementById('messages-edit-reset');

const chatEditControls = document.getElementById('chat-edit-controls');
const chatShowMessagesZone = document.getElementById('chat-show-messages-zone');
const chatEditColor = document.getElementById('chat-edit-color');
const chatEditOpacity = document.getElementById('chat-edit-opacity');
const chatEditOpacityValue = document.getElementById('chat-edit-opacity-value');
const chatLanguageSelect = document.getElementById('chat-language-select');
const chatEditReset = document.getElementById('chat-edit-reset');
const textsContainer = document.getElementById('texts-container');
const suggestionsContainer = document.getElementById('suggestions-container');
const suggestionsList = document.getElementById('suggestions-list');
const toggleMessagesBtn = document.getElementById('toggle-messages-btn');

const adminPanel = document.getElementById('admin-panel');
const adminHistory = document.getElementById('admin-history');
const adminPlayerName = document.getElementById('admin-player-name');
const adminCloseBtn = document.getElementById('admin-close');
const adminMuteBtn = document.getElementById('admin-mute-btn');
const muteDurationInput = document.getElementById('mute-duration');
const muteReasonInput = document.getElementById('mute-reason');

const adminPanelPlayers = document.getElementById('admin-panel-players');
const adminPlayersClose = document.getElementById('admin-players-close');
const adminPlayersList = document.getElementById('admin-players-list');
const adminSearchInput = document.getElementById('admin-search-input');
const selectedPlayerName = document.getElementById('selected-player-name');
const selectedPlayerId = document.getElementById('selected-player-id');
const adminPlayerHistory = document.getElementById('admin-player-history');
const adminMuteDurationInput = document.getElementById('admin-mute-duration');
const adminMuteReasonInput = document.getElementById('admin-mute-reason');
const adminPlayerMuteBtn = document.getElementById('admin-player-mute-btn');
const adminMessageBox = document.getElementById('admin-message');
const filterAllBtn = document.getElementById('filter-all');
const filterMutedBtn = document.getElementById('filter-muted');
const filterUnmutedBtn = document.getElementById('filter-unmuted');
const adminRefreshBtn = document.getElementById('admin-refresh-btn');

const announceCloseBtn = document.getElementById('announce-close-btn');
const announceDurationInput = document.getElementById('announce-duration');
const announcePlayerSelect = document.getElementById('announce-player-select');
const announceCharCount = document.getElementById('announce-char-count');
const announcePreviewContent = document.getElementById('announce-preview-content');
const announceImportanceBtns = document.querySelectorAll('.announce-importance-btn');
const announceTargetRadios = document.querySelectorAll('input[name="announce-target"]');
const announceFormatBtns = document.querySelectorAll('.announce-format-btn');

let currentAdminPlayerId = null;
let announceFormData = {
    importance: 'info',
    target: 'all',
    targetPlayer: null,
    duration: 5,
    message: '',
    formatting: {
        bold: false,
        italic: false,
        underline: false,
        color: '#ffffff'
    }
};
let allPlayers = [];
let adminPanelData = null;
let selectedPlayerIdInPanel = null;
let adminDisplayedPlayers = [];
let currentFilterMode = 'all';
let unmuteUnlistener = null;

function migratePixelsToPercentage(value) {
    if (!value) return null;
    if (value.endsWith('%')) return value;
    if (value.endsWith('px')) {
        const pixelValue = parseInt(value);
        const percentage = Math.round((pixelValue / 1920) * 100);
        return Math.max(1, Math.min(100, percentage)) + '%';
    }
    return value;
}

const getStoredWidth = (key, defaultValue) => {
    const stored = localStorage.getItem(key);
    if (!stored) return defaultValue;
    const migrated = migratePixelsToPercentage(stored);
    return migrated || defaultValue;
};

const getStoredHeight = (key, defaultValue) => {
    const stored = localStorage.getItem(key);
    if (!stored) return defaultValue;
    if (defaultValue === 'auto' && stored === 'auto') return 'auto';
    const migrated = migratePixelsToPercentage(stored);
    return migrated || defaultValue;
};

const zoneSettings = {
    'messages-zone': {
        color: localStorage.getItem('msgZoneColor') || '#363636',
        opacity: parseInt(localStorage.getItem('msgZoneOpacity')) || 26,
        top: localStorage.getItem('msgZoneTop') || '152.5px',
        left: localStorage.getItem('msgZoneLeft') || '1373px',
        width: getStoredWidth('msgZoneWidth', '28%'),
        height: getStoredHeight('msgZoneHeight', '62%'),
        showAuto: localStorage.getItem('msgZoneShowAuto') !== 'false',
        font: localStorage.getItem('msgZoneFont') || 'Segoe UI',
        fontSize: parseInt(localStorage.getItem('msgZoneFontSize')) || 12
    },
    'chat-container': {
        color: localStorage.getItem('chatZoneColor') || '#363636',
        opacity: parseInt(localStorage.getItem('chatZoneOpacity')) || 50,
        top: localStorage.getItem('chatZoneTop') || '487.5px',
        left: localStorage.getItem('chatZoneLeft') || '17px',
        width: getStoredWidth('chatZoneWidth', '24%'),
        height: getStoredHeight('chatZoneHeight', 'auto')
    }
};

function getTimeString() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
}

function parseColorCodes(text) {
    const colorMap = {
        '0': '#000000', '1': '#FF0000', '2': '#00FF00', '3': '#FFFF00',
        '4': '#0000FF', '5': '#00FFFF', '6': '#FF00FF', '7': '#FFFFFF',
        '8': '#FF8000', '9': '#808080'
    };
    
    const parts = [];
    let currentText = '';
    let currentColor = null;
    let i = 0;
    
    while (i < text.length) {
        if (text[i] === '^' && i + 1 < text.length && /[0-9]/.test(text[i + 1])) {
            if (currentText) {
                parts.push({ text: currentText, color: currentColor });
                currentText = '';
            }
            currentColor = colorMap[text[i + 1]] || null;
            i += 2;
        } else {
            currentText += text[i];
            i++;
        }
    }
    
    if (currentText) {
        parts.push({ text: currentText, color: currentColor });
    }
    
    return parts;
}

function addMessageToChat(message, isCommand = false) {
    const timestamp = getTimeString();
    const messageElement = document.createElement('div');
    messageElement.className = 'chat-message';
    
    const timeEl = document.createElement('span');
    timeEl.className = 'message-time';
    timeEl.textContent = `[${timestamp}]`;
    
    const contentEl = document.createElement('span');
    contentEl.className = 'message-content' + (isCommand ? ' command' : '');
    
    const colorParts = parseColorCodes(message);
    colorParts.forEach(part => {
        const span = document.createElement('span');
        span.textContent = part.text;
        if (part.color) {
            span.style.color = part.color;
        }
        contentEl.appendChild(span);
    });
    
    messageElement.appendChild(timeEl);
    messageElement.appendChild(contentEl);
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    chatMessages.classList.add('active');
    
    const shouldAutoShow = zoneSettings['messages-zone'].showAuto && showMessagesZone && !editModeActive;
    console.log('[DEBUG Auto-show]', {
        showAuto: zoneSettings['messages-zone'].showAuto,
        showMessagesZone: showMessagesZone,
        editModeActive: editModeActive,
        chatVisible: chatVisible,
        shouldAutoShow: shouldAutoShow
    });
    
    if (shouldAutoShow) {
        console.log('[Auto-show] Affichage de la zone de messages');
        messagesZone.classList.add('visible');
        messagesVisible = true;
        updateMessagesVisibility();
        
        if (autoHideTimeout) {
            clearTimeout(autoHideTimeout);
        }
        
        if (!chatVisible) {
            console.log('[Auto-show] Programmation du masquage dans 5s');
            autoHideTimeout = setTimeout(() => {
                console.log('[Auto-show] Masquage de la zone de messages');
                messagesVisible = false;
                updateMessagesVisibility();
                messagesZone.classList.remove('visible');
            }, 5000);
        }
    }
}

function applyChatPosition(posX, posY) {
    chatContainer.style.left = 'auto';
    chatContainer.style.right = 'auto';
    chatContainer.style.top = 'auto';
    chatContainer.style.bottom = 'auto';
    
    if (posX === 'left') chatContainer.style.left = '20px';
    else if (posX === 'right') chatContainer.style.right = '20px';
    else chatContainer.style.left = posX + 'px';
    
    if (posY === 'top') chatContainer.style.top = '10px';
    else if (posY === 'bottom') chatContainer.style.bottom = '50px';
    else if (posY === 'center') {
        chatContainer.style.top = '50%';
        chatContainer.style.transform = 'translateY(-50%)';
    } else chatContainer.style.top = posY + 'px';
}

function updateMessagesVisibility() {
    if (messagesVisible) {
        chatMessages.classList.remove('hidden');
        toggleMessagesBtn.textContent = '−';
    } else {
        chatMessages.classList.add('hidden');
        toggleMessagesBtn.textContent = '+';
    }
}

function updateMessagesZoneVisibility() {
    if ((showMessagesZone && chatVisible) || editModeActive) {
        messagesZone.classList.add('visible');
    } else {
        messagesZone.classList.remove('visible');
    }
}

function applyZoneSettings(zoneId) {
    const zone = document.getElementById(zoneId);
    const settings = zoneSettings[zoneId];
    const rgb = hexToRgb(settings.color);
    
    zone.style.borderLeftColor = settings.color;
    
    if (zoneId === 'messages-zone') {
        zone.style.background = 'transparent';
        zone.style.height = settings.height;
        chatMessages.style.background = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${settings.opacity / 100})`;
        chatMessages.style.fontFamily = settings.font;
        chatMessages.style.fontSize = settings.fontSize + 'px';
    } else {
        zone.style.background = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${settings.opacity / 100})`;
    }
    
    zone.style.top = settings.top;
    zone.style.left = settings.left;
    zone.style.width = settings.width;
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 0, g: 212, b: 255 };
}

function createResizeHandles(zone) {
    const existing = zone.querySelectorAll('.resize-handle');
    existing.forEach(el => el.remove());
    
    const rightHandle = document.createElement('div');
    rightHandle.className = 'resize-handle resize-handle-right';
    rightHandle.dataset.zoneId = zone.id;
    rightHandle.dataset.resizeType = 'right';
    zone.appendChild(rightHandle);
    
    const bottomHandle = document.createElement('div');
    bottomHandle.className = 'resize-handle resize-handle-bottom';
    bottomHandle.dataset.zoneId = zone.id;
    bottomHandle.dataset.resizeType = 'bottom';
    zone.appendChild(bottomHandle);
    
    const cornerHandle = document.createElement('div');
    cornerHandle.className = 'resize-handle resize-handle-corner';
    cornerHandle.dataset.zoneId = zone.id;
    cornerHandle.dataset.resizeType = 'corner';
    zone.appendChild(cornerHandle);
}

function toggleEditMode() {
    editModeActive = !editModeActive;
    
    if (editModeActive) {
        editModeBtn.style.color = '#ff6b35';
        messagesZone.classList.add('visible');
        messagesZone.classList.add('editable');
        chatContainer.classList.add('visible');
        chatContainer.classList.add('editable');
        
        buttonsContainer.style.display = 'flex';
        chatInputContainer.style.display = 'none';
        announceSection.style.display = 'none';
        suggestionsContainer.style.display = 'none';
        
        messagesEditControls.style.display = 'flex';
        chatEditControls.style.display = 'flex';
        
        applyZoneSettings('messages-zone');
        applyZoneSettings('chat-container');
        createResizeHandles(messagesZone);
        createResizeHandles(chatContainer);
        updateEditControls('messages-zone');
        updateEditControls('chat-container');
    } else {
        editModeBtn.style.color = '#00d4ff';
        messagesZone.classList.remove('editable');
        chatContainer.classList.remove('editable');
        
        messagesEditControls.style.display = 'none';
        chatEditControls.style.display = 'none';
        
        messagesZone.querySelectorAll('.resize-handle').forEach(el => el.remove());
        chatContainer.querySelectorAll('.resize-handle').forEach(el => el.remove());
        
        messagesZone.classList.remove('visible');
        chatContainer.classList.remove('visible');
        
        if (chatVisible && chatMode === 'toggle') {
            chatInputContainer.style.display = 'flex';
            chatContainer.classList.add('visible');
            updateMessagesZoneVisibility();
        }
    }
}

function updateEditControls(zoneId) {
    const settings = zoneSettings[zoneId];
    
    if (zoneId === 'messages-zone') {
        messagesAutoShow.checked = settings.showAuto;
        messagesEditColor.value = settings.color;
        messagesEditOpacity.value = settings.opacity;
        messagesEditOpacityValue.textContent = settings.opacity;
        messagesEditFont.value = settings.font;
        messagesEditFontSize.value = settings.fontSize;
        messagesEditFontSizeValue.textContent = settings.fontSize;
    } else {
        chatShowMessagesZone.checked = showMessagesZone;
        chatEditColor.value = settings.color;
        chatEditOpacity.value = settings.opacity;
        chatEditOpacityValue.textContent = settings.opacity;
    }
}

function saveZoneSettings(zoneId) {
    const settings = zoneSettings[zoneId];
    const data = {
        type: zoneId,
        color: settings.color,
        opacity: settings.opacity,
        top: settings.top,
        left: settings.left,
        width: settings.width
    };
    
    if (zoneId === 'messages-zone') {
        data.height = settings.height;
        data.showAuto = settings.showAuto;
        data.font = settings.font;
        data.fontSize = settings.fontSize;
    }
    
    fetch(`https://chat/saveSettings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).catch(error => console.error('Failed to save settings:', error));
}

function startDrag(e, zoneId) {
    if (!editModeActive) return;
    
    draggedZone = document.getElementById(zoneId);
    const rect = draggedZone.getBoundingClientRect();
    dragOffsetX = e.clientX - rect.left;
    dragOffsetY = e.clientY - rect.top;
    
    draggedZone.style.zIndex = '2001';
}

function moveDrag(e) {
    if (!draggedZone || !editModeActive) return;
    
    draggedZone.style.top = (e.clientY - dragOffsetY) + 'px';
    draggedZone.style.left = (e.clientX - dragOffsetX) + 'px';
    draggedZone.style.transform = 'none';
}

function stopDrag(e) {
    if (!draggedZone) return;
    
    const zoneId = draggedZone.id;
    zoneSettings[zoneId].top = draggedZone.style.top || 'calc(50% + 140px)';
    zoneSettings[zoneId].left = draggedZone.style.left || '20px';
    saveZoneSettings(zoneId);
    
    draggedZone.style.zIndex = '1500';
    draggedZone = null;
}

function startResize(e) {
    if (!editModeActive) return;
    const handle = e.target.closest('.resize-handle');
    if (!handle) return;
    
    e.preventDefault();
    const zoneId = handle.dataset.zoneId;
    const zone = document.getElementById(zoneId);
    
    resizingZone = zone;
    resizeType = handle.dataset.resizeType;
    resizeStartX = e.clientX;
    resizeStartY = e.clientY;
    resizeStartWidth = zone.offsetWidth;
    resizeStartHeight = zone.offsetHeight;
    
    handle.classList.add('active');
}

function moveResize(e) {
    if (!resizingZone || !editModeActive) return;
    
    const deltaX = e.clientX - resizeStartX;
    const deltaY = e.clientY - resizeStartY;
    
    if (resizeType === 'right' || resizeType === 'corner') {
        const newWidth = resizeStartWidth + deltaX;
        if (newWidth > 100) {
            const percentWidth = Math.round((newWidth / window.innerWidth) * 100);
            resizingZone.style.width = percentWidth + '%';
        }
    }
    
    if (resizeType === 'bottom' || resizeType === 'corner') {
        const newHeight = resizeStartHeight + deltaY;
        if (newHeight > 50) {
            const percentHeight = Math.round((newHeight / window.innerHeight) * 100);
            resizingZone.style.height = percentHeight + '%';
        }
    }
}

function stopResize(e) {
    if (!resizingZone) return;
    
    const zoneId = resizingZone.id;
    const width = resizingZone.style.width || zoneSettings[zoneId].width;
    const height = resizingZone.style.height || zoneSettings[zoneId].height;
    
    zoneSettings[zoneId].width = width;
    if (zoneId === 'messages-zone') {
        zoneSettings[zoneId].height = height;
    }
    
    saveZoneSettings(zoneId);
    
    document.querySelectorAll('.resize-handle.active').forEach(h => h.classList.remove('active'));
    resizingZone = null;
    resizeType = null;
}

function sendMessage() {
    const message = chatInput.value.trim();
    
    if (!message) return;
    
    const fullMessage = inputPrefix + message;
    const isCommand = fullMessage.startsWith('/');
    addMessageToChat(fullMessage, isCommand);
    
    fetch(`https://chat/chatResult`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: fullMessage,
            canceled: false
        })
    }).then(() => {
        chatInput.value = '';
        if (chatMode === 'prefix') {
            inputPrefix = '';
            messagesZone.classList.remove('visible');
            chatContainer.classList.remove('visible');
            buttonsContainer.style.display = 'none';
            chatInputContainer.style.display = 'none';
            chatVisible = false;
            chatMode = null;
            focusInInput = false;
        } else if (chatMode === 'toggle') {
            chatInput.focus();
        }
    }).catch(error => console.error('Failed to send chat message:', error));
}

function closeChatInput() {
    chatInputContainer.style.display = 'none';
    buttonsContainer.style.display = 'none';
    messagesZone.classList.remove('visible');
    chatContainer.classList.remove('visible');
    chatInput.value = '';
    inputPrefix = '';
    chatVisible = false;
    chatMode = null;
    focusInInput = false;
    
    fetch(`https://chat/chatResult`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            canceled: true
        })
    });
}

function openChatWithPrefix(prefix) {
    chatContainer.classList.add('visible');
    buttonsContainer.style.display = 'flex';
    chatInputContainer.style.display = 'flex';
    inputPrefix = prefix;
    chatInput.value = '';
    chatVisible = true;
    chatMode = 'prefix';
    updateMessagesZoneVisibility();
    chatInput.focus();
}

function filterSuggestions(input) {
    if (!input || input.length === 0) {
        suggestionsContainer.style.display = 'none';
        return;
    }
    
    const filtered = Array.from(suggestions.values()).filter(s => {
        return s.name.toLowerCase().startsWith(input.toLowerCase());
    }).slice(0, 5);
    
    if (filtered.length === 0) {
        suggestionsContainer.style.display = 'none';
        return;
    }
    
    suggestionsList.innerHTML = '';
    filtered.forEach(suggestion => {
        const item = document.createElement('div');
        item.className = 'suggestion-item';
        
        const nameEl = document.createElement('div');
        nameEl.className = 'suggestion-name';
        nameEl.textContent = suggestion.name;
        item.appendChild(nameEl);
        
        if (suggestion.help) {
            const helpEl = document.createElement('div');
            helpEl.className = 'suggestion-help';
            helpEl.textContent = suggestion.help;
            item.appendChild(helpEl);
        }
        
        if (suggestion.params && suggestion.params.length > 0) {
            const paramsEl = document.createElement('div');
            paramsEl.className = 'suggestion-params';
            paramsEl.textContent = suggestion.params.join(', ');
            item.appendChild(paramsEl);
        }
        
        item.addEventListener('click', () => {
            const prefix = chatMode === 'toggle' ? '/' : '';
            chatInput.value = prefix + suggestion.name + ' ';
            chatInput.focus();
            filterSuggestions(chatInput.value.split(' ').pop());
        });
        
        suggestionsList.appendChild(item);
    });
    
    suggestionsContainer.style.display = 'block';
}

function openAnnounceModal() {
    if (!hasAnnouncePermission) return;
    
    announceFormData = {
        importance: 'info',
        target: 'all',
        targetPlayer: null,
        duration: 5,
        message: '',
        formatting: {
            bold: false,
            italic: false,
            underline: false,
            color: '#ffffff'
        }
    };
    
    announceTextarea.value = '';
    announceDurationInput.value = '5';
    announceCharCount.textContent = '0';
    
    announceImportanceBtns.forEach((btn, idx) => btn.classList.remove('active'));
    announceImportanceBtns[0].classList.add('active');
    
    announceTargetRadios[0].checked = true;
    if (announcePlayerSelect) announcePlayerSelect.style.display = 'none';
    
    announceFormatBtns.forEach(btn => btn.classList.remove('active'));
    updateAnnouncePreview();
    
    chatInputContainer.style.display = 'none';
    suggestionsContainer.style.display = 'none';
    announceSection.style.display = 'flex';
    announceTextarea.focus();
}

function closeAnnounceModal() {
    announceSection.style.display = 'none';
    chatInputContainer.style.display = 'flex';
}

function showAdminPanel(historyData) {
    adminPanel.classList.add('active');
    adminPlayerName.textContent = historyData.playerName;
    currentAdminPlayerId = historyData.playerId;
    
    adminHistory.innerHTML = '';
    
    if (historyData.messages && historyData.messages.length > 0) {
        historyData.messages.forEach(msg => {
            const messageEl = document.createElement('div');
            messageEl.className = 'admin-message';
            
            const timeEl = document.createElement('span');
            timeEl.className = 'admin-message-time';
            const date = new Date(msg.created_at);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            timeEl.textContent = `${day}/${month}/${year} ${hours}:${minutes}`;
            
            const contentEl = document.createElement('span');
            contentEl.textContent = msg.message;
            
            messageEl.appendChild(timeEl);
            messageEl.appendChild(contentEl);
            adminHistory.appendChild(messageEl);
        });
    } else {
        adminHistory.innerHTML = '<div style="text-align: center; color: #888;">Aucun message trouvé</div>';
    }
}

function closeAdminPanel() {
    adminPanel.classList.remove('active');
    currentAdminPlayerId = null;
}

function showAdminPanelPlayers(data) {
    adminPanelData = data;
    adminPanelPlayers.classList.add('active');
    adminDisplayedPlayers = data.players || [];
    adminSearchInput.value = '';
    currentFilterMode = 'all';
    filterAllBtn.classList.add('active');
    filterMutedBtn.classList.remove('active');
    filterUnmutedBtn.classList.remove('active');
    
    selectedPlayerIdInPanel = null;
    selectedPlayerName.textContent = 'Sélectionnez un joueur';
    selectedPlayerId.textContent = '';
    adminPlayerHistory.innerHTML = '';
    adminPlayerMuteBtn.textContent = 'Mute';
    adminPlayerMuteBtn.classList.remove('unmute-btn');
    adminMuteDurationInput.style.display = 'inline-block';
    adminMuteReasonInput.style.display = 'inline-block';
    adminMuteDurationInput.value = '30';
    adminMuteReasonInput.value = '';
    adminMessageBox.style.display = 'none';
    
    document.querySelectorAll('.player-item').forEach(el => el.classList.remove('active'));
    
    displayAdminPlayersList(adminDisplayedPlayers);
}

function displayAdminPlayersList(players) {
    adminPlayersList.innerHTML = '';
    
    if (players && players.length > 0) {
        const sorted = [...players].sort((a, b) => {
            const aMuted = adminPanelData.muteStatuses && adminPanelData.muteStatuses[a.identifier] && adminPanelData.muteStatuses[a.identifier].isMuted;
            const bMuted = adminPanelData.muteStatuses && adminPanelData.muteStatuses[b.identifier] && adminPanelData.muteStatuses[b.identifier].isMuted;
            if (aMuted === bMuted) return a.id - b.id;
            return bMuted ? -1 : 1;
        });
        
        sorted.forEach(player => {
            const playerEl = document.createElement('div');
            const muteStatus = adminPanelData.muteStatuses && adminPanelData.muteStatuses[player.identifier];
            const isMuted = muteStatus && muteStatus.isMuted;
            
            playerEl.className = 'player-item' + (isMuted ? ' muted' : '');
            
            const nameEl = document.createElement('div');
            nameEl.className = 'player-item-name';
            nameEl.textContent = player.name + (isMuted ? ' 🔇' : '');
            
            const idEl = document.createElement('div');
            idEl.className = 'player-item-id';
            idEl.textContent = `ID: ${player.id}`;
            
            playerEl.appendChild(nameEl);
            playerEl.appendChild(idEl);
            
            if (isMuted && muteStatus.mutedUntil) {
                const timeRemaining = Math.ceil((muteStatus.mutedUntil - Math.floor(Date.now() / 1000)) / 60);
                const muteInfoEl = document.createElement('div');
                muteInfoEl.className = 'player-mute-info';
                muteInfoEl.textContent = `Muté: ${timeRemaining}m par ${muteStatus.mutedBy}`;
                playerEl.appendChild(muteInfoEl);
            }
            
            playerEl.addEventListener('click', (clickEvent) => {
                document.querySelectorAll('.player-item').forEach(el => el.classList.remove('active'));
                clickEvent.currentTarget.classList.add('active');
                selectPlayerInPanel(player.id, player.name, player.identifier, adminPanelData.histories[player.identifier], muteStatus);
            });
            
            adminPlayersList.appendChild(playerEl);
        });
    } else {
        adminPlayersList.innerHTML = '<div style="padding: 20px; text-align: center; color: rgba(255, 255, 255, 0.5);">Aucun joueur trouvé</div>';
    }
}

function applyAdminFilter() {
    let filtered = [...adminDisplayedPlayers];
    
    if (currentFilterMode === 'muted') {
        filtered = filtered.filter(player => {
            const muteStatus = adminPanelData.muteStatuses && adminPanelData.muteStatuses[player.identifier];
            return muteStatus && muteStatus.isMuted;
        });
    } else if (currentFilterMode === 'unmuted') {
        filtered = filtered.filter(player => {
            const muteStatus = adminPanelData.muteStatuses && adminPanelData.muteStatuses[player.identifier];
            return !muteStatus || !muteStatus.isMuted;
        });
    }
    
    displayAdminPlayersList(filtered);
}

function showAdminMessage(message, type = 'success') {
    adminMessageBox.textContent = message;
    adminMessageBox.className = 'admin-message-notification ' + type;
    adminMessageBox.style.display = 'block';
    
    if (type === 'success') {
        setTimeout(() => {
            adminMessageBox.style.display = 'none';
        }, 4000);
    }
}

function selectPlayerInPanel(playerId, playerName, identifier, history, muteStatus) {
    selectedPlayerIdInPanel = playerId;
    
    selectedPlayerName.textContent = playerName;
    selectedPlayerId.textContent = `ID: ${playerId} | ${identifier}`;
    
    adminMessageBox.style.display = 'none';
    
    if (unmuteUnlistener) {
        adminPlayerMuteBtn.removeEventListener('click', unmuteUnlistener);
        unmuteUnlistener = null;
    }
    
    if (muteStatus && muteStatus.isMuted) {
        const timeRemaining = Math.ceil((muteStatus.mutedUntil - Math.floor(Date.now() / 1000)) / 60);
        adminPlayerMuteBtn.textContent = `Unmute (${timeRemaining}m restant - par ${muteStatus.mutedBy})`;
        adminPlayerMuteBtn.classList.add('unmute-btn');
        
        unmuteUnlistener = () => {
            adminPlayerMuteBtn.disabled = true;
            fetch(`https://chat/unmute`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ playerId: playerId })
            }).then(response => {
                adminPlayerMuteBtn.disabled = false;
                if (response.ok) {
                    showAdminMessage('✓ Joueur démuté avec succès', 'success');
                    adminPanelData.muteStatuses[identifier] = { isMuted: false };
                    selectPlayerInPanel(playerId, playerName, identifier, history, { isMuted: false });
                    applyAdminFilter();
                } else {
                    showAdminMessage('✗ Erreur lors du démute', 'error');
                }
            }).catch(error => {
                adminPlayerMuteBtn.disabled = false;
                showAdminMessage('✗ Erreur lors du démute', 'error');
            });
        };
        
        adminPlayerMuteBtn.addEventListener('click', unmuteUnlistener);
        
        adminMuteDurationInput.style.display = 'none';
        adminMuteReasonInput.style.display = 'none';
        adminMuteDurationInput.value = '30';
        adminMuteReasonInput.value = '';
    } else {
        adminPlayerMuteBtn.textContent = 'Mute';
        adminPlayerMuteBtn.classList.remove('unmute-btn');
        adminPlayerMuteBtn.disabled = false;
        
        adminMuteDurationInput.style.display = 'inline-block';
        adminMuteReasonInput.style.display = 'inline-block';
        adminMuteDurationInput.value = '30';
        adminMuteReasonInput.value = '';
    }
    
    adminPlayerHistory.innerHTML = '';
    
    if (history && history.length > 0) {
        history.forEach(msg => {
            const messageEl = document.createElement('div');
            messageEl.className = 'admin-message';
            
            const timeEl = document.createElement('span');
            timeEl.className = 'admin-message-time';
            const date = new Date(msg.created_at);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            timeEl.textContent = `${day}/${month}/${year} ${hours}:${minutes}`;
            
            const contentEl = document.createElement('span');
            contentEl.textContent = msg.message;
            
            messageEl.appendChild(timeEl);
            messageEl.appendChild(contentEl);
            adminPlayerHistory.appendChild(messageEl);
        });
    } else {
        adminPlayerHistory.innerHTML = '<div style="text-align: center; color: #888;">Aucun message trouvé</div>';
    }
}

function closeAdminPanelPlayers() {
    adminPanelPlayers.classList.remove('active');
    selectedPlayerIdInPanel = null;
    adminPanelData = null;
    
    selectedPlayerName.textContent = 'Sélectionnez un joueur';
    selectedPlayerId.textContent = '';
    adminPlayerHistory.innerHTML = '';
    adminPlayerMuteBtn.textContent = 'Mute';
    adminPlayerMuteBtn.classList.remove('unmute-btn');
    adminMuteDurationInput.style.display = 'inline-block';
    adminMuteReasonInput.style.display = 'inline-block';
    adminMuteDurationInput.value = '30';
    adminMuteReasonInput.value = '';
    adminMessageBox.style.display = 'none';
    
    if (unmuteUnlistener) {
        adminPlayerMuteBtn.removeEventListener('click', unmuteUnlistener);
        unmuteUnlistener = null;
    }
    
    fetch(`https://chat/closeAdminPanel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
    });
}

function updateAnnouncePreview() {
    const importance = announceFormData.importance;
    const message = announceFormData.message;
    const iconMap = {
        'info': 'ℹ️',
        'success': '✅',
        'warning': '⚠️',
        'error': '❌',
        'critical': '🔴'
    };
    
    let displayText = message || t('announce.message').toLowerCase();
    if (announceFormData.formatting.bold) displayText = `<strong>${displayText}</strong>`;
    if (announceFormData.formatting.italic) displayText = `<em>${displayText}</em>`;
    if (announceFormData.formatting.underline) displayText = `<u>${displayText}</u>`;
    
    const displayTextWithLineBreaks = displayText.replace(/\\n/g, '<br>').replace(/\n/g, '<br>');
    
    if (announcePreviewContent) {
        announcePreviewContent.innerHTML = `<div style="display: flex; gap: 10px; align-items: center; justify-content: center;">
            <span>${iconMap[importance]}</span>
            <div>${displayTextWithLineBreaks}</div>
        </div>`;
    }
}

function showAdvancedAnnouncement(data) {
    try {
        console.log('[showAdvancedAnnouncement] ========= CALLED ==========');
        console.log('[showAdvancedAnnouncement] data:', data);
        console.log('[showAdvancedAnnouncement] data.message:', data.message);
        console.log('[showAdvancedAnnouncement] data.message type:', typeof data.message);
        console.log('[showAdvancedAnnouncement] data.message JSON:', JSON.stringify(data.message));
        console.log('[showAdvancedAnnouncement] data.message keys:', Object.keys(data.message || {}));
        
        if (typeof data === 'string') {
            data = {
                importance: 'info',
                message: data,
                duration: 5,
                formatting: {}
            };
        }
        
        if (!data) data = {};
        if (!data.importance) data.importance = 'info';
        if (!data.formatting) data.formatting = {};
        
        const iconMap = {
        'info': 'ℹ️',
        'success': '✅',
        'warning': '⚠️',
        'error': '❌',
        'critical': '🔴'
    };
    
    const announcement = document.createElement('div');
    announcement.className = `announcement-display ${data.importance || 'info'}`;
    
    let messageText = '';
    
    if (typeof data.message === 'string') {
        messageText = data.message;
    } else if (!data.message) {
        messageText = '';
    } else if (typeof data.message === 'object') {
        if (Array.isArray(data.message)) {
            messageText = data.message.join(' ');
        } else if (data.message.text) {
            messageText = data.message.text;
        } else if (data.message.content) {
            messageText = data.message.content;
        } else if (data.message.value) {
            messageText = data.message.value;
        } else {
            for (let key in data.message) {
                if (typeof data.message[key] === 'string' && data.message[key].length > 0) {
                    messageText = data.message[key];
                    break;
                }
            }
        }
    } else {
        messageText = String(data.message);
    }
    
    if (data.formatting && typeof data.formatting === 'object') {
        if (data.formatting.bold === true) messageText = `<strong>${messageText}</strong>`;
        if (data.formatting.italic === true) messageText = `<em>${messageText}</em>`;
        if (data.formatting.underline === true) messageText = `<u>${messageText}</u>`;
        if (data.formatting.color && typeof data.formatting.color === 'string') announcement.style.color = data.formatting.color;
    }
    
    const contentWithLineBreaks = messageText.replace(/\\n/g, '<br>').replace(/\n/g, '<br>');
    announcement.innerHTML = `
        <div class="announcement-icon">${iconMap[data.importance]}</div>
        <div class="announcement-content">
            <div class="announcement-title">Message Staff</div>
            <div class="announcement-message">${contentWithLineBreaks}</div>
        </div>
    `;
    
    console.log('[showAdvancedAnnouncement] textsContainer:', textsContainer);
    if (!textsContainer) {
        console.error('[showAdvancedAnnouncement] ERROR: textsContainer is null!');
        return;
    }
    
    textsContainer.appendChild(announcement);
    
    const duration = (data.duration || 5) * 1000;
    
    setTimeout(() => {
        announcement.style.animation = 'announceSlideOut 0.4s ease forwards';
        setTimeout(() => {
            announcement.remove();
        }, 400);
    }, duration);
    } catch (error) {
        console.error('[showAdvancedAnnouncement] Error:', error);
    }
}

function submitAnnounce() {
    const message = announceTextarea.value.trim();
    
    if (!message) {
        alert(t('modals.announcePlaceholder'));
        return;
    }
    
    if (message.length > 500) {
        alert('Message trop long (max 500 caractères)');
        return;
    }
    
    announceFormData.message = message;
    announceFormData.target = announceTargetRadios[0].checked ? 'all' : 'specific';
    announceFormData.targetPlayer = (announcePlayerSelect && announcePlayerSelect.value) || null;
    announceFormData.duration = parseInt(announceDurationInput.value) || 5;
    
    fetch(`https://chat/submitAnnounce`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(announceFormData)
    }).catch(error => console.error('Failed to submit announcement:', error));
    
    closeAnnounceModal();
}

window.addEventListener('message', (event) => {
    const data = event.data;
    
    if (!data.type) return;
    
    console.log('[NUI] Received message:', data.type);
    
    switch (data.type) {
        case CHAT_EVENTS.OPEN:
            if (!chatVisible || chatMode !== 'toggle') {
                chatContainer.classList.add('visible');
                buttonsContainer.style.display = 'flex';
                chatInputContainer.style.display = 'flex';
                inputPrefix = '';
                chatInput.value = '';
                chatVisible = true;
                chatMode = 'toggle';
                updateMessagesZoneVisibility();
            } else {
                chatContainer.classList.remove('visible');
                buttonsContainer.style.display = 'none';
                chatInputContainer.style.display = 'none';
                chatVisible = false;
                chatMode = null;
                focusInInput = false;
                updateMessagesZoneVisibility();
            }
            break;
            
        case CHAT_EVENTS.CLOSE:
            chatContainer.classList.remove('visible');
            buttonsContainer.style.display = 'none';
            chatInputContainer.style.display = 'none';
            chatVisible = false;
            updateMessagesZoneVisibility();
            break;
            
        case CHAT_EVENTS.OPEN_WITH_PREFIX:
            openChatWithPrefix(data.prefix);
            break;
            
        case CHAT_EVENTS.OPEN_ANNOUNCE:
            openAnnounceModal();
            break;
            
        case CHAT_EVENTS.UPDATE_PERMISSIONS:
            hasAnnouncePermission = data.hasAnnouncePermission;
            isAdmin = data.isAdmin || false;
            announceBtn.style.display = hasAnnouncePermission ? 'block' : 'none';
            serverPrintControl.style.display = isAdmin ? 'block' : 'none';
            if (isAdmin) {
                messagesServerPrint.checked = showServerPrint;
            }
            break;
            
        case CHAT_EVENTS.UPDATE_CONFIG:
            config = data.config;
            applyChatPosition(config.Position?.x || 0, config.Position?.y || 0);
            break;
            
        case CHAT_EVENTS.SHOW_ANNOUNCEMENT:
            console.log('[SHOW_ANNOUNCEMENT] Full data:', JSON.stringify(data));
            console.log('[SHOW_ANNOUNCEMENT] data.data:', data.data);
            console.log('[SHOW_ANNOUNCEMENT] data.data keys:', data.data ? Object.keys(data.data) : 'none');
            console.log('[SHOW_ANNOUNCEMENT] About to call showAdvancedAnnouncement with:', JSON.stringify(data.data));
            try {
                if (data.data) {
                    showAdvancedAnnouncement(data.data);
                } else if (data.message) {
                    showAdvancedAnnouncement(data.message);
                }
            } catch (error) {
                console.error('[SHOW_ANNOUNCEMENT] ERROR:', error);
            }
            break;
            
        case CHAT_EVENTS.UPDATE_TEXT_POSITION:
            updateTextPosition(data.textId, data.x, data.y, data.text, data.textType);
            break;
            
        case CHAT_EVENTS.REMOVE_TEXT:
            removeText(data.textId);
            break;
            
        case CHAT_EVENTS.ADD_SUGGESTION:
            suggestions.set(data.suggestion.name, data.suggestion);
            break;
            
        case CHAT_EVENTS.REMOVE_SUGGESTION:
            suggestions.delete(data.name);
            break;
            
        case CHAT_EVENTS.ADD_MESSAGE:
            addMessageToChat(data.message, data.isCommand || false);
            break;
            
        case CHAT_EVENTS.SHOW_ADMIN_HISTORY:
            showAdminPanel(data.data);
            break;
            
        case CHAT_EVENTS.SHOW_MUTE_MESSAGE:
            showMuteNotification(data.timeRemaining);
            break;
            
        case CHAT_EVENTS.OPEN_ADMIN_PANEL:
            showAdminPanelPlayers(data.data);
            break;
            
        case 'LOAD_ZONE_SETTINGS':
            if (data.settings && data.zoneId) {
                zoneSettings[data.zoneId] = {
                    color: data.settings.color || zoneSettings[data.zoneId].color,
                    opacity: data.settings.opacity || zoneSettings[data.zoneId].opacity,
                    top: data.settings.top || zoneSettings[data.zoneId].top,
                    left: data.settings.left || zoneSettings[data.zoneId].left,
                    width: data.settings.width || zoneSettings[data.zoneId].width,
                    height: data.settings.height || zoneSettings[data.zoneId].height,
                    showAuto: data.settings.showAuto !== undefined ? data.settings.showAuto : zoneSettings[data.zoneId].showAuto
                };
                applyZoneSettings(data.zoneId);
            }
            break;
    }
});

function showMuteNotification(timeRemaining) {
    const notification = document.createElement('div');
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(255, 107, 53, 0.95);
        color: #fff;
        padding: 15px 25px;
        border-radius: 4px;
        border-left: 4px solid #ff0000;
        box-shadow: 0 0 20px rgba(255, 0, 0, 0.4);
        max-width: 600px;
        word-wrap: break-word;
        z-index: 2001;
        font-size: 14px;
        font-weight: bold;
        animation: slideDown 0.3s ease;
    `;
    
    notification.textContent = `Vous êtes mute pour ${minutes}m ${seconds}s`;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transition = 'opacity 0.3s ease';
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

meBtn.addEventListener('click', () => {
    fetch(`https://chat/meCommand`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
    });
});

doBtn.addEventListener('click', () => {
    fetch(`https://chat/doCommand`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
    });
});

announceBtn.addEventListener('click', () => {
    console.log('[announceBtn] Clicked, fetching players...');
    fetch(`https://chat/getPlayersForAnnounce`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
    }).then(response => {
        console.log('[announceBtn] Response status:', response.status);
        return response.json();
    })
      .then(data => {
          console.log('[announceBtn] Received data:', data, 'type:', typeof data);
          const playersList = Array.isArray(data) ? data : (data && data.data ? data.data : []);
          allPlayers = playersList;
          console.log('[announceBtn] allPlayers count:', allPlayers.length);
          if (announcePlayerSelect) {
              announcePlayerSelect.innerHTML = '<option value="" selected>' + t('announce.selectPlayer') + '</option>';
              allPlayers.forEach(player => {
                  console.log('[announceBtn] Adding player:', player.name, 'ID:', player.id);
                  const option = document.createElement('option');
                  option.value = player.id;
                  option.textContent = `${player.name} (ID: ${player.id})`;
                  announcePlayerSelect.appendChild(option);
              });
          }
          openAnnounceModal();
      })
      .catch(error => {
          console.error('[announceBtn] Failed to fetch players:', error);
          allPlayers = [];
          if (announcePlayerSelect) {
              announcePlayerSelect.innerHTML = '<option value="" selected>' + t('announce.selectPlayer') + '</option>';
          }
          openAnnounceModal();
      });
});

sendBtn.addEventListener('click', sendMessage);

chatInput.addEventListener('focus', () => {
    focusInInput = true;
});

chatInput.addEventListener('blur', () => {
    focusInInput = false;
});

chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    } else if (e.key === 'Escape') {
        closeChatInput();
    }
});

chatContainer.addEventListener('keydown', (e) => {
    if (e.key === 't' && chatVisible && chatMode === 'toggle' && !focusInInput) {
        e.preventDefault();
        closeChatInput();
    }
});

chatInput.addEventListener('input', (e) => {
    const text = e.target.value;
    let lastWord = text.split(' ').pop();
    if (lastWord.startsWith('/')) {
        lastWord = lastWord.substring(1);
    }
    filterSuggestions(lastWord);
});

announceSendBtn.addEventListener('click', submitAnnounce);

announceCancelBtn.addEventListener('click', closeAnnounceModal);

announceCloseBtn.addEventListener('click', closeAnnounceModal);

announceImportanceBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        announceImportanceBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        announceFormData.importance = btn.dataset.importance;
        updateAnnouncePreview();
    });
});

function initializePlayerSearch() {
    if (!announcePlayerSelect) return;
    
    const container = announcePlayerSelect.parentElement;
    const searchContainer = document.getElementById('announce-player-search-container');
    const searchInput = document.getElementById('announce-player-search');
    const playerList = document.getElementById('announce-player-list');
    
    if (searchInput && playerList) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            playerList.innerHTML = '';
            
            if (!searchTerm) {
                const noResults = document.createElement('div');
                noResults.style.cssText = 'padding: 8px; color: rgba(255, 255, 255, 0.6); text-align: center;';
                noResults.textContent = 'Entrez ID ou nom...';
                playerList.appendChild(noResults);
                return;
            }
            
            const filtered = allPlayers.filter(player => 
                player.id.toString().includes(searchTerm) || 
                player.name.toLowerCase().includes(searchTerm)
            );
            
            if (filtered.length === 0) {
                const noResults = document.createElement('div');
                noResults.style.cssText = 'padding: 8px; color: rgba(255, 255, 255, 0.6); text-align: center;';
                noResults.textContent = 'Aucun joueur trouvé';
                playerList.appendChild(noResults);
                return;
            }
            
            filtered.forEach(player => {
                const playerItem = document.createElement('div');
                playerItem.style.cssText = 'padding: 8px 10px; cursor: pointer; border-bottom: 1px solid rgba(255, 107, 53, 0.2); transition: all 0.2s ease;';
                playerItem.innerHTML = `<span style="color: #ff6b35; font-weight: bold;">${player.id}</span> - <span style="color: #fff;">${player.name}</span>`;
                playerItem.addEventListener('mouseover', () => {
                    playerItem.style.background = 'rgba(255, 107, 53, 0.2)';
                });
                playerItem.addEventListener('mouseout', () => {
                    playerItem.style.background = 'transparent';
                });
                playerItem.addEventListener('click', () => {
                    announcePlayerSelect.value = player.id;
                    announceFormData.targetPlayer = player.id;
                    searchInput.value = `${player.name} (ID: ${player.id})`;
                    playerList.innerHTML = '';
                    const selected = document.createElement('div');
                    selected.style.cssText = 'padding: 8px; color: #4caf50; text-align: center; font-weight: bold;';
                    selected.textContent = '✓ Sélectionné';
                    playerList.appendChild(selected);
                });
                playerList.appendChild(playerItem);
            });
        });
    }
}

announceTargetRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
        const searchContainer = document.getElementById('announce-player-search-container');
        const selectElement = document.getElementById('announce-player-select');
        if (searchContainer) {
            if (e.target.value === 'specific') {
                searchContainer.style.display = 'block';
                initializePlayerSearch();
            } else {
                searchContainer.style.display = 'none';
            }
        } else if (selectElement) {
            if (e.target.value === 'specific') {
                selectElement.style.display = 'block';
            } else {
                selectElement.style.display = 'none';
            }
        }
    });
});

announceFormatBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const format = btn.dataset.format;
        
        if (format === 'color') {
            const colorInput = document.createElement('input');
            colorInput.type = 'color';
            colorInput.value = announceFormData.formatting.color;
            colorInput.addEventListener('change', (e) => {
                announceFormData.formatting.color = e.target.value;
                btn.style.background = e.target.value;
            });
            colorInput.click();
        } else {
            announceFormData.formatting[format] = !announceFormData.formatting[format];
            btn.classList.toggle('active');
        }
        
        updateAnnouncePreview();
    });
});

announceTextarea.addEventListener('input', (e) => {
    announceFormData.message = e.target.value;
    announceCharCount.textContent = e.target.value.length;
    updateAnnouncePreview();
});

announceDurationInput.addEventListener('input', (e) => {
    announceFormData.duration = parseInt(e.target.value) || 1;
});

if (announcePlayerSelect) {
    announcePlayerSelect.addEventListener('change', (e) => {
        announceFormData.targetPlayer = e.target.value;
    });
}

announceTextarea.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeAnnounceModal();
    }
});

toggleMessagesBtn.addEventListener('click', () => {
    messagesVisible = !messagesVisible;
    localStorage.setItem('chatMessagesVisible', messagesVisible);
    updateMessagesVisibility();
    
    if (autoHideTimeout) {
        clearTimeout(autoHideTimeout);
        autoHideTimeout = null;
    }
});

announceTextarea.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeAnnounceModal();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && chatVisible) {
        closeChatInput();
    }
});

editModeBtn.addEventListener('click', toggleEditMode);

messagesZone.addEventListener('mousedown', (e) => {
    if (editModeActive && e.button === 0) startDrag(e, 'messages-zone');
});

messagesZone.addEventListener('dblclick', () => openEditPanel('messages-zone'));

chatContainer.addEventListener('mousedown', (e) => {
    if (editModeActive && e.button === 0 && e.target === chatContainer) startDrag(e, 'chat-container');
});

document.addEventListener('mousemove', moveDrag);
document.addEventListener('mouseup', stopDrag);

document.addEventListener('mousedown', startResize);
document.addEventListener('mousemove', moveResize);
document.addEventListener('mouseup', stopResize);

messagesEditColor.addEventListener('input', (e) => {
    const rgb = hexToRgb(e.target.value);
    zoneSettings['messages-zone'].color = e.target.value;
    messagesZone.style.borderLeftColor = e.target.value;
    chatMessages.style.background = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${parseInt(messagesEditOpacity.value) / 100})`;
    saveZoneSettings('messages-zone');
});

messagesEditOpacity.addEventListener('input', (e) => {
    messagesEditOpacityValue.textContent = e.target.value;
    zoneSettings['messages-zone'].opacity = parseInt(e.target.value);
    const rgb = hexToRgb(messagesEditColor.value);
    chatMessages.style.background = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${parseInt(e.target.value) / 100})`;
    saveZoneSettings('messages-zone');
});

messagesAutoShow.addEventListener('change', (e) => {
    zoneSettings['messages-zone'].showAuto = e.target.checked;
});

messagesEditFont.addEventListener('change', (e) => {
    zoneSettings['messages-zone'].font = e.target.value;
    chatMessages.style.fontFamily = e.target.value;
    saveZoneSettings('messages-zone');
});

messagesEditFontSize.addEventListener('input', (e) => {
    messagesEditFontSizeValue.textContent = e.target.value;
    zoneSettings['messages-zone'].fontSize = parseInt(e.target.value);
    chatMessages.style.fontSize = e.target.value + 'px';
    saveZoneSettings('messages-zone');
});

messagesServerPrint.addEventListener('change', (e) => {
    showServerPrint = e.target.checked;
    localStorage.setItem('showServerPrint', showServerPrint);
    fetch(`https://chat/toggleServerPrint`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: showServerPrint })
    });
});



messagesEditReset.addEventListener('click', () => {
    zoneSettings['messages-zone'].color = '#363636';
    zoneSettings['messages-zone'].opacity = 26;
    zoneSettings['messages-zone'].top = '152.5px';
    zoneSettings['messages-zone'].left = '1373px';
    zoneSettings['messages-zone'].width = '28%';
    zoneSettings['messages-zone'].height = '62%';
    zoneSettings['messages-zone'].showAuto = true;
    zoneSettings['messages-zone'].font = 'Segoe UI';
    zoneSettings['messages-zone'].fontSize = 12;
    messagesAutoShow.checked = true;
    
    saveZoneSettings('messages-zone');
    applyZoneSettings('messages-zone');
    messagesZone.style.transform = '';
    updateEditControls('messages-zone');
});

chatEditColor.addEventListener('input', (e) => {
    const rgb = hexToRgb(e.target.value);
    zoneSettings['chat-container'].color = e.target.value;
    chatContainer.style.borderLeftColor = e.target.value;
    chatContainer.style.background = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${parseInt(chatEditOpacity.value) / 100})`;
    saveZoneSettings('chat-container');
});

chatEditOpacity.addEventListener('input', (e) => {
    chatEditOpacityValue.textContent = e.target.value;
    zoneSettings['chat-container'].opacity = parseInt(e.target.value);
    const rgb = hexToRgb(chatEditColor.value);
    chatContainer.style.background = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${parseInt(e.target.value) / 100})`;
    saveZoneSettings('chat-container');
});

chatShowMessagesZone.addEventListener('change', (e) => {
    showMessagesZone = e.target.checked;
    localStorage.setItem('showMessagesZone', showMessagesZone);
    if (!editModeActive) {
        updateMessagesZoneVisibility();
    }
});

chatEditReset.addEventListener('click', () => {
    showMessagesZone = true;
    localStorage.setItem('showMessagesZone', showMessagesZone);
    zoneSettings['chat-container'].color = '#363636';
    zoneSettings['chat-container'].opacity = 50;
    zoneSettings['chat-container'].top = '487.5px';
    zoneSettings['chat-container'].left = '17px';
    zoneSettings['chat-container'].width = '24%';
    chatShowMessagesZone.checked = true;
    
    saveZoneSettings('chat-container');
    applyZoneSettings('chat-container');
    chatContainer.style.transform = '';
    updateEditControls('chat-container');
    updateMessagesZoneVisibility();
});

function showAnnouncement(message, duration = 5000) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(255, 107, 53, 0.95);
        color: #fff;
        padding: 15px 25px;
        border-radius: 4px;
        border-left: 4px solid #ff6b35;
        box-shadow: 0 0 20px rgba(255, 107, 53, 0.4);
        max-width: 600px;
        word-wrap: break-word;
        z-index: 2000;
        font-size: 14px;
        font-weight: bold;
        animation: slideDown 0.3s ease;
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideDown {
            from {
                transform: translateX(-50%) translateY(-100px);
                opacity: 0;
            }
            to {
                transform: translateX(-50%) translateY(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
    
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transition = 'opacity 0.3s ease';
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

function updateTextPosition(textId, x, y, text, textType) {
    let element = activeTexts.get(textId);
    
    if (!element) {
        element = document.createElement('div');
        element.className = `floating-text ${textType}`;
        
        const icon = document.createElement('span');
        icon.className = 'text-icon';
        icon.textContent = textType === 'me' ? '💭' : '⚡';
        
        const content = document.createElement('span');
        content.className = 'text-content';
        content.textContent = text;
        
        element.appendChild(icon);
        element.appendChild(content);
        
        textsContainer.appendChild(element);
        activeTexts.set(textId, element);
    }
    
    element.style.left = x + 'px';
    element.style.top = y + 'px';
}

function removeText(textId) {
    const element = activeTexts.get(textId);
    if (element) {
        element.style.animation = 'fadeOut 0.3s ease forwards';
        setTimeout(() => {
            element.remove();
            activeTexts.delete(textId);
        }, 300);
    }
}

function GetParentResourceName() {
    return 'chat';
}

adminCloseBtn.addEventListener('click', closeAdminPanel);

adminPanel.addEventListener('click', (e) => {
    if (e.target === adminPanel) {
        closeAdminPanel();
    }
});

adminMuteBtn.addEventListener('click', () => {
    const duration = muteDurationInput.value || 30;
    const reason = muteReasonInput.value || 'No reason provided';
    
    if (currentAdminPlayerId) {
        fetch(`https://chat/mute`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                playerId: currentAdminPlayerId,
                duration: duration,
                reason: reason
            })
        }).then(() => {
            muteDurationInput.value = '30';
            muteReasonInput.value = '';
            closeAdminPanel();
        });
    }
});

adminSearchInput.addEventListener('input', () => {
    const searchQuery = adminSearchInput.value.toLowerCase().trim();
    
    let filtered = adminDisplayedPlayers;
    
    if (searchQuery) {
        filtered = filtered.filter(player => {
            return player.id.toString().includes(searchQuery) || player.name.toLowerCase().includes(searchQuery);
        });
    }
    
    if (currentFilterMode === 'muted') {
        filtered = filtered.filter(player => {
            const muteStatus = adminPanelData.muteStatuses && adminPanelData.muteStatuses[player.identifier];
            return muteStatus && muteStatus.isMuted;
        });
    } else if (currentFilterMode === 'unmuted') {
        filtered = filtered.filter(player => {
            const muteStatus = adminPanelData.muteStatuses && adminPanelData.muteStatuses[player.identifier];
            return !muteStatus || !muteStatus.isMuted;
        });
    }
    
    displayAdminPlayersList(filtered);
});

filterAllBtn.addEventListener('click', () => {
    currentFilterMode = 'all';
    filterAllBtn.classList.add('active');
    filterMutedBtn.classList.remove('active');
    filterUnmutedBtn.classList.remove('active');
    adminSearchInput.value = '';
    applyAdminFilter();
});

filterMutedBtn.addEventListener('click', () => {
    currentFilterMode = 'muted';
    filterAllBtn.classList.remove('active');
    filterMutedBtn.classList.add('active');
    filterUnmutedBtn.classList.remove('active');
    adminSearchInput.value = '';
    applyAdminFilter();
});

filterUnmutedBtn.addEventListener('click', () => {
    currentFilterMode = 'unmuted';
    filterAllBtn.classList.remove('active');
    filterMutedBtn.classList.remove('active');
    filterUnmutedBtn.classList.add('active');
    adminSearchInput.value = '';
    applyAdminFilter();
});

adminRefreshBtn.addEventListener('click', () => {
    adminRefreshBtn.style.animation = 'spin 0.6s linear';
    fetch(`https://chat/refreshAdminPanel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
    }).then(() => {
        adminRefreshBtn.style.animation = 'none';
        setTimeout(() => { adminRefreshBtn.style.animation = ''; }, 10);
    }).catch(error => {
        console.error('Failed to refresh admin panel:', error);
        adminRefreshBtn.style.animation = 'none';
    });
});

adminPlayersClose.addEventListener('click', closeAdminPanelPlayers);

adminPanelPlayers.addEventListener('click', (e) => {
    if (e.target === adminPanelPlayers) {
        closeAdminPanelPlayers();
    }
});

adminPlayerMuteBtn.addEventListener('click', () => {
    const duration = adminMuteDurationInput.value || 30;
    const reason = adminMuteReasonInput.value || 'No reason provided';
    
    if (selectedPlayerIdInPanel) {
        adminPlayerMuteBtn.disabled = true;
        fetch(`https://chat/mute`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                playerId: selectedPlayerIdInPanel,
                duration: duration,
                reason: reason
            })
        }).then(response => {
            adminPlayerMuteBtn.disabled = false;
            if (response.ok) {
                showAdminMessage('✓ Joueur muté avec succès', 'success');
                adminMuteDurationInput.value = '30';
                adminMuteReasonInput.value = '';
                
                const currentPlayer = adminDisplayedPlayers.find(p => p.id === selectedPlayerIdInPanel);
                if (currentPlayer) {
                    const adminName = document.querySelector('.admin-players-header h3').textContent.includes('Admin') ? 'Admin' : 'Vous';
                    const muteEndTime = Math.floor(Date.now() / 1000) + (parseInt(duration) * 60);
                    adminPanelData.muteStatuses[currentPlayer.identifier] = {
                        isMuted: true,
                        mutedUntil: muteEndTime,
                        mutedBy: adminName,
                        reason: reason
                    };
                    selectPlayerInPanel(currentPlayer.id, currentPlayer.name, currentPlayer.identifier, adminPanelData.histories[currentPlayer.identifier], adminPanelData.muteStatuses[currentPlayer.identifier]);
                    applyAdminFilter();
                }
            } else {
                showAdminMessage('✗ Erreur lors du mute du joueur', 'error');
            }
        }).catch(error => {
            adminPlayerMuteBtn.disabled = false;
            showAdminMessage('✗ Erreur lors du mute', 'error');
            console.error('Mute error:', error);
        });
    }
});

function initializeLanguage() {
    const savedLanguage = localStorage.getItem('chatLanguage') || 'fr';
    if (typeof setLanguage === 'function' && setLanguage(savedLanguage)) {
        currentLanguage = savedLanguage;
    } else {
        currentLanguage = savedLanguage;
        localStorage.setItem('chatLanguage', savedLanguage);
    }
    if (chatLanguageSelect) {
        chatLanguageSelect.value = currentLanguage;
    }
    updateInterfaceLanguage();
}

function addTooltip(label, tooltipKey) {
    const tooltip = document.createElement('span');
    tooltip.className = 'tooltip-icon';
    tooltip.setAttribute('data-tooltip', tooltipKey);
    
    const tooltipContainer = document.createElement('div');
    tooltipContainer.className = 'tooltip-container';
    tooltipContainer.textContent = t('tooltips.' + tooltipKey);
    tooltip.appendChild(tooltipContainer);
    
    label.appendChild(tooltip);
}

function updateInterfaceLanguage() {
    const messagesHeader = document.getElementById('messages-header');
    if (messagesHeader) {
        const span = messagesHeader.querySelector('span');
        if (span) span.textContent = t('chat.title');
    }
    
    const toggleMessagesBtn = document.getElementById('toggle-messages-btn');
    if (toggleMessagesBtn) toggleMessagesBtn.title = t('chat.hide');
    
    const messagesAutoShowContainer = document.querySelector('label:has(#messages-auto-show)');
    if (messagesAutoShowContainer) {
        const checkbox = document.getElementById('messages-auto-show');
        messagesAutoShowContainer.textContent = '';
        messagesAutoShowContainer.appendChild(checkbox);
        messagesAutoShowContainer.appendChild(document.createTextNode(' ' + t('settings.autoShow')));
        
        const existingTooltip = messagesAutoShowContainer.querySelector('.tooltip-icon');
        if (existingTooltip) existingTooltip.remove();
        addTooltip(messagesAutoShowContainer, 'autoShow');
    }
    
    const serverPrintContainer = document.querySelector('label:has(#messages-server-print)');
    if (serverPrintContainer) {
        const checkbox = document.getElementById('messages-server-print');
        serverPrintContainer.textContent = '';
        serverPrintContainer.appendChild(checkbox);
        serverPrintContainer.appendChild(document.createTextNode(' ' + t('settings.serverPrint')));
        
        const existingTooltip = serverPrintContainer.querySelector('.tooltip-icon');
        if (existingTooltip) existingTooltip.remove();
        addTooltip(serverPrintContainer, 'serverPrint');
    }
    
    const editControls = document.getElementById('messages-edit-controls');
    if (editControls) {
        const labels = editControls.querySelectorAll('label');
        labels.forEach(label => {
            const text = label.textContent.trim();
            const existingTooltip = label.querySelector('.tooltip-icon');
            if (existingTooltip) existingTooltip.remove();
            
            if (text.startsWith('Couleur') || text.startsWith('Color')) {
                const span = label.querySelector('span');
                if (!span) label.textContent = t('settings.color') + ':';
                addTooltip(label, 'color');
            }
            if (text.startsWith('Transparence') || text.startsWith('Transparency')) {
                const span = label.querySelector('span');
                label.textContent = t('settings.transparency') + ': ';
                if (span) label.appendChild(span);
                label.appendChild(document.createTextNode('%'));
                addTooltip(label, 'transparency');
            }
            if (text.startsWith('Police') || text.startsWith('Font')) {
                if (!label.querySelector('select')) label.textContent = t('settings.font') + ':';
                addTooltip(label, 'font');
            }
            if (text.startsWith('Taille') || text.startsWith('Size')) {
                const span = label.querySelector('span');
                label.textContent = t('settings.fontSize') + ': ';
                if (span) label.appendChild(span);
                label.appendChild(document.createTextNode('px'));
                addTooltip(label, 'fontSize');
            }
            if (text.startsWith('Langue') || text.startsWith('Language')) {
                if (!label.querySelector('select')) label.textContent = t('settings.language') + ':';
                addTooltip(label, 'language');
            }
        });
    }
    
    const chatEditControls = document.getElementById('chat-edit-controls');
    if (chatEditControls) {
        const labels = chatEditControls.querySelectorAll('label');
        labels.forEach(label => {
            const text = label.textContent.trim();
            const existingTooltip = label.querySelector('.tooltip-icon');
            if (existingTooltip) existingTooltip.remove();
            
            if (text.startsWith('Couleur') || text.startsWith('Color')) {
                label.textContent = t('settings.color') + ':';
                addTooltip(label, 'color');
            }
            if (text.startsWith('Transparence') || text.startsWith('Transparency')) {
                const span = label.querySelector('span');
                label.textContent = t('settings.transparency') + ': ';
                if (span) label.appendChild(span);
                label.appendChild(document.createTextNode('%'));
                addTooltip(label, 'transparency');
            }
            if (text.startsWith('Langue') || text.startsWith('Language')) {
                if (!label.querySelector('select')) label.textContent = t('settings.language') + ':';
                addTooltip(label, 'language');
            }
        });
    }
    
    const chatShowContainer = document.querySelector('label:has(#chat-show-messages-zone)');
    if (chatShowContainer) {
        const checkbox = document.getElementById('chat-show-messages-zone');
        chatShowContainer.textContent = '';
        chatShowContainer.appendChild(checkbox);
        chatShowContainer.appendChild(document.createTextNode(' ' + t('settings.showMessages')));
        
        const existingTooltip = chatShowContainer.querySelector('.tooltip-icon');
        if (existingTooltip) existingTooltip.remove();
        addTooltip(chatShowContainer, 'showMessages');
    }
    
    const resetButtons = document.querySelectorAll('[id$="-edit-reset"]');
    resetButtons.forEach(button => {
        button.title = t('tooltips.reset');
    });
    
    const chatInput = document.getElementById('chat-input');
    if (chatInput) chatInput.placeholder = t('chat.placeholder');
    
    const sendBtn = document.getElementById('send-btn');
    if (sendBtn) sendBtn.textContent = t('chat.send');
    
    const announceSend = document.getElementById('announce-send');
    if (announceSend) announceSend.textContent = t('chat.send');
    
    const announceCancel = document.getElementById('announce-cancel');
    if (announceCancel) announceCancel.textContent = t('chat.cancel');
    
    const messagesEditReset = document.getElementById('messages-edit-reset');
    if (messagesEditReset) messagesEditReset.textContent = t('buttons.reset');
    
    const chatEditReset = document.getElementById('chat-edit-reset');
    if (chatEditReset) chatEditReset.textContent = t('buttons.reset');
    
    const meBtn = document.getElementById('me-btn');
    if (meBtn) meBtn.title = t('buttons.meCommand');
    
    const doBtn = document.getElementById('do-btn');
    if (doBtn) doBtn.title = t('buttons.doCommand');
    
    const announceBtn = document.getElementById('announce-btn');
    if (announceBtn) announceBtn.title = t('buttons.announceCommand');
    
    const editModeBtn = document.getElementById('edit-mode-btn');
    if (editModeBtn) editModeBtn.title = t('buttons.editMode');
    
    const announceHeader = document.querySelector('#announce-section h3');
    if (announceHeader) announceHeader.textContent = t('announce.title');
    
    const announceTitle = document.getElementById('announce-title');
    if (announceTitle) announceTitle.textContent = t('announce.title');
    
    const announceImportanceLabel = document.getElementById('announce-importance-label');
    if (announceImportanceLabel) announceImportanceLabel.textContent = t('announce.importance') + ':';
    
    const announceTargetLabel = document.getElementById('announce-target-label');
    if (announceTargetLabel) announceTargetLabel.textContent = t('announce.target') + ':';
    
    const announceDurationLabel = document.getElementById('announce-duration-label');
    if (announceDurationLabel) announceDurationLabel.textContent = t('announce.duration') + ':';
    
    const announceFormattingLabel = document.getElementById('announce-formatting-label');
    if (announceFormattingLabel) announceFormattingLabel.textContent = t('announce.formatting') + ':';
    
    const announceMessageLabel = document.getElementById('announce-message-label');
    if (announceMessageLabel) announceMessageLabel.textContent = t('announce.message') + ':';
    
    const announcePreviewLabel = document.getElementById('announce-preview-label');
    if (announcePreviewLabel) announcePreviewLabel.textContent = t('announce.title') + ' - ' + t('modals.announcePlaceholder');
    
    const announceTargetAll = document.getElementById('announce-target-all');
    if (announceTargetAll) announceTargetAll.textContent = t('announce.targetOptions.all');
    
    const announceTargetSpecific = document.getElementById('announce-target-specific');
    if (announceTargetSpecific) announceTargetSpecific.textContent = t('announce.targetOptions.specific');
    
    const announcePlayerPlaceholder = document.getElementById('announce-player-placeholder');
    if (announcePlayerPlaceholder) announcePlayerPlaceholder.textContent = t('announce.selectPlayer');
    
    const announceSendBtn = document.getElementById('announce-send');
    if (announceSendBtn) announceSendBtn.textContent = t('announce.send');
    
    const announceCancelBtn = document.getElementById('announce-cancel');
    if (announceCancelBtn) announceCancelBtn.textContent = t('announce.cancel');
    
    const announceTextarea = document.getElementById('announce-textarea');
    if (announceTextarea) announceTextarea.placeholder = t('modals.announcePlaceholder');
    
    announceImportanceBtns.forEach((btn, idx) => {
        const importance = btn.dataset.importance;
        const levels = t('announce.importanceLevels');
        const icon = btn.dataset.icon;
        btn.textContent = icon + ' ' + levels[importance];
    });
    
    const adminHeader = document.querySelector('#admin-panel .admin-header h3');
    if (adminHeader) adminHeader.textContent = t('admin.history');
    
    const adminPlayersHeader = document.querySelector('#admin-panel-players .admin-players-header h3');
    if (adminPlayersHeader) adminPlayersHeader.textContent = t('admin.title');
    
    const adminSearchInput = document.getElementById('admin-search-input');
    if (adminSearchInput) adminSearchInput.placeholder = t('admin.search');
    
    const muteDuration = document.getElementById('mute-duration');
    if (muteDuration) muteDuration.placeholder = t('admin.muteDuration');
    
    const muteReason = document.getElementById('mute-reason');
    if (muteReason) muteReason.placeholder = t('admin.muteReason');
    
    const adminMuteBtn = document.getElementById('admin-mute-btn');
    if (adminMuteBtn) adminMuteBtn.textContent = t('buttons.mute');
    
    const adminMuteDuration = document.getElementById('admin-mute-duration');
    if (adminMuteDuration) adminMuteDuration.placeholder = t('admin.muteDuration');
    
    const adminMuteReason = document.getElementById('admin-mute-reason');
    if (adminMuteReason) adminMuteReason.placeholder = t('admin.muteReason');
    
    const adminPlayerMuteBtn = document.getElementById('admin-player-mute-btn');
    if (adminPlayerMuteBtn) adminPlayerMuteBtn.textContent = t('buttons.mute');
    
    const filterAll = document.getElementById('filter-all');
    if (filterAll) filterAll.textContent = t('admin.filters.all');
    
    const filterMuted = document.getElementById('filter-muted');
    if (filterMuted) filterMuted.textContent = t('admin.filters.muted');
    
    const filterUnmuted = document.getElementById('filter-unmuted');
    if (filterUnmuted) filterUnmuted.textContent = t('admin.filters.unmuted');
    
    const selectedPlayerName = document.getElementById('selected-player-name');
    if (selectedPlayerName) selectedPlayerName.textContent = t('admin.selectedPlayer');
    
    const adminFooter = document.querySelector('.admin-footer');
    if (adminFooter) adminFooter.textContent = t('footer');
}

function changeLanguage(lang) {
    if (typeof setLanguage === 'function' && setLanguage(lang)) {
        updateInterfaceLanguage();
    } else {
        currentLanguage = lang;
        localStorage.setItem('chatLanguage', lang);
        updateInterfaceLanguage();
    }
}

window.addEventListener('load', () => {
    initializeLanguage();
    updateMessagesVisibility();
    updateMessagesZoneVisibility();
    applyZoneSettings('messages-zone');
    applyZoneSettings('chat-container');
    fetch(`https://chat/loaded`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
    }).catch(e => console.error('Loaded callback failed', e));
});

if (chatLanguageSelect) {
    chatLanguageSelect.addEventListener('change', (e) => {
        changeLanguage(e.target.value);
    });
}

console.log('chat UI loaded and ready');
