# CDT Chat System - Usage Guide

## Table of Contents
1. [Basic Usage](#basic-usage)
2. [Chat Commands](#chat-commands)
3. [Roleplay Commands](#roleplay-commands)
4. [Admin Commands](#admin-commands)
5. [Chat Features](#chat-features)
6. [Keyboard Shortcuts](#keyboard-shortcuts)
7. [Tips & Tricks](#tips--tricks)
8. [Frequently Asked Questions](#frequently-asked-questions)

---

## Basic Usage

### Opening the Chat

**Default Key:** `T`

- Press `T` to open the chat input box
- Type your message
- Press `Enter` to send
- Press `Escape` to cancel

### Chat Window Controls

**Chat Window Features:**
- **Position:** Can be customized (top-left, center, etc.)
- **Resizable:** Drag the bottom-right corner to resize
- **Scrollable:** Scroll with mouse wheel or arrow keys
- **Collapsible:** Messages auto-hide when chat is closed

### Chat Visibility

**When Chat is Open:**
- Chat window displays
- Input field is active
- You can scroll through message history

**When Chat is Closed:**
- Recent messages fade out
- Chat window minimizes
- You can still see incoming messages briefly

---

## Chat Commands

### Standard Messages

Send regular messages to all players:

```
/msg Hello everyone!
/say Good morning!
```

**Display:** 
```
[Player_Name]: Hello everyone!
```

**Visible To:** All players in range

### Private Messages

Send messages to specific players (if configured):

```
/pm [player_id] Your private message
/tell [player_name] Secret message
```

**Example:**
```
/pm 5 How are you?
```

---

## Roleplay Commands

### /me Command

Display a roleplay **action** visible to nearby players.

**Syntax:**
```
/me [action description]
```

**Examples:**
```
/me waves at everyone
/me sits on the bench
/me pulls out a weapon
/me looks confused
/me nods slowly
```

**Display:**
```
[ME] waves at everyone
```

**Features:**
- Visible range: 50 units (default, customizable)
- Display duration: 5 seconds (default)
- Red colored text
- Appears above player's head
- Works in first-person perspective

**Configuration:**
```lua
Config.MeCommand = {
    Range = 50.0,       -- Distance players can see
    Duration = 5000,    -- How long to display (ms)
    Font = 0,           -- Text style
    Scale = 0.4,        -- Text size
    HeadOffset = 1.2    -- Height above head
}
```

### /do Command

Display a roleplay **narrative** or environmental description visible to nearby players.

**Syntax:**
```
/do [narrative description]
```

**Examples:**
```
/do The door is locked
/do A car horn honks in the distance
/do The weather seems to be changing
/do Someone's phone buzzes
/do Footsteps can be heard approaching
```

**Display:**
```
[DO] The door is locked
```

**Features:**
- Similar range and duration to /me
- Orange/yellow colored text
- Appears above player's head
- Used for environmental descriptions
- Immersive roleplay tool

**Configuration:**
```lua
Config.DoCommand = {
    Range = 50.0,       -- Distance players can see
    Duration = 5000,    -- How long to display (ms)
    Font = 0,           -- Text style
    Scale = 0.4,        -- Text size
    HeadOffset = 1.2    -- Height above head
}
```

### /me and /do Tips

**Range:**
- Stand closer to players to ensure they see your action/narrative
- Default range is 50 units (approximately half a block)

**Timing:**
- Messages display for 5 seconds
- Plan your actions accordingly
- Multiple messages can overlap

**Frequency:**
- Use frequently for immersive roleplay
- Combine with regular chat for complete conversations
- Alternate between /me, /do, and /say

---

## Admin Commands

### Announcement Command

Send a server-wide **announcement** visible to all players.

**Command:** `/annonce [message]`

**Permission Required:** `admin.announce`

**Syntax:**
```
/annonce [Your announcement text]
```

**Examples:**
```
/annonce Welcome to our server!
/annonce Maintenance starts in 5 minutes
/annonce Police are recruiting! /apply
```

**Display:**
```
[ANNOUNCEMENT] Welcome to our server!
```

**Features:**
- Server-wide visibility
- Special formatting
- Icon display
- Customizable duration (default: 5 seconds)
- Logged in chat history

**Configuration:**
```lua
Config.Announcement = {
    System = 'native',
    Duration = 5000,           -- Display time in ms
    Icon = 'CHAR_MULTIPLAYER', -- Icon to display
    DefaultFormatting = {
        bold = false,
        italic = false,
        underline = false,
        color = '#ffffff'      -- White text
    }
}
```

### Admin Chat Panel

Open the administration panel for chat management.

**Command:** `/adminchat`

**Permission Required:** `chat.admin`

**Features:**
- View chat history
- Manage player mutes
- See player information
- Access admin tools
- View system messages

**Admin Panel Interface:**
- Player list with identifiers
- Mute status indicators
- Command history
- Real-time updates
- Search functionality

### Mute Command

Temporarily silence a player's chat.

**Command:** `/mute [player_id] [duration_in_minutes]`

**Permission Required:** `chat.admin`

**Syntax:**
```
/mute [player_id] [duration]
```

**Examples:**
```
/mute 5 30      -- Mute player 5 for 30 minutes
/mute 2 10      -- Mute player 2 for 10 minutes
/mute 8         -- Mute player 8 (uses default duration)
```

**Default Duration:** 30 minutes (configurable)

**What Happens:**
- Player receives mute notification
- Player cannot send messages during mute
- Message appears in admin chat
- Mute timer counts down

**Muted Player's Experience:**
```
[SYSTEM] You are muted for 30 minutes remaining
[SYSTEM] You are muted for 29 minutes remaining
... (updates every minute)
```

### Unmute Command

Remove a mute from a player.

**Command:** `/unmute [player_id]`

**Permission Required:** `chat.admin`

**Syntax:**
```
/unmute [player_id]
```

**Examples:**
```
/unmute 5       -- Unmute player 5
/unmute 2       -- Unmute player 2
```

**What Happens:**
- Mute is immediately removed
- Player receives unmute notification
- Player can send messages again
- Action logged in history

### Chat History Command

View a player's chat history.

**Command:** `/chathistory [player_id]`

**Permission Required:** `chat.admin`

**Syntax:**
```
/chathistory [player_id]
```

**Examples:**
```
/chathistory 5  -- View player 5's history
/chathistory 2  -- View player 2's history
```

**Information Displayed:**
- Player name and ID
- Messages sent
- Timestamps
- Command usage
- Last 30 messages (default)

---

## Chat Features

### Message History

Access previous messages:

**Controls:**
- **Mouse Wheel:** Scroll through history
- **Up Arrow:** Previous message (when typing)
- **Down Arrow:** Next message (when typing)
- **Page Up:** Scroll up faster
- **Page Down:** Scroll down faster

### Auto-Mute System

Automatic muting for blocked words/commands:

**Triggers:**
- Using admin commands without permission
- Saying blocked words
- Using blocked commands

**Mute Duration:** 10 minutes (default, configurable)

**Message:**
```
[SYSTEM] You have been muted for 10 minutes for attempting to use an admin command.
```

**Blocked Words Example:**
- `/admin`
- `/kick`
- `/ban`
- Prohibited content

**Configuration:**
```lua
Config.BlockedWordsConfig = {
    MuteDuration = 10,      -- Minutes
    CaseSensitive = false,  -- Ignore case
    Enabled = true          -- Enable/disable
}
```

### Chat Persistence

Messages are saved and logged:

**Storage:**
- Local chat history (on client)
- Database history (on server, if enabled)
- Admin accessible via `/chathistory`

**What's Logged:**
- Regular messages
- Commands used
- Timestamps
- Player identifiers

**Retention:**
- Default: 100 messages per player
- Server-side logging (with database)

### Multilingual Support

Chat supports 5 languages:

**Available Languages:**
- 🇫🇷 French (`fr`)
- 🇬🇧 English (`en`)
- 🇩🇪 German (`de`)
- 🇪🇸 Spanish (`es`)
- 🇵🇹 Portuguese (`pt`)

**Change Language:**
1. Edit `config.lua`
2. Set `Config.Language.Default = 'en'`
3. Restart resource
4. Messages appear in chosen language

---

## Keyboard Shortcuts

### Chat Controls

| Key | Action |
|-----|--------|
| `T` | Open/Close Chat |
| `Enter` | Send Message |
| `Escape` | Close Chat (without sending) |
| `Mouse Wheel` | Scroll Message History |
| `Page Up` | Scroll Up Faster |
| `Page Down` | Scroll Down Faster |
| `↑` Arrow | Previous Message (while typing) |
| `↓` Arrow | Next Message (while typing) |

### System

| Key | Action |
|-----|--------|
| `F8` | Open Console |
| `F10` | Show Debug Information |
| `Ctrl+C` | Copy Selected Text |

---

## Tips & Tricks

### Roleplay Tips

**1. Use /me and /do Effectively**
```
Good Roleplay:
/me looks at the suspect carefully
/do The suspect appears nervous
/say I have some questions for you

Instead of:
/say I look at the suspect and he's nervous and I'll ask him questions
```

**2. Describe Actions Clearly**
```
Good: /me pulls out a notepad and starts writing
Bad: /me writes

Good: /do The sound of sirens approaches in the distance
Bad: /do sirens
```

**3. Combine Chat Types**
```
/me extends hand for a handshake
/say Name's John, pleasure to meet you
/do Waits for response with a smile
```

### Performance Tips

**1. Manage Chat Window**
- Keep chat closed when not in use
- Reduces screen clutter
- Improves visibility of game

**2. Use Ranges Appropriately**
- Position yourself within range for visibility
- Default: 50 units
- Roughly half a city block

**3. Spam Prevention**
- Don't send too many messages rapidly
- Can be filtered as spam
- Admins may mute repeated offenders

### Admin Tips

**1. Monitor Activity**
- Use `/adminchat` regularly
- Check for rule violations
- Review chat history as needed

**2. Fair Moderation**
- Always warn before muting
- Use appropriate mute durations
- Document reasons for actions

**3. Create Rules**
- Establish chat rules for your server
- Communicate expectations clearly
- Enforce consistently

---

## Frequently Asked Questions

### Q: I can't see my /me action
**A:** Make sure you're close to other players (within 50 units). Test with nearby players to verify visibility.

### Q: How do I change the chat color?
**A:** Edit `config.lua` under `Config.Chat.Styling`. You can customize border colors and other styling options.

### Q: Can I increase the /me range?
**A:** Yes! Edit `config.lua`:
```lua
Config.MeCommand.Range = 100.0  -- Change from 50.0 to 100.0
Config.DoCommand.Range = 100.0
```
Then restart: `/restart chat`

### Q: What does "You are muted" mean?
**A:** An admin has silenced your chat. You cannot send messages during the mute period. Check the remaining time in your notifications.

### Q: How long do /me messages stay visible?
**A:** Default is 5 seconds. Admins can customize this in `config.lua` under `Config.MeCommand.Duration`.

### Q: Can I undo an /annonce message?
**A:** No, announcements cannot be deleted once sent. Admins should review before sending.

### Q: What's the difference between /me and /do?
**A:** 
- `/me` describes YOUR actions ("waves", "sits down")
- `/do` describes environmental/narrative elements ("the door is locked", "footsteps approach")

### Q: Are chat messages saved?
**A:** Yes, if database is enabled. Admins can view history with `/chathistory [id]`. Messages are not saved if database is disabled.

### Q: How do I get admin permissions?
**A:** Ask your server owner. They need to add your Discord ID or identifier to the server configuration with `admin.announce` or `chat.admin` permissions.

### Q: Can I edit messages after sending?
**A:** No, messages cannot be edited. This is by design for accountability.

### Q: What happens if I use blocked words?
**A:** You'll be automatically muted for 10 minutes. The blocked word system protects against command injection attempts.

### Q: Can I disable the chat system?
**A:** Yes, admins can temporarily disable chat features by removing `ensure chat` from `server.cfg` and restarting the server.

---

## Getting Help

**Common Issues:**

1. **Chat not working** - Make sure resource is running: `/status chat`
2. **Commands not recognized** - Check spelling and permissions
3. **Can't see /me messages** - Verify you're in range of other players
4. **Permission denied** - Ask server owner for permissions

**Support Resources:**
- Check `README.md` for comprehensive documentation
- Review `INSTALLATION_GUIDE.md` for setup help
- GitHub Issues: https://github.com/Chris29380/chat/issues
- Discord: ChrisToF#0851

---

## Server Rules Template

**Suggested chat rules for your server:**

```
CHAT RULES:
1. Use /me and /do for roleplay descriptions
2. Use /say for general conversation
3. No spam or excessive caps
4. No inappropriate language
5. No advertising without permission
6. Respect all players
7. Follow admin directions
8. No command abuse attempts
9. Admins reserve right to mute
10. Violations may result in bans
```

---

**Happy Chatting!** 💬

For more information, visit: https://github.com/Chris29380/chat
