import chalk from 'chalk';
import figlet from 'figlet';
import { SecurityCommands } from '../security/security-commands.js';

export class Commands {
  constructor(osApi) {
    this.osApi = osApi;
    this.securityCommands = new SecurityCommands(osApi);
    
    // Merge security commands with base commands
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
      ...this.securityCommands.getCommands()
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
    let output = chalk.cyan('🖥️  Mukuvi OS - Advanced Security Operating System\n\n');
    
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
      
      // Security commands
      'wifi-scan': 'Scan for WiFi networks',
      'wifi-capture': 'Capture WPA handshakes',
      'wifi-crack': 'Crack WiFi passwords',
      'wifi-deauth': 'Deauthentication attacks',
      'wifi-list': 'List WiFi scan results',
      'nmap-scan': 'Network port scanning',
      'vuln-scan': 'Vulnerability assessment',
      'network-discovery': 'Discover network hosts',
      'ai': 'Ask the AI security assistant',
      'ai-history': 'View AI conversation history',
      'exploit-db': 'Search exploit database',
      'hash-crack': 'Password hash cracking',
      'forensics': 'Digital forensics tools',
      'security-audit': 'System security audit'
    };

    // Group commands by category
    const categories = {
      '📁 File Operations': ['ls', 'cd', 'pwd', 'mkdir', 'touch', 'cat', 'rm'],
      '💻 System Info': ['ps', 'whoami', 'uname', 'uptime', 'sysinfo', 'users'],
      '🛠️  Utilities': ['echo', 'date', 'calc', 'clear', 'help', 'history', 'banner'],
      '🔒 WiFi Security': ['wifi-scan', 'wifi-capture', 'wifi-crack', 'wifi-deauth', 'wifi-list'],
      '🌐 Network Security': ['nmap-scan', 'vuln-scan', 'network-discovery'],
      '🤖 AI Assistant': ['ai', 'ai-history'],
      '🔍 Security Tools': ['exploit-db', 'hash-crack', 'forensics', 'security-audit'],
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
    return { output: `${sysInfo.osName} ${sysInfo.version} - Security Edition`, exit: false };
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
    return { output: chalk.yellow('👋 Goodbye! Stay secure!'), exit: true };
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
    output += chalk.cyan('═'.repeat(40) + '\n\n');
    output += `${chalk.yellow('OS Name:')} ${sysInfo.osName}\n`;
    output += `${chalk.yellow('Version:')} ${sysInfo.version}\n`;
    output += `${chalk.yellow('Edition:')} Security & Penetration Testing\n`;
    output += `${chalk.yellow('Boot Time:')} ${sysInfo.bootTime.toLocaleString()}\n`;
    output += `${chalk.yellow('Uptime:')} ${Math.floor(sysInfo.uptime / 1000)} seconds\n`;
    output += `${chalk.yellow('Processes:')} ${sysInfo.processCount}\n`;
    output += `${chalk.yellow('Active Users:')} ${sysInfo.userCount}\n`;
    output += `${chalk.yellow('Node.js Version:')} ${process.version}\n`;
    output += `${chalk.yellow('Platform:')} ${process.platform}\n`;
    output += `${chalk.yellow('Architecture:')} ${process.arch}\n\n`;
    output += chalk.green('🔒 Security Features Enabled:\n');
    output += chalk.white('  • WiFi Security Testing\n');
    output += chalk.white('  • Network Vulnerability Scanning\n');
    output += chalk.white('  • AI Security Assistant\n');
    output += chalk.white('  • Digital Forensics Tools\n');
    output += chalk.white('  • Exploit Database Access\n');
    
    return { output, exit: false };
  }

  async banner() {
    const banner = figlet.textSync('MUKUVI OS', { horizontalLayout: 'full' });
    const output = chalk.cyan(banner) + '\n' + 
                  chalk.yellow('🔒 Advanced Security Operating System') + '\n' +
                  chalk.green('🛡️  Penetration Testing & Digital Forensics Platform') + '\n' +
                  chalk.gray('Built for ethical hackers and security professionals') + '\n\n' +
                  chalk.white('Features: WiFi Security • Network Scanning • AI Assistant • Forensics');
    
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