import { createApp } from './app.js';

createApp().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
