class MukuviGUI {
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
        
        // Initialize data
        this.initializePackages();
        this.initializeServices();
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
            'Loading Metasploit framework...',
            'Initializing Burp Suite...',
            'Starting development environment...',
            'Loading package manager...',
            'Security systems ready!'
        ];

        for (let i = 0; i < bootMessages.length; i++) {
            loadingText.textContent = bootMessages[i];
            await this.sleep(500);
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
        this.showWelcomeMessage();
        
        // Focus terminal input
        const terminalInput = document.getElementById('terminal-input');
        if (terminalInput) {
            terminalInput.focus();
        }
    }

    showWelcomeMessage() {
        const welcomeMsg = `🔒 Welcome to Mukuvi OS - Complete Hacking & Programming Environment!

🛡️ Security Tools Available:
• WiFi Security Testing (aircrack-ng, wifi-crack, handshake capture)
• Web Application Security (sqlmap, burpsuite, nikto, dirb, gobuster)
• Network Security (nmap-scan, vuln-scan, network-discovery)
• Penetration Testing (metasploit, msfconsole, hydra)
• Password Cracking (john, hashcat, hash-crack)
• Network Analysis (wireshark, tcpdump, netstat)
• Social Engineering Toolkit
• AI Security Assistant (ARIA)

💻 Development Environment:
• Programming Languages (Python, Node.js, C/C++, JavaScript)
• Package Management (apt, npm, pip)
• Development Tools (git, docker, vim, nano, VS Code)
• Project Management (create-project, dev-server, build, test, deploy)
• Database Support (MySQL, PostgreSQL, Redis)

⚙️ System Administration:
• Service Management (systemctl, service)
• Process Monitoring (ps, top, htop, free, df, du, lsof)
• User Management (sudo, su, chmod, chown)
• Network Tools (ping, traceroute, dig, nslookup, ss)
• Firewall (iptables, ufw)
• File Operations (find, grep, tar, zip, wget, curl)

🚀 Quick Start:
• Use desktop icons or start menu to launch applications
• Type 'help' for full command list
• Use 'apt install <package>' to install new tools
• Use 'ai <question>' for security assistance

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
        if (terminalInput) {
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
        }

        // Desktop icons
        document.querySelectorAll('.desktop-icon').forEach(icon => {
            icon.addEventListener('dblclick', () => {
                const app = icon.getAttribute('data-app');
                this.launchApplication(app);
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

        // Click outside to close start menu
        document.addEventListener('click', (e) => {
            if (!e.target.closest('#start-menu-btn') && !e.target.closest('#start-menu')) {
                this.hideStartMenu();
            }
        });
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
                const bssid = prompt('Enter BSSID to capture:');
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
                const target = prompt('Enter target IP:');
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
            } else {
                errorDiv.textContent = result.error;
                errorDiv.classList.remove('hidden');
            }
        } catch (error) {
            errorDiv.textContent = 'Connection error';
            errorDiv.classList.remove('hidden');
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
                    setTimeout(() => terminalInput.focus(), 100);
                }
            }
            
            // Load application-specific data
            this.loadApplicationData(appName);
        } else {
            // Handle applications that don't have dedicated windows
            this.handleSpecialApplications(appName);
        }
    }

    handleSpecialApplications(appName) {
        switch (appName) {
            case 'python':
                this.launchApplication('terminal');
                this.executeSecurityCommand('python3');
                break;
            case 'nodejs':
                this.launchApplication('terminal');
                this.executeSecurityCommand('node');
                break;
            case 'git':
                this.launchApplication('terminal');
                this.executeSecurityCommand('git status');
                break;
            case 'docker':
                this.launchApplication('terminal');
                this.executeSecurityCommand('docker ps');
                break;
            case 'vscode':
                this.launchApplication('terminal');
                this.executeSecurityCommand('code .');
                break;
            case 'nmap':
                this.launchApplication('terminal');
                this.executeSecurityCommand('nmap-scan 192.168.1.1');
                break;
            case 'burpsuite':
                this.launchApplication('terminal');
                this.executeSecurityCommand('burpsuite http://example.com');
                break;
            case 'wireshark':
                this.launchApplication('terminal');
                this.executeSecurityCommand('wireshark eth0');
                break;
            case 'john':
                this.launchApplication('terminal');
                this.executeSecurityCommand('john --help');
                break;
            case 'hashcat':
                this.launchApplication('terminal');
                this.executeSecurityCommand('hashcat --help');
                break;
            case 'social-engineer':
                this.launchApplication('terminal');
                this.executeSecurityCommand('social-engineer phishing example@target.com');
                break;
            case 'firewall':
                this.launchApplication('terminal');
                this.executeSecurityCommand('ufw status');
                break;
            case 'file-manager':
                this.launchApplication('terminal');
                this.executeSecurityCommand('ls -la');
                break;
            default:
                this.showNotification(`Application ${appName} not implemented yet`, 'warning');
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
                    window.style.width = '80%';
                    window.style.height = '70%';
                    window.style.left = '10%';
                    window.style.top = '10%';
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
            indicator.style.cssText = `
                width: 8px;
                height: 8px;
                background: #00ff00;
                border-radius: 50%;
                margin: 0 2px;
                box-shadow: 0 0 5px #00ff00;
            `;
            runningAppsContainer.appendChild(indicator);
        });
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

    getPromptText() {
        const userColor = this.currentUser?.isAdmin ? '🔴' : '🟢';
        return `${userColor}${this.currentUser?.username || 'user'}@mukuvi-security:${this.currentDirectory}$ `;
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
            'ai', 'exploit-db', 'forensics', 'security-audit'
        ];
        
        const matches = allCommands.filter(cmd => cmd.startsWith(value));
        if (matches.length === 1) {
            input.value = matches[0] + ' ';
        }
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
            // Show all installed packages
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
            `;

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
                removeBtn.style.padding = '5px 15px';
                removeBtn.style.fontSize = '12px';
                removeBtn.addEventListener('click', () => {
                    this.executeSecurityCommand(`apt remove ${pkg.name}`);
                });
                packageActions.appendChild(removeBtn);
            } else {
                const installBtn = document.createElement('button');
                installBtn.textContent = 'Install';
                installBtn.className = 'btn primary';
                installBtn.style.padding = '5px 15px';
                installBtn.style.fontSize = '12px';
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

            const serviceInfo = document.createElement('div');
            serviceInfo.className = 'service-info';
            serviceInfo.innerHTML = `
                <div class="service-name">${service.name}</div>
                <div class="service-description">${service.description}</div>
            `;

            const serviceStatus = document.createElement('div');
            serviceStatus.className = `service-status ${service.status}`;
            serviceStatus.textContent = service.status.toUpperCase();

            const serviceControls = document.createElement('div');
            serviceControls.className = 'service-controls';

            if (service.status === 'running') {
                const stopBtn = document.createElement('button');
                stopBtn.textContent = 'Stop';
                stopBtn.className = 'btn danger';
                stopBtn.addEventListener('click', () => {
                    this.executeSecurityCommand(`systemctl stop ${service.name}`);
                    service.status = 'stopped';
                    this.refreshServices();
                });
                serviceControls.appendChild(stopBtn);

                const restartBtn = document.createElement('button');
                restartBtn.textContent = 'Restart';
                restartBtn.className = 'btn secondary';
                restartBtn.addEventListener('click', () => {
                    this.executeSecurityCommand(`systemctl restart ${service.name}`);
                });
                serviceControls.appendChild(restartBtn);
            } else {
                const startBtn = document.createElement('button');
                startBtn.textContent = 'Start';
                startBtn.className = 'btn success';
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
            background: ${type === 'error' ? 'rgba(231, 76, 60, 0.9)' : 
                        type === 'warning' ? 'rgba(243, 156, 18, 0.9)' : 
                        'rgba(52, 152, 219, 0.9)'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 1000;
            max-width: 300px;
            backdrop-filter: blur(10px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    showSecurityAlert(alert) {
        this.showNotification(`🚨 Security Alert: ${alert.message}`, 'error');
    }

    startClock() {
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

// Initialize the GUI when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new MukuviGUI();
});