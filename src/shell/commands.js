import chalk from 'chalk';
import figlet from 'figlet';
import { SecurityCommands } from '../security/security-commands.js';
import { AdvancedCommands } from '../security/advanced-commands.js';

export class Commands {
  constructor(osApi) {
    this.osApi = osApi;
    this.securityCommands = new SecurityCommands(osApi);
    this.advancedCommands = new AdvancedCommands(osApi);
    
    // Merge all command sets
    this.commandMap = {
      'help': this.help.bind(this),
      'ls': this.ls.bind(this),
      'cd': this.cd.bind(this),
      'pwd': this.pwd.bind(this),
      'mkdir': this.mkdir.bind(this),
      'touch': this.touch.bind(this),
      'cat': this.cat.bind(this),
      'echo': this.echo.bind(this),
      'rm': this.rm.bind(this),
      'ps': this.ps.bind(this),
      'whoami': this.whoami.bind(this),
      'uname': this.uname.bind(this),
      'uptime': this.uptime.bind(this),
      'clear': this.clear.bind(this),
      'exit': this.exit.bind(this),
      'shutdown': this.shutdown.bind(this),
      'users': this.users.bind(this),
      'sysinfo': this.sysinfo.bind(this),
      'banner': this.banner.bind(this),
      'history': this.history.bind(this),
      'date': this.date.bind(this),
      'calc': this.calc.bind(this),
      // Add security commands
      ...this.securityCommands.getCommands(),
      // Add advanced commands (hacking, programming, system admin)
      ...this.advancedCommands.getCommands()
    };
  }

  hasCommand(command) {
    return this.commandMap.hasOwnProperty(command);
  }

  async execute(command, args, user) {
    return await this.commandMap[command](args, user);
  }

  async help(args) {
    const commands = Object.keys(this.commandMap).sort();
    let output = chalk.cyan('🖥️  Mukuvi OS - Complete Linux-Style Hacking & Programming Environment\n\n');
    
    const descriptions = {
      // Basic commands
      'help': 'Show this help message',
      'ls': 'List directory contents',
      'cd': 'Change directory',
      'pwd': 'Print working directory',
      'mkdir': 'Create directory',
      'touch': 'Create empty file',
      'cat': 'Display file contents',
      'echo': 'Display text',
      'rm': 'Remove file',
      'ps': 'Show running processes',
      'whoami': 'Show current user',
      'uname': 'Show system information',
      'uptime': 'Show system uptime',
      'clear': 'Clear screen',
      'exit': 'Exit shell',
      'shutdown': 'Shutdown system',
      'users': 'List all users',
      'sysinfo': 'Show detailed system information',
      'banner': 'Show Mukuvi OS banner',
      'history': 'Show command history',
      'date': 'Show current date and time',
      'calc': 'Simple calculator',
      
      // Package Management
      'apt': 'Advanced Package Tool',
      'apt-get': 'APT package manager',
      'dpkg': 'Debian package manager',
      'snap': 'Snap package manager',
      
      // Service Management
      'systemctl': 'Control systemd services',
      'service': 'Control system services',
      
      // Development Tools
      'create-project': 'Create new development project',
      'dev-server': 'Start development server',
      'build': 'Build project',
      'test': 'Run project tests',
      'deploy': 'Deploy project',
      
      // Programming Languages
      'python': 'Python interpreter',
      'python3': 'Python 3 interpreter',
      'node': 'Node.js runtime',
      'npm': 'Node Package Manager',
      'pip': 'Python Package Installer',
      'gcc': 'GNU Compiler Collection',
      'make': 'Build automation tool',
      'git': 'Version control system',
      'docker': 'Container platform',
      'vim': 'Vi IMproved text editor',
      'nano': 'Simple text editor',
      'code': 'Visual Studio Code',
      
      // WiFi Security
      'wifi-scan': 'Scan for WiFi networks',
      'wifi-capture': 'Capture WPA handshakes',
      'wifi-crack': 'Crack WiFi passwords',
      'wifi-deauth': 'Deauthentication attacks',
      'wifi-list': 'List WiFi scan results',
      'aircrack-ng': 'WiFi security auditing suite',
      
      // Network Security
      'nmap-scan': 'Network port scanning',
      'vuln-scan': 'Vulnerability assessment',
      'network-discovery': 'Discover network hosts',
      'netstat': 'Display network connections',
      'ss': 'Socket statistics',
      'ping': 'Test network connectivity',
      'traceroute': 'Trace network path',
      'dig': 'DNS lookup utility',
      'nslookup': 'DNS lookup tool',
      
      // Web Application Security
      'sqlmap': 'Automatic SQL injection tool',
      'burpsuite': 'Web application security testing',
      'nikto': 'Web server scanner',
      'dirb': 'Web content scanner',
      'gobuster': 'Directory/file brute forcer',
      
      // Penetration Testing
      'metasploit': 'Penetration testing framework',
      'msfconsole': 'Metasploit console',
      'hydra': 'Network login cracker',
      'social-engineer': 'Social engineering toolkit',
      
      // Password Cracking
      'john': 'John the Ripper password cracker',
      'hashcat': 'Advanced password recovery',
      'hash-crack': 'Password hash cracking',
      
      // Network Analysis
      'wireshark': 'Network protocol analyzer',
      'tcpdump': 'Network packet analyzer',
      
      // AI Assistant
      'ai': 'Ask the AI security assistant',
      'ai-history': 'View AI conversation history',
      
      // Security Tools
      'exploit-db': 'Search exploit database',
      'forensics': 'Digital forensics tools',
      'security-audit': 'System security audit',
      
      // System Administration
      'top': 'Display running processes',
      'htop': 'Interactive process viewer',
      'free': 'Display memory usage',
      'df': 'Display filesystem usage',
      'du': 'Display directory usage',
      'lsof': 'List open files',
      'crontab': 'Schedule tasks',
      'sudo': 'Execute as another user',
      'su': 'Switch user',
      'chmod': 'Change file permissions',
      'chown': 'Change file ownership',
      
      // File Operations
      'find': 'Search for files',
      'grep': 'Search text patterns',
      'awk': 'Text processing tool',
      'sed': 'Stream editor',
      'tar': 'Archive files',
      'zip': 'Create zip archives',
      'unzip': 'Extract zip archives',
      'wget': 'Download files',
      'curl': 'Transfer data',
      
      // Firewall
      'iptables': 'Configure firewall rules',
      'ufw': 'Uncomplicated Firewall'
    };

    // Group commands by category
    const categories = {
      '📁 File Operations': ['ls', 'cd', 'pwd', 'mkdir', 'touch', 'cat', 'rm', 'find', 'grep', 'chmod', 'chown'],
      '💻 System Info & Monitoring': ['ps', 'top', 'htop', 'free', 'df', 'du', 'whoami', 'uname', 'uptime', 'sysinfo', 'users', 'lsof'],
      '📦 Package Management': ['apt', 'apt-get', 'dpkg', 'snap'],
      '⚙️ Service Management': ['systemctl', 'service'],
      '🛠️ Development Tools': ['create-project', 'dev-server', 'build', 'test', 'deploy'],
      '💻 Programming Languages': ['python', 'python3', 'node', 'npm', 'pip', 'gcc', 'make', 'git', 'docker'],
      '📝 Text Editors': ['vim', 'nano', 'code'],
      '🔒 WiFi Security': ['wifi-scan', 'wifi-capture', 'wifi-crack', 'wifi-deauth', 'wifi-list', 'aircrack-ng'],
      '🌐 Network Security': ['nmap-scan', 'vuln-scan', 'network-discovery', 'netstat', 'ss', 'ping', 'traceroute', 'dig', 'nslookup'],
      '🕷️ Web Application Security': ['sqlmap', 'burpsuite', 'nikto', 'dirb', 'gobuster'],
      '🚀 Penetration Testing': ['metasploit', 'msfconsole', 'hydra', 'social-engineer'],
      '🔐 Password Cracking': ['john', 'hashcat', 'hash-crack'],
      '📡 Network Analysis': ['wireshark', 'tcpdump'],
      '🤖 AI Assistant': ['ai', 'ai-history'],
      '🔍 Security Tools': ['exploit-db', 'forensics', 'security-audit'],
      '🔥 Firewall': ['iptables', 'ufw'],
      '📄 Text Processing': ['awk', 'sed', 'tar', 'zip', 'unzip'],
      '🌍 Network Utilities': ['wget', 'curl'],
      '👑 System Administration': ['sudo', 'su', 'crontab'],
      '🛠️ Utilities': ['echo', 'date', 'calc', 'clear', 'help', 'history', 'banner'],
      '⚡ System Control': ['exit', 'shutdown']
    };

    for (const [category, categoryCommands] of Object.entries(categories)) {
      output += chalk.yellow(`${category}:\n`);
      for (const cmd of categoryCommands) {
        if (descriptions[cmd]) {
          output += chalk.green(`  ${cmd.padEnd(18)}`) + descriptions[cmd] + '\n';
        }
      }
      output += '\n';
    }

    output += chalk.cyan('💡 Tips:\n');
    output += chalk.white('  • Use "ai <question>" to get help with security topics\n');
    output += chalk.white('  • Use "apt install <package>" to install new tools\n');
    output += chalk.white('  • Use "systemctl status" to see running services\n');
    output += chalk.white('  • Use "create-project <name> <type>" to start development\n');
    output += chalk.white('  • Always use security tools ethically and legally\n');
    output += chalk.white('  • Type "help <command>" for detailed command info\n');

    return { output, exit: false };
  }

  async ls(args) {
    try {
      const path = args[0] || this.osApi.fileSystem.getCurrentDirectory();
      const entries = await this.osApi.fileSystem.listDirectory(path);
      
      let output = '';
      for (const entry of entries) {
        const color = entry.type === 'directory' ? chalk.blue : chalk.white;
        const icon = entry.type === 'directory' ? '📁' : '📄';
        output += color(`${icon} ${entry.name}`) + '\n';
      }
      
      return { output, exit: false };
    } catch (error) {
      return { output: chalk.red(error.message), exit: false };
    }
  }

  async cd(args) {
    try {
      const newPath = args[0] || '/home/' + this.osApi.userManager.getCurrentUser().username;
      this.osApi.fileSystem.changeDirectory(newPath);
      return { output: '', exit: false };
    } catch (error) {
      return { output: chalk.red(`cd: ${error.message}`), exit: false };
    }
  }

  async pwd() {
    const currentDir = this.osApi.fileSystem.getCurrentDirectory();
    return { output: currentDir, exit: false };
  }

  async mkdir(args) {
    if (!args[0]) {
      return { output: chalk.red('mkdir: missing directory name'), exit: false };
    }

    try {
      await this.osApi.fileSystem.createDirectory(args[0]);
      return { output: chalk.green(`📁 Directory '${args[0]}' created`), exit: false };
    } catch (error) {
      return { output: chalk.red(`mkdir: ${error.message}`), exit: false };
    }
  }

  async touch(args) {
    if (!args[0]) {
      return { output: chalk.red('touch: missing file name'), exit: false };
    }

    try {
      await this.osApi.fileSystem.writeFile(args[0], '');
      return { output: chalk.green(`📄 File '${args[0]}' created`), exit: false };
    } catch (error) {
      return { output: chalk.red(`touch: ${error.message}`), exit: false };
    }
  }

  async cat(args) {
    if (!args[0]) {
      return { output: chalk.red('cat: missing file name'), exit: false };
    }

    try {
      const content = await this.osApi.fileSystem.readFile(args[0]);
      return { output: content, exit: false };
    } catch (error) {
      return { output: chalk.red(`cat: ${error.message}`), exit: false };
    }
  }

  async echo(args) {
    return { output: args.join(' '), exit: false };
  }

  async rm(args) {
    if (!args[0]) {
      return { output: chalk.red('rm: missing file name'), exit: false };
    }

    try {
      await this.osApi.fileSystem.deleteFile(args[0]);
      return { output: chalk.green(`🗑️  File '${args[0]}' removed`), exit: false };
    } catch (error) {
      return { output: chalk.red(`rm: ${error.message}`), exit: false };
    }
  }

  async ps() {
    const processes = this.osApi.processManager.getAllProcesses();
    let output = chalk.cyan('PID\tNAME\t\tSTATUS\t\tSTART TIME\n');
    output += chalk.cyan('───\t────\t\t──────\t\t──────────\n');
    
    for (const proc of processes) {
      output += `${proc.pid}\t${proc.name.padEnd(12)}\t${proc.status.padEnd(8)}\t${proc.startTime.toLocaleTimeString()}\n`;
    }
    
    return { output, exit: false };
  }

  async whoami(args, user) {
    return { output: `${user.username} (${user.fullName})`, exit: false };
  }

  async uname() {
    const sysInfo = this.osApi.getSystemInfo();
    return { output: `${sysInfo.osName} ${sysInfo.version} - Complete Hacking & Programming Edition`, exit: false };
  }

  async uptime() {
    const sysInfo = this.osApi.getSystemInfo();
    const uptimeMs = sysInfo.uptime;
    const uptimeSeconds = Math.floor(uptimeMs / 1000);
    const hours = Math.floor(uptimeSeconds / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);
    const seconds = uptimeSeconds % 60;
    
    return { 
      output: `⏱️  up ${hours}h ${minutes}m ${seconds}s`, 
      exit: false 
    };
  }

  async clear() {
    console.clear();
    return { output: '', exit: false };
  }

  async exit() {
    return { output: chalk.yellow('👋 Goodbye! Stay secure and keep coding!'), exit: true };
  }

  async shutdown() {
    await this.osApi.shutdown();
    return { output: '', exit: true };
  }

  async users() {
    const users = await this.osApi.userManager.getAllUsers();
    let output = chalk.cyan('USERNAME\tFULL NAME\t\tCREATED\t\tADMIN\n');
    output += chalk.cyan('────────\t─────────\t\t───────\t\t─────\n');
    
    for (const user of users) {
      const adminStatus = user.isAdmin ? chalk.green('Yes') : chalk.gray('No');
      output += `${user.username.padEnd(12)}\t${user.fullName.padEnd(16)}\t${new Date(user.createdAt).toLocaleDateString()}\t${adminStatus}\n`;
    }
    
    return { output, exit: false };
  }

  async sysinfo() {
    const sysInfo = this.osApi.getSystemInfo();
    let output = chalk.cyan('🖥️  Mukuvi OS System Information\n');
    output += chalk.cyan('═'.repeat(50) + '\n\n');
    output += `${chalk.yellow('OS Name:')} ${sysInfo.osName}\n`;
    output += `${chalk.yellow('Version:')} ${sysInfo.version}\n`;
    output += `${chalk.yellow('Edition:')} Complete Hacking & Programming Environment\n`;
    output += `${chalk.yellow('Boot Time:')} ${sysInfo.bootTime.toLocaleString()}\n`;
    output += `${chalk.yellow('Uptime:')} ${Math.floor(sysInfo.uptime / 1000)} seconds\n`;
    output += `${chalk.yellow('Processes:')} ${sysInfo.processCount}\n`;
    output += `${chalk.yellow('Active Users:')} ${sysInfo.userCount}\n`;
    output += `${chalk.yellow('Node.js Version:')} ${process.version}\n`;
    output += `${chalk.yellow('Platform:')} ${process.platform}\n`;
    output += `${chalk.yellow('Architecture:')} ${process.arch}\n\n`;
    
    output += chalk.green('🔒 Security Features:\n');
    output += chalk.white('  • WiFi Security Testing (aircrack-ng, wifi-crack)\n');
    output += chalk.white('  • Network Vulnerability Scanning (nmap, vuln-scan)\n');
    output += chalk.white('  • Web Application Testing (sqlmap, burpsuite)\n');
    output += chalk.white('  • Penetration Testing Framework (metasploit)\n');
    output += chalk.white('  • Password Cracking (john, hashcat)\n');
    output += chalk.white('  • Network Analysis (wireshark, tcpdump)\n');
    output += chalk.white('  • Social Engineering Toolkit\n');
    output += chalk.white('  • AI Security Assistant (ARIA)\n');
    output += chalk.white('  • Digital Forensics Tools\n\n');
    
    output += chalk.blue('💻 Development Features:\n');
    output += chalk.white('  • Multi-language Support (Python, Node.js, C/C++)\n');
    output += chalk.white('  • Package Management (apt, npm, pip)\n');
    output += chalk.white('  • Development Tools (git, docker, vim, code)\n');
    output += chalk.white('  • Project Creation & Management\n');
    output += chalk.white('  • Service Management (systemctl)\n');
    output += chalk.white('  • Build & Deployment Tools\n');
    output += chalk.white('  • Database Support (MySQL, PostgreSQL)\n\n');
    
    output += chalk.magenta('🛠️ System Administration:\n');
    output += chalk.white('  • Process Management (ps, top, htop)\n');
    output += chalk.white('  • File System Operations (find, grep, tar)\n');
    output += chalk.white('  • Network Configuration (iptables, ufw)\n');
    output += chalk.white('  • User & Permission Management\n');
    output += chalk.white('  • System Monitoring & Logging\n');
    output += chalk.white('  • Cron Job Scheduling\n');
    
    return { output, exit: false };
  }

  async banner() {
    const banner = figlet.textSync('MUKUVI OS', { horizontalLayout: 'full' });
    const output = chalk.cyan(banner) + '\n' + 
                  chalk.yellow('🔒 Complete Linux-Style Hacking & Programming Environment') + '\n' +
                  chalk.green('🛡️  Penetration Testing • Development • System Administration') + '\n' +
                  chalk.gray('Built for ethical hackers, developers, and system administrators') + '\n\n' +
                  chalk.white('Features: WiFi Security • Web App Testing • Network Scanning • Programming • AI Assistant');
    
    return { output, exit: false };
  }

  async history() {
    return { output: chalk.gray('📚 Command history feature coming soon...'), exit: false };
  }

  async date() {
    const now = new Date();
    return { output: `📅 ${now.toString()}`, exit: false };
  }

  async calc(args) {
    if (!args[0]) {
      return { output: chalk.red('calc: missing expression'), exit: false };
    }

    try {
      const expression = args.join(' ');
      const sanitized = expression.replace(/[^0-9+\-*/.() ]/g, '');
      const result = eval(sanitized);
      return { output: `🧮 ${expression} = ${result}`, exit: false };
    } catch (error) {
      return { output: chalk.red('calc: invalid expression'), exit: false };
    }
  }
}