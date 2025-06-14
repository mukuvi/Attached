import { EventEmitter } from 'events';
import chalk from 'chalk';

export class PackageManager extends EventEmitter {
  constructor(osApi) {
    super();
    this.osApi = osApi;
    this.installedPackages = new Map();
    this.repositories = new Map();
    this.initializeRepositories();
    this.initializeDefaultPackages();
  }

  initializeRepositories() {
    this.repositories.set('mukuvi-main', {
      name: 'Mukuvi Main Repository',
      url: 'https://repo.mukuvi-os.com/main',
      packages: new Map([
        ['nmap', { version: '7.94', description: 'Network discovery and security auditing' }],
        ['metasploit', { version: '6.3.0', description: 'Penetration testing framework' }],
        ['wireshark', { version: '4.0.0', description: 'Network protocol analyzer' }],
        ['burpsuite', { version: '2023.1', description: 'Web application security testing' }],
        ['sqlmap', { version: '1.7.0', description: 'Automatic SQL injection tool' }],
        ['john', { version: '1.9.0', description: 'Password cracking tool' }],
        ['hashcat', { version: '6.2.6', description: 'Advanced password recovery' }],
        ['aircrack-ng', { version: '1.7', description: 'WiFi security auditing tools' }],
        ['nikto', { version: '2.5.0', description: 'Web server scanner' }],
        ['dirb', { version: '2.22', description: 'Web content scanner' }]
      ])
    });

    this.repositories.set('mukuvi-dev', {
      name: 'Mukuvi Development Tools',
      url: 'https://repo.mukuvi-os.com/dev',
      packages: new Map([
        ['nodejs', { version: '20.0.0', description: 'JavaScript runtime' }],
        ['python3', { version: '3.11.0', description: 'Python programming language' }],
        ['gcc', { version: '12.0.0', description: 'GNU Compiler Collection' }],
        ['git', { version: '2.40.0', description: 'Version control system' }],
        ['docker', { version: '24.0.0', description: 'Container platform' }],
        ['vim', { version: '9.0.0', description: 'Text editor' }],
        ['code', { version: '1.80.0', description: 'Visual Studio Code' }],
        ['mysql', { version: '8.0.0', description: 'Database server' }],
        ['postgresql', { version: '15.0.0', description: 'Advanced database' }],
        ['redis', { version: '7.0.0', description: 'In-memory data store' }]
      ])
    });
  }

  initializeDefaultPackages() {
    // Pre-install some basic packages
    this.installedPackages.set('bash', {
      name: 'bash',
      version: '5.2.0',
      description: 'Bourne Again Shell',
      installDate: new Date(),
      size: 1024
    });

    this.installedPackages.set('coreutils', {
      name: 'coreutils',
      version: '9.0.0',
      description: 'Core utilities',
      installDate: new Date(),
      size: 2048
    });
  }

  async install(packageName, version = 'latest') {
    this.emit('installStarted', { packageName, version });

    // Find package in repositories
    let packageInfo = null;
    let repoName = null;

    for (const [name, repo] of this.repositories) {
      if (repo.packages.has(packageName)) {
        packageInfo = repo.packages.get(packageName);
        repoName = name;
        break;
      }
    }

    if (!packageInfo) {
      throw new Error(`Package '${packageName}' not found in any repository`);
    }

    // Simulate download and installation
    const steps = ['Downloading', 'Verifying', 'Extracting', 'Installing', 'Configuring'];
    
    for (let i = 0; i < steps.length; i++) {
      this.emit('installProgress', {
        step: steps[i],
        progress: Math.round(((i + 1) / steps.length) * 100)
      });
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    const installedPackage = {
      name: packageName,
      version: packageInfo.version,
      description: packageInfo.description,
      installDate: new Date(),
      size: Math.floor(Math.random() * 10000) + 1000,
      repository: repoName
    };

    this.installedPackages.set(packageName, installedPackage);
    this.emit('installCompleted', installedPackage);

    return installedPackage;
  }

  async uninstall(packageName) {
    if (!this.installedPackages.has(packageName)) {
      throw new Error(`Package '${packageName}' is not installed`);
    }

    this.emit('uninstallStarted', { packageName });

    // Simulate uninstallation
    await new Promise(resolve => setTimeout(resolve, 2000));

    const removedPackage = this.installedPackages.get(packageName);
    this.installedPackages.delete(packageName);

    this.emit('uninstallCompleted', removedPackage);
    return removedPackage;
  }

  async update(packageName = null) {
    if (packageName) {
      // Update specific package
      if (!this.installedPackages.has(packageName)) {
        throw new Error(`Package '${packageName}' is not installed`);
      }
      
      this.emit('updateStarted', { packageName });
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const pkg = this.installedPackages.get(packageName);
      pkg.version = this.getLatestVersion(packageName);
      pkg.installDate = new Date();
      
      this.emit('updateCompleted', { packageName, newVersion: pkg.version });
      return pkg;
    } else {
      // Update all packages
      this.emit('updateAllStarted');
      
      const updates = [];
      for (const [name, pkg] of this.installedPackages) {
        const latestVersion = this.getLatestVersion(name);
        if (latestVersion !== pkg.version) {
          updates.push({ name, oldVersion: pkg.version, newVersion: latestVersion });
          pkg.version = latestVersion;
          pkg.installDate = new Date();
        }
      }
      
      this.emit('updateAllCompleted', { updates });
      return updates;
    }
  }

  getLatestVersion(packageName) {
    for (const repo of this.repositories.values()) {
      if (repo.packages.has(packageName)) {
        return repo.packages.get(packageName).version;
      }
    }
    return '1.0.0';
  }

  search(query) {
    const results = [];
    
    for (const [repoName, repo] of this.repositories) {
      for (const [packageName, packageInfo] of repo.packages) {
        if (packageName.includes(query) || packageInfo.description.toLowerCase().includes(query.toLowerCase())) {
          results.push({
            name: packageName,
            version: packageInfo.version,
            description: packageInfo.description,
            repository: repoName,
            installed: this.installedPackages.has(packageName)
          });
        }
      }
    }
    
    return results;
  }

  list(installed = false) {
    if (installed) {
      return Array.from(this.installedPackages.values());
    } else {
      const allPackages = [];
      for (const [repoName, repo] of this.repositories) {
        for (const [packageName, packageInfo] of repo.packages) {
          allPackages.push({
            name: packageName,
            version: packageInfo.version,
            description: packageInfo.description,
            repository: repoName,
            installed: this.installedPackages.has(packageName)
          });
        }
      }
      return allPackages;
    }
  }

  getPackageInfo(packageName) {
    if (this.installedPackages.has(packageName)) {
      return this.installedPackages.get(packageName);
    }
    
    for (const repo of this.repositories.values()) {
      if (repo.packages.has(packageName)) {
        return {
          ...repo.packages.get(packageName),
          installed: false
        };
      }
    }
    
    return null;
  }
}