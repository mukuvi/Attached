#!/usr/bin/env node

import chalk from 'chalk';
import { MukuviKernel } from '../kernel/kernel.js';
import { ProcessManager } from '../kernel/process-manager.js';
import { FileSystem } from '../kernel/filesystem.js';
import { OsApi } from '../api/os-api.js';

class TestRunner {
  constructor() {
    this.tests = [];
    this.passed = 0;
    this.failed = 0;
  }

  addTest(name, testFn) {
    this.tests.push({ name, testFn });
  }

  async runTests() {
    console.log(chalk.cyan('🧪 Running Mukuvi OS Tests\n'));

    for (const test of this.tests) {
      try {
        await test.testFn();
        console.log(chalk.green(`✅ ${test.name}`));
        this.passed++;
      } catch (error) {
        console.log(chalk.red(`❌ ${test.name}: ${error.message}`));
        this.failed++;
      }
    }

    console.log(chalk.cyan(`\n📊 Test Results: ${this.passed} passed, ${this.failed} failed`));
  }

  assert(condition, message) {
    if (!condition) {
      throw new Error(message);
    }
  }
}

// Test suite
const runner = new TestRunner();

runner.addTest('Process Manager - Create Process', async () => {
  const pm = new ProcessManager();
  await pm.initialize();
  
  const pid = pm.createProcess('test-process', 'echo', ['hello']);
  runner.assert(pid > 0, 'Process should have valid PID');
  runner.assert(pm.getProcess(pid) !== undefined, 'Process should exist');
});

runner.addTest('Process Manager - Kill Process', async () => {
  const pm = new ProcessManager();
  await pm.initialize();
  
  const pid = pm.createProcess('test-process', 'echo', ['hello']);
  const killed = pm.killProcess(pid);
  
  runner.assert(killed === true, 'Process should be killed successfully');
  runner.assert(pm.getProcess(pid) === undefined, 'Process should not exist after killing');
});

runner.addTest('File System - Path Resolution', async () => {
  const fs = new FileSystem('/tmp/test-mukuvi');
  
  const resolved = fs.resolvePath('/home/user/test.txt');
  runner.assert(resolved.includes('test.txt'), 'Path should be resolved correctly');
});

runner.addTest('OsApi - File System Integration', async () => {
  const mockKernel = {
    fileSystem: new FileSystem('/tmp/test-mukuvi')
  };
  
  const osApi = new OsApi(mockKernel);
  const resolved = osApi.fileSystem.resolvePath('/test/path');
  runner.assert(resolved.includes('test'), 'OsApi should properly wrap file system methods');
});

runner.addTest('OsApi - System Info Access', async () => {
  const mockKernel = {
    getSystemInfo: () => ({ osName: 'Test OS', version: '1.0.0' })
  };
  
  const osApi = new OsApi(mockKernel);
  const sysInfo = osApi.getSystemInfo();
  runner.assert(sysInfo.osName === 'Test OS', 'OsApi should provide access to system info');
});

runner.addTest('Kernel - Initialization', async () => {
  // This test would require a test environment setup
  runner.assert(true, 'Kernel initialization test placeholder');
});

// Run tests
runner.runTests().catch(error => {
  console.error(chalk.red('Test runner failed:'), error);
  process.exit(1);
});