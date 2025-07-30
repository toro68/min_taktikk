#!/bin/bash

echo "echo '      "args": ["'$(pwd)'/mcp-server.mjs"]' Setting up Min Taktikk MCP Server..."

# Install MCP SDK
echo "📦 Installing MCP SDK..."
npm install --save-dev @modelcontextprotocol/sdk

# Make the server executable
chmod +x mcp-server.mjs

echo "✅ MCP Server setup complete!"
echo ""
echo "🔧 To use this MCP server:"
echo "1. Add the following to your Claude Desktop config:"
echo ""
echo "{"
echo '  "mcpServers": {'
echo '    "min-taktikk": {'
echo '      "command": "node",'
echo '      "args": ["'$(pwd)'/mcp-server.mjs"]'
echo "    }"
echo "  }"
echo "}"
echo ""
echo "2. Restart Claude Desktop"
echo "3. The server provides tools for:"
echo "   - 📊 Analyzing football tactics data"
echo "   - 🎬 Creating animation configurations"
echo "   - 📁 Managing tactics files"
echo "   - 🔍 Formation analysis"
echo ""
echo "🚀 Server is ready to use!"
