class MukuviOSGUI {
    constructor() {
        this.socket = null;
        this.sessionId = null;
        this.currentUser = null;
        this.currentDirectory = '/';
        this.commandHistory = [];
        this.historyIndex = -1;
        this.runningApps = new Set();
        this.packages = new Map();
        this.services = new Map();
        this.isInitialized = false;
        
        this.init();
    }

    async init() {
        try {
            // Show enhanced boot sequence
            await this.showEnhancedBootSequence();
            
            // Initialize socket connection
            this.initializeSocket();
            
            // Show login screen
            this.showLoginScreen();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Start system clock
            this.startSystemClock();
            
            // Initialize data
            this.initializeSystemData();
            
            this.isInitialized = true;
        } catch (error) {
            console.error('Failed to initialize mukuviOS:', error);
            this.showErrorScreen(error);
        }
    }

    async showEnhancedBootSequence() {
        const bootScreen = document.getElementById('boot-screen');
        const loadingText = document.querySelector('.loading-text');
        
        const bootMessages = [
            'Initializing mukuviOS Security Kernel...',
            'Loading advanced WiFi hacking modules...',
            'Starting ARIA AI security assistant...',
            'Initializing network vulnerability scanners...',
            'Loading Metasploit exploitation framework...',
            'Starting web application security tools...',
            'Loading password cracking utilities...',
            'Initializing digital forensics toolkit...',
            'Starting development environment...',
            'Loading package management system...',
            'Initializing service orchestration...',
            'Security systems fully operational!'
        ];

        for (let i = 0; i < bootMessages.length; i++) {
            loadingText.textContent = bootMessages[i];
            await this.sleep(600);
            
            // Add some visual effects
            if (i === bootMessages.length - 1) {
                loadingText.style.color = '#00ff00';
                loadingText.style.textShadow = '0 0 20px #00ff00';
            }
        }

        await this.sleep(1500);
        bootScreen.classList.add('hidden');
    }

    initializeSocket() {
        this.socket = io();
        this.setupSocketListeners();
    }

    setupSocketListeners() {
        this.socket.on('connect', () => {
            console.log('Connected to mukuviOS server');
        });

        this.socket.on('command-result', (result) => {
            this.handleCommandResult(result);
        });

        this.socket.on('directory-listing', (data) => {
            this.updateFileManager(data);
        });

        this.socket.on('security-alert', (alert) => {
            this.showSecurityAlert(alert);
        });

        this.socket.on('disconnect', () => {
            console.log('Disconnected from mukuviOS server');
            this.showNotification('Connection lost - attempting to reconnect...', 'warning');
        });
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
        this.showWelcomeMessage();
        
        // Focus terminal input
        setTimeout(() => {
            const terminalInput = document.getElementById('terminal-input');
            if (terminalInput) {
                terminalInput.focus();
            }
        }, 500);
    }

