const http = require('http');
const fs = require('fs');
const path = require('path');
const { Client } = require('@modelcontextprotocol/sdk/client/index.js');
const { StdioClientTransport } = require('@modelcontextprotocol/sdk/client/stdio.js');

// URL de tu túnel ngrok
const OLLAMA_URL = 'https://unofficed-tunefully-modesta.ngrok-free.dev';

async function obtenerReporteViaMCP() {
  const transport = new StdioClientTransport({
    command: 'node',
    args: [path.join(__dirname, 'mcp-server.js')],
  });

  const client = new Client({ name: 'mi-cliente', version: '1.0.0' });
  await client.connect(transport);

  const result = await client.callTool({ name: 'leer_reporte', arguments: {} });
  await client.close();

  return result.content[0].text;
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  //HTML visual
  if (req.method === 'GET' && (req.url === '/' || req.url === '/index.html')) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(fs.readFileSync(path.join(__dirname, 'reporte-visual.html')));
    return;
  }

  // MCP lee el reporte txt
  if (req.method === 'GET' && req.url === '/reporte') {
    try {
      const contenido = await obtenerReporteViaMCP();
      res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(contenido);
    } catch (e) {
      console.error('Error MCP:', e.message);
      res.writeHead(500);
      res.end('Error al leer reporte via MCP: ' + e.message);
    }
    return;
  }

  // Ollama analiza el reporte
  if (req.method === 'POST' && req.url === '/api/generate') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', async () => {
      try {
        const clientData = JSON.parse(body);
        const response = await fetch(`${OLLAMA_URL}/api/generate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          },
          body: JSON.stringify({
            model: clientData.model || 'llama3',
            prompt: clientData.prompt,
            stream: false 
          }),
        });
        const data = await response.json();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
      } catch (e) {
        console.error('Error Ollama:', e.message);
        res.writeHead(500);
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }
  res.writeHead(404); res.end('Not found');
});

server.listen(3000, () => {
  console.log('✅ Servidor corriendo en http://localhost:3000');
  console.log('🔌 MCP activo — leyendo reporte via mcp-server.js');
  console.log('🦙 Llama 3 conectado via Ollama remoto (ngrok)');
});