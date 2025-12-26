#!/usr/bin/env node

/**
 * Test script for the MCP server
 * This simulates an MCP client sending requests to the server
 */

import { spawn } from 'child_process';
import { strict as assert } from 'assert';

// Mock OpenAI API key for testing
const TEST_API_KEY = 'test-key-12345';
const TEST_MODEL = 'gpt-3.5-turbo';

async function testServer() {
  console.log('Starting MCP server test...\n');

  // Start the server process
  const server = spawn('node', ['build/index.js'], {
    env: {
      ...process.env,
      OPENAI_API_KEY: TEST_API_KEY,
      OPENAI_MODEL: TEST_MODEL,
    },
    stdio: ['pipe', 'pipe', 'pipe'],
  });

  let stderr = '';
  server.stderr.on('data', (data) => {
    stderr += data.toString();
  });

  // Wait for server to start
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Test 1: Initialize
  console.log('Test 1: Initialize request');
  const initRequest = {
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: {
        name: 'test-client',
        version: '1.0.0',
      },
    },
  };

  server.stdin.write(JSON.stringify(initRequest) + '\n');

  // Test 2: List tools
  console.log('Test 2: List tools request');
  const listToolsRequest = {
    jsonrpc: '2.0',
    id: 2,
    method: 'tools/list',
    params: {},
  };

  setTimeout(() => {
    server.stdin.write(JSON.stringify(listToolsRequest) + '\n');
  }, 500);

  // Collect responses
  let output = '';
  server.stdout.on('data', (data) => {
    output += data.toString();
    console.log('Response:', data.toString());
  });

  // Wait for responses
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Cleanup
  server.kill();

  // Verify
  console.log('\n--- Test Results ---');
  console.log('Server stderr output:');
  console.log(stderr);
  
  // Check that server started
  assert(stderr.includes('Claude BYOM MCP Server running'), 'Server should start');
  assert(stderr.includes(TEST_MODEL), 'Server should display model name');
  
  console.log('\n✅ All basic tests passed!');
  console.log('\nNote: Full integration testing requires a valid OpenAI API key.');
  console.log('Set OPENAI_API_KEY environment variable to test actual LLM calls.');
}

// Run tests
testServer().catch((error) => {
  console.error('Test failed:', error);
  process.exit(1);
});
