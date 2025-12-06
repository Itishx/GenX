// Import TypeScript support for ES modules
require('ts-node').register({
  transpileOnly: true,
  compilerOptions: {
    module: 'commonjs',
    target: 'es2020'
  }
});

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const DEFAULT_PORT = 3001;

// Load environment variables
require('dotenv').config();

// Middleware
app.use(cors());
app.use(express.json());

// Pre-load the chat handler using require (works better with ts-node)
let chatHandler;
try {
  // Use require instead of dynamic import for TypeScript
  const chatModule = require('./api/chat.ts');
  chatHandler = chatModule.default || chatModule;
} catch (error) {
  console.error('Failed to load chat handler:', error);
  process.exit(1);
}

// Route to simulate Vercel's /api/chat endpoint
app.all('/api/chat', async (req, res) => {
  try {
    // Create Vercel-like request/response objects
    const vercelReq = {
      method: req.method,
      body: req.body,
      headers: req.headers,
      query: req.query,
    };
    
    let statusCode = 200;
    let responseData = null;
    let responseEnded = false;
    
    const vercelRes = {
      status: (code) => {
        statusCode = code;
        return {
          json: (data) => {
            responseData = data;
            return vercelRes;
          },
          end: () => {
            responseEnded = true;
            return vercelRes;
          }
        };
      },
      json: (data) => {
        responseData = data;
        return vercelRes;
      },
      setHeader: (name, value) => {
        res.setHeader(name, value);
        return vercelRes;
      },
    };
    
    await chatHandler(vercelReq, vercelRes);
    
    // Send the response
    if (responseEnded) {
      res.status(statusCode).end();
    } else if (responseData) {
      res.status(statusCode).json(responseData);
    }
    
  } catch (error) {
    console.error('Error in chat handler:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// Function to find available port
function findAvailablePort(startPort) {
  return new Promise((resolve) => {
    const server = app.listen(startPort, () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    }).on('error', () => {
      resolve(findAvailablePort(startPort + 1));
    });
  });
}

// Start server with automatic port detection
(async () => {
  try {
    const port = await findAvailablePort(DEFAULT_PORT);
    
    app.listen(port, '127.0.0.1', () => {
      console.log(`🚀 Backend API server running at http://127.0.0.1:${port}`);
      console.log(`📡 Chat endpoint: http://127.0.0.1:${port}/api/chat`);
      console.log(`🔑 OpenAI API Key: ${process.env.OPENAI_API_KEY ? 'Found' : 'Missing'}`);
      
      // Write port to a file that Vite can read
      const fs = require('fs');
      fs.writeFileSync('.api-port', port.toString());
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
})();