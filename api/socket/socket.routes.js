const socketService = require('./socket-service')

module.exports = connectSockets

function connectSockets(io) {
    socketService.setSocketIo(io)
    io.on('connection', socket => {
        console.log('connection!');
        socket.on('joinUsersSocket', () => {
            socketService.joinUsersSocket(socket)
        })
        socket.on('lalalala', () => {
            console.log('this is work');
        })
    })
}



