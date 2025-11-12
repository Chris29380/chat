# CDT Chat System - Installation Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Installation Steps](#installation-steps)
3. [Configuration](#configuration)
4. [Verification](#verification)
5. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before installing CDT Chat System, ensure you have:

- **FiveM Server** - Active and running
- **oxmysql Resource** - Required for database features
  - Ensure `ensure oxmysql` is in your `server.cfg` **before** the chat resource
- **Basic Server Knowledge** - Understanding of FiveM configuration
- **File Access** - Write permissions to your server's `resources` folder
- **Port Access** - Default FiveM ports available (depends on your setup)

### Checking Prerequisites

**Check FiveM Version:**
```
Open your server console and look for the FiveM version number
```

**Verify oxmysql is Running:**
```
In your server console, you should see:
[oxmysql] Database connection established
```

---

## Installation Steps

### Step 1: Download the Resource

**Option A: Git Clone**
```bash
cd c:\your\server\resources
git clone https://github.com/Chris29380/chat.git
```

**Option B: Download ZIP**
1. Visit: https://github.com/Chris29380/chat
2. Click "Code" → "Download ZIP"
3. Extract to your `resources` folder
4. Rename folder to `chat` (if needed)

### Step 2: Verify Folder Structure

After extraction, your folder should look like:
```
resources/
└── chat/
    ├── client/
    │   ├── cl_chat.lua
    │   └── cl_suggestions.lua
    ├── server/
    │   └── sv_chat.lua
    ├── html/
    │   ├── index.html
    │   ├── css/
    │   │   └── styles.css
    │   └── js/
    │       ├── app.js
    │       └── locales.js
    ├── config.lua
    ├── fxmanifest.lua
    ├── README.md
    └── (other .md files)
```

### Step 3: Update server.cfg

Open your `server.cfg` file and add the resource:

**Important:** Ensure `oxmysql` is listed BEFORE `chat`

```cfg
# Database
ensure oxmysql

# Chat System
ensure chat
```

**Complete Example:**
```cfg
# Server Configuration
sv_projectName "My Server"
sv_projectDesc "A FiveM Server"

# Database Connection
set mysql_connection_string "mysql://user:password@localhost/fivem_db"
ensure oxmysql

# Resources
ensure mapmanager
ensure sessionmanager
ensure basic-gamemode
ensure defaultmapmanager

# Chat System
ensure chat

# Additional Resources
ensure other_resource
```

### Step 4: Configure the Resource (Optional)

Edit `config.lua` in the chat folder to customize settings:

**Basic Configuration:**
```lua
-- Chat window position
Config.Chat.Position = { x = 'left', y = 'center' }

-- Chat window size
Config.Chat.Width = 400
Config.Chat.MaxHeight = 500

-- Command ranges
Config.MeCommand.Range = 50.0
Config.DoCommand.Range = 50.0

-- Language
Config.Language.Default = 'en'
```

See `README.md` for comprehensive configuration options.

### Step 5: Set Up Permissions (Optional but Recommended)

If using admin commands (`/annonce`, `/mute`, `/adminchat`), add ACE permissions:

**Add to your server.cfg:**
```cfg
# Replace with your actual Discord ID or identifier
add_ace identifier.discord:123456789 admin.announce allow
add_ace identifier.discord:123456789 chat.admin allow
```

**Alternative - Using IP Identification:**
```cfg
add_ace identifier.ip:127.0.0.1 admin.announce allow
add_ace identifier.ip:127.0.0.1 chat.admin allow
```

### Step 6: Start Your Server

```bash
# Linux
./run.sh

# Windows
run.bat

# Or manually start FiveM
```

### Step 7: Verify Installation

In your server console, you should see:
```
[chat] Chat system initialized
[chat] Database connection established
[chat] Permissions system loaded
```

Connect to your server and test:
```
/me waves at everyone
/do looks around
/help chat
```

---

## Configuration

### Quick Configuration Tips

#### Change Chat Position
```lua
Config.Chat.Position = {
    x = 'left',     -- 'left', 'center', 'right'
    y = 'center'    -- 'top', 'center', 'bottom'
}
```

#### Disable Database Features
```lua
Config.Database.Enabled = false
```

#### Change Default Language to French
```lua
Config.Language.Default = 'fr'
```

#### Increase Command Range
```lua
Config.MeCommand.Range = 100.0
Config.DoCommand.Range = 100.0
```

#### Add Blocked Words
```lua
table.insert(Config.BlockedWords, 'badword')
table.insert(Config.BlockedWords, '/admin')
```

#### Customize Styling
```lua
Config.Chat.Styling = {
    BorderRadius = 8,
    EditableBorderColor = '#ff0000',
    ResizeHandleColor = '#00ff00',
    ResizeHandleOpacity = 0.8,
    ResizeHandleWidth = 10
}
```

**After making any config changes, restart the resource:**
```
/restart chat
```

---

## Verification

### Test Installation

1. **Connect to Server**
   - Join your server as a player

2. **Test Chat Commands**
   ```
   Type: /me waves
   Expected: Red text above your head saying "[ME] waves"
   
   Type: /do walks away
   Expected: Orange text above your head saying "[DO] walks away"
   ```

3. **Test Admin Commands** (if permissions set)
   ```
   Type: /annonce Welcome to our server
   Expected: Server-wide notification
   ```

4. **Check Server Console**
   - Look for any errors or warnings
   - Verify no red error messages appear

### Enable Debug Mode

To verify everything is working correctly:

Edit `config.lua`:
```lua
Config.Debug = {
    Enabled = true,
    PrintInitialization = true,
    PrintDatabaseQueries = true,
    PrintPermissions = true
}
```

Restart the resource and check the console for detailed information.

---

## Troubleshooting

### Resource Not Starting

**Error:** `Failed to start chat resource`

**Solutions:**
1. Check `fxmanifest.lua` syntax
2. Verify all required files are present
3. Check server console for specific error messages
4. Ensure oxmysql is running: `ensure oxmysql`

### Commands Not Working

**Error:** `/me` command does nothing

**Solutions:**
1. Verify resource is running: `/status`
2. Check permissions in ACE (if required)
3. Ensure you're typing the command correctly
4. Check console for error messages
5. Restart the resource: `/restart chat`

### Database Errors

**Error:** `Database connection failed`

**Solutions:**
1. Verify oxmysql is running and configured
2. Check MySQL credentials in oxmysql config
3. Ensure database exists
4. Check MySQL service is running
5. Set `Config.Database.Enabled = false` to disable database features temporarily

### Permission Denied for Admin Commands

**Error:** `You don't have permission to use this command`

**Solutions:**
1. Add ACE permission to `server.cfg`:
   ```cfg
   add_ace identifier.discord:YOUR_ID admin.announce allow
   add_ace identifier.discord:YOUR_ID chat.admin allow
   ```
2. Restart server
3. Verify your Discord ID is correct
4. Use `/getid` command to confirm your identifier

### Chat Window Not Visible

**Error:** Chat window doesn't appear on screen

**Solutions:**
1. Check if chat is opened with default key (usually 'T')
2. Verify HTML files are present in `html/` folder
3. Check `config.lua` for positioning issues
4. Disable other chat resources that might conflict
5. Check browser console (press F8 in FiveM, type `web`)

### Performance Issues

**Problem:** Server or client lag after installing chat

**Solutions:**
1. Disable database features if not needed:
   ```lua
   Config.Database.Enabled = false
   ```
2. Reduce `AdminPanel.RefreshInterval`:
   ```lua
   Config.AdminPanel.RefreshInterval = 10000  -- 10 seconds instead of 5
   ```
3. Disable history recording:
   ```lua
   Config.Database.History.Enabled = false
   ```

### Language Issues

**Problem:** Messages appear in wrong language

**Solutions:**
1. Check default language setting:
   ```lua
   Config.Language.Default = 'en'  -- or 'fr', 'de', 'es', 'pt'
   ```
2. Verify language code is correct
3. Check `config.lua` Messages table for correct entries
4. Restart resource after changing language

---

## Getting Help

If you encounter issues:

1. **Check the README.md** - Comprehensive documentation
2. **Review config.lua** - All settings are well-commented
3. **Enable Debug Mode** - Get detailed console output
4. **Check Server Console** - Look for error messages
5. **GitHub Issues** - https://github.com/Chris29380/chat/issues
6. **Discord Support** - ChrisToF#0851

---

## Next Steps

After successful installation:

1. Read the `USAGE_GUIDE.md` to learn how to use the system
2. Customize `config.lua` to match your server needs
3. Set up permissions for admin commands
4. Test all commands with your team
5. Consider enabling database features for chat history

---

**Installation Complete!** 🎉

Your CDT Chat System is now ready to use. Enjoy enhanced chat functionality on your server!
