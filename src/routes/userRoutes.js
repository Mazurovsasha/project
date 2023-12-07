const express = require('express');
const router = express.Router();

module.exports = (pool) => {
  router.get('/', (req, res) => {
    pool.query('SELECT * FROM users', (err, result) => {
      if (err) {
        console.error('Error querying data:', err);
        res.status(500).send('Error fetching data');
      } else {
        const rows = result.rows;
        const tableContent = `<table border="1">
                                <tr>
                                  <th>ID</th>
                                  <th>First Name</th>
                                  <th>Last Name</th>
                                </tr>
                                ${rows.map(row => `
                                  <tr>
                                    <td>${row.id}</td>
                                    <td>${row.first_name}</td>
                                    <td>${row.last_name}</td>
                                  </tr>`).join('')}
                              </table>`;
        const toggleButton = `<button onclick="toggleTable()">Toggle Table</button>`;
        const form = `
          <form action="/add-user" method="POST">
            <label for="firstName">First Name:</label>
            <input type="text" id="firstName" name="firstName"><br><br>
            <label for="lastName">Last Name:</label>
            <input type="text" id="lastName" name="lastName"><br><br>
            <input type="submit" value="Add User">
          </form>
        `;
        const script = `
          <script>
            function toggleTable() {
              const table = document.getElementById('userTable');
              if (table.style.display === 'none') {
                table.style.display = 'block';
              } else {
                table.style.display = 'none';
              }
            }

            function clearTable() {
              if (confirm('Are you sure you want to clear the table?')) {
                fetch('/clear-table', { method: 'DELETE' })
                  .then(response => {
                    if (response.ok) {
                      location.reload();
                    } else {
                      alert('Failed to clear the table');
                    }
                  })
                  .catch(error => {
                    console.error('Error:', error);
                    alert('An error occurred while trying to clear the table');
                  });
              }
            }
          </script>
        `;

        const clearButton = `<button onclick="clearTable()">Clear Table</button>`;
        const tableDiv = `<div id="userTable" style="display: none;">${tableContent}</div>`;

        const htmlContent = `
          <h1>Alexander Mazurov's project. Group number: m-sa2-25-23</h1>
          ${form}
          ${toggleButton}
          ${clearButton}
          ${script}
          ${tableDiv}
          <div style="position: fixed; bottom: 10px; left: 10px;">
          <h3>App Version: ${res.locals.appVersion}</h3>
          </div>
        `;

        res.send(htmlContent);
      }
    });
  });

  router.post('/add-user', (req, res) => {
    const { firstName, lastName } = req.body;
  
    if (!firstName && !lastName) {
      res.status(400).send('Both first name and last name are required.');
    } else {
      const insertQuery = 'INSERT INTO users (first_name, last_name) VALUES ($1, $2)';
      const values = [firstName || null, lastName || null];
  
      pool.query(insertQuery, values, (err) => {
        if (err) {
          console.error('Error inserting data:', err);
          res.status(500).send('Error inserting data');
        } else {
          res.redirect('/');
        }
      });
    }
  });

  router.delete('/clear-table', async (req, res) => {
    try {
      await pool.query('DELETE FROM users');
      await pool.query('ALTER SEQUENCE users_id_seq RESTART WITH 1');
      res.sendStatus(200);
    } catch (error) {
      console.error('Error deleting data:', error);
      res.status(500).send('Error deleting data');
    }
  });

  return router;
};

