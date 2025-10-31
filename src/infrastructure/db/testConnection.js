import { getConnection } from './mssql.js';

(async () => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query('SELECT 1 AS ok');
    console.log('✅ Resultado:', result.recordset);
  } catch (error) {
    console.error('❌ Error en test de conexión:', error.message);
  } finally {
    process.exit(0);
  }
})();