# Mukuvi OS Installation Guide

## Prerequisites

- Node.js 18.0.0 or higher
- npm (comes with Node.js)
- Terminal/Command prompt

## Installation Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run the Installer**
   ```bash
   npm run install
   ```

3. **Follow the Installation Wizard**
   - Enter your username
   - Set a password (minimum 4 characters)
   - Enter your full name

4. **Boot the System**
   ```bash
   npm run boot
   ```

## System Structure

After installation, Mukuvi OS creates the following directory structure:

```
mukuvi-system/
├── config/
│   └── system.json          # System configuration
├── users/
│   └── [username].json      # User accounts
├── system/
│   ├── bin/                 # System binaries
│   ├── lib/                 # System libraries
│   ├── logs/                # System logs
│   └── tmp/                 # Temporary files
├── home/
│   └── [username]/          # User home directories
├── var/                     # Variable data
└── etc/                     # Configuration files
```

## Available Commands

Once logged in, you can use these commands:

### File Operations
- `ls` - List directory contents
- `cd [path]` - Change directory
- `pwd` - Print working directory
- `mkdir [name]` - Create directory
- `touch [file]` - Create empty file
- `cat [file]` - Display file contents
- `rm [file]` - Remove file

### System Information
- `whoami` - Show current user
- `uname` - Show system information
- `uptime` - Show system uptime
- `sysinfo` - Detailed system information
- `ps` - Show running processes
- `users` - List all users

### Utilities
- `echo [text]` - Display text
- `date` - Show current date and time
- `calc [expression]` - Simple calculator
- `banner` - Show Mukuvi OS banner
- `clear` - Clear screen
- `help` - Show all commands

### System Control
- `exit` - Exit shell
- `shutdown` - Shutdown system

## Development Mode

To run in development mode with additional debugging:

```bash
npm run dev
```

## Testing

Run the test suite:

```bash
npm test
```

## Troubleshooting

### Installation Issues
- Ensure Node.js 18+ is installed
- Check that you have write permissions in the current directory
- Try running with administrator/sudo privileges if needed

### Boot Issues
- Make sure the installation completed successfully
- Check that the `mukuvi-system` directory exists
- Verify user account was created properly

### Login Issues
- Double-check username and password
- User accounts are case-sensitive
- Password must be at least 4 characters

## Features

- **Complete OS Simulation**: Full kernel, process manager, file system
- **User Management**: Multi-user support with authentication
- **Process Management**: Create, monitor, and kill processes
- **File System**: Virtual file system with standard operations
- **Shell Interface**: Interactive command-line interface
- **System Services**: Logger, scheduler, memory manager simulation
- **Security**: User permissions and session management

## License

Mukuvi OS is licensed under the GNU General Public License v3.0.