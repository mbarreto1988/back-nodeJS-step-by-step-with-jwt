import { getConnection } from "../../db/mssql.js";

export default class AuthRepository {
  constructor() {
    this.getConnection = getConnection;
  }

  async findByEmail(email) {
    const pool = await this.getConnection();
    const result = await pool
      .request()
      .input("email", email)
      .query("SELECT * FROM user_data WHERE email = @email");

    return result.recordset[0] || null;
  }

  async createUser({ firstName, lastName, userName, email, passwordHash }) {
    const pool = await this.getConnection();

    const query = `
      INSERT INTO user_data (
        firstName, lastName, userName, email, passwordHash, userRole
      )
      OUTPUT 
        INSERTED.id, INSERTED.firstName, INSERTED.lastName, INSERTED.userName,
        INSERTED.email, INSERTED.userRole, INSERTED.createdAt
      VALUES (
        @firstName, @lastName, @userName, @email, @passwordHash, 'user'
      )
    `;

    const result = await pool
      .request()
      .input("firstName", firstName)
      .input("lastName", lastName)
      .input("userName", userName)
      .input("email", email)
      .input("passwordHash", passwordHash)
      .query(query);

    return result.recordset[0] || null;
  }
}
