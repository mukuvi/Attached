# Mukuvi OS

A complete terminal-based operating system simulation built with Node.js.

## Overview

Mukuvi OS is a fully functional operating system that runs in your terminal. It provides a complete OS experience including:

- **Kernel**: Core system management
- **Process Manager**: Handle running processes
- **File System**: Virtual file system operations
- **User Management**: Multi-user support with authentication
- **Shell**: Interactive command-line interface
- **System Services**: Various background services

## Quick Start

1. **Install the system:**
   ```bash
   npm install
   npm run install
   ```

2. **Boot the OS:**
   ```bash
   npm run boot
   ```

3. **Login with your credentials and start using the system!**

## Features

### Core System
- ✅ Kernel with boot sequence
- ✅ Process management
- ✅ Virtual file system
- ✅ User authentication
- ✅ Session management
- ✅ System services

### Shell Commands
- ✅ File operations (ls, cd, mkdir, touch, cat, rm)
- ✅ System info (ps, whoami, uname, uptime, sysinfo)
- ✅ Utilities (echo, date, calc, clear, help)
- ✅ User management (users)
- ✅ System control (exit, shutdown)

### Security
- ✅ User authentication
- ✅ Password protection
- ✅ Session management
- ✅ File permissions (basic)

## Architecture

```
Mukuvi OS
├── Kernel
│   ├── Boot Loader
│   ├── Process Manager
│   ├── File System
│   └── User Manager
├── Shell
│   ├── Command Processor
│   └── Built-in Commands
└── System Services
    ├── Logger
    ├── Scheduler
    └── Memory Manager
```

## Installation Guide

See [INSTALL.md](INSTALL.md) for detailed installation instructions.

## System Requirements

- Node.js 18.0.0 or higher
- npm (Node Package Manager)
- Terminal/Command prompt
- At least 50MB free disk space

## Development

### Running Tests
```bash
npm test
```

### Development Mode
```bash
npm run dev
```

### Project Structure
```
src/
├── installer/          # Installation scripts
├── kernel/             # Core OS components
│   ├── boot.js         # Boot loader
│   ├── kernel.js       # Main kernel
│   ├── process-manager.js
│   ├── filesystem.js
│   └── user-manager.js
├── shell/              # Shell interface
│   ├── shell.js        # Main shell
│   ├── command-processor.js
│   └── commands.js     # Built-in commands
└── tests/              # Test suite
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with Node.js and modern JavaScript
- Inspired by Unix/Linux operating systems
- Uses chalk for colorful terminal output
- Figlet for ASCII art banners

---

**Mukuvi OS** - Experience a complete operating system in your terminal!