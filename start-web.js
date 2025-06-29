#!/usr/bin/env node

const { spawn } = require('child_process');
const net = require('net');

// 检查端口是否可用
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.once('close', () => resolve(true));
      server.close();
    });
    server.on('error', () => resolve(false));
  });
}

// 查找可用端口
async function findAvailablePort(startPort = 3000) {
  for (let port = startPort; port < startPort + 100; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error('无法找到可用端口');
}

// 启动Web服务器
async function startWebServer() {
  try {
    const port = await findAvailablePort(3000);
    console.log(`🚀 正在启动Web服务器，端口: ${port}`);
    
    const child = spawn('npx', ['expo', 'start', '--web', '--port', port.toString(), '--clear'], {
      stdio: 'inherit',
      shell: true
    });

    child.on('close', (code) => {
      console.log(`Web服务器已停止，退出码: ${code}`);
    });

    child.on('error', (err) => {
      console.error('启动失败:', err);
    });

    // 处理Ctrl+C
    process.on('SIGINT', () => {
      console.log('\n正在停止Web服务器...');
      child.kill('SIGINT');
    });

  } catch (error) {
    console.error('启动Web服务器失败:', error.message);
  }
}

startWebServer(); 