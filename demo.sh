#!/bin/bash

# Demo script to test claude-byom with Ollama
# This script demonstrates the complete setup process

set -e

echo "🎬 Claude BYOM Demo with Ollama"
echo "================================"
echo ""

# Check prerequisites
echo "Checking prerequisites..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi
echo "✅ Node.js found: $(node --version)"

if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi
echo "✅ npm found: $(npm --version)"

if ! command -v ollama &> /dev/null; then
    echo "❌ Ollama is not installed."
    echo "   Please install from: https://ollama.ai"
    exit 1
fi
echo "✅ Ollama found"

echo ""
echo "Step 1: Checking if llama2 model is available..."
if ! ollama list | grep -q llama2; then
    echo "📥 Pulling llama2 model (this may take a while)..."
    ollama pull llama2
else
    echo "✅ llama2 model already available"
fi

echo ""
echo "Step 2: Building claude-byom..."
npm install --silent
npm run build --silent
echo "✅ Build complete"

echo ""
echo "Step 3: Starting Ollama server (if not running)..."
# Ollama usually starts automatically, but let's make sure
if ! pgrep -x "ollama" > /dev/null; then
    ollama serve &
    OLLAMA_PID=$!
    sleep 3
    echo "✅ Ollama server started (PID: $OLLAMA_PID)"
else
    echo "✅ Ollama server already running"
fi

echo ""
echo "Step 4: Starting claude-byom proxy server..."
export OPENAI_API_KEY="ollama"
export OPENAI_BASE_URL="http://localhost:11434/v1"
export OPENAI_MODEL="llama2"
export PORT=3000

node build/index.js &
PROXY_PID=$!
sleep 2

echo "✅ Proxy server started (PID: $PROXY_PID)"

echo ""
echo "Step 5: Testing the proxy..."

# Test health endpoint
echo "Testing health endpoint..."
HEALTH_RESPONSE=$(curl -s http://127.0.0.1:3000/health)
echo "Response: $HEALTH_RESPONSE"

if echo "$HEALTH_RESPONSE" | grep -q "ok"; then
    echo "✅ Health check passed"
else
    echo "❌ Health check failed"
    kill $PROXY_PID 2>/dev/null || true
    exit 1
fi

echo ""
echo "Step 6: Testing message endpoint..."
curl -s -X POST http://127.0.0.1:3000/v1/messages \
  -H "Content-Type: application/json" \
  -d '{
    "model": "claude-3-5-sonnet-20241022",
    "max_tokens": 100,
    "messages": [{"role": "user", "content": "Say hello in one sentence!"}]
  }' | jq '.' || echo "(Response received - install jq for pretty printing)"

echo ""
echo "✅ Demo complete!"
echo ""
echo "📋 Next steps:"
echo "1. Configure Claude Desktop with:"
echo "   ANTHROPIC_BASE_URL=http://127.0.0.1:3000"
echo "   ANTHROPIC_API_KEY=any-value"
echo ""
echo "2. Restart Claude Desktop"
echo ""
echo "3. Start chatting with Llama2!"
echo ""
echo "Press Ctrl+C to stop the proxy server..."

# Wait for interrupt
trap "echo ''; echo 'Stopping proxy server...'; kill $PROXY_PID 2>/dev/null || true; exit 0" INT
wait $PROXY_PID
