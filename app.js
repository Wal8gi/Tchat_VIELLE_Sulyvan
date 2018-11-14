const express =require('express')
var app = express()
const http = require('http').Server(app)
const socketio = require('socket.io')(http)
app.use(express.static('./view/'))
const randomcolor = require('randomcolor')
var client = 0

socketio.emit('message', 'Numbers of tchatter : ' + client)

socketio.on('connection', (socket) => {
    client++
    var couleur = randomcolor()

    socket.on('new_client', (pseudo) => {        
        socket.pseudo = pseudo.fontcolor(couleur)
        socket.broadcast.emit('message', socket.pseudo + ' joined the chat')
        socket.broadcast.emit('message', client + ' clients connected')
    })
    
    console.log('user connected : ', socket.id)
    socket.on('loaded', (data) => {
        console.log('data from client : ', data)
    })
    socket.on('message', (data) => {
       socketio.emit('message', socket.pseudo + ' : '+ data)
    })
    socket.on('disconnect', () => {
        client--
        if(socket.pseudo != '')
        socket.broadcast.emit('message', socket.pseudo + ' leave the chat')
        socket.broadcast.emit('message', client + ' clients connected')
        console.log('user disconnected : ', socket.id)
    })
})

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/view/index.html')
})

http.listen(3000, () => {
    console.log('Server is up and running on http://localhost:3000')
})