import { getConnection } from "../../db/mssql.js";

export const AuthRepository = {
  async findByEmail(email) {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("email", email)
      .query("SELECT * FROM user_data WHERE email = @email");
    return result.recordset[0];
  },

  async createUser({ firstName, lastName, userName, email, passwordHash }) {
    const pool = await getConnection();

    const query = `
      INSERT INTO user_data (firstName, lastName, userName, email, passwordHash, userRole)
      OUTPUT inserted.id, inserted.firstName, inserted.lastName, inserted.userName,
             inserted.email, inserted.userRole, inserted.createdAt
      VALUES (@firstName, @lastName, @userName, @email, @passwordHash, 'admin');
    `;

    const result = await pool
      .request()
      .input("firstName", firstName)
      .input("lastName", lastName)
      .input("userName", userName)
      .input("email", email)
      .input("passwordHash", passwordHash)
      .query(query);

    if (result?.recordset?.length) {
      return result.recordset[0];
    }
    console.error("⚠️ No se devolvió ningún registro tras el INSERT");
    return null;
  }
};
