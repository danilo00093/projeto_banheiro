const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let bathroomStatus = {
    occupied: false,
    user: ''
};

io.on('connection', (socket) => {
    // Envia o status atual ao novo usuário
    socket.emit('statusUpdate', bathroomStatus);

    // Ouve as atualizações de status
    socket.on('updateStatus', (data) => {
        bathroomStatus = data;
        // Notifica todos os clientes sobre a mudança
        io.emit('statusUpdate', bathroomStatus);
    });
});

app.use(express.static('public'));

server.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});
