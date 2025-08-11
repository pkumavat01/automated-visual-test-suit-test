/* eslint-disable no-underscore-dangle */
import express from 'express';
import cors from 'cors';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import http from 'http';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;
const MAX_PORT = 3010; // Maximum port number to try

// Ensure the directory for port.txt exists
const portFilePath = path.join(__dirname, 'port.txt');
const portFileDir = path.dirname(portFilePath);

// Function to check if a port is used by our visual-test server
async function isOurServer(portToCheck) {
  return new Promise((resolve) => {
    http.get(`http://localhost:${portToCheck}/api/health`, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          resolve(response.status === 'ok');
        } catch (e) {
          resolve(false);
        }
      });
    }).on('error', () => {
      resolve(false);
    });
  });
}

async function tryStartServerOnPort(currentPort) {
  // If port is in use, check if it's our server
  if (await isOurServer(currentPort)) {
    console.log(`Visual test server already running on port ${currentPort}`);
    process.exit(0);
  }
  // Try to start server on current port
  app.listen(currentPort);
  // If successful, write port to file and exit function
  try {
    if (!fs.existsSync(portFileDir)) {
      fs.mkdirSync(portFileDir, { recursive: true });
    }
    fs.writeFileSync(portFilePath, currentPort.toString(), 'utf8');
    console.log(`Port ${currentPort} written to ${portFilePath}`);
  } catch (error) {
    console.error('Error writing port file:', error);
  }
  console.log(`Visual test server running on port ${currentPort}`);
}

async function startServer() {
  let currentPort = port;
  // eslint-disable-next-line no-await-in-loop
  while (currentPort <= MAX_PORT) {
    try {
      // eslint-disable-next-line no-await-in-loop
      await tryStartServerOnPort(currentPort);
      return;
    } catch (error) {
      if (error.code === 'EADDRINUSE') {
        currentPort += 1;
      } else {
        console.error('Server failed to start:', error);
        process.exit(1);
      }
    }
  }
  // If we get here, we've run out of ports to try
  console.error(`Could not find available port between ${process.env.PORT || 3001} and ${MAX_PORT}`);
  process.exit(1);
}

// Enable CORS
app.use(cors());
app.use(express.json());

// Serve static files from the playwright-report directory
const reportPath = path.join(__dirname, '../../playwright-report');
if (fs.existsSync(reportPath)) {
  console.log('Serving Playwright report from:', reportPath);
  app.use('/playwright-report', express.static(reportPath));
} else {
  console.log('Playwright report directory not found at:', reportPath);
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Port endpoint
app.get('/port.txt', (req, res) => {
  try {
    const portNumber = fs.readFileSync(portFilePath, 'utf8');
    res.setHeader('Content-Type', 'text/plain');
    res.send(portNumber);
  } catch (error) {
    console.error('Error reading port file:', error);
    res.status(500).send('Error reading port');
  }
});

// Run visual test endpoint
app.post('/api/run-visual-test', async (req, res) => {
  const { command, component } = req.body;
  console.log('Received request:', { command, component });

  if (command !== 'test:visual:component') {
    return res.status(400).json({ error: 'Invalid command' });
  }

  if (!component) {
    return res.status(400).json({ error: 'Missing component name' });
  }

  // Get the project root directory (2 levels up from server.js)
  const projectRoot = path.resolve(__dirname, '../');
  console.log('Project root:', projectRoot);

  // Construct the command to run visual tests
  const testCommand = `npm run test:visual:component ${component}`;
  console.log('Executing command:', testCommand);
  console.log('In directory:', projectRoot);

  try {
    // Ensure the directory exists
    if (!fs.existsSync(projectRoot)) {
      return res.status(400).json({ error: 'Working directory does not exist' });
    }

    exec(testCommand, {
      cwd: projectRoot,
      env: {
        ...process.env,
        FORCE_COLOR: true,
        PATH: process.env.PATH,
      },
      shell: process.platform === 'win32',
    }, (error, stdout, stderr) => {
      console.log('Command output:', stdout);
      if (stderr) console.log('Command errors:', stderr);
      console.log('Current working directory:', process.cwd());
      console.log('Command working directory:', projectRoot);
      console.log('Command:', testCommand);

      if (error) {
        console.error('Command execution error:', error);
        res.status(500).json({
          error: 'Command execution failed',
          details: error.message,
          output: stdout,
          stderr,
        });
        return;
      }

      if (stderr && stderr.toLowerCase().includes('error')) {
        res.status(500).json({
          error: 'Command completed with errors',
          output: stdout,
          stderr,
        });
        return;
      }

      res.json({
        success: true,
        output: stdout,
        stderr,
      });
    });
  } catch (error) {
    console.error('Error executing command:', error);
    res.status(500).json({
      error: 'Failed to execute command',
      details: error.message,
    });
  }
  return null;
});

// Start the server
startServer();

export default startServer;
