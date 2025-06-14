class MukuviGUI {
    constructor() {
        this.socket = null;
        this.sessionId = null;
        this.currentUser = null;
        this.currentDirectory = '/';
        this.commandHistory = [];
        this.historyIndex = -1;
        
        this.init();
    }

    async init() {
        // Show boot screen
        await this.showBootSequence();
        
        // Initialize socket connection
        this.socket = io();
        this.setupSocketListeners();
        
        // Show login screen
        this.showLoginScreen();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Start clock
        this.startClock();
    }

    async showBootSequence() {
        const bootScreen = document.getElementById('boot-screen');
        const loadingText = document.querySelector('.loading-text');
        
        const bootMessages = [
            'Initializing Mukuvi Security Kernel...',
            'Loading WiFi hacking modules...',
            'Starting AI assistant ARIA...',
            'Initializing network scanners...',
            'Loading exploit database...',
            'Starting forensics tools...',
            'Security systems ready!'
        ];

        for (let i = 0; i < bootMessages.length; i++) {
            loadingText.textContent = bootMessages[i];
            await this.sleep(600);
        }

        await this.sleep(1000);
        bootScreen.classList.add('hidden');
    }

    showLoginScreen() {
        document.getElementById('login-screen').classList.remove('hidden');
    }

    showDesktop() {
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('desktop').classList.remove('hidden');
        
        // Initialize desktop components
        this.updatePrompt();
        this.loadSystemInfo();
        this.loadDirectoryListing();
        this.loadProcessList();
        this.showWelcomeMessage();
        
        // Focus terminal input
        document.getElementById('terminal-input').focus();
    }

    showWelcomeMessage() {
        const welcomeMsg = `🔒 Welcome to Mukuvi OS Security Edition!

Available security tools:
• wifi-scan - Discover WiFi networks
• nmap-scan - Network port scanning  
• ai <question> - Ask security AI assistant
• vuln-scan - Vulnerability assessment
• exploit-db - Search exploits
• forensics - Digital forensics tools

Type 'help' for full command list.
Remember: Use tools ethically and legally! 🛡️`;

        this.addToTerminal(welcomeMsg, 'welcome');
    }

    setupSocketListeners() {
        this.socket.on('command-result', (result) => {
            this.handleCommandResult(result);
        });

        this.socket.on('directory-listing', (data) => {
            this.updateFileManager(data);
        });

        this.socket.on('security-alert', (alert) => {
            this.showSecurityAlert(alert);
        });
    }

    setupEventListeners() {
        // Login form
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Terminal input
        const terminalInput = document.getElementById('terminal-input');
        terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.executeCommand();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.navigateHistory(-1);
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.navigateHistory(1);
            } else if (e.key === 'Tab') {
                e.preventDefault();
                this.autoComplete();
            }
        });

        // File manager buttons
        document.getElementById('refresh-btn').addEventListener('click', () => {
            this.loadDirectoryListing();
        });

        document.getElementById('new-folder-btn').addEventListener('click', () => {
            this.createNewFolder();
        });

        document.getElementById('new-file-btn').addEventListener('click', () => {
            this.createNewFile();
        });

        // Security tools shortcuts
        this.addSecurityShortcuts();

        // Window controls
        document.querySelectorAll('.control.close').forEach(control => {
            control.addEventListener('click', (e) => {
                e.target.closest('.window').style.display = 'none';
            });
        });

        document.querySelectorAll('.control.minimize').forEach(control => {
            control.addEventListener('click', (e) => {
                const window = e.target.closest('.window');
                window.style.transform = window.style.transform === 'scale(0.1)' ? 'scale(1)' : 'scale(0.1)';
            });
        });
    }

    addSecurityShortcuts() {
        // Add quick access buttons for security tools
        const toolbar = document.querySelector('.file-manager-toolbar');
        
        const securityButtons = [
            { text: 'WiFi Scan', command: 'wifi-scan' },
            { text: 'Nmap', command: 'nmap-scan 192.168.1.1' },
            { text: 'AI Help', command: 'ai How do I secure my network?' }
        ];

        securityButtons.forEach(btn => {
            const button = document.createElement('button');
            button.className = 'toolbar-btn security-btn';
            button.textContent = btn.text;
            button.style.background = '#e74c3c';
            button.addEventListener('click', () => {
                this.executeSecurityCommand(btn.command);
            });
            toolbar.appendChild(button);
        });
    }

    executeSecurityCommand(command) {
        // Set the command in terminal and execute
        document.getElementById('terminal-input').value = command;
        this.executeCommand();
    }

    autoComplete() {
        const input = document.getElementById('terminal-input');
        const value = input.value;
        
        const securityCommands = [
            'wifi-scan', 'wifi-capture', 'wifi-crack', 'wifi-deauth',
            'nmap-scan', 'vuln-scan', 'network-discovery',
            'ai', 'exploit-db', 'hash-crack', 'forensics', 'security-audit'
        ];
        
        const matches = securityCommands.filter(cmd => cmd.startsWith(value));
        if (matches.length === 1) {
            input.value = matches[0] + ' ';
        }
    }

    async handleLogin() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('login-error');

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const result = await response.json();

            if (result.success) {
                this.sessionId = result.sessionId;
                this.currentUser = result.user;
                this.currentDirectory = `/home/${result.user.username}`;
                this.showDesktop();
            } else {
                errorDiv.textContent = result.error;
                errorDiv.classList.remove('hidden');
            }
        } catch (error) {
            errorDiv.textContent = 'Connection error';
            errorDiv.classList.remove('hidden');
        }
    }

    executeCommand() {
        const input = document.getElementById('terminal-input');
        const command = input.value.trim();
        
        if (!command) return;

        // Add to history
        this.commandHistory.push(command);
        this.historyIndex = this.commandHistory.length;

        // Display command in terminal
        this.addToTerminal(`${this.getPromptText()}${command}`, 'command');

        // Clear input
        input.value = '';

        // Execute command
        this.socket.emit('execute-command', {
            sessionId: this.sessionId,
            command: command
        });
    }

    handleCommandResult(result) {
        if (result.error) {
            this.addToTerminal(result.error, 'error');
        } else {
            if (result.output) {
                this.addToTerminal(result.output, 'output');
            }
            if (result.currentDir) {
                this.currentDirectory = result.currentDir;
                this.updatePrompt();
                this.updateCurrentPath();
                this.loadDirectoryListing();
            }
        }
    }

    addToTerminal(text, type = 'output') {
        const output = document.getElementById('terminal-output');
        const div = document.createElement('div');
        div.className = `terminal-line ${type}`;
        
        if (type === 'welcome') {
            div.style.color = '#00ffff';
            div.style.whiteSpace = 'pre-line';
        } else if (type === 'command') {
            div.style.color = '#ffffff';
        } else if (type === 'error') {
            div.style.color = '#ff6b6b';
        } else {
            div.style.color = '#00ff00';
            div.style.whiteSpace = 'pre-line';
        }
        
        div.textContent = text;
        output.appendChild(div);
        output.scrollTop = output.scrollHeight;
    }

    showSecurityAlert(alert) {
        // Create security alert notification
        const alertDiv = document.createElement('div');
        alertDiv.className = 'security-alert';
        alertDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(231, 76, 60, 0.9);
            color: white;
            padding: 15px;
            border-radius: 8px;
            z-index: 1000;
            max-width: 300px;
            backdrop-filter: blur(10px);
        `;
        alertDiv.innerHTML = `
            <strong>🚨 Security Alert</strong><br>
            ${alert.message}
        `;
        
        document.body.appendChild(alertDiv);
        
        setTimeout(() => {
            alertDiv.remove();
        }, 5000);
    }

    getPromptText() {
        const userColor = this.currentUser?.isAdmin ? '🔴' : '🟢';
        return `${userColor}${this.currentUser?.username || 'user'}@mukuvi-security:${this.currentDirectory}$ `;
    }

    updatePrompt() {
        document.getElementById('terminal-prompt').textContent = this.getPromptText();
    }

    updateCurrentPath() {
        document.getElementById('current-directory').textContent = this.currentDirectory;
    }

    navigateHistory(direction) {
        if (this.commandHistory.length === 0) return;

        this.historyIndex += direction;
        
        if (this.historyIndex < 0) {
            this.historyIndex = 0;
        } else if (this.historyIndex >= this.commandHistory.length) {
            this.historyIndex = this.commandHistory.length;
            document.getElementById('terminal-input').value = '';
            return;
        }

        document.getElementById('terminal-input').value = this.commandHistory[this.historyIndex] || '';
    }

    loadDirectoryListing() {
        this.socket.emit('get-directory-listing', {
            sessionId: this.sessionId,
            path: this.currentDirectory
        });
    }

    updateFileManager(data) {
        const fileList = document.getElementById('file-list');
        fileList.innerHTML = '';

        if (data.error) {
            fileList.innerHTML = `<div class="error">${data.error}</div>`;
            return;
        }

        data.entries.forEach(entry => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.innerHTML = `
                <div class="file-icon ${entry.type}">
                    ${entry.type === 'directory' ? '📁' : '📄'}
                </div>
                <div class="file-name">${entry.name}</div>
            `;
            
            fileItem.addEventListener('dblclick', () => {
                if (entry.type === 'directory') {
                    this.changeDirectory(entry.name);
                }
            });

            fileList.appendChild(fileItem);
        });
    }

    changeDirectory(dirName) {
        const newPath = this.currentDirectory === '/' ? `/${dirName}` : `${this.currentDirectory}/${dirName}`;
        this.socket.emit('execute-command', {
            sessionId: this.sessionId,
            command: `cd ${newPath}`
        });
    }

    createNewFolder() {
        const name = prompt('Enter folder name:');
        if (name) {
            this.socket.emit('execute-command', {
                sessionId: this.sessionId,
                command: `mkdir ${name}`
            });
        }
    }

    createNewFile() {
        const name = prompt('Enter file name:');
        if (name) {
            this.socket.emit('execute-command', {
                sessionId: this.sessionId,
                command: `touch ${name}`
            });
        }
    }

    async loadSystemInfo() {
        try {
            const response = await fetch('/api/system-info');
            const sysInfo = await response.json();
            
            const systemInfoDiv = document.getElementById('system-info');
            systemInfoDiv.innerHTML = `
                <div class="info-item">
                    <span class="info-label">OS Name:</span>
                    <span class="info-value">${sysInfo.osName} Security Edition</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Version:</span>
                    <span class="info-value">${sysInfo.version}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Boot Time:</span>
                    <span class="info-value">${new Date(sysInfo.bootTime).toLocaleString()}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Uptime:</span>
                    <span class="info-value">${Math.floor(sysInfo.uptime / 1000)}s</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Processes:</span>
                    <span class="info-value">${sysInfo.processCount}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Users:</span>
                    <span class="info-value">${sysInfo.userCount}</span>
                </div>
                <div class="security-features">
                    <h4>🔒 Security Features</h4>
                    <div class="feature-list">
                        <span class="feature">WiFi Hacking</span>
                        <span class="feature">Network Scanning</span>
                        <span class="feature">AI Assistant</span>
                        <span class="feature">Forensics</span>
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Failed to load system info:', error);
        }
    }

    loadProcessList() {
        this.socket.emit('execute-command', {
            sessionId: this.sessionId,
            command: 'ps'
        });
    }

    startClock() {
        const updateClock = () => {
            const now = new Date();
            document.getElementById('clock-time').textContent = now.toLocaleTimeString();
            const userDisplay = this.currentUser?.username || 'Guest';
            const adminIndicator = this.currentUser?.isAdmin ? ' 🔴' : ' 🟢';
            document.getElementById('current-user').textContent = userDisplay + adminIndicator;
        };

        updateClock();
        setInterval(updateClock, 1000);
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the GUI when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new MukuviGUI();
});