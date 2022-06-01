const express = require('express');
const app = express();
const { Server } = require('socket.io');
app.use(require('cors')());
const server = require('http').createServer(app);
const url = "mongodb://localhost:27017/mobile-chat-app";
const registry = require('./routes/registry.js')
const mongoose = require('mongoose');
app.use(express.json())
app.use(express.urlencoded({extended: false}))
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["POST", "GET"]
    }
});
mongoose.connect(url, {
    useUnifiedTopology: true
}, () =>  console.log('connected'));
io.on('connection', (socket) =>{
    console.log('connected')
})
app.get('/', (req, res) =>{res.send('you\'re on my mobile-chat-app backend')})
app.use('/api/auth', registry)
const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>{console.log(`http://localhost:${PORT}`)})