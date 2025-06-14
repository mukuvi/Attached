import fs from 'fs/promises';
import path from 'path';

export class FileSystem {
  constructor(osPath) {
    this.osPath = osPath;
    this.currentDirectory = '/';
    this.mountPoints = new Map();
  }

  async initialize() {
    // Mount root filesystem
    this.mountPoints.set('/', this.osPath);
    console.log('  File System initialized');
  }

  resolvePath(virtualPath) {
    // Convert virtual path to real filesystem path
    const normalizedPath = path.normalize(virtualPath);
    return path.join(this.osPath, normalizedPath.startsWith('/') ? normalizedPath.slice(1) : normalizedPath);
  }

  async readFile(filePath) {
    const realPath = this.resolvePath(filePath);
    return await fs.readFile(realPath, 'utf8');
  }

  async writeFile(filePath, content) {
    const realPath = this.resolvePath(filePath);
    await fs.mkdir(path.dirname(realPath), { recursive: true });
    return await fs.writeFile(realPath, content);
  }

  async deleteFile(filePath) {
    const realPath = this.resolvePath(filePath);
    return await fs.unlink(realPath);
  }

  async createDirectory(dirPath) {
    const realPath = this.resolvePath(dirPath);
    return await fs.mkdir(realPath, { recursive: true });
  }

  async listDirectory(dirPath = this.currentDirectory) {
    const realPath = this.resolvePath(dirPath);
    try {
      const entries = await fs.readdir(realPath, { withFileTypes: true });
      return entries.map(entry => ({
        name: entry.name,
        type: entry.isDirectory() ? 'directory' : 'file',
        size: 0, // Would need stat for real size
        modified: new Date()
      }));
    } catch (error) {
      throw new Error(`Cannot access directory: ${dirPath}`);
    }
  }

  async exists(filePath) {
    const realPath = this.resolvePath(filePath);
    try {
      await fs.access(realPath);
      return true;
    } catch {
      return false;
    }
  }

  async getStats(filePath) {
    const realPath = this.resolvePath(filePath);
    const stats = await fs.stat(realPath);
    return {
      size: stats.size,
      isDirectory: stats.isDirectory(),
      isFile: stats.isFile(),
      modified: stats.mtime,
      created: stats.birthtime,
      permissions: stats.mode
    };
  }

  changeDirectory(newPath) {
    // Normalize and validate path
    const normalizedPath = path.normalize(newPath.startsWith('/') ? newPath : path.join(this.currentDirectory, newPath));
    this.currentDirectory = normalizedPath;
    return this.currentDirectory;
  }

  getCurrentDirectory() {
    return this.currentDirectory;
  }
}