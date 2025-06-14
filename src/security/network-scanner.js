import { EventEmitter } from 'events';

export class NetworkScanner extends EventEmitter {
  constructor() {
    super();
    this.scanResults = new Map();
    this.vulnerabilityDatabase = this.initializeVulnDB();
  }

  initializeVulnDB() {
    return {
      '22': {
        service: 'SSH',
        vulnerabilities: ['Weak passwords', 'Default credentials', 'Version vulnerabilities'],
        recommendations: ['Use key-based auth', 'Disable root login', 'Update SSH version']
      },
      '80': {
        service: 'HTTP',
        vulnerabilities: ['Unencrypted traffic', 'Web application flaws', 'Directory traversal'],
        recommendations: ['Use HTTPS', 'Web application firewall', 'Regular security scans']
      },
      '443': {
        service: 'HTTPS',
        vulnerabilities: ['Weak SSL/TLS config', 'Certificate issues', 'Protocol downgrade'],
        recommendations: ['Strong cipher suites', 'Valid certificates', 'HSTS headers']
      },
      '21': {
        service: 'FTP',
        vulnerabilities: ['Anonymous access', 'Unencrypted credentials', 'Directory traversal'],
        recommendations: ['Disable anonymous FTP', 'Use SFTP/FTPS', 'Restrict access']
      },
      '23': {
        service: 'Telnet',
        vulnerabilities: ['Unencrypted traffic', 'Weak authentication', 'Protocol flaws'],
        recommendations: ['Use SSH instead', 'Disable telnet', 'Network segmentation']
      },
      '3389': {
        service: 'RDP',
        vulnerabilities: ['Brute force attacks', 'BlueKeep vulnerability', 'Weak passwords'],
        recommendations: ['Network level auth', 'Strong passwords', 'VPN access']
      }
    };
  }

  async portScan(target, portRange = '1-1000') {
    this.emit('scanStarted', { target, portRange });
    
    const [startPort, endPort] = portRange.split('-').map(Number);
    const openPorts = [];
    const services = [];

    // Simulate port scanning
    for (let port = startPort; port <= Math.min(endPort, startPort + 50); port++) {
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Simulate some open ports
      if (this.isPortOpen(port)) {
        const service = this.identifyService(port);
        openPorts.push(port);
        services.push({ port, service, state: 'open' });
        
        this.emit('portFound', { port, service });
      }
      
      this.emit('scanProgress', {
        current: port - startPort + 1,
        total: Math.min(endPort - startPort + 1, 51),
        percentage: Math.round(((port - startPort + 1) / Math.min(endPort - startPort + 1, 51)) * 100)
      });
    }

    const result = {
      target,
      openPorts,
      services,
      timestamp: new Date(),
      scanType: 'TCP Connect'
    };

    this.scanResults.set(target, result);
    this.emit('scanCompleted', result);
    
    return result;
  }

  async vulnerabilityScan(target) {
    const scanResult = this.scanResults.get(target);
    if (!scanResult) {
      throw new Error('No port scan results found. Run port scan first.');
    }

    this.emit('vulnScanStarted', { target });
    
    const vulnerabilities = [];
    
    for (const service of scanResult.services) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const vulnInfo = this.vulnerabilityDatabase[service.port.toString()];
      if (vulnInfo) {
        const vulns = vulnInfo.vulnerabilities.map(vuln => ({
          port: service.port,
          service: service.service,
          vulnerability: vuln,
          severity: this.calculateSeverity(service.port, vuln),
          recommendations: vulnInfo.recommendations
        }));
        
        vulnerabilities.push(...vulns);
        this.emit('vulnFound', { port: service.port, vulnerabilities: vulns });
      }
    }

    const vulnResult = {
      target,
      vulnerabilities,
      riskScore: this.calculateRiskScore(vulnerabilities),
      timestamp: new Date()
    };

    this.emit('vulnScanCompleted', vulnResult);
    return vulnResult;
  }

  async networkDiscovery(subnet = '192.168.1.0/24') {
    this.emit('discoveryStarted', { subnet });
    
    const hosts = [];
    const baseIP = subnet.split('/')[0].split('.').slice(0, 3).join('.');
    
    // Simulate network discovery
    for (let i = 1; i <= 20; i++) {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      if (Math.random() > 0.7) { // 30% chance of active host
        const ip = `${baseIP}.${i}`;
        const host = {
          ip,
          hostname: this.generateHostname(i),
          mac: this.generateMAC(),
          vendor: this.getVendor(),
          os: this.guessOS(),
          status: 'up'
        };
        
        hosts.push(host);
        this.emit('hostDiscovered', host);
      }
      
      this.emit('discoveryProgress', {
        current: i,
        total: 20,
        percentage: Math.round((i / 20) * 100)
      });
    }

    this.emit('discoveryCompleted', { hosts });
    return hosts;
  }

  isPortOpen(port) {
    // Common open ports for simulation
    const commonPorts = [22, 80, 443, 21, 23, 25, 53, 110, 143, 993, 995, 3389, 5432, 3306];
    return commonPorts.includes(port) && Math.random() > 0.7;
  }

  identifyService(port) {
    const services = {
      21: 'FTP',
      22: 'SSH',
      23: 'Telnet',
      25: 'SMTP',
      53: 'DNS',
      80: 'HTTP',
      110: 'POP3',
      143: 'IMAP',
      443: 'HTTPS',
      993: 'IMAPS',
      995: 'POP3S',
      3306: 'MySQL',
      3389: 'RDP',
      5432: 'PostgreSQL'
    };
    
    return services[port] || 'Unknown';
  }

  calculateSeverity(port, vulnerability) {
    const highRiskPorts = [21, 23, 3389];
    const criticalVulns = ['Default credentials', 'Anonymous access', 'BlueKeep vulnerability'];
    
    if (criticalVulns.some(vuln => vulnerability.includes(vuln))) {
      return 'Critical';
    } else if (highRiskPorts.includes(port)) {
      return 'High';
    } else {
      return Math.random() > 0.5 ? 'Medium' : 'Low';
    }
  }

  calculateRiskScore(vulnerabilities) {
    const scores = { 'Critical': 10, 'High': 7, 'Medium': 4, 'Low': 1 };
    const totalScore = vulnerabilities.reduce((sum, vuln) => sum + scores[vuln.severity], 0);
    return Math.min(totalScore, 100);
  }

  generateHostname(index) {
    const prefixes = ['desktop', 'laptop', 'server', 'router', 'printer', 'phone'];
    return `${prefixes[index % prefixes.length]}-${index}`;
  }

  generateMAC() {
    return Array.from({length: 6}, () => 
      Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
    ).join(':');
  }

  getVendor() {
    const vendors = ['Dell', 'HP', 'Cisco', 'Apple', 'Samsung', 'Lenovo', 'ASUS'];
    return vendors[Math.floor(Math.random() * vendors.length)];
  }

  guessOS() {
    const oses = ['Windows 10', 'Windows 11', 'Ubuntu Linux', 'macOS', 'iOS', 'Android'];
    return oses[Math.floor(Math.random() * oses.length)];
  }

  getScanResults(target) {
    return this.scanResults.get(target);
  }

  getAllScanResults() {
    return Array.from(this.scanResults.values());
  }
}