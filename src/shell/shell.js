import readline from 'readline';
import chalk from 'chalk';
import { CommandProcessor } from './command-processor.js';
import { OsApi } from '../api/os-api.js';

export class Shell {
  constructor(kernel) {
    this.kernel = kernel;
    this.osApi = new OsApi(kernel);
    this.commandProcessor = new CommandProcessor(this.osApi);
    this.rl = null;
    this.currentUser = null;
    this.isRunning = false;
    this.history = [];
  }

  async start() {
    console.log(chalk.green('✅ Shell started'));
    await this.login();
  }

  async login() {
    console.log(chalk.cyan('\n=== Mukuvi OS Login ==='));
    
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const username = await this.prompt('Username: ');
    const password = await this.prompt('Password: ', true);

    const authResult = await this.osApi.userManager.authenticateUser(username, password);
    
    if (authResult.success) {
      this.currentUser = authResult.user;
      console.log(chalk.green(`\nWelcome, ${this.currentUser.fullName}!`));
      await this.startCommandLoop();
    } else {
      console.log(chalk.red('Login failed: ' + authResult.error));
      this.rl.close();
      process.exit(1);
    }
  }

  async prompt(question, hidden = false) {
    return new Promise((resolve) => {
      if (hidden) {
        process.stdout.write(question);
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.setEncoding('utf8');
        
        let input = '';
        const onData = (char) => {
          if (char === '\r' || char === '\n') {
            process.stdin.setRawMode(false);
            process.stdin.pause();
            process.stdin.removeListener('data', onData);
            console.log();
            resolve(input);
          } else if (char === '\u0003') { // Ctrl+C
            process.exit();
          } else if (char === '\u007f') { // Backspace
            if (input.length > 0) {
              input = input.slice(0, -1);
              process.stdout.write('\b \b');
            }
          } else {
            input += char;
            process.stdout.write('*');
          }
        };
        
        process.stdin.on('data', onData);
      } else {
        this.rl.question(question, resolve);
      }
    });
  }

  async startCommandLoop() {
    this.isRunning = true;
    
    while (this.isRunning) {
      const currentDir = this.osApi.fileSystem.getCurrentDirectory();
      const prompt = chalk.green(`${this.currentUser.username}@mukuvi`) + 
                    chalk.blue(`:${currentDir}`) + 
                    chalk.white('$ ');
      
      const command = await this.prompt(prompt);
      
      if (command.trim()) {
        this.history.push(command);
        await this.executeCommand(command.trim());
      }
    }
  }

  async executeCommand(command) {
    try {
      const result = await this.commandProcessor.execute(command, this.currentUser);
      
      if (result.output) {
        console.log(result.output);
      }
      
      if (result.exit) {
        this.isRunning = false;
      }
    } catch (error) {
      console.log(chalk.red(`Error: ${error.message}`));
    }
  }

  async stop() {
    this.isRunning = false;
    if (this.rl) {
      this.rl.close();
    }
  }
}