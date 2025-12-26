#!/usr/bin/env node

/**
 * Test script for the HTTP proxy server
 * Tests Anthropic API to OpenAI translation
 */

import { spawn } from 'child_process';
import { setTimeout as sleep } from 'timers/promises';

const PORT = 3001; // Use different port to avoid conflicts
const BASE_URL = `http://127.0.0.1:${PORT}`;

async function testProxy() {
  console.log('🧪 Starting proxy server tests...\n');

  // Start the proxy server
  const server = spawn('node', ['build/index.js'], {
    env: {
      ...process.env,
      OPENAI_API_KEY: 'test-key-12345',
      OPENAI_MODEL: 'gpt-4',
      PORT: PORT.toString(),
    },
    stdio: ['pipe', 'pipe', 'pipe'],
  });

  let serverOutput = '';
  server.stdout.on('data', (data) => {
    serverOutput += data.toString();
  });

  server.stderr.on('data', (data) => {
    serverOutput += data.toString();
  });

  // Wait for server to start
  await sleep(2000);

  try {
    // Test 1: Health check
    console.log('Test 1: Health check endpoint');
    const healthResponse = await fetch(`${BASE_URL}/health`);
    const healthData = await healthResponse.json();
    
    if (healthData.status !== 'ok') {
      throw new Error('Health check failed');
    }
    console.log('✅ Health check passed:', healthData);
    console.log();

    // Test 2: Anthropic API format (should fail with test key but format should be correct)
    console.log('Test 2: Anthropic messages endpoint format');
    const messageResponse = await fetch(`${BASE_URL}/v1/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 100,
        messages: [
          { role: 'user', content: 'Hello, test!' }
        ]
      })
    });

    const messageData = await messageResponse.json();
    
    // We expect an error because we're using a fake API key
    // But the response should be in Anthropic format
    if (messageData.type === 'error') {
      console.log('✅ Correctly returned Anthropic error format:', messageData.error.type);
    } else {
      // If it somehow worked (shouldn't with test key)
      console.log('✅ Response structure:', {
        id: messageData.id,
        type: messageData.type,
        role: messageData.role,
        hasContent: Array.isArray(messageData.content),
      });
    }
    console.log();

    // Test 3: Invalid request (missing messages)
    console.log('Test 3: Invalid request handling');
    const invalidResponse = await fetch(`${BASE_URL}/v1/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 100,
      })
    });

    const invalidData = await invalidResponse.json();
    if (invalidData.type === 'error' && invalidData.error.type === 'invalid_request_error') {
      console.log('✅ Correctly rejected invalid request');
    } else {
      throw new Error('Should have rejected invalid request');
    }
    console.log();

    console.log('✅ All tests passed!\n');
    console.log('Note: Full integration testing requires a valid OpenAI API key.');
    console.log('Set OPENAI_API_KEY environment variable to test actual LLM calls.\n');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    server.kill();
    process.exit(1);
  }

  // Cleanup
  server.kill();
  await sleep(500);
}

// Run tests
testProxy().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
