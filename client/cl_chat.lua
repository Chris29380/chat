local chatActive = false
local hasAnnouncePermission = false
local isAdmin = false
local showServerPrint = false
local activeTexts = {}
local textIdCounter = 0
local lastCommandTime = 0
local commandMessageTimeout = 500
local isMuted = false
local muteTimeRemaining = 0

RegisterNetEvent('cdtChat:updatePermissions')
AddEventHandler('cdtChat:updatePermissions', function(hasPermission, adminPermission)
    hasAnnouncePermission = hasPermission
    isAdmin = adminPermission or false
    SendNUIMessage({
        type = 'UPDATE_PERMISSIONS',
        hasAnnouncePermission = hasPermission,
        isAdmin = isAdmin
    })
end)

RegisterNetEvent('cdtChat:muteStatusResponse')
AddEventHandler('cdtChat:muteStatusResponse', function(muted, timeRemaining)
    isMuted = muted
    muteTimeRemaining = timeRemaining
    if muted then
        SendNUIMessage({
            type = 'SHOW_MUTE_MESSAGE',
            timeRemaining = timeRemaining
        })
    end
end)

RegisterNetEvent('cdtChat:playerMuted')
AddEventHandler('cdtChat:playerMuted', function(duration)
    isMuted = true
    muteTimeRemaining = duration * 60
end)

RegisterNetEvent('cdtChat:playerUnmuted')
AddEventHandler('cdtChat:playerUnmuted', function()
    isMuted = false
    muteTimeRemaining = 0
end)

RegisterNetEvent('cdtChat:showHistory')
AddEventHandler('cdtChat:showHistory', function(historyData)
    SendNUIMessage({
        type = 'SHOW_ADMIN_HISTORY',
        data = historyData
    })
end)

RegisterNetEvent('cdtChat:openAdminPanel')
AddEventHandler('cdtChat:openAdminPanel', function(data)
    SendNUIMessage({
        type = 'OPEN_ADMIN_PANEL',
        data = data
    })
    SetNuiFocus(true, true)
end)

RegisterNetEvent('cdtChat:sendAnnouncement')
AddEventHandler('cdtChat:sendAnnouncement', function(message)
    print('[cdtChat:sendAnnouncement] Received message:', message, 'type:', type(message))
    SendNUIMessage({
        type = 'SHOW_ANNOUNCEMENT',
        message = tostring(message or '')
    })
end)

RegisterNetEvent('cdtChat:showAdvancedAnnouncement')
AddEventHandler('cdtChat:showAdvancedAnnouncement', function(data)
    SendNUIMessage({
        type = 'SHOW_ANNOUNCEMENT',
        data = data
    })
end)

RegisterNetEvent('cdtChat:showCommandResult')
AddEventHandler('cdtChat:showCommandResult', function(result)
    SendNUIMessage({
        type = 'ADD_MESSAGE',
        message = result,
        isCommand = false
    })
end)

RegisterNetEvent('chat:addMessage')
AddEventHandler('chat:addMessage', function(args)
    local message = ''
    if args.args and #args.args > 0 then
        for i = 1, #args.args do
            if i > 1 then message = message .. ' ' end
            message = message .. tostring(args.args[i])
        end
    elseif args.multiline then
        message = args.multiline
    end
    
    if message ~= '' then
        SendNUIMessage({
            type = 'ADD_MESSAGE',
            message = message,
            isCommand = false
        })
    end
end)

local function worldToScreen(worldX, worldY, worldZ)
    local onScreen, screenX, screenY = GetScreenCoordFromWorldCoord(worldX, worldY, worldZ)
    
    if not onScreen then
        return nil, nil
    end
    
    screenX = screenX * 1920
    screenY = screenY * 1080
    
    return screenX, screenY
end

local function showTextOnScreen(ped, text, duration, range, textType)
    local textId = textIdCounter
    textIdCounter = textIdCounter + 1
    
    local startTime = GetGameTimer()
    local endTime = startTime + duration
    
    activeTexts[textId] = true
    
    Citizen.CreateThread(function()
        while GetGameTimer() <= endTime and activeTexts[textId] do
            Wait(0)
            
            local playerPed = PlayerPedId()
            local playerPos = GetEntityCoords(playerPed)
            local targetPos = GetEntityCoords(ped)
            local dist = #(playerPos - targetPos)
            
            if dist <= range then
                local headPos = GetOffsetFromEntityInWorldCoords(ped, 0.0, 0.0, 1.2)
                local screenX, screenY = worldToScreen(headPos.x, headPos.y, headPos.z)
                
                if screenX and screenY then
                    SendNUIMessage({
                        type = 'UPDATE_TEXT_POSITION',
                        textId = textId,
                        x = screenX,
                        y = screenY,
                        text = text,
                        textType = textType
                    })
                end
            end
        end
        
        activeTexts[textId] = nil
        SendNUIMessage({
            type = 'REMOVE_TEXT',
            textId = textId
        })
    end)
end

RegisterNetEvent('cdtChat:showMe')
AddEventHandler('cdtChat:showMe', function(message, sourceServerId)
    local playerId = GetPlayerFromServerId(sourceServerId)
    if playerId == -1 then return end
    
    local ped = GetPlayerPed(playerId)
    if ped == 0 then return end
    
    showTextOnScreen(ped, message, Config.MeCommand.Duration, Config.MeCommand.Range, 'me')
end)

RegisterNetEvent('cdtChat:showDo')
AddEventHandler('cdtChat:showDo', function(message, sourceServerId)
    local playerId = GetPlayerFromServerId(sourceServerId)
    if playerId == -1 then return end
    
    local ped = GetPlayerPed(playerId)
    if ped == 0 then return end
    
    showTextOnScreen(ped, message, Config.DoCommand.Duration, Config.DoCommand.Range, 'do')
end)

RegisterNUICallback('chatResult', function(data, cb)
    if data.canceled then
        chatActive = false
        SetNuiFocus(false, false)
        cb('ok')
        return
    end
    
    local message = data.message
    
    if message:sub(1, 1) == '/' then
        local command = message:sub(2)
        lastCommandTime = GetGameTimer()
        if command:sub(1, 3) == 'me ' or command:sub(1, 3) == 'do ' then
            chatActive = false
            SetNuiFocus(false, false)
        else
            TriggerServerEvent('cdtChat:commandExecuted', message)
        end
        TriggerServerEvent('cdtChat:recordMessage', message)
        ExecuteCommand(command)
    elseif not isMuted then
        TriggerServerEvent('cdtChat:recordMessage', message)
    end
    
    cb('ok')
end)

RegisterNUICallback('meCommand', function(data, cb)
    chatActive = true
    SetNuiFocus(true)
    SendNUIMessage({
        type = 'OPEN_WITH_PREFIX',
        prefix = '/me '
    })
    cb('ok')
end)

RegisterNUICallback('doCommand', function(data, cb)
    chatActive = true
    SetNuiFocus(true)
    SendNUIMessage({
        type = 'OPEN_WITH_PREFIX',
        prefix = '/do '
    })
    cb('ok')
end)

RegisterNUICallback('announceCommand', function(data, cb)
    if not hasAnnouncePermission then
        cb('ok')
        return
    end
    
    chatActive = true
    SetNuiFocus(true)
    SendNUIMessage({
        type = 'OPEN_ANNOUNCE'
    })
    cb('ok')
end)

RegisterNUICallback('mute', function(data, cb)
    TriggerServerEvent('cdtChat:mutePlayerCommand', data.playerId, data.duration, data.reason)
    cb('ok')
end)

RegisterNUICallback('unmute', function(data, cb)
    TriggerServerEvent('cdtChat:unmutePlayerCommand', data.playerId)
    cb('ok')
end)

RegisterNUICallback('refreshAdminPanel', function(data, cb)
    TriggerServerEvent('cdtChat:refreshAdminPanelData')
    cb('ok')
end)

RegisterNUICallback('submitAnnounce', function(data, cb)
    if data.message and data.message ~= '' then
        TriggerServerEvent('cdtChat:submitAdvancedAnnounce', data)
    end
    cb('ok')
end)

RegisterNUICallback('getPlayersForAnnounce', function(data, cb)
    local players = {}
    local success, playerList = pcall(GetPlayers)
    print('[getPlayersForAnnounce] success:', success, 'playerList:', playerList, 'type:', type(playerList))
    if success and playerList then
        print('[getPlayersForAnnounce] Players found:', #playerList)
        for _, id in ipairs(playerList) do
            local playerId = tonumber(id)
            local playerName = GetPlayerName(playerId)
            print('[getPlayersForAnnounce] Player:', playerId, 'Name:', playerName)
            if playerName then
                table.insert(players, {
                    id = playerId,
                    name = playerName
                })
            end
        end
    else
        print('[getPlayersForAnnounce] GetPlayers() failed or returned nil')
    end
    print('[getPlayersForAnnounce] Returning players:', #players, 'players')
    cb(players)
end)

RegisterCommand('me', function(source, args, rawCommand)
    local message = rawCommand:sub(4)
    if message and message ~= '' then
        TriggerServerEvent('cdtChat:meCommand', message)
    end
end, false)

RegisterCommand('do', function(source, args, rawCommand)
    local message = rawCommand:sub(4)
    if message and message ~= '' then
        TriggerServerEvent('cdtChat:doCommand', message)
    end
end, false)

print('[DEBUG] Registering annonce command')
RegisterCommand('annonce', function(source, args, rawCommand)
    print('[annonce command] EXECUTED - source:', source, 'rawCommand:', rawCommand)
    local message = rawCommand:sub(8)
    print('[annonce command] Raw message:', message, 'Type:', type(message), 'Length:', string.len(message or ''))
    if message and message ~= '' then
        print('[annonce command] Triggering server event with message:', message)
        TriggerServerEvent('cdtChat:announceCommand', message)
    else
        print('[annonce command] Message is empty!')
    end
end, false)
print('[DEBUG] Annonce command registered')

RegisterNUICallback('closeAdminPanel', function(data, cb)
    SetNuiFocus(false, false)
    cb('ok')
end)

RegisterNUICallback('loaded', function(data, cb)
    SendNUIMessage({
        type = 'UPDATE_CONFIG',
        config = {
            Position = Config.Chat.Position,
            AnnouncementDuration = Config.Announcement.Duration
        }
    })
    TriggerServerEvent('cdtChat:init')
    TriggerServerEvent('cdtChat:loadSettings')
    TriggerEvent('chat:addSuggestion', 'test', 'Commande de test pour vérifier les suggestions', {'arg1', 'arg2'})
    cb('ok')
end)

RegisterNUICallback('saveSettings', function(data, cb)
    TriggerServerEvent('cdtChat:saveSettings', data)
    cb('ok')
end)

RegisterNetEvent('cdtChat:settingsLoaded')
AddEventHandler('cdtChat:settingsLoaded', function(zoneId, settings)
    SendNUIMessage({
        type = 'LOAD_ZONE_SETTINGS',
        zoneId = zoneId,
        settings = settings
    })
end)

RegisterNUICallback('toggleServerPrint', function(data, cb)
    showServerPrint = data.enabled
    cb('ok')
end)

RegisterKeyMapping('cdt_chat_toggle', 'Afficher/Cacher le chat', 'keyboard', Config.Chat.OpenKey)

RegisterCommand('cdt_chat_toggle', function()
    if not chatActive then
        TriggerServerEvent('cdtChat:checkMuteStatus')
        Wait(100)
        if isMuted then
            TriggerEvent('chat:addMessage', {
                args = {'SYSTEM', 'Vous êtes mute pour ' .. muteTimeRemaining .. ' secondes encore'}
            })
            return
        end
        chatActive = true
        SendNUIMessage({
            type = 'OPEN'
        })
        SetNuiFocus(true, true)
    else
        chatActive = false
        SetNuiFocus(false, false)
        SendNUIMessage({
            type = 'CLOSE'
        })
    end
end, false)

RegisterNetEvent('__cfx_internal:serverPrint')
AddEventHandler('__cfx_internal:serverPrint', function(msg)
    if isAdmin and showServerPrint then
        SendNUIMessage({
            type = 'ADD_MESSAGE',
            message = '[SERVER] ' .. msg,
            isCommand = false
        })
    end
end)

RegisterCommand('adminchat', function()
    TriggerServerEvent('cdtChat:openAdminPanelEvent')
end, false)
