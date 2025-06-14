import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';
import { ProcessManager } from './process-manager.js';
import { FileSystem } from './filesystem.js';
import { UserManager } from './user-manager.js';
import { Shell } from '../shell/shell.js';

export class MukuviKernel {
  constructor() {
    this.version = '1.0.0';
    this.osPath = path.join(process.cwd(), 'mukuvi-system');
    this.isRunning = false;
    this.bootTime = null;
    this.processManager = new ProcessManager();
    this.fileSystem = new FileSystem(this.osPath);
    this.userManager = new UserManager(this.osPath);
    this.shell = null;
    this.systemConfig = null;
  }

  async initialize() {
    try {
      // Load system configuration
      const configPath = path.join(this.osPath, 'config', 'system.json');
      const configData = await fs.readFile(configPath, 'utf8');
      this.systemConfig = JSON.parse(configData);
      
      // Initialize subsystems
      await this.fileSystem.initialize();
      await this.userManager.initialize();
      await this.processManager.initialize();
      
      this.bootTime = new Date();
      this.isRunning = true;
      
      console.log(chalk.green('✅ Kernel initialized successfully'));
    } catch (error) {
      throw new Error(`Kernel initialization failed: ${error.message}`);
    }
  }

  async loadServices() {
    try {
      const services = [
        'logger',
        'network',
        'scheduler',
        'memory-manager'
      ];

      for (const service of services) {
        console.log(chalk.gray(`  Loading ${service}...`));
        // Simulate service loading
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      console.log(chalk.green('✅ System services loaded'));
    } catch (error) {
      console.error(chalk.red(`❌ Failed to load services: ${error.message}`));
      throw error;
    }
  }

  async startShell() {
    this.shell = new Shell(this);
    await this.shell.start();
  }

  getSystemInfo() {
    return {
      osName: this.systemConfig?.osName || 'Mukuvi OS',
      version: this.version,
      bootTime: this.bootTime,
      uptime: this.bootTime ? Date.now() - this.bootTime.getTime() : 0,
      processCount: this.processManager.getProcessCount(),
      userCount: this.userManager.getUserCount()
    };
  }

  async shutdown() {
    console.log(chalk.yellow('🔄 Shutting down Mukuvi OS...'));
    
    if (this.shell) {
      await this.shell.stop();
    }
    
    await this.processManager.killAllProcesses();
    this.isRunning = false;
    
    console.log(chalk.green('✅ System shutdown complete'));
    process.exit(0);
  }
}