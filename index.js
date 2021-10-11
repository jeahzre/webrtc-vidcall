const express = require('express')
const app = express();
const server = require('http').createServer(app);
const cors = require('cors');
const io = require('socket.io')(server, {
  cors: {
    origin:  "*", 
    methods: ["GET", "POST"]
  }
});
const {nanoid} = require('nanoid')

app.use(cors());

const PORT = process.env.PORT || 5000;

app.set('view engine', 'ejs');
app.use(express.static('public'))

app.get('/', (req,res) => {
  res.redirect(`/${nanoid()}`);
})

app.get('/:room', (req, res) => {
  // res.send(req.params.room)
  res.render('room', {roomId: req.params.room});
});

io.on('connection', (socket) => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).emit('user-connected', userId);
  });
  socket.emit('me', socket.id);
  socket.on('disconnect', () => {
    // socket.bradcast.emit('callended');
  });
})

server.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));






