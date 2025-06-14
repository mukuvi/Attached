import { EventEmitter } from 'events';
import chalk from 'chalk';

export class ServiceManager extends EventEmitter {
  constructor(osApi) {
    super();
    this.osApi = osApi;
    this.services = new Map();
    this.initializeServices();
  }

  initializeServices() {
    const defaultServices = [
      {
        name: 'ssh',
        description: 'Secure Shell daemon',
        status: 'running',
        port: 22,
        autoStart: true,
        pid: 1001
      },
      {
        name: 'apache2',
        description: 'Apache HTTP Server',
        status: 'stopped',
        port: 80,
        autoStart: false,
        pid: null
      },
      {
        name: 'mysql',
        description: 'MySQL Database Server',
        status: 'stopped',
        port: 3306,
        autoStart: false,
        pid: null
      },
      {
        name: 'postgresql',
        description: 'PostgreSQL Database Server',
        status: 'stopped',
        port: 5432,
        autoStart: false,
        pid: null
      },
      {
        name: 'redis',
        description: 'Redis In-Memory Data Store',
        status: 'stopped',
        port: 6379,
        autoStart: false,
        pid: null
      },
      {
        name: 'nginx',
        description: 'Nginx Web Server',
        status: 'stopped',
        port: 80,
        autoStart: false,
        pid: null
      },
      {
        name: 'docker',
        description: 'Docker Container Runtime',
        status: 'stopped',
        port: null,
        autoStart: false,
        pid: null
      },
      {
        name: 'metasploit',
        description: 'Metasploit Framework RPC',
        status: 'stopped',
        port: 55553,
        autoStart: false,
        pid: null
      }
    ];

    defaultServices.forEach(service => {
      this.services.set(service.name, {
        ...service,
        startTime: service.status === 'running' ? new Date() : null,
        restarts: 0,
        logs: []
      });
    });
  }

  async start(serviceName) {
    const service = this.services.get(serviceName);
    if (!service) {
      throw new Error(`Service '${serviceName}' not found`);
    }

    if (service.status === 'running') {
      throw new Error(`Service '${serviceName}' is already running`);
    }

    this.emit('serviceStarting', { serviceName });

    // Simulate service startup
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Create process for the service
    const pid = this.osApi.processManager.createProcess(
      serviceName,
      serviceName,
      [],
      { userId: this.osApi.userManager.getCurrentUser()?.username || 'system' }
    );

    service.status = 'running';
    service.pid = pid;
    service.startTime = new Date();
    service.restarts++;
    service.logs.push({
      timestamp: new Date(),
      level: 'INFO',
      message: `Service ${serviceName} started successfully`
    });

    this.emit('serviceStarted', { serviceName, pid });
    return service;
  }

  async stop(serviceName) {
    const service = this.services.get(serviceName);
    if (!service) {
      throw new Error(`Service '${serviceName}' not found`);
    }

    if (service.status === 'stopped') {
      throw new Error(`Service '${serviceName}' is already stopped`);
    }

    this.emit('serviceStopping', { serviceName });

    // Simulate service shutdown
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Kill the process
    if (service.pid) {
      this.osApi.processManager.killProcess(service.pid);
    }

    service.status = 'stopped';
    service.pid = null;
    service.startTime = null;
    service.logs.push({
      timestamp: new Date(),
      level: 'INFO',
      message: `Service ${serviceName} stopped`
    });

    this.emit('serviceStopped', { serviceName });
    return service;
  }

  async restart(serviceName) {
    await this.stop(serviceName);
    await new Promise(resolve => setTimeout(resolve, 500));
    return await this.start(serviceName);
  }

  async reload(serviceName) {
    const service = this.services.get(serviceName);
    if (!service) {
      throw new Error(`Service '${serviceName}' not found`);
    }

    this.emit('serviceReloading', { serviceName });
    await new Promise(resolve => setTimeout(resolve, 1000));

    service.logs.push({
      timestamp: new Date(),
      level: 'INFO',
      message: `Service ${serviceName} configuration reloaded`
    });

    this.emit('serviceReloaded', { serviceName });
    return service;
  }

  getStatus(serviceName = null) {
    if (serviceName) {
      return this.services.get(serviceName);
    }
    return Array.from(this.services.values());
  }

  enable(serviceName) {
    const service = this.services.get(serviceName);
    if (!service) {
      throw new Error(`Service '${serviceName}' not found`);
    }

    service.autoStart = true;
    service.logs.push({
      timestamp: new Date(),
      level: 'INFO',
      message: `Service ${serviceName} enabled for auto-start`
    });

    return service;
  }

  disable(serviceName) {
    const service = this.services.get(serviceName);
    if (!service) {
      throw new Error(`Service '${serviceName}' not found`);
    }

    service.autoStart = false;
    service.logs.push({
      timestamp: new Date(),
      level: 'INFO',
      message: `Service ${serviceName} disabled from auto-start`
    });

    return service;
  }

  getLogs(serviceName, lines = 50) {
    const service = this.services.get(serviceName);
    if (!service) {
      throw new Error(`Service '${serviceName}' not found`);
    }

    return service.logs.slice(-lines);
  }

  async startAutoStartServices() {
    const autoStartServices = Array.from(this.services.entries())
      .filter(([name, service]) => service.autoStart && service.status === 'stopped')
      .map(([name]) => name);

    for (const serviceName of autoStartServices) {
      try {
        await this.start(serviceName);
      } catch (error) {
        console.error(chalk.red(`Failed to start ${serviceName}: ${error.message}`));
      }
    }
  }
}