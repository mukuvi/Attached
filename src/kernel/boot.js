#!/usr/bin/env node

import { MukuviKernel } from './kernel.js';
import chalk from 'chalk';
import figlet from 'figlet';

class BootLoader {
  constructor() {
    this.kernel = new MukuviKernel();
  }

  async displayBootScreen() {
    console.clear();
    console.log(chalk.cyan(figlet.textSync('MUKUVI OS', { horizontalLayout: 'full' })));
    console.log(chalk.yellow('Booting Mukuvi Operating System...'));
    console.log(chalk.gray('Kernel Version 1.0.0\n'));
  }

  async boot() {
    await this.displayBootScreen();
    
    console.log(chalk.blue('🔄 Initializing kernel...'));
    await this.kernel.initialize();
    
    console.log(chalk.blue('🔄 Loading system services...'));
    await this.kernel.loadServices();
    
    console.log(chalk.blue('🔄 Starting shell...'));
    await this.kernel.startShell();
  }
}

const bootLoader = new BootLoader();
bootLoader.boot().catch(error => {
  console.error(chalk.red('Boot failed:'), error.message);
  process.exit(1);
});