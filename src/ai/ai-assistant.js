import axios from 'axios';
import chalk from 'chalk';

export class AIAssistant {
  constructor() {
    this.conversationHistory = [];
    this.systemPrompt = `You are ARIA (Advanced Reasoning Intelligence Assistant), an AI assistant built into Mukuvi OS, a security-focused operating system. You specialize in:

1. Cybersecurity and ethical hacking
2. Network security analysis
3. System administration
4. Programming and scripting
5. Digital forensics
6. General computing questions

Always provide helpful, educational responses while emphasizing ethical use of security tools. When discussing security techniques, always mention legal and ethical considerations.`;
  }

  async askQuestion(question, context = {}) {
    try {
      // Add context about the current system state
      const contextualQuestion = this.buildContextualQuestion(question, context);
      
      // For demo purposes, we'll use a mock AI response
      // In production, you would integrate with OpenAI, Claude, or another AI service
      const response = await this.generateMockResponse(contextualQuestion);
      
      this.conversationHistory.push({
        question: question,
        response: response,
        timestamp: new Date(),
        context: context
      });

      return response;
    } catch (error) {
      throw new Error(`AI Assistant error: ${error.message}`);
    }
  }

  buildContextualQuestion(question, context) {
    let contextualInfo = '';
    
    if (context.currentUser) {
      contextualInfo += `Current user: ${context.currentUser.username}\n`;
    }
    
    if (context.currentDirectory) {
      contextualInfo += `Current directory: ${context.currentDirectory}\n`;
    }
    
    if (context.systemInfo) {
      contextualInfo += `System: ${context.systemInfo.osName} ${context.systemInfo.version}\n`;
    }
    
    if (context.recentCommands) {
      contextualInfo += `Recent commands: ${context.recentCommands.join(', ')}\n`;
    }

    return `${contextualInfo}\nUser question: ${question}`;
  }

  async generateMockResponse(question) {
    // Mock AI responses based on keywords
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('wifi') || lowerQuestion.includes('wireless')) {
      return this.getWiFiSecurityResponse(question);
    } else if (lowerQuestion.includes('hack') || lowerQuestion.includes('penetration')) {
      return this.getEthicalHackingResponse(question);
    } else if (lowerQuestion.includes('network') || lowerQuestion.includes('scan')) {
      return this.getNetworkSecurityResponse(question);
    } else if (lowerQuestion.includes('password') || lowerQuestion.includes('brute')) {
      return this.getPasswordSecurityResponse(question);
    } else if (lowerQuestion.includes('forensics') || lowerQuestion.includes('investigation')) {
      return this.getForensicsResponse(question);
    } else if (lowerQuestion.includes('command') || lowerQuestion.includes('help')) {
      return this.getCommandHelpResponse(question);
    } else {
      return this.getGeneralResponse(question);
    }
  }

  getWiFiSecurityResponse(question) {
    return `🔒 **WiFi Security Analysis**

Based on your question about WiFi security, here are some key points:

**Common WiFi Vulnerabilities:**
- WEP encryption (easily crackable)
- Weak WPA/WPA2 passwords
- WPS vulnerabilities
- Evil twin attacks
- Deauthentication attacks

**Mukuvi OS WiFi Tools:**
- \`wifi-scan\` - Discover nearby networks
- \`wifi-capture\` - Capture WPA handshakes
- \`wifi-crack\` - Attempt password recovery
- \`wifi-deauth\` - Deauthentication attacks

**Ethical Considerations:**
⚠️ Only test on networks you own or have explicit permission to test. Unauthorized access to networks is illegal in most jurisdictions.

**Best Practices:**
- Use WPA3 when available
- Strong, unique passwords (12+ characters)
- Disable WPS
- Regular firmware updates
- Network monitoring

Would you like specific guidance on any of these topics?`;
  }

  getEthicalHackingResponse(question) {
    return `🎯 **Ethical Hacking & Penetration Testing**

Ethical hacking involves authorized testing to identify security vulnerabilities:

**Key Principles:**
1. **Authorization** - Always get written permission
2. **Scope** - Stay within defined boundaries
3. **Documentation** - Record all findings
4. **Disclosure** - Report vulnerabilities responsibly

**Common Methodologies:**
- OWASP Testing Guide
- NIST Cybersecurity Framework
- PTES (Penetration Testing Execution Standard)

**Mukuvi OS Security Tools:**
- \`nmap-scan\` - Network discovery and port scanning
- \`vuln-scan\` - Vulnerability assessment
- \`exploit-db\` - Search exploit database
- \`metasploit\` - Exploitation framework

**Legal Framework:**
- Computer Fraud and Abuse Act (US)
- Computer Misuse Act (UK)
- Local cybersecurity laws

Remember: The goal is to improve security, not cause harm. Always follow responsible disclosure practices.`;
  }

  getNetworkSecurityResponse(question) {
    return `🌐 **Network Security Analysis**

Network security involves protecting network infrastructure and data:

**Network Reconnaissance:**
- Port scanning with nmap
- Service enumeration
- OS fingerprinting
- Network topology mapping

**Common Network Attacks:**
- Man-in-the-middle (MITM)
- ARP spoofing
- DNS poisoning
- DDoS attacks

**Mukuvi OS Network Tools:**
- \`nmap [target]\` - Port scanning
- \`netstat -tulpn\` - Active connections
- \`arp-scan\` - ARP table analysis
- \`tcpdump\` - Packet capture

**Defense Strategies:**
- Network segmentation
- Intrusion detection systems (IDS)
- Firewalls and access control
- Regular security audits

**Monitoring Commands:**
- \`netstat\` - Network connections
- \`ss\` - Socket statistics
- \`iftop\` - Network bandwidth usage

Would you like help with a specific network security task?`;
  }

  getPasswordSecurityResponse(question) {
    return `🔐 **Password Security & Cracking**

Password security is fundamental to system protection:

**Password Attacks:**
- Dictionary attacks
- Brute force attacks
- Rainbow table attacks
- Hybrid attacks

**Mukuvi OS Password Tools:**
- \`hashcat\` - Advanced password recovery
- \`john\` - John the Ripper password cracker
- \`hydra\` - Network login cracker
- \`wordlist-gen\` - Generate custom wordlists

**Password Best Practices:**
- Minimum 12 characters
- Mix of uppercase, lowercase, numbers, symbols
- Unique passwords for each account
- Use password managers
- Enable 2FA when available

**Hash Types:**
- MD5 (weak, avoid)
- SHA-1 (deprecated)
- SHA-256/512 (better)
- bcrypt/scrypt (recommended)

**Ethical Guidelines:**
- Only crack passwords you own or have permission to test
- Use for security assessment, not malicious purposes
- Follow responsible disclosure for vulnerabilities

Remember: Strong passwords are your first line of defense!`;
  }

  getForensicsResponse(question) {
    return `🔍 **Digital Forensics & Investigation**

Digital forensics involves collecting and analyzing digital evidence:

**Forensics Process:**
1. **Identification** - Locate potential evidence
2. **Preservation** - Create forensic images
3. **Analysis** - Examine data for evidence
4. **Documentation** - Record findings
5. **Presentation** - Report results

**Mukuvi OS Forensics Tools:**
- \`dd\` - Create disk images
- \`file-recovery\` - Recover deleted files
- \`hash-verify\` - Verify file integrity
- \`timeline\` - Create activity timelines

**Evidence Types:**
- File system artifacts
- Network logs
- Memory dumps
- Registry entries (Windows)
- Browser history

**Chain of Custody:**
- Document all evidence handling
- Maintain integrity hashes
- Secure storage procedures
- Detailed access logs

**Legal Considerations:**
- Follow proper procedures
- Maintain evidence integrity
- Document methodology
- Expert testimony preparation

Digital forensics requires careful methodology to ensure evidence admissibility in legal proceedings.`;
  }

  getCommandHelpResponse(question) {
    return `💻 **Mukuvi OS Command Reference**

Here are some useful commands in Mukuvi OS:

**File Operations:**
- \`ls\` - List directory contents
- \`cd [path]\` - Change directory
- \`mkdir [name]\` - Create directory
- \`touch [file]\` - Create file
- \`cat [file]\` - Display file contents
- \`rm [file]\` - Remove file

**Security Tools:**
- \`wifi-scan\` - Scan for WiFi networks
- \`nmap-scan [target]\` - Network port scan
- \`vuln-scan [target]\` - Vulnerability scan
- \`hash-crack [hash]\` - Password cracking
- \`forensics [command]\` - Digital forensics tools

**System Information:**
- \`ps\` - Running processes
- \`whoami\` - Current user
- \`uname\` - System information
- \`sysinfo\` - Detailed system info
- \`uptime\` - System uptime

**AI Assistant:**
- \`ai [question]\` - Ask the AI assistant
- \`ai-history\` - View conversation history

**Network Tools:**
- \`netstat\` - Network connections
- \`ping [host]\` - Test connectivity
- \`traceroute [host]\` - Trace network path

Type \`help [command]\` for detailed information about specific commands.`;
  }

  getGeneralResponse(question) {
    return `🤖 **ARIA - AI Assistant**

I'm here to help with your questions about cybersecurity, system administration, and general computing topics.

**My Capabilities:**
- Cybersecurity guidance and best practices
- Network security analysis
- Ethical hacking methodologies
- Digital forensics procedures
- Programming and scripting help
- System administration tasks
- Security tool usage

**Popular Topics:**
- WiFi security testing
- Network penetration testing
- Password security
- Digital forensics
- Vulnerability assessment
- Incident response

**How to Get Better Help:**
- Be specific about your goals
- Mention your experience level
- Describe your current setup
- Ask about specific tools or techniques

**Example Questions:**
- "How do I secure my WiFi network?"
- "What's the best way to scan for vulnerabilities?"
- "How do I create a forensic disk image?"
- "What are the legal considerations for penetration testing?"

Feel free to ask me anything about cybersecurity or system administration. I'm here to help you learn and stay secure!

Remember: Always use security tools ethically and legally. 🔒`;
  }

  getConversationHistory() {
    return this.conversationHistory;
  }

  clearHistory() {
    this.conversationHistory = [];
  }

  exportHistory() {
    return JSON.stringify(this.conversationHistory, null, 2);
  }
}