import chalk from 'chalk';
import { WiFiTools } from './wifi-tools.js';
import { NetworkScanner } from './network-scanner.js';
import { AIAssistant } from '../ai/ai-assistant.js';

export class SecurityCommands {
  constructor(osApi) {
    this.osApi = osApi;
    this.wifiTools = new WiFiTools();
    this.networkScanner = new NetworkScanner();
    this.aiAssistant = new AIAssistant();
    this.setupEventListeners();
  }

  setupEventListeners() {
    // WiFi Tools Events
    this.wifiTools.on('scanStarted', () => {
      console.log(chalk.blue('📡 Starting WiFi network scan...'));
    });

    this.wifiTools.on('scanCompleted', (networks) => {
      console.log(chalk.green(`✅ Found ${networks.length} networks`));
    });

    this.wifiTools.on('handshakeCapture', (data) => {
      if (data.status === 'started') {
        console.log(chalk.yellow(`🎯 Capturing handshake for ${data.network.ssid}...`));
      } else {
        console.log(chalk.green(`✅ Handshake captured: ${data.handshake.packets} packets`));
      }
    });

    this.wifiTools.on('bruteForceProgress', (data) => {
      process.stdout.write(`\r${chalk.yellow('🔓')} Testing: ${data.password} (${data.percentage}%)`);
    });

    this.wifiTools.on('bruteForceCompleted', (data) => {
      console.log(); // New line
      if (data.success) {
        console.log(chalk.green(`🎉 Password found: ${data.password}`));
      } else {
        console.log(chalk.red('❌ Password not found in wordlist'));
      }
    });

    // Network Scanner Events
    this.networkScanner.on('scanStarted', (data) => {
      console.log(chalk.blue(`🔍 Scanning ${data.target} ports ${data.portRange}...`));
    });

    this.networkScanner.on('portFound', (data) => {
      console.log(chalk.green(`  ✅ ${data.port}/tcp open ${data.service}`));
    });

    this.networkScanner.on('vulnFound', (data) => {
      console.log(chalk.red(`  🚨 Vulnerabilities found on port ${data.port}`));
    });
  }

  getCommands() {
    return {
      'wifi-scan': this.wifiScan.bind(this),
      'wifi-capture': this.wifiCapture.bind(this),
      'wifi-crack': this.wifiCrack.bind(this),
      'wifi-deauth': this.wifiDeauth.bind(this),
      'wifi-list': this.wifiList.bind(this),
      'nmap-scan': this.nmapScan.bind(this),
      'vuln-scan': this.vulnScan.bind(this),
      'network-discovery': this.networkDiscovery.bind(this),
      'ai': this.aiQuery.bind(this),
      'ai-history': this.aiHistory.bind(this),
      'exploit-db': this.exploitDB.bind(this),
      'hash-crack': this.hashCrack.bind(this),
      'forensics': this.forensics.bind(this),
      'security-audit': this.securityAudit.bind(this)
    };
  }

  async wifiScan(args) {
    try {
      const networks = await this.wifiTools.scanNetworks();
      
      let output = chalk.cyan('\n📡 WiFi Networks Found:\n\n');
      output += chalk.cyan('SSID'.padEnd(20) + 'BSSID'.padEnd(20) + 'CH'.padEnd(5) + 'Signal'.padEnd(10) + 'Security\n');
      output += chalk.cyan('─'.repeat(70) + '\n');
      
      networks.forEach(network => {
        const signalColor = network.signal > -50 ? chalk.green : network.signal > -70 ? chalk.yellow : chalk.red;
        const securityColor = network.security === 'Open' ? chalk.red : chalk.green;
        
        output += `${network.ssid.padEnd(20)}${network.bssid.padEnd(20)}${network.channel.toString().padEnd(5)}${signalColor(network.signal + 'dBm').padEnd(15)}${securityColor(network.security)}\n`;
      });
      
      return { output, exit: false };
    } catch (error) {
      return { output: chalk.red(`WiFi scan error: ${error.message}`), exit: false };
    }
  }

