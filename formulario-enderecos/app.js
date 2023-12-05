const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = 4000;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'bd1',
    password: 'postgres',
    port: 5433,
});

// Create
app.post('/salvar', async (req, res) => {
    const { cep, rua, bairro, cidade, estado } = req.body;
  
    try {
      const query =
        'INSERT INTO enderecos (cep, rua, bairro, cidade, estado) VALUES ($1, $2, $3, $4, $5)';
      await pool.query(query, [cep, rua, bairro, cidade, estado]);
      res.send('Dados salvos no PostgreSQL.');
    } catch (error) {
      console.error(error);
      res.status(500).send('Erro ao salvar os dados no PostgreSQL.');
    }
  });
  
 
  app.get('/enderecos', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM enderecos');
      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).send('Erro ao recuperar os dados do PostgreSQL.');
    }
  });
  
 
  app.get('/enderecos/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const result = await pool.query('SELECT * FROM enderecos WHERE id = $1', [id]);
      if (result.rows.length === 0) {
        res.status(404).send('Endereço não encontrado.');
      } else {
        res.json(result.rows[0]);
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Erro ao recuperar os dados do PostgreSQL.');
    }
  });
  
 
  app.put('/atualizar/:id', async (req, res) => {
    const { id } = req.params;
    const { cep, rua, bairro, cidade, estado } = req.body;
  
    try {
      const query =
        'UPDATE enderecos SET cep = $1, rua = $2, bairro = $3, cidade = $4, estado = $5 WHERE id = $6';
      await pool.query(query, [cep, rua, bairro, cidade, estado, id]);
      res.send(`Endereço com ID ${id} atualizado no PostgreSQL.`);
    } catch (error) {
      console.error(error);
      res.status(500).send('Erro ao atualizar os dados no PostgreSQL.');
    }
  });
  
  
  app.delete('/excluir/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const result = await pool.query('DELETE FROM enderecos WHERE id = $1', [id]);
      if (result.rowCount === 0) {
        res.status(404).send('Endereço não encontrado para exclusão.');
      } else {
        res.send(`Endereço com ID ${id} excluído do PostgreSQL.`);
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Erro ao excluir os dados no PostgreSQL.');
    }
  });
app.use(express.static(__dirname)); // Serve o conteúdo estático, como o HTML

app.listen(port, () => {
    console.log(`Servidor em execução na porta ${port}`);
});
