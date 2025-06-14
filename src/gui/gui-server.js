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

class GuiServer {
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
    this.port = 3000;
  }

  async initialize() {
    // Initialize kernel
    this.kernel = new MukuviKernel();
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
  }

  setupRoutes() {
    // Serve the main GUI page
    this.app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });

    // API endpoints
    this.app.post('/api/login', async (req, res) => {
      const { username, password } = req.body;
      const result = await this.osApi.userManager.authenticateUser(username, password);
      
      if (result.success) {
        const sessionId = Math.random().toString(36).substring(2, 15);
        this.sessions.set(sessionId, {
          user: result.user,
          currentDir: `/home/${result.user.username}`,
          startTime: new Date()
        });
        
        res.json({ success: true, sessionId, user: result.user });
      } else {
        res.json({ success: false, error: result.error });
      }
    });

    this.app.get('/api/system-info', (req, res) => {
      const sysInfo = this.osApi.getSystemInfo();
      res.json(sysInfo);
    });
  }

  setupSocketHandlers() {
    this.io.on('connection', (socket) => {
      console.log(chalk.blue('GUI client connected'));

      socket.on('execute-command', async (data) => {
        const { sessionId, command } = data;
        const session = this.sessions.get(sessionId);
        
        if (!session) {
          socket.emit('command-result', { error: 'Invalid session' });
          return;
        }

        try {
          // Use the full command processor instead of simplified execution
          const result = await this.commandProcessor.execute(command, session.user);
          
          // Handle directory changes
          if (command.trim().startsWith('cd ')) {
            session.currentDir = this.osApi.fileSystem.getCurrentDirectory();
            result.currentDir = session.currentDir;
          }
          
          socket.emit('command-result', result);
        } catch (error) {
          socket.emit('command-result', { error: error.message });
        }
      });

      socket.on('get-directory-listing', async (data) => {
        const { sessionId, path } = data;
        const session = this.sessions.get(sessionId);
        
        if (!session) {
          socket.emit('directory-listing', { error: 'Invalid session' });
          return;
        }

        try {
          const targetPath = path || session.currentDir;
          const entries = await this.osApi.fileSystem.listDirectory(targetPath);
          socket.emit('directory-listing', { entries, currentPath: targetPath });
        } catch (error) {
          socket.emit('directory-listing', { error: error.message });
        }
      });

      socket.on('disconnect', () => {
        console.log(chalk.gray('GUI client disconnected'));
      });
    });
  }

  async start() {
    await this.initialize();
    
    this.server.listen(this.port, () => {
      console.log(chalk.green(`🖥️  Mukuvi OS GUI Server running on http://localhost:${this.port}`));
      console.log(chalk.yellow('Open your browser to access the graphical interface'));
    });
  }
}

const guiServer = new GuiServer();
guiServer.start().catch(error => {
  console.error(chalk.red('GUI Server failed to start:'), error);
  process.exit(1);
});