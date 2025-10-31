import sql from 'mssql';
import { env } from '../config/config.env.js';

const dbConfig = {
  server: env.DB_HOST,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  port: env.DB_PORT,
  options: {
    encrypt: env.DB_ENCRYPT,
    trustServerCertificate: env.DB_TRUST_SERVER_CERT
  },
  pool: {
    min: env.DB_POOL_MIN,
    max: env.DB_POOL_MAX,
    idleTimeoutMillis: env.DB_POOL_IDLE
  }
};

let pool;

/**
 * Retorna una conexión activa o crea una nueva si no existe.
 */
export const getConnection = async () => {
  try {
    if (pool) {
      return pool;
    }

    pool = await sql.connect(dbConfig);
    console.log('✅ Conectado a SQL Server');
    return pool;
  } catch (error) {
    console.error('❌ Error al conectar a la base de datos:', error.message);
    throw error;
  }
};

/**
 * Cierra el pool de conexiones.
 */
export const closeConnection = async () => {
  try {
    if (pool) {
      await pool.close();
      pool = null;
      console.log('🔌 Conexión cerrada');
    }
  } catch (error) {
    console.error('❌ Error al cerrar conexión:', error.message);
  }
};