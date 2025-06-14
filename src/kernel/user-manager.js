import fs from 'fs/promises';
import path from 'path';

export class UserManager {
  constructor(osPath) {
    this.osPath = osPath;
    this.usersPath = path.join(osPath, 'users');
    this.currentUser = null;
    this.sessions = new Map();
  }

  async initialize() {
    console.log('  User Manager initialized');
  }

  async authenticateUser(username, password) {
    try {
      const userFile = path.join(this.usersPath, `${username}.json`);
      const userData = await fs.readFile(userFile, 'utf8');
      const user = JSON.parse(userData);
      
      const encodedPassword = Buffer.from(password).toString('base64');
      if (user.password === encodedPassword) {
        this.currentUser = user;
        const sessionId = this.createSession(user);
        return { success: true, user, sessionId };
      }
      
      return { success: false, error: 'Invalid credentials' };
    } catch (error) {
      return { success: false, error: 'User not found' };
    }
  }

  createSession(user) {
    const sessionId = Math.random().toString(36).substring(2, 15);
    this.sessions.set(sessionId, {
      user,
      startTime: new Date(),
      lastActivity: new Date()
    });
    return sessionId;
  }

  getCurrentUser() {
    return this.currentUser;
  }

  async createUser(userData) {
    const userFile = path.join(this.usersPath, `${userData.username}.json`);
    
    // Check if user already exists
    if (await this.userExists(userData.username)) {
      throw new Error('User already exists');
    }

    const user = {
      ...userData,
      password: Buffer.from(userData.password).toString('base64'),
      createdAt: new Date().toISOString(),
      lastLogin: null
    };

    await fs.writeFile(userFile, JSON.stringify(user, null, 2));
    
    // Create user home directory
    const homeDir = path.join(this.osPath, 'home', userData.username);
    await fs.mkdir(homeDir, { recursive: true });
    
    return user;
  }

  async userExists(username) {
    const userFile = path.join(this.usersPath, `${username}.json`);
    try {
      await fs.access(userFile);
      return true;
    } catch {
      return false;
    }
  }

  async getAllUsers() {
    try {
      const files = await fs.readdir(this.usersPath);
      const users = [];
      
      for (const file of files) {
        if (file.endsWith('.json')) {
          const userData = await fs.readFile(path.join(this.usersPath, file), 'utf8');
          const user = JSON.parse(userData);
          delete user.password; // Don't return password
          users.push(user);
        }
      }
      
      return users;
    } catch (error) {
      return [];
    }
  }

  getUserCount() {
    return this.sessions.size;
  }

  logout() {
    this.currentUser = null;
  }
}