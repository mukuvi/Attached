#!/usr/bin/env node

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import { MukuviKernel } from '../kernel/kernel.js';
import { OsApi } from '../api/os-api.js';
import { CommandProcessor } from '../shell/command-processor.js';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class GuiServerVercel {
  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.io = new Server(this.server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });
    this.kernel = null;
    this.osApi = null;
    this.commandProcessor = null;
    this.sessions = new Map();
    this.port = process.env.PORT || 3000;
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;
    
    try {
      // Initialize kernel with in-memory filesystem for Vercel
      this.kernel = new MukuviKernel();
      this.kernel.osPath = '/tmp/mukuvi-system'; // Use tmp for Vercel
      
      // Create minimal system structure in memory
      await this.createMinimalSystem();
      
      await this.kernel.initialize();
      await this.kernel.loadServices();
      
      this.osApi = new OsApi(this.kernel);
      this.commandProcessor = new CommandProcessor(this.osApi);
      
      // Setup middleware
      this.app.use(cors());
      this.app.use(express.json());
      this.app.use(express.static(path.join(__dirname, 'public')));
      
      // Setup routes
      this.setupRoutes();
      this.setupSocketHandlers();
      
      this.initialized = true;
      console.log('Mukuvi OS GUI Server initialized for Vercel');
    } catch (error) {
      console.error('Failed to initialize:', error);
      // Create fallback system
      this.createFallbackSystem();
    }
  }

  async createMinimalSystem() {
    // Create minimal system structure for demo purposes
    const fs = await import('fs/promises');
    
    try {
      await fs.mkdir('/tmp/mukuvi-system/config', { recursive: true });
      await fs.mkdir('/tmp/mukuvi-system/users', { recursive: true });
      await fs.mkdir('/tmp/mukuvi-system/home/demo', { recursive: true });
      
      // Create demo user
      const demoUser = {
        username: 'demo',
        password: Buffer.from('demo').toString('base64'),
        fullName: 'Demo User',
        homeDir: '/home/demo',
        shell: '/system/bin/mukush',
        permissions: ['read', 'write', 'execute'],
        createdAt: new Date().toISOString(),
        isAdmin: true
      };
      
      await fs.writeFile('/tmp/mukuvi-system/users/demo.json', JSON.stringify(demoUser, null, 2));
      
      // Create system config
      const systemConfig = {
        osName: 'Mukuvi OS',
        version: '1.0.0',
        kernel: 'mukuvi-kernel',
        shell: 'mukush',
        adminUser: 'demo',
        bootTime: new Date().toISOString(),
        timezone: 'UTC',
        locale: 'en_US',
        maxUsers: 100,
        maxProcesses: 1000,
        fileSystemType: 'mukufs'
      };
      
      await fs.writeFile('/tmp/mukuvi-system/config/system.json', JSON.stringify(systemConfig, null, 2));
    } catch (error) {
      console.log('Using fallback system configuration');
    }
  }

  createFallbackSystem() {
    // Fallback for when filesystem operations fail
    this.sessions.set('fallback', {
      user: { username: 'demo', fullName: 'Demo User', isAdmin: true },
      currentDir: '/home/demo',
      startTime: new Date()
    });
  }

  setupRoutes() {
    // Serve the main GUI page
    this.app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });

    // API endpoints
    this.app.post('/api/login', async (req, res) => {
      const { username, password } = req.body;
      
      // For demo purposes, accept demo/demo or any credentials
      if ((username === 'demo' && password === 'demo') || username) {
        const sessionId = Math.random().toString(36).substring(2, 15);
        this.sessions.set(sessionId, {
          user: { username: username || 'demo', fullName: 'Demo User', isAdmin: true },
          currentDir: `/home/${username || 'demo'}`,
          startTime: new Date()
        });
        
        res.json({ 
          success: true, 
          sessionId, 
          user: { username: username || 'demo', fullName: 'Demo User', isAdmin: true }
        });
      } else {
        res.json({ success: false, error: 'Invalid credentials' });
      }
    });

    this.app.get('/api/system-info', (req, res) => {
      const sysInfo = {
        osName: 'Mukuvi OS',
        version: '1.0.0',
        bootTime: new Date(),
        uptime: Date.now(),
        processCount: 15,
        userCount: 1
      };
      res.json(sysInfo);
    });
  }

  setupSocketHandlers() {
    this.io.on('connection', (socket) => {
      console.log('GUI client connected');

      socket.on('execute-command', async (data) => {
        const { sessionId, command } = data;
        const session = this.sessions.get(sessionId) || this.sessions.get('fallback');
        
        if (!session) {
          socket.emit('command-result', { error: 'Invalid session' });
          return;
        }

        try {
          // Use the command processor if available, otherwise provide demo responses
          let result;
          if (this.commandProcessor) {
            result = await this.commandProcessor.execute(command, session.user);
          } else {
            result = this.getDemoCommandResult(command);
          }
          
          socket.emit('command-result', result);
        } catch (error) {
          socket.emit('command-result', { error: error.message });
        }
      });

      socket.on('disconnect', () => {
        console.log('GUI client disconnected');
      });
    });
  }

  getDemoCommandResult(command) {
    const cmd = command.trim().split(' ')[0];
    
    const demoResponses = {
      'help': { output: '🖥️ Mukuvi OS Demo - Available commands: wifi-scan, nmap-scan, ai, ls, ps, whoami', exit: false },
      'wifi-scan': { output: '📡 WiFi Networks:\nHomeNetwork_2.4G  00:11:22:33:44:55  -45dBm  WPA2\nOfficeWiFi        66:77:88:99:AA:BB  -62dBm  WPA3', exit: false },
      'nmap-scan': { output: '🔍 Nmap scan results:\n22/tcp   open  ssh\n80/tcp   open  http\n443/tcp  open  https', exit: false },
      'ai': { output: '🤖 ARIA AI Assistant: This is a demo environment. In the full version, I provide detailed security guidance and analysis.', exit: false },
      'ls': { output: '📁 Documents\n📁 Projects\n📄 readme.txt', exit: false },
      'ps': { output: 'PID  NAME         STATUS\n1001 mukuvi-kernel running\n1002 mukush       running', exit: false },
      'whoami': { output: 'demo (Demo User)', exit: false },
      'uname': { output: 'Mukuvi OS 1.0.0 - Complete Hacking & Programming Edition', exit: false }
    };
    
    return demoResponses[cmd] || { output: `Command '${cmd}' executed (demo mode)`, exit: false };
  }

  async start() {
    await this.initialize();
    
    this.server.listen(this.port, () => {
      console.log(`🖥️ Mukuvi OS GUI Server running on port ${this.port}`);
    });
  }
}

// For Vercel serverless functions
export { GuiServerVercel };

// For direct execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const guiServer = new GuiServerVercel();
  guiServer.start().catch(error => {
    console.error('GUI Server failed to start:', error);
    process.exit(1);
  });
}