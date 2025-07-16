import http from 'http';
import { createApp } from './app.js';
import container from './container.js';
import { config } from './config/index.js';

const app    = createApp();
const server = http.createServer(app);

server.listen(config.port, () => {
  console.log(`🚀 Server listening on http://localhost:${config.port}`);
});

// Graceful shutdown
function shutdown(signal) {
  console.log(`\n⚠️  Received ${signal}. Shutting down...`);

  server.close(async () => {
    console.log('🧹 HTTP server closed.');

    // Awilix cleanup
    if (typeof container.dispose === 'function') {
      await container.dispose();
      console.log('🧼 Container disposed.');
    }

    process.exit(0);
  });

  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
