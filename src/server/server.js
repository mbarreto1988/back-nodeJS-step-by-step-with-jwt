import express from 'express';
import { getConnection } from '../infrastructure/db/mssql.js';
import { env } from '../infrastructure/config/config.env.js';
import authRoutes from '../interface/http/router/auth/auth.routes.js'
import userRoutes from '../interface/http/router/users/user.routes.js'
import { verifyToken } from '../interface/http/middlewares/auth/auth.middleware.js';

export async function startServer() {
  const app = express();
  app.use(express.json());

  // Ruta base
  app.get('/', (req, res) => {
    res.send('🚀 Servidor corriendo correctamente');
  });

  // Ruta de prueba de conexión a la base
  app.get('/health', async (req, res) => {
    try {
      const pool = await getConnection();
      const result = await pool.request().query('SELECT 1 AS ok');
      res.status(200).json({ status: 'ok', db: result.recordset[0].ok });
    } catch (error) {
      console.error('❌ Error en /health:', error.message);
      res.status(500).json({ status: 'error', message: error.message });
    }
  });
  app.use("/api/v1/auth", authRoutes);

  app.use(verifyToken)

  app.use("/api/v1/users", userRoutes);

  app.listen(env.PORT, () => {
    console.log(`✅ Server corriendo en http://localhost:${env.PORT}`);
  });
}