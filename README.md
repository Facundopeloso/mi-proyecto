# 🎭 Playwright + MCP + Llama 3: AI Test Analyzer

Este proyecto implementa un sistema de monitoreo inteligente para pruebas de automatización. Utiliza **Playwright** para la ejecución de tests, el protocolo **MCP (Model Context Protocol)** para la lectura segura de reportes y **Llama 3** (vía Ollama) para el análisis de fallos en lenguaje natural.

##  Arquitectura del Sistema
1.  **Capa de Ejecución:** Playwright ejecuta los tests de login y genera un archivo `reporte.txt` en la carpeta `/tests`.
2.  **Capa de Servicio (MCP):** Un servidor MCP dedicado (`mcp-server.js`) expone la herraamienta `leer_reporte`, que es la única autorizada para acceder al sistema de archivos local.
3.  **Interfaz y Análisis:** Un servidor Node.js (`server.js`) sirve un panel visual (`reporte-visual.html`) que consume el reporte mediante el cliente MCP y lo envía a una instancia de **Llama 3** para su interpretación.

---

## Requisitos Previos

Para que el sistema funcione correctamente entre tus PCs, asegurate de tener:

* **Ollama:** Instalado y corriendo con el modelo Llama 3 (`ollama run llama3`).
* **Ngrok:** Un túnel activo apuntando al puerto de Ollama (ej. `ngrok http 11434`) (Esto es solo si queres acceder a tu IA Local de forma remota).
* **Configuración de Red:** Debés actualizar la variable `OLLAMA_URL` en `server.js` con tu enlace actual de ngrok.

---
## Para utilizar MCP Y PLAYWRIGHT en otro link, dos posibles usos actualmente:

* $env:BASE_URL="https://the-internet.herokuapp.com/login"; npx playwright test
* $env:BASE_URL="https://practicetestautomation.com/practice-test-login/"; npx playwright test
* --luego correr el server.js

---

## Instalación y Configuración
---
### 1. Clonar e Instalar Dependencias / correr test y node para usar ollama
```bash
git clone <tu-repo-privado>
cd mi-proyecto
npm install
npx playwright install chromium
npx playwright test --headed (este si quieren ver la interfaz)
npx playwright test (simplemente verlo por consola)
node server.js (para usar ollama en localhost:3000)
ingresar al localhost:3000 para ver reportes y hacer analizar los reportes con la IA