    showWelcomeMessage() {
        const welcomeMsg = `🔒 Welcome to mukuviOS - Complete Hacking & Programming Environment!

🛡️ Advanced Security Arsenal:
• WiFi Security Testing (aircrack-ng, handshake capture, WPA/WPA2 cracking)
• Web Application Security (sqlmap, burpsuite, nikto, dirb, gobuster)
• Network Penetration Testing (nmap-scan, vuln-scan, network-discovery)
• Exploitation Framework (metasploit, msfconsole, payload generation)
• Password Cracking (john, hashcat, hash-crack, wordlist attacks)
• Network Analysis (wireshark, tcpdump, packet inspection)
• Social Engineering Toolkit (phishing, vishing, pretexting)
• Digital Forensics (disk imaging, file recovery, timeline analysis)
• AI Security Assistant (ARIA - Advanced Reasoning Intelligence Assistant)

💻 Complete Development Environment:
• Programming Languages (Python, Node.js, C/C++, JavaScript, Go, Rust)
• Package Management (apt, npm, pip, cargo, go mod)
• Development Tools (git, docker, vim, nano, VS Code, IntelliJ)
• Project Management (create-project, dev-server, build, test, deploy)
• Database Support (MySQL, PostgreSQL, Redis, MongoDB, SQLite)
• Web Frameworks (React, Vue, Angular, Express, Django, Flask)
• DevOps Tools (CI/CD, containerization, orchestration)

⚙️ System Administration Suite:
• Service Management (systemctl, service control, daemon management)
• Process Monitoring (ps, top, htop, free, df, du, lsof, iotop)
• User Management (sudo, su, chmod, chown, user creation)
• Network Tools (ping, traceroute, dig, nslookup, ss, netstat)
• Firewall Management (iptables, ufw, security policies)
• File Operations (find, grep, tar, zip, wget, curl, rsync)
• System Monitoring (performance metrics, log analysis)
• Cron Job Scheduling (automated tasks, system maintenance)

🚀 Quick Start Commands:
• Use desktop icons or start menu to launch applications
• Type 'help' for comprehensive command reference
• Use 'apt install <package>' to install new security tools
• Use 'ai <question>' for intelligent security assistance
• Use 'create-project <name> <type>' to start development
• Use 'systemctl status' to monitor system services

🔐 Ethical Usage Reminder:
All security tools are for authorized testing and educational purposes only.
Always obtain proper permission before testing on any systems.
Follow responsible disclosure practices for any vulnerabilities found.

Ready to explore the complete hacking and programming environment! 🛡️💻`;

        this.addToTerminal(welcomeMsg, 'welcome');
    }

    setupEventListeners() {
        // Login form
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Terminal input with enhanced features
        const terminalInput = document.getElementById('terminal-input');
        if (terminalInput) {
            terminalInput.addEventListener('keydown', (e) => {
                this.handleTerminalKeydown(e);
            });
        }

        // Desktop icons with double-click and context menu
        document.querySelectorAll('.desktop-icon').forEach(icon => {
            icon.addEventListener('dblclick', () => {
                const app = icon.getAttribute('data-app');
                this.launchApplication(app);
            });
            
            icon.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                this.showContextMenu(e, icon);
            });
        });

        // Quick launch icons
        document.querySelectorAll('.quick-icon').forEach(icon => {
            icon.addEventListener('click', () => {
                const app = icon.getAttribute('data-app');
                this.launchApplication(app);
            });
        });

        // Start menu
        document.getElementById('start-menu-btn').addEventListener('click', () => {
            this.toggleStartMenu();
        });

        // Start menu items
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', () => {
                const app = item.getAttribute('data-app');
                this.launchApplication(app);
                this.hideStartMenu();
            });
        });

        // Window controls
        document.querySelectorAll('.control').forEach(control => {
            control.addEventListener('click', (e) => {
                const action = e.target.getAttribute('data-action');
                const window = e.target.closest('.app-window');
                this.handleWindowControl(window, action);
            });
        });

        // Application-specific event listeners
        this.setupApplicationEventListeners();

        // Global keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleGlobalKeyboard(e);
        });

        // Click outside to close menus
        document.addEventListener('click', (e) => {
            if (!e.target.closest('#start-menu-btn') && !e.target.closest('#start-menu')) {
                this.hideStartMenu();
            }
        });
    }

    handleTerminalKeydown(e) {
        switch (e.key) {
            case 'Enter':
                this.executeCommand();
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.navigateHistory(-1);
                break;
            case 'ArrowDown':
                e.preventDefault();
                this.navigateHistory(1);
                break;
            case 'Tab':
                e.preventDefault();
                this.autoComplete();
                break;
            case 'l':
                if (e.ctrlKey) {
                    e.preventDefault();
                    this.clearTerminal();
                }
                break;
            case 'c':
                if (e.ctrlKey) {
                    e.preventDefault();
                    this.interruptCommand();
                }
                break;
        }
    }

    handleGlobalKeyboard(e) {
        // Global shortcuts
        if (e.ctrlKey && e.altKey) {
            switch (e.key) {
                case 't':
                    e.preventDefault();
                    this.launchApplication('terminal');
                    break;
                case 'f':
                    e.preventDefault();
                    this.launchApplication('file-manager');
                    break;
                case 'w':
                    e.preventDefault();
                    this.launchApplication('wifi-scanner');
                    break;
                case 'm':
                    e.preventDefault();
                    this.launchApplication('metasploit');
                    break;
            }
        }
    }

    setupApplicationEventListeners() {
        // WiFi Scanner
        const wifiScanBtn = document.getElementById('wifi-scan-btn');
        if (wifiScanBtn) {
            wifiScanBtn.addEventListener('click', () => {
                this.executeSecurityCommand('wifi-scan');
            });
        }

        const wifiCaptureBtn = document.getElementById('wifi-capture-btn');
        if (wifiCaptureBtn) {
            wifiCaptureBtn.addEventListener('click', () => {
                const bssid = prompt('Enter BSSID to capture handshake:');
                if (bssid) {
                    this.executeSecurityCommand(`wifi-capture ${bssid}`);
                }
            });
        }

        const wifiCrackBtn = document.getElementById('wifi-crack-btn');
        if (wifiCrackBtn) {
            wifiCrackBtn.addEventListener('click', () => {
                const bssid = prompt('Enter BSSID to crack:');
                if (bssid) {
                    this.executeSecurityCommand(`wifi-crack ${bssid}`);
                }
            });
        }

        // Metasploit
        document.querySelectorAll('.exploit-card').forEach(card => {
            card.addEventListener('click', () => {
                const exploit = card.getAttribute('data-exploit');
                const target = prompt('Enter target IP address:');
                if (target) {
                    this.executeSecurityCommand(`metasploit ${exploit} ${target}`);
                }
            });
        });

        // Package Manager
        const packageUpdateBtn = document.getElementById('package-update-btn');
        if (packageUpdateBtn) {
            packageUpdateBtn.addEventListener('click', () => {
                this.executeSecurityCommand('apt update');
            });
        }

        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const category = btn.getAttribute('data-category');
                this.showPackageCategory(category);
            });
        });

        // Project Creator
        const createProjectBtn = document.getElementById('create-project-btn');
        if (createProjectBtn) {
            createProjectBtn.addEventListener('click', () => {
                this.createNewProject();
            });
        }

        // Service Manager
        const serviceRefreshBtn = document.getElementById('service-refresh-btn');
        if (serviceRefreshBtn) {
            serviceRefreshBtn.addEventListener('click', () => {
                this.refreshServices();
            });
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
                this.showNotification(`Welcome to mukuviOS, ${result.user.fullName}!`, 'success');
            } else {
                errorDiv.textContent = result.error;
                errorDiv.classList.remove('hidden');
                setTimeout(() => {
                    errorDiv.classList.add('hidden');
                }, 3000);
            }
        } catch (error) {
            errorDiv.textContent = 'Connection error - please try again';
            errorDiv.classList.remove('hidden');
            setTimeout(() => {
                errorDiv.classList.add('hidden');
            }, 3000);
        }
    }

    launchApplication(appName) {
        const windowId = `${appName}-window`;
        const window = document.getElementById(windowId);
        
        if (window) {
            window.classList.remove('hidden');
            this.runningApps.add(appName);
            this.updateRunningApps();
            
            // Special handling for terminal
            if (appName === 'terminal') {
                const terminalInput = document.getElementById('terminal-input');
                if (terminalInput) {
                    setTimeout(() => terminalInput.focus(), 200);
                }
            }
            
            // Load application-specific data
            this.loadApplicationData(appName);
            
            // Show notification
            this.showNotification(`Launched ${appName.replace('-', ' ')}`, 'info');
        } else {
            // Handle applications that don't have dedicated windows
            this.handleSpecialApplications(appName);
        }
    }

    handleSpecialApplications(appName) {
        const commands = {
            'python': 'python3',
            'nodejs': 'node',
            'git': 'git status',
            'docker': 'docker ps',
            'vscode': 'code .',
            'nmap': 'nmap-scan 192.168.1.1',
            'burpsuite': 'burpsuite http://example.com',
            'wireshark': 'wireshark eth0',
            'john': 'john --help',
            'hashcat': 'hashcat --help',
            'social-engineer': 'social-engineer phishing example@target.com',
            'firewall': 'ufw status',
            'file-manager': 'ls -la'
        };

        if (commands[appName]) {
            this.launchApplication('terminal');
            setTimeout(() => {
                this.executeSecurityCommand(commands[appName]);
            }, 500);
        } else {
            this.showNotification(`Application ${appName} not implemented yet`, 'warning');
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

    executeSecurityCommand(command) {
        // Add to terminal output
        this.addToTerminal(`${this.getPromptText()}${command}`, 'command');
        
        // Execute command
        this.socket.emit('execute-command', {
            sessionId: this.sessionId,
            command: command
        });
        
        // Show terminal if not visible
        this.launchApplication('terminal');
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
            }
        }
    }

    addToTerminal(text, type = 'output') {
        const output = document.getElementById('terminal-output');
        if (!output) return;
        
        const div = document.createElement('div');
        div.className = `terminal-line ${type}`;
        
        const colors = {
            'welcome': '#00ffff',
            'command': '#ffffff',
            'error': '#ff6b6b',
            'output': '#00ff00'
        };
        
        div.style.color = colors[type] || '#00ff00';
        if (type === 'welcome' || type === 'output') {
            div.style.whiteSpace = 'pre-line';
        }
        
        div.textContent = text;
        output.appendChild(div);
        output.scrollTop = output.scrollHeight;
    }

    clearTerminal() {
        const output = document.getElementById('terminal-output');
        if (output) {
            output.innerHTML = '';
        }
    }

    interruptCommand() {
        this.addToTerminal('^C', 'error');
        this.addToTerminal('Command interrupted', 'error');
    }

    getPromptText() {
        const userColor = this.currentUser?.isAdmin ? '🔴' : '🟢';
        return `${userColor}${this.currentUser?.username || 'user'}@mukuvios:${this.currentDirectory}$ `;
    }

    updatePrompt() {
        const prompt = document.getElementById('terminal-prompt');
        if (prompt) {
            prompt.textContent = this.getPromptText();
        }
    }

    updateCurrentPath() {
        const pathElement = document.getElementById('current-directory');
        if (pathElement) {
            pathElement.textContent = this.currentDirectory;
        }
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

    autoComplete() {
        const input = document.getElementById('terminal-input');
        const value = input.value;
        
        const allCommands = [
            // Security commands
            'wifi-scan', 'wifi-capture', 'wifi-crack', 'wifi-deauth', 'aircrack-ng',
            'nmap-scan', 'vuln-scan', 'network-discovery', 'sqlmap', 'burpsuite',
            'metasploit', 'msfconsole', 'nikto', 'dirb', 'gobuster', 'hydra',
            'john', 'hashcat', 'wireshark', 'tcpdump', 'social-engineer',
            // Development commands
            'create-project', 'dev-server', 'build', 'test', 'deploy',
            'python', 'python3', 'node', 'npm', 'pip', 'gcc', 'make',
            'git', 'docker', 'vim', 'nano', 'code',
            // System commands
            'apt', 'systemctl', 'service', 'top', 'htop', 'free', 'df', 'du',
            'ps', 'netstat', 'ss', 'ping', 'traceroute', 'dig', 'nslookup',
            'iptables', 'ufw', 'sudo', 'su', 'chmod', 'chown',
            // AI and utilities
            'ai', 'exploit-db', 'forensics', 'security-audit', 'help', 'clear'
        ];
        
        const matches = allCommands.filter(cmd => cmd.startsWith(value));
        if (matches.length === 1) {
            input.value = matches[0] + ' ';
        } else if (matches.length > 1) {
            this.addToTerminal(`Available commands: ${matches.join(', ')}`, 'info');
        }
    }

    handleWindowControl(window, action) {
        const appName = window.id.replace('-window', '');
        
        switch (action) {
            case 'close':
                window.classList.add('hidden');
                this.runningApps.delete(appName);
                this.updateRunningApps();
                break;
            case 'minimize':
                window.style.transform = window.style.transform === 'scale(0.1)' ? 'scale(1)' : 'scale(0.1)';
                break;
            case 'maximize':
                if (window.style.width === '100%') {
                    window.style.width = '84%';
                    window.style.height = '75%';
                    window.style.left = '8%';
                    window.style.top = '8%';
                } else {
                    window.style.width = '100%';
                    window.style.height = '100%';
                    window.style.left = '0';
                    window.style.top = '0';
                }
                break;
        }
    }

    toggleStartMenu() {
        const startMenu = document.getElementById('start-menu');
        startMenu.classList.toggle('hidden');
    }

    hideStartMenu() {
        const startMenu = document.getElementById('start-menu');
        startMenu.classList.add('hidden');
    }

    updateRunningApps() {
        const runningAppsContainer = document.getElementById('running-apps');
        runningAppsContainer.innerHTML = '';
        
        this.runningApps.forEach(appName => {
            const indicator = document.createElement('div');
            indicator.className = 'running-app-indicator';
            runningAppsContainer.appendChild(indicator);
        });
    }

    initializeSystemData() {
        this.initializePackages();
        this.initializeServices();
    }

    initializePackages() {
        const securityPackages = [
            { name: 'metasploit', version: '6.3.0', description: 'Penetration testing framework', installed: true },
            { name: 'nmap', version: '7.94', description: 'Network discovery and security auditing', installed: true },
            { name: 'wireshark', version: '4.0.0', description: 'Network protocol analyzer', installed: false },
            { name: 'burpsuite', version: '2023.1', description: 'Web application security testing', installed: false },
            { name: 'sqlmap', version: '1.7.0', description: 'Automatic SQL injection tool', installed: true },
            { name: 'john', version: '1.9.0', description: 'Password cracking tool', installed: true },
            { name: 'hashcat', version: '6.2.6', description: 'Advanced password recovery', installed: false },
            { name: 'aircrack-ng', version: '1.7', description: 'WiFi security auditing tools', installed: true },
            { name: 'nikto', version: '2.5.0', description: 'Web server scanner', installed: false },
            { name: 'dirb', version: '2.22', description: 'Web content scanner', installed: false }
        ];

        const devPackages = [
            { name: 'nodejs', version: '20.0.0', description: 'JavaScript runtime', installed: true },
            { name: 'python3', version: '3.11.0', description: 'Python programming language', installed: true },
            { name: 'gcc', version: '12.0.0', description: 'GNU Compiler Collection', installed: true },
            { name: 'git', version: '2.40.0', description: 'Version control system', installed: true },
            { name: 'docker', version: '24.0.0', description: 'Container platform', installed: false },
            { name: 'vim', version: '9.0.0', description: 'Text editor', installed: true },
            { name: 'code', version: '1.80.0', description: 'Visual Studio Code', installed: false }
        ];

        const systemPackages = [
            { name: 'mysql', version: '8.0.0', description: 'Database server', installed: false },
            { name: 'postgresql', version: '15.0.0', description: 'Advanced database', installed: false },
            { name: 'redis', version: '7.0.0', description: 'In-memory data store', installed: false },
            { name: 'apache2', version: '2.4.0', description: 'Web server', installed: false },
            { name: 'nginx', version: '1.24.0', description: 'Web server and reverse proxy', installed: false }
        ];

        this.packages.set('security', securityPackages);
        this.packages.set('development', devPackages);
        this.packages.set('system', systemPackages);
    }

    initializeServices() {
        const services = [
            { name: 'ssh', description: 'Secure Shell daemon', status: 'running', port: 22 },
            { name: 'apache2', description: 'Apache HTTP Server', status: 'stopped', port: 80 },
            { name: 'mysql', description: 'MySQL Database Server', status: 'stopped', port: 3306 },
            { name: 'postgresql', description: 'PostgreSQL Database Server', status: 'stopped', port: 5432 },
            { name: 'redis', description: 'Redis In-Memory Data Store', status: 'stopped', port: 6379 },
            { name: 'nginx', description: 'Nginx Web Server', status: 'stopped', port: 80 },
            { name: 'docker', description: 'Docker Container Runtime', status: 'stopped', port: null },
            { name: 'metasploit', description: 'Metasploit Framework RPC', status: 'stopped', port: 55553 }
        ];

        services.forEach(service => {
            this.services.set(service.name, service);
        });
    }

    showPackageCategory(category) {
        const packageList = document.getElementById('package-list');
        if (!packageList) return;

        packageList.innerHTML = '';
        
        let packages = [];
        if (category === 'installed') {
            for (const [cat, pkgs] of this.packages) {
                packages.push(...pkgs.filter(pkg => pkg.installed));
            }
        } else {
            packages = this.packages.get(category) || [];
        }

        packages.forEach(pkg => {
            const packageItem = document.createElement('div');
            packageItem.className = 'package-item';
            packageItem.style.cssText = `
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 15px;
                background: rgba(0, 0, 0, 0.3);
                border-radius: 8px;
                margin-bottom: 10px;
                border: 1px solid rgba(0, 255, 255, 0.2);
                transition: all 0.3s ease;
            `;

            packageItem.addEventListener('mouseenter', () => {
                packageItem.style.background = 'rgba(0, 255, 255, 0.1)';
                packageItem.style.borderColor = 'rgba(0, 255, 255, 0.5)';
            });

            packageItem.addEventListener('mouseleave', () => {
                packageItem.style.background = 'rgba(0, 0, 0, 0.3)';
                packageItem.style.borderColor = 'rgba(0, 255, 255, 0.2)';
            });

            const packageInfo = document.createElement('div');
            packageInfo.innerHTML = `
                <div style="color: #00ffff; font-weight: 600; margin-bottom: 5px;">${pkg.name} v${pkg.version}</div>
                <div style="color: #ccc; font-size: 12px;">${pkg.description}</div>
            `;

            const packageActions = document.createElement('div');
            packageActions.style.display = 'flex';
            packageActions.style.gap = '10px';

            if (pkg.installed) {
                const removeBtn = document.createElement('button');
                removeBtn.textContent = 'Remove';
                removeBtn.className = 'btn danger';
                removeBtn.style.cssText = 'padding: 5px 15px; font-size: 12px; background: #e74c3c; color: white; border: none; border-radius: 5px; cursor: pointer;';
                removeBtn.addEventListener('click', () => {
                    this.executeSecurityCommand(`apt remove ${pkg.name}`);
                });
                packageActions.appendChild(removeBtn);
            } else {
                const installBtn = document.createElement('button');
                installBtn.textContent = 'Install';
                installBtn.className = 'btn primary';
                installBtn.style.cssText = 'padding: 5px 15px; font-size: 12px; background: #3498db; color: white; border: none; border-radius: 5px; cursor: pointer;';
                installBtn.addEventListener('click', () => {
                    this.executeSecurityCommand(`apt install ${pkg.name}`);
                });
                packageActions.appendChild(installBtn);
            }

            packageItem.appendChild(packageInfo);
            packageItem.appendChild(packageActions);
            packageList.appendChild(packageItem);
        });
    }

    refreshServices() {
        const serviceList = document.getElementById('service-list');
        if (!serviceList) return;

        serviceList.innerHTML = '';

        for (const [name, service] of this.services) {
            const serviceItem = document.createElement('div');
            serviceItem.className = 'service-item';
            serviceItem.style.cssText = `
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 15px;
                background: rgba(0, 0, 0, 0.3);
                border-radius: 8px;
                margin-bottom: 10px;
                border: 1px solid rgba(0, 255, 255, 0.2);
                transition: all 0.3s ease;
            `;

            const serviceInfo = document.createElement('div');
            serviceInfo.innerHTML = `
                <div style="color: #00ffff; font-weight: 600; margin-bottom: 5px;">${service.name}</div>
                <div style="color: #ccc; font-size: 12px;">${service.description}</div>
            `;

            const serviceStatus = document.createElement('div');
            serviceStatus.style.cssText = `
                padding: 5px 15px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 600;
                margin-right: 15px;
                ${service.status === 'running' ? 
                    'background: rgba(39, 174, 96, 0.2); color: #27ae60; border: 1px solid #27ae60;' :
                    'background: rgba(231, 76, 60, 0.2); color: #e74c3c; border: 1px solid #e74c3c;'
                }
            `;
            serviceStatus.textContent = service.status.toUpperCase();

            const serviceControls = document.createElement('div');
            serviceControls.style.cssText = 'display: flex; gap: 10px;';

            if (service.status === 'running') {
                const stopBtn = document.createElement('button');
                stopBtn.textContent = 'Stop';
                stopBtn.style.cssText = 'padding: 5px 15px; font-size: 12px; background: #e74c3c; color: white; border: none; border-radius: 5px; cursor: pointer;';
                stopBtn.addEventListener('click', () => {
                    this.executeSecurityCommand(`systemctl stop ${service.name}`);
                    service.status = 'stopped';
                    this.refreshServices();
                });
                serviceControls.appendChild(stopBtn);

                const restartBtn = document.createElement('button');
                restartBtn.textContent = 'Restart';
                restartBtn.style.cssText = 'padding: 5px 15px; font-size: 12px; background: #95a5a6; color: white; border: none; border-radius: 5px; cursor: pointer;';
                restartBtn.addEventListener('click', () => {
                    this.executeSecurityCommand(`systemctl restart ${service.name}`);
                });
                serviceControls.appendChild(restartBtn);
            } else {
                const startBtn = document.createElement('button');
                startBtn.textContent = 'Start';
                startBtn.style.cssText = 'padding: 5px 15px; font-size: 12px; background: #27ae60; color: white; border: none; border-radius: 5px; cursor: pointer;';
                startBtn.addEventListener('click', () => {
                    this.executeSecurityCommand(`systemctl start ${service.name}`);
                    service.status = 'running';
                    this.refreshServices();
                });
                serviceControls.appendChild(startBtn);
            }

            serviceItem.appendChild(serviceInfo);
            serviceItem.appendChild(serviceStatus);
            serviceItem.appendChild(serviceControls);
            serviceList.appendChild(serviceItem);
        }
    }

    createNewProject() {
        const name = document.getElementById('project-name').value;
        const type = document.getElementById('project-type').value;
        const template = document.getElementById('project-template').value;

        if (!name) {
            this.showNotification('Please enter a project name', 'error');
            return;
        }

        this.executeSecurityCommand(`create-project ${name} ${type} ${template}`);
        
        const statusArea = document.getElementById('project-status');
        if (statusArea) {
            statusArea.innerHTML = `<p style="color: #00ff00;">Creating project "${name}" of type "${type}"...</p>`;
        }
    }

    async loadSystemInfo() {
        try {
            const response = await fetch('/api/system-info');
            const sysInfo = await response.json();
            
            const systemInfoDiv = document.getElementById('system-info-display');
            if (systemInfoDiv) {
                systemInfoDiv.innerHTML = `
                    <div style="margin-bottom: 10px;">
                        <span style="color: #00ffff;">OS:</span>
                        <span style="color: #fff;">${sysInfo.osName} ${sysInfo.version}</span>
                    </div>
                    <div style="margin-bottom: 10px;">
                        <span style="color: #00ffff;">Uptime:</span>
                        <span style="color: #fff;">${Math.floor(sysInfo.uptime / 1000)}s</span>
                    </div>
                    <div style="margin-bottom: 10px;">
                        <span style="color: #00ffff;">Processes:</span>
                        <span style="color: #fff;">${sysInfo.processCount}</span>
                    </div>
                    <div style="margin-bottom: 10px;">
                        <span style="color: #00ffff;">Users:</span>
                        <span style="color: #fff;">${sysInfo.userCount}</span>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Failed to load system info:', error);
        }
    }

    loadApplicationData(appName) {
        switch (appName) {
            case 'package-manager':
                this.showPackageCategory('security');
                break;
            case 'service-manager':
                this.refreshServices();
                break;
            case 'system-monitor':
                this.loadSystemMonitorData();
                break;
        }
    }

    loadSystemMonitorData() {
        this.loadSystemInfo();
        
        // Load process list
        this.executeSecurityCommand('ps');
        
        // Load network connections
        const networkDiv = document.getElementById('network-connections');
        if (networkDiv) {
            networkDiv.innerHTML = `
                <div style="font-size: 12px; color: #00ff00;">
                    tcp    LISTEN    *:22<br>
                    tcp    LISTEN    *:80<br>
                    tcp    ESTAB     192.168.1.100:22
                </div>
            `;
        }
        
        // Load memory usage
        const memoryDiv = document.getElementById('memory-usage');
        if (memoryDiv) {
            memoryDiv.innerHTML = `
                <div style="font-size: 12px; color: #00ff00;">
                    Total: 8192 MB<br>
                    Used: 4096 MB<br>
                    Free: 4096 MB<br>
                    Cached: 2048 MB
                </div>
            `;
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? 'rgba(231, 76, 60, 0.95)' : 
                        type === 'warning' ? 'rgba(243, 156, 18, 0.95)' : 
                        type === 'success' ? 'rgba(39, 174, 96, 0.95)' :
                        'rgba(52, 152, 219, 0.95)'};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            z-index: 1000;
            max-width: 350px;
            backdrop-filter: blur(10px);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
            border: 1px solid rgba(255, 255, 255, 0.2);
            font-weight: 500;
            animation: slideInRight 0.3s ease-out;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 18px;">
                    ${type === 'error' ? '❌' : 
                      type === 'warning' ? '⚠️' : 
                      type === 'success' ? '✅' : 'ℹ️'}
                </span>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in forwards';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 4000);
    }

    showSecurityAlert(alert) {
        this.showNotification(`🚨 Security Alert: ${alert.message}`, 'error');
    }

    showContextMenu(event, element) {
        // Context menu implementation
        const contextMenu = document.createElement('div');
        contextMenu.style.cssText = `
            position: fixed;
            top: ${event.clientY}px;
            left: ${event.clientX}px;
            background: rgba(0, 0, 0, 0.95);
            border: 1px solid rgba(0, 255, 255, 0.3);
            border-radius: 8px;
            padding: 8px 0;
            z-index: 1000;
            backdrop-filter: blur(10px);
        `;
        
        const menuItems = ['Open', 'Properties', 'Create Shortcut'];
        menuItems.forEach(item => {
            const menuItem = document.createElement('div');
            menuItem.textContent = item;
            menuItem.style.cssText = `
                padding: 8px 16px;
                color: white;
                cursor: pointer;
                transition: background 0.2s;
            `;
            menuItem.addEventListener('mouseenter', () => {
                menuItem.style.background = 'rgba(0, 255, 255, 0.2)';
            });
            menuItem.addEventListener('mouseleave', () => {
                menuItem.style.background = 'transparent';
            });
            contextMenu.appendChild(menuItem);
        });
        
        document.body.appendChild(contextMenu);
        
        setTimeout(() => {
            document.addEventListener('click', () => {
                contextMenu.remove();
            }, { once: true });
        }, 100);
    }

    showErrorScreen(error) {
        document.body.innerHTML = `
            <div style="
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100vh;
                background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%);
                color: #ff6b6b;
                font-family: 'JetBrains Mono', monospace;
                text-align: center;
            ">
                <div>
                    <h1 style="font-size: 48px; margin-bottom: 20px;">⚠️ System Error</h1>
                    <p style="font-size: 18px; margin-bottom: 20px;">mukuviOS failed to initialize</p>
                    <p style="font-size: 14px; color: #ccc;">${error.message}</p>
                    <button onclick="location.reload()" style="
                        margin-top: 30px;
                        padding: 15px 30px;
                        background: #e74c3c;
                        color: white;
                        border: none;
                        border-radius: 8px;
                        cursor: pointer;
                        font-size: 16px;
                    ">Restart System</button>
                </div>
            </div>
        `;
    }

    startSystemClock() {
        const updateClock = () => {
            const now = new Date();
            const clockElement = document.getElementById('clock-time');
            if (clockElement) {
                clockElement.textContent = now.toLocaleTimeString();
            }
            
            const userDisplay = this.currentUser?.username || 'Guest';
            const adminIndicator = this.currentUser?.isAdmin ? ' 🔴' : ' 🟢';
            const userElement = document.getElementById('current-user');
            if (userElement) {
                userElement.textContent = userDisplay + adminIndicator;
            }
        };

        updateClock();
        setInterval(updateClock, 1000);
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Initialize the GUI when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new MukuviOSGUI();
});