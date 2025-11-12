local suggestions = {}

RegisterNetEvent('chat:addSuggestion')
AddEventHandler('chat:addSuggestion', function(name, help, params)
    if not suggestions[name] then
        suggestions[name] = { name = name, help = help or '', params = params or {} }
        SendNUIMessage({
            type = 'ADD_SUGGESTION',
            suggestion = suggestions[name]
        })
    end
end)

RegisterNetEvent('chat:removeSuggestion')
AddEventHandler('chat:removeSuggestion', function(name)
    if suggestions[name] then
        suggestions[name] = nil
        SendNUIMessage({
            type = 'REMOVE_SUGGESTION',
            name = name
        })
    end
end)
