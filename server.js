
// This is a simple entry point to load the server module
import('./server/index.js')
  .catch(error => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
