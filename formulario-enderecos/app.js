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

app.use(express.urlencoded({ extended: true }));

app.post('/salvar', async (req, res) => {
    const {  cep, rua, bairro, cidade, estado    } = req.body;

    try {
        const query = 'INSERT INTO enderecos (cep, rua, bairro, cidade, estado) VALUES ($1, $2, $3, $4, $5)';
        await pool.query(query, [cep, rua, bairro, cidade, estado]);
        res.send('Dados salvos no PostgreSQL.');
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao salvar os dados no PostgreSQL.');
    }
});

app.use(express.static(__dirname)); // Serve o conteúdo estático, como o HTML

app.listen(port, () => {
    console.log(`Servidor em execução na porta ${port}`);
});
