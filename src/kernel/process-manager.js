import { EventEmitter } from 'events';

export class ProcessManager extends EventEmitter {
  constructor() {
    super();
    this.processes = new Map();
    this.nextPid = 1;
    this.maxProcesses = 1000;
  }

  async initialize() {
    console.log('  Process Manager initialized');
  }

  createProcess(name, command, args = [], options = {}) {
    if (this.processes.size >= this.maxProcesses) {
      throw new Error('Maximum process limit reached');
    }

    const pid = this.nextPid++;
    const process = {
      pid,
      name,
      command,
      args,
      status: 'running',
      startTime: new Date(),
      parentPid: options.parentPid || 0,
      userId: options.userId || 0,
      memory: options.memory || 1024,
      priority: options.priority || 0
    };

    this.processes.set(pid, process);
    this.emit('processCreated', process);
    
    return pid;
  }

  getProcess(pid) {
    return this.processes.get(pid);
  }

  getAllProcesses() {
    return Array.from(this.processes.values());
  }

  killProcess(pid) {
    const process = this.processes.get(pid);
    if (process) {
      process.status = 'terminated';
      process.endTime = new Date();
      this.processes.delete(pid);
      this.emit('processKilled', process);
      return true;
    }
    return false;
  }

  async killAllProcesses() {
    for (const [pid] of this.processes) {
      this.killProcess(pid);
    }
  }

  getProcessCount() {
    return this.processes.size;
  }

  getProcessesByUser(userId) {
    return this.getAllProcesses().filter(p => p.userId === userId);
  }
}