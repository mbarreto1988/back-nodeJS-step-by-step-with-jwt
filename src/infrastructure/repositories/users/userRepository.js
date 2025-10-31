import { getConnection } from "../../db/mssql.js";

export const userRepository = {
  async getAll() {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT id, 
        firstName, 
        lastName, 
        userName, 
        email,
        userRole,
        createdAt
      FROM user_data
      ORDER BY id DESC
    `);
    return result.recordset;
  },
};