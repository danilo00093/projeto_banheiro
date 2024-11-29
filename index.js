const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;
const path = require ('path');

// Cria ou abre o banco de dados SQLite (ele será criado automaticamente se não existir)
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite.');
    }
});

// Criação da tabela 'banheiro' caso ela não exista
const createTableQuery = `
CREATE TABLE IF NOT EXISTS banheiro (
    id INTEGER PRIMARY KEY,
    nome TEXT, estado TEXT DEFAULT 'livre'
);
`;

db.run(createTableQuery, (err) => {
    if (err) {
        console.error('Erro ao criar a tabela:', err.message);
    } else {
        console.log('Tabela "banheiro" criada ou já existe.');
    }
});

// Middleware para servir arquivos estáticos (seu front-end HTML)
app.use(express.static('public'));

app.get('/cadastro', (req, res) =>{
    res.sendFile(path.join(__dirname, 'index.html')); //enviar arquivo html 
    });

// API para alterar o estado do banheiro (livre ou ocupado)
app.post('/api/banheiro/:estado', (req, res) => {
    const estado = req.params.estado;  // 'livre' ou 'ocupado'
    
    if (estado !== 'livre' && estado !== 'ocupado') {
        return res.status(400).json({ error: "Estado inválido. Use 'livre' ou 'ocupado'." });
    }

    const updateQuery = `UPDATE banheiro SET estado = ? WHERE id = 1`;
    db.run(updateQuery, [estado], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: `Estado do banheiro atualizado para ${estado}` });
    });
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
