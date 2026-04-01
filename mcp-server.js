const { McpServer } = require('@modelcontextprotocol/sdk/server/mcp.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const fs = require('fs');
const path = require('path');
const { z } = require('zod');

const server = new McpServer({ name: 'reporte-server', version: '1.0.0' });

server.tool(
  'leer_reporte',
  'Lee el reporte de tests generado por Playwright',
  {},
  async () => {
    const logPath = path.join(__dirname, 'tests', 'reporte.txt');
    if (!fs.existsSync(logPath)) {
      return { content: [{ type: 'text', text: 'ERROR: reporte.txt no encontrado. Corré los tests primero.' }] };
    }
    const contenido = fs.readFileSync(logPath, 'utf-8');
    return { content: [{ type: 'text', text: contenido }] };
  }
);

const transport = new StdioServerTransport();
server.connect(transport);