# 🖥️ Running mukuviOS in VS Code

## 🚀 Quick Start

### Method 1: Using Debug Panel (Recommended)
1. Open VS Code in the project folder
2. Press `Ctrl+Shift+D` (or `Cmd+Shift+D` on Mac) to open Debug panel
3. Select one of these configurations:
   - **🖥️ Start GUI Server** - Launches web interface
   - **🔒 Boot Terminal OS** - Launches terminal interface
   - **⚙️ Setup System** - First-time setup
   - **🧪 Run Tests** - Run test suite
4. Press `F5` or click the green play button

### Method 2: Using Tasks
1. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
2. Type "Tasks: Run Task"
3. Select from available tasks:
   - **🖥️ Start GUI Server**
   - **🔒 Boot Terminal OS**
   - **⚙️ Setup System**
   - **🧪 Run Tests**
   - **📦 Install Dependencies**

### Method 3: Using Integrated Terminal
1. Press `Ctrl+`` (backtick) to open terminal
2. Run commands:
   ```bash
   npm install          # Install dependencies
   npm run setup        # First-time setup
   npm run gui          # Start GUI server
   npm run boot         # Start terminal OS
   npm test             # Run tests
   ```

## 🔧 First Time Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Setup System** (Required for first run)
   - Use Debug panel: "⚙️ Setup System"
   - Or terminal: `npm run setup`
   - Follow prompts to create user account

3. **Start GUI Server**
   - Use Debug panel: "🖥️ Start GUI Server"
   - Or terminal: `npm run gui`
   - Open browser to `http://localhost:3000`

## 🖥️ GUI Mode (Recommended)

**Best for:** Full desktop experience with graphical interface

1. Run "🖥️ Start GUI Server" from Debug panel
2. Open `http://localhost:3000` in browser
3. Login with credentials from setup
4. Enjoy full desktop environment with:
   - Security tools (WiFi scanner, Metasploit, etc.)
   - Development tools (project creator, package manager)
   - System administration tools
   - AI assistant integration

## 🔒 Terminal Mode

**Best for:** Command-line enthusiasts

1. Run "🔒 Boot Terminal OS" from Debug panel
2. Login with credentials from setup
3. Use commands like:
   - `help` - Show all commands
   - `wifi-scan` - Scan WiFi networks
   - `nmap-scan <target>` - Network scanning
   - `ai <question>` - Ask AI assistant
   - `create-project <name>` - Create development project

## 🛠️ Development Features

### Debugging
- Set breakpoints in any `.js` file
- Use VS Code's built-in debugger
- Inspect variables and call stack
- Hot reload for GUI changes

### IntelliSense
- Auto-completion for all modules
- Parameter hints
- Error detection
- Import suggestions

### Extensions
VS Code will suggest installing helpful extensions:
- JSON support
- Prettier formatting
- Path IntelliSense
- Live Server (for static files)

## 📁 Project Structure

```
mukuvios/
├── src/
│   ├── gui/           # Web interface
│   ├── kernel/        # Core OS components
│   ├── shell/         # Command-line interface
│   ├── security/      # Security tools
│   ├── programming/   # Development tools
│   └── system/        # System administration
├── .vscode/           # VS Code configuration
└── mukuvi-system/     # Generated OS files
```

## 🔍 Troubleshooting

### Common Issues:

1. **"Module not found" errors**
   - Run `npm install` first
   - Check Node.js version (requires 18+)

2. **Permission errors**
   - Run VS Code as administrator (Windows)
   - Use `sudo` if needed (Linux/Mac)

3. **Port already in use**
   - Change port in `src/gui/gui-server.js`
   - Or kill existing process

4. **Setup required**
   - Run "⚙️ Setup System" first
   - Creates user accounts and system files

### Debug Console
- View logs in VS Code's Debug Console
- Check terminal output for errors
- Use browser dev tools for GUI issues

## 🎯 Tips for VS Code

1. **Split Terminal**: Use multiple terminals for different tasks
2. **File Explorer**: Navigate project structure easily
3. **Search**: Use `Ctrl+Shift+F` to search across all files
4. **Git Integration**: Built-in version control
5. **Extensions**: Install recommended extensions for better experience

## 🚀 Advanced Usage

### Custom Launch Configurations
Edit `.vscode/launch.json` to add custom debug configurations

### Environment Variables
Set in launch configuration or `.env` file:
```json
"env": {
  "NODE_ENV": "development",
  "DEBUG": "mukuvios:*"
}
```

### Workspace Settings
Customize VS Code behavior in `.vscode/settings.json`

---

**Happy Hacking with mukuviOS! 🔒💻**