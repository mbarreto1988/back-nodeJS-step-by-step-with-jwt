import { startServer } from "./server/server.js";

(async () => {
  try {
    await startServer();
  } catch (error) {
    console.error('❌ Error al iniciar la app:', error.message);
    process.exit(1);
  }
})();