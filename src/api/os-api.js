/**
 * Operating System API Layer
 * Provides a unified interface to interact with all OS components
 */
export class OsApi {
  constructor(kernel) {
    this.kernel = kernel;
  }

  // File System API
  get fileSystem() {
    return {
      getCurrentDirectory: () => this.kernel.fileSystem.getCurrentDirectory(),
      changeDirectory: (path) => this.kernel.fileSystem.changeDirectory(path),
      listDirectory: (path) => this.kernel.fileSystem.listDirectory(path),
      readFile: (path) => this.kernel.fileSystem.readFile(path),
      writeFile: (path, content) => this.kernel.fileSystem.writeFile(path, content),
      deleteFile: (path) => this.kernel.fileSystem.deleteFile(path),
      createDirectory: (path) => this.kernel.fileSystem.createDirectory(path),
      exists: (path) => this.kernel.fileSystem.exists(path),
      getStats: (path) => this.kernel.fileSystem.getStats(path),
      resolvePath: (path) => this.kernel.fileSystem.resolvePath(path)
    };
  }

  // User Management API
  get userManager() {
    return {
      authenticateUser: (username, password) => this.kernel.userManager.authenticateUser(username, password),
      getCurrentUser: () => this.kernel.userManager.getCurrentUser(),
      createUser: (userData) => this.kernel.userManager.createUser(userData),
      getAllUsers: () => this.kernel.userManager.getAllUsers(),
      getUserCount: () => this.kernel.userManager.getUserCount(),
      userExists: (username) => this.kernel.userManager.userExists(username),
      logout: () => this.kernel.userManager.logout(),
      createSession: (user) => this.kernel.userManager.createSession(user)
    };
  }

  // Process Management API
  get processManager() {
    return {
      createProcess: (name, command, args, options) => 
        this.kernel.processManager.createProcess(name, command, args, options),
      getProcess: (pid) => this.kernel.processManager.getProcess(pid),
      getAllProcesses: () => this.kernel.processManager.getAllProcesses(),
      killProcess: (pid) => this.kernel.processManager.killProcess(pid),
      getProcessCount: () => this.kernel.processManager.getProcessCount(),
      getProcessesByUser: (userId) => this.kernel.processManager.getProcessesByUser(userId)
    };
  }

  // System Information API
  getSystemInfo() {
    return this.kernel.getSystemInfo();
  }

  // System Control API
  shutdown() {
    return this.kernel.shutdown();
  }

  // Kernel Status API
  isRunning() {
    return this.kernel.isRunning;
  }

  getVersion() {
    return this.kernel.version;
  }

  getBootTime() {
    return this.kernel.bootTime;
  }

  // Configuration API
  getSystemConfig() {
    return this.kernel.systemConfig;
  }
}