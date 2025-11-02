import { getConnection } from "../../db/mssql.js";

export default class UserRepository {
  constructor() {
    this.getConnection = getConnection;
  }

  async getAll() {
    const pool = await this.getConnection();
    const result = await pool.request().query(`
      SELECT id, firstName, lastName, userName, email, userRole, createdAt
      FROM user_data
      ORDER BY id DESC
    `);
    return result.recordset;
  }

  async getById(id) {
    const pool = await this.getConnection();
    const result = await pool
      .request()
      .input("id", id)
      .query(`
        SELECT id, firstName, lastName, userName, email, userRole, createdAt
        FROM user_data
        WHERE id = @id
      `);
    return result.recordset[0] || null;
  }

  async create({ firstName, lastName, userName, email, passwordHash }) {
    const pool = await this.getConnection();
    const result = await pool
      .request()
      .input("firstName", firstName)
      .input("lastName", lastName)
      .input("userName", userName)
      .input("email", email)
      .input("passwordHash", passwordHash)
      .query(`
        INSERT INTO user_data 
          (firstName, lastName, userName, email, passwordHash)
        OUTPUT 
          INSERTED.id, INSERTED.firstName, INSERTED.lastName, 
          INSERTED.userName, INSERTED.email, INSERTED.userRole,
          INSERTED.createdAt, INSERTED.updatedAt
        VALUES (@firstName, @lastName, @userName, @email, @passwordHash)
      `);
    return result.recordset[0];
  }

  async update(id, { firstName, lastName, userName, email, password, userRole }) {
    const pool = await this.getConnection();
    const result = await pool
      .request()
      .input("id", id)
      .input("firstName", firstName)
      .input("lastName", lastName)
      .input("userName", userName)
      .input("email", email)
      .input("password", password)
      .input("userRole", userRole)
      .query(`
        UPDATE user_data
        SET firstName = @firstName,
            lastName = @lastName,
            userName = @userName,
            email = @email,
            updatedAt = GETDATE()
        OUTPUT INSERTED.*
        WHERE id = @id
      `);
    return result.recordset[0] || null;
  }

  async patch(id, fields) {
    const pool = await this.getConnection();
    const updates = Object.entries(fields)
      .map(([key]) => `${key} = @${key}`)
      .join(", ");

    const request = pool.request().input("id", id);
    for (const [key, value] of Object.entries(fields)) {
      request.input(key, value);
    }

    const query = `
      UPDATE user_data
      SET ${updates}, updatedAt = GETDATE()
      OUTPUT INSERTED.*
      WHERE id = @id
    `;

    const result = await request.query(query);
    return result.recordset[0] || null;
  }

  async delete(id) {
    const pool = await this.getConnection();
    const result = await pool
      .request()
      .input("id", id)
      .query(`
        DELETE FROM user_data
        OUTPUT DELETED.*
        WHERE id = @id
      `);
    return result.recordset[0] || null;
  }
}
