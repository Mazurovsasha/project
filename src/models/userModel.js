module.exports = (pool) => {
  const ensureUsersTableExists = async () => {
    try {
      const checkTableQuery = `
        SELECT EXISTS (
          SELECT FROM information_schema.tables
          WHERE table_name = 'users'
        )
      `;
      const result = await pool.query(checkTableQuery);
      const tableExists = result.rows[0].exists;

      if (!tableExists) {
        const createTableQuery = `
          CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            first_name VARCHAR(255),
            last_name VARCHAR(255)
          )
        `;
        await pool.query(createTableQuery);
        console.log('Users table created.');
      }
    } catch (error) {
      console.error('Error ensuring users table exists:', error);
    }
  };

  return { ensureUsersTableExists };
};