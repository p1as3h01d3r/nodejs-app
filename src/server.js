import { createApp } from './app.js';

const server = createApp();

server.listen(8080, '0.0.0.0', () => {
  console.log('Listening on port 8080');
});

function shutdown() {
  server.close((error) => {
    if (error) {
      console.error(error);
      process.exitCode = 1;
    }
  });

  setTimeout(() => {
    server.closeAllConnections();
    process.exit(1);
  }, 10_000).unref();
}

process.once('SIGTERM', shutdown);
process.once('SIGINT', shutdown);
