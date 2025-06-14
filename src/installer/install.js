#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';
import figlet from 'figlet';
import inquirer from 'inquirer';

class MukuviInstaller {
  constructor() {
    this.osPath = path.join(process.cwd(), 'mukuvi-system');
    this.configPath = path.join(this.osPath, 'config');
    this.userPath = path.join(this.osPath, 'users');
    this.systemPath = path.join(this.osPath, 'system');
  }

  async displayWelcome() {
    console.clear();
    console.log(chalk.cyan(figlet.textSync('MUKUVI OS', { horizontalLayout: 'full' })));
    console.log(chalk.yellow('Welcome to Mukuvi Operating System Installer'));
    console.log(chalk.gray('Version 1.0.0 - A complete terminal-based operating system\n'));
  }

  async createDirectoryStructure() {
    const directories = [
      this.osPath,
      this.configPath,
      this.userPath,
      this.systemPath,
      path.join(this.systemPath, 'bin'),
      path.join(this.systemPath, 'lib'),
      path.join(this.systemPath, 'logs'),
      path.join(this.systemPath, 'tmp'),
      path.join(this.osPath, 'home'),
      path.join(this.osPath, 'var'),
      path.join(this.osPath, 'etc')
    ];

    for (const dir of directories) {
      await fs.mkdir(dir, { recursive: true });
    }
  }

  async setupUserAccount() {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'username',
        message: 'Enter your username:',
        validate: (input) => input.length > 0 || 'Username cannot be empty'
      },
      {
        type: 'password',
        name: 'password',
        message: 'Enter your password:',
        validate: (input) => input.length >= 4 || 'Password must be at least 4 characters'
      },
      {
        type: 'input',
        name: 'fullName',
        message: 'Enter your full name:',
        default: 'Mukuvi User'
      }
    ]);

    const userConfig = {
      username: answers.username,
      password: Buffer.from(answers.password).toString('base64'),
      fullName: answers.fullName,
      homeDir: `/home/${answers.username}`,
      shell: '/system/bin/mukush',
      permissions: ['read', 'write', 'execute'],
      createdAt: new Date().toISOString(),
      isAdmin: true
    };

    await fs.writeFile(
      path.join(this.userPath, `${answers.username}.json`),
      JSON.stringify(userConfig, null, 2)
    );

    // Create user home directory
    await fs.mkdir(path.join(this.osPath, 'home', answers.username), { recursive: true });

    return answers.username;
  }

  async createSystemConfig(adminUser) {
    const systemConfig = {
      osName: 'Mukuvi OS',
      version: '1.0.0',
      kernel: 'mukuvi-kernel',
      shell: 'mukush',
      adminUser: adminUser,
      bootTime: new Date().toISOString(),
      timezone: 'UTC',
      locale: 'en_US',
      maxUsers: 100,
      maxProcesses: 1000,
      fileSystemType: 'mukufs',
      security: {
        passwordPolicy: {
          minLength: 4,
          requireSpecialChars: false
        },
        sessionTimeout: 3600000
      }
    };

    await fs.writeFile(
      path.join(this.configPath, 'system.json'),
      JSON.stringify(systemConfig, null, 2)
    );
  }

  async createBootScript() {
    const bootScript = `#!/usr/bin/env node
// Mukuvi OS Boot Script
import { MukuviKernel } from '../kernel/kernel.js';

const kernel = new MukuviKernel();
kernel.boot();
`;

    await fs.writeFile(path.join(this.systemPath, 'bin', 'boot'), bootScript);
  }

  async install() {
    try {
      await this.displayWelcome();
      
      console.log(chalk.blue('🔧 Creating directory structure...'));
      await this.createDirectoryStructure();
      
      console.log(chalk.blue('👤 Setting up user account...'));
      const adminUser = await this.setupUserAccount();
      
      console.log(chalk.blue('⚙️  Creating system configuration...'));
      await this.createSystemConfig(adminUser);
      
      console.log(chalk.blue('🚀 Creating boot scripts...'));
      await this.createBootScript();
      
      console.log(chalk.green('\n✅ Mukuvi OS installation completed successfully!'));
      console.log(chalk.yellow('To start the system, run: npm run boot'));
      console.log(chalk.gray('System installed at: ' + this.osPath));
      
    } catch (error) {
      console.error(chalk.red('❌ Installation failed:'), error.message);
      process.exit(1);
    }
  }
}

const installer = new MukuviInstaller();
installer.install();