import chalk from 'chalk';
import figlet from 'figlet';

export class Commands {
  constructor(kernel) {
    this.kernel = kernel;
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
      'calc': this.calc.bind(this)
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
    let output = chalk.cyan('Available commands:\n\n');
    
    const descriptions = {
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
      'calc': 'Simple calculator'
    };

    for (const cmd of commands) {
      output += chalk.yellow(cmd.padEnd(12)) + descriptions[cmd] + '\n';
    }

    return { output, exit: false };
  }

  async ls(args) {
    try {
      const path = args[0] || this.kernel.fileSystem.getCurrentDirectory();
      const entries = await this.kernel.fileSystem.listDirectory(path);
      
      let output = '';
      for (const entry of entries) {
        const color = entry.type === 'directory' ? chalk.blue : chalk.white;
        output += color(entry.name) + '\n';
      }
      
      return { output, exit: false };
    } catch (error) {
      return { output: chalk.red(error.message), exit: false };
    }
  }

  async cd(args) {
    try {
      const newPath = args[0] || '/home/' + this.kernel.userManager.getCurrentUser().username;
      this.kernel.fileSystem.changeDirectory(newPath);
      return { output: '', exit: false };
    } catch (error) {
      return { output: chalk.red(`cd: ${error.message}`), exit: false };
    }
  }

  async pwd() {
    const currentDir = this.kernel.fileSystem.getCurrentDirectory();
    return { output: currentDir, exit: false };
  }

  async mkdir(args) {
    if (!args[0]) {
      return { output: chalk.red('mkdir: missing directory name'), exit: false };
    }

    try {
      await this.kernel.fileSystem.createDirectory(args[0]);
      return { output: '', exit: false };
    } catch (error) {
      return { output: chalk.red(`mkdir: ${error.message}`), exit: false };
    }
  }

  async touch(args) {
    if (!args[0]) {
      return { output: chalk.red('touch: missing file name'), exit: false };
    }

    try {
      await this.kernel.fileSystem.writeFile(args[0], '');
      return { output: '', exit: false };
    } catch (error) {
      return { output: chalk.red(`touch: ${error.message}`), exit: false };
    }
  }

  async cat(args) {
    if (!args[0]) {
      return { output: chalk.red('cat: missing file name'), exit: false };
    }

    try {
      const content = await this.kernel.fileSystem.readFile(args[0]);
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
      await this.kernel.fileSystem.deleteFile(args[0]);
      return { output: '', exit: false };
    } catch (error) {
      return { output: chalk.red(`rm: ${error.message}`), exit: false };
    }
  }

  async ps() {
    const processes = this.kernel.processManager.getAllProcesses();
    let output = chalk.cyan('PID\tNAME\t\tSTATUS\t\tSTART TIME\n');
    output += chalk.cyan('---\t----\t\t------\t\t----------\n');
    
    for (const proc of processes) {
      output += `${proc.pid}\t${proc.name.padEnd(12)}\t${proc.status.padEnd(8)}\t${proc.startTime.toLocaleTimeString()}\n`;
    }
    
    return { output, exit: false };
  }

  async whoami(args, user) {
    return { output: user.username, exit: false };
  }

  async uname() {
    const sysInfo = this.kernel.getSystemInfo();
    return { output: `${sysInfo.osName} ${sysInfo.version}`, exit: false };
  }

  async uptime() {
    const sysInfo = this.kernel.getSystemInfo();
    const uptimeMs = sysInfo.uptime;
    const uptimeSeconds = Math.floor(uptimeMs / 1000);
    const hours = Math.floor(uptimeSeconds / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);
    const seconds = uptimeSeconds % 60;
    
    return { 
      output: `up ${hours}h ${minutes}m ${seconds}s`, 
      exit: false 
    };
  }

  async clear() {
    console.clear();
    return { output: '', exit: false };
  }

  async exit() {
    return { output: chalk.yellow('Goodbye!'), exit: true };
  }

  async shutdown() {
    await this.kernel.shutdown();
    return { output: '', exit: true };
  }

  async users() {
    const users = await this.kernel.userManager.getAllUsers();
    let output = chalk.cyan('USERNAME\tFULL NAME\t\tCREATED\n');
    output += chalk.cyan('--------\t---------\t\t-------\n');
    
    for (const user of users) {
      output += `${user.username.padEnd(12)}\t${user.fullName.padEnd(16)}\t${new Date(user.createdAt).toLocaleDateString()}\n`;
    }
    
    return { output, exit: false };
  }

  async sysinfo() {
    const sysInfo = this.kernel.getSystemInfo();
    let output = chalk.cyan('=== Mukuvi OS System Information ===\n\n');
    output += `OS Name: ${sysInfo.osName}\n`;
    output += `Version: ${sysInfo.version}\n`;
    output += `Boot Time: ${sysInfo.bootTime.toLocaleString()}\n`;
    output += `Uptime: ${Math.floor(sysInfo.uptime / 1000)} seconds\n`;
    output += `Processes: ${sysInfo.processCount}\n`;
    output += `Active Users: ${sysInfo.userCount}\n`;
    output += `Node.js Version: ${process.version}\n`;
    output += `Platform: ${process.platform}\n`;
    output += `Architecture: ${process.arch}\n`;
    
    return { output, exit: false };
  }

  async banner() {
    const banner = figlet.textSync('MUKUVI OS', { horizontalLayout: 'full' });
    const output = chalk.cyan(banner) + '\n' + 
                  chalk.yellow('Welcome to Mukuvi Operating System') + '\n' +
                  chalk.gray('A complete terminal-based OS experience');
    
    return { output, exit: false };
  }

  async history() {
    // This would need to be implemented with shell history tracking
    return { output: chalk.gray('Command history not implemented yet'), exit: false };
  }

  async date() {
    return { output: new Date().toString(), exit: false };
  }

  async calc(args) {
    if (!args[0]) {
      return { output: chalk.red('calc: missing expression'), exit: false };
    }

    try {
      const expression = args.join(' ');
      // Simple calculator - only allow basic math operations for security
      const sanitized = expression.replace(/[^0-9+\-*/.() ]/g, '');
      const result = eval(sanitized);
      return { output: `${expression} = ${result}`, exit: false };
    } catch (error) {
      return { output: chalk.red('calc: invalid expression'), exit: false };
    }
  }
}