  async wifiCapture(args) {
    if (!args[0]) {
      return { output: chalk.red('Usage: wifi-capture <BSSID>'), exit: false };
    }

    try {
      const handshake = await this.wifiTools.captureHandshake(args[0]);
      const output = chalk.green(`\n✅ Handshake captured successfully!\n\n`) +
                   chalk.cyan(`BSSID: ${handshake.bssid}\n`) +
                   chalk.cyan(`SSID: ${handshake.ssid}\n`) +
                   chalk.cyan(`Packets: ${handshake.packets}\n`) +
                   chalk.cyan(`Quality: ${handshake.quality}\n`) +
                   chalk.cyan(`Timestamp: ${handshake.timestamp.toLocaleString()}\n`);
      
      return { output, exit: false };
    } catch (error) {
      return { output: chalk.red(`Handshake capture error: ${error.message}`), exit: false };
    }
  }

  async wifiCrack(args) {
    if (!args[0]) {
      return { output: chalk.red('Usage: wifi-crack <BSSID> [wordlist]'), exit: false };
    }

    const wordlist = args[1] || 'wifi-common';
    
    try {
      const result = await this.wifiTools.bruteForceAttack(args[0], wordlist);
      
      if (result.success) {
        const output = chalk.green(`\n🎉 Password cracked!\n\n`) +
                      chalk.cyan(`Password: ${result.password}\n`) +
                      chalk.cyan(`Attempts: ${result.attempts}\n`);
        return { output, exit: false };
      } else {
        return { output: chalk.red(`❌ Password not found after ${result.attempts} attempts`), exit: false };
      }
    } catch (error) {
      return { output: chalk.red(`WiFi crack error: ${error.message}`), exit: false };
    }
  }

  async wifiDeauth(args) {
    if (!args[0]) {
      return { output: chalk.red('Usage: wifi-deauth <BSSID> [client_mac]'), exit: false };
    }

    try {
      const result = await this.wifiTools.deauthAttack(args[0], args[1]);
      const output = chalk.green(`\n✅ Deauthentication attack completed!\n\n`) +
                   chalk.cyan(`Packets sent: ${result.packetsSent}\n`) +
                   chalk.yellow(`⚠️ Use responsibly and only on networks you own!\n`);
      
      return { output, exit: false };
    } catch (error) {
      return { output: chalk.red(`Deauth attack error: ${error.message}`), exit: false };
    }
  }

  async wifiList(args) {
    const networks = this.wifiTools.getAllNetworks();
    const handshakes = this.wifiTools.getCapturedHandshakes();
    
    let output = chalk.cyan('\n📋 WiFi Status Summary:\n\n');
    output += chalk.green(`Networks discovered: ${networks.length}\n`);
    output += chalk.green(`Handshakes captured: ${handshakes.length}\n\n`);
    
    if (handshakes.length > 0) {
      output += chalk.cyan('Captured Handshakes:\n');
      handshakes.forEach(h => {
        output += chalk.white(`  ${h.ssid} (${h.bssid}) - ${h.packets} packets\n`);
      });
    }
    
    return { output, exit: false };
  }

  async nmapScan(args) {
    if (!args[0]) {
      return { output: chalk.red('Usage: nmap-scan <target> [port-range]'), exit: false };
    }

    const target = args[0];
    const portRange = args[1] || '1-1000';
    
    try {
      const result = await this.networkScanner.portScan(target, portRange);
      
      let output = chalk.cyan(`\n🔍 Nmap scan results for ${target}:\n\n`);
      output += chalk.cyan('PORT'.padEnd(10) + 'STATE'.padEnd(10) + 'SERVICE\n');
      output += chalk.cyan('─'.repeat(30) + '\n');
      
      result.services.forEach(service => {
        output += `${service.port}/tcp`.padEnd(10) + 
                 chalk.green(service.state).padEnd(15) + 
                 service.service + '\n';
      });
      
      output += chalk.yellow(`\n📊 Scan completed: ${result.openPorts.length} open ports found\n`);
      
      return { output, exit: false };
    } catch (error) {
      return { output: chalk.red(`Nmap scan error: ${error.message}`), exit: false };
    }
  }

  async vulnScan(args) {
    if (!args[0]) {
      return { output: chalk.red('Usage: vuln-scan <target>'), exit: false };
    }

    try {
      const result = await this.networkScanner.vulnerabilityScan(args[0]);
      
      let output = chalk.cyan(`\n🚨 Vulnerability scan results for ${args[0]}:\n\n`);
      output += chalk.red(`Risk Score: ${result.riskScore}/100\n\n`);
      
      if (result.vulnerabilities.length === 0) {
        output += chalk.green('✅ No vulnerabilities found\n');
      } else {
        result.vulnerabilities.forEach(vuln => {
          const severityColor = vuln.severity === 'Critical' ? chalk.red : 
                               vuln.severity === 'High' ? chalk.magenta :
                               vuln.severity === 'Medium' ? chalk.yellow : chalk.blue;
          
          output += severityColor(`[${vuln.severity}] `) + 
                   chalk.white(`Port ${vuln.port} (${vuln.service}): ${vuln.vulnerability}\n`);
        });
        
        output += chalk.cyan('\n💡 Recommendations:\n');
        const recommendations = [...new Set(result.vulnerabilities.flatMap(v => v.recommendations))];
        recommendations.forEach(rec => {
          output += chalk.white(`  • ${rec}\n`);
        });
      }
      
      return { output, exit: false };
    } catch (error) {
      return { output: chalk.red(`Vulnerability scan error: ${error.message}`), exit: false };
    }
  }

  async networkDiscovery(args) {
    const subnet = args[0] || '192.168.1.0/24';
    
    try {
      const hosts = await this.networkScanner.networkDiscovery(subnet);
      
      let output = chalk.cyan(`\n🌐 Network discovery results for ${subnet}:\n\n`);
      output += chalk.cyan('IP ADDRESS'.padEnd(16) + 'HOSTNAME'.padEnd(15) + 'MAC ADDRESS'.padEnd(20) + 'VENDOR\n');
      output += chalk.cyan('─'.repeat(70) + '\n');
      
      hosts.forEach(host => {
        output += `${host.ip.padEnd(16)}${host.hostname.padEnd(15)}${host.mac.padEnd(20)}${host.vendor}\n`;
      });
      
      output += chalk.green(`\n📊 Discovery completed: ${hosts.length} active hosts found\n`);
      
      return { output, exit: false };
    } catch (error) {
      return { output: chalk.red(`Network discovery error: ${error.message}`), exit: false };
    }
  }

  async aiQuery(args) {
    if (!args.length) {
      return { output: chalk.red('Usage: ai <question>'), exit: false };
    }

    const question = args.join(' ');
    const context = {
      currentUser: this.osApi.userManager.getCurrentUser(),
      currentDirectory: this.osApi.fileSystem.getCurrentDirectory(),
      systemInfo: this.osApi.getSystemInfo()
    };

    try {
      const response = await this.aiAssistant.askQuestion(question, context);
      return { output: chalk.cyan('\n🤖 ARIA AI Assistant:\n\n') + response + '\n', exit: false };
    } catch (error) {
      return { output: chalk.red(`AI Assistant error: ${error.message}`), exit: false };
    }
  }

  async aiHistory(args) {
    const history = this.aiAssistant.getConversationHistory();
    
    if (history.length === 0) {
      return { output: chalk.yellow('No conversation history found'), exit: false };
    }

    let output = chalk.cyan('\n📚 AI Conversation History:\n\n');
    
    history.slice(-5).forEach((entry, index) => {
      output += chalk.blue(`[${entry.timestamp.toLocaleString()}] `) + 
               chalk.white(`Q: ${entry.question}\n`) +
               chalk.gray(`A: ${entry.response.substring(0, 100)}...\n\n`);
    });
    
    return { output, exit: false };
  }

  async exploitDB(args) {
    const searchTerm = args.join(' ') || 'recent';
    
    // Mock exploit database
    const exploits = [
      { id: 'CVE-2023-1234', title: 'WiFi WPA3 Authentication Bypass', severity: 'High' },
      { id: 'CVE-2023-5678', title: 'SSH Remote Code Execution', severity: 'Critical' },
      { id: 'CVE-2023-9012', title: 'HTTP Server Buffer Overflow', severity: 'Medium' },
      { id: 'CVE-2023-3456', title: 'FTP Anonymous Access Vulnerability', severity: 'Low' }
    ];

    let output = chalk.cyan(`\n🗃️ Exploit Database Search: "${searchTerm}"\n\n`);
    output += chalk.cyan('CVE ID'.padEnd(15) + 'SEVERITY'.padEnd(10) + 'TITLE\n');
    output += chalk.cyan('─'.repeat(60) + '\n');
    
    exploits.forEach(exploit => {
      const severityColor = exploit.severity === 'Critical' ? chalk.red :
                           exploit.severity === 'High' ? chalk.magenta :
                           exploit.severity === 'Medium' ? chalk.yellow : chalk.blue;
      
      output += `${exploit.id.padEnd(15)}${severityColor(exploit.severity).padEnd(15)}${exploit.title}\n`;
    });
    
    return { output, exit: false };
  }

  async hashCrack(args) {
    if (!args[0]) {
      return { output: chalk.red('Usage: hash-crack <hash> [wordlist]'), exit: false };
    }

    const hash = args[0];
    const wordlist = args[1] || 'common';
    
    // Simulate hash cracking
    let output = chalk.blue(`\n🔓 Cracking hash: ${hash}\n`);
    output += chalk.blue(`Using wordlist: ${wordlist}\n\n`);
    
    // Mock cracking process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (Math.random() > 0.5) {
      const password = 'password123';
      output += chalk.green(`✅ Hash cracked!\n`);
      output += chalk.cyan(`Password: ${password}\n`);
    } else {
      output += chalk.red(`❌ Hash not cracked with current wordlist\n`);
    }
    
    return { output, exit: false };
  }

  async forensics(args) {
    const command = args[0];
    
    if (!command) {
      let output = chalk.cyan('\n🔍 Digital Forensics Tools:\n\n');
      output += chalk.white('Available commands:\n');
      output += chalk.yellow('  forensics image <device>     - Create disk image\n');
      output += chalk.yellow('  forensics recover <path>     - Recover deleted files\n');
      output += chalk.yellow('  forensics timeline <path>    - Create timeline\n');
      output += chalk.yellow('  forensics hash <file>        - Calculate file hash\n');
      output += chalk.yellow('  forensics metadata <file>    - Extract metadata\n');
      
      return { output, exit: false };
    }

    switch (command) {
      case 'image':
        return { output: chalk.green('📀 Creating forensic image... (simulated)'), exit: false };
      case 'recover':
        return { output: chalk.green('🔄 Scanning for deleted files... (simulated)'), exit: false };
      case 'timeline':
        return { output: chalk.green('📅 Generating activity timeline... (simulated)'), exit: false };
      case 'hash':
        return { output: chalk.green('🔐 Calculating SHA-256 hash... (simulated)'), exit: false };
      case 'metadata':
        return { output: chalk.green('📋 Extracting file metadata... (simulated)'), exit: false };
      default:
        return { output: chalk.red(`Unknown forensics command: ${command}`), exit: false };
    }
  }

  async securityAudit(args) {
    let output = chalk.cyan('\n🛡️ Security Audit Report:\n\n');
    
    // Simulate security audit
    const checks = [
      { name: 'Password Policy', status: 'PASS', details: 'Strong password requirements enforced' },
      { name: 'Open Ports', status: 'WARN', details: 'SSH port 22 open to internet' },
      { name: 'File Permissions', status: 'PASS', details: 'Proper file permissions set' },
      { name: 'User Accounts', status: 'PASS', details: 'No default accounts found' },
      { name: 'System Updates', status: 'FAIL', details: 'Security updates pending' }
    ];
    
    checks.forEach(check => {
      const statusColor = check.status === 'PASS' ? chalk.green :
                         check.status === 'WARN' ? chalk.yellow : chalk.red;
      
      output += `${statusColor('[' + check.status + ']')} ${check.name}: ${check.details}\n`;
    });
    
    const passCount = checks.filter(c => c.status === 'PASS').length;
    const score = Math.round((passCount / checks.length) * 100);
    
    output += chalk.cyan(`\n📊 Security Score: ${score}/100\n`);
    
    return { output, exit: false };
  }
}