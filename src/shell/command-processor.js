import chalk from 'chalk';
import { Commands } from './commands.js';

export class CommandProcessor {
  constructor(osApi) {
    this.osApi = osApi;
    this.commands = new Commands(osApi);
  }

  async execute(commandLine, user) {
    const parts = this.parseCommand(commandLine);
    const command = parts[0];
    const args = parts.slice(1);

    // Check if command exists
    if (!this.commands.hasCommand(command)) {
      return {
        output: chalk.red(`Command not found: ${command}`),
        exit: false
      };
    }

    // Execute command
    try {
      const result = await this.commands.execute(command, args, user);
      return result;
    } catch (error) {
      return {
        output: chalk.red(`Error executing ${command}: ${error.message}`),
        exit: false
      };
    }
  }

  parseCommand(commandLine) {
    // Simple command parsing - could be enhanced for quotes, pipes, etc.
    return commandLine.trim().split(/\s+/);
  }
}