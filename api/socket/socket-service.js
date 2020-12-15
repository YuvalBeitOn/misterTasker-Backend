module.exports = {
    emitUpdateTask,
    joinUsersSocket,
    setSocketIo
}

let gIo;

function setSocketIo(io) {
    console.log('setSocketIo is running');
    gIo = io;

}

function joinUsersSocket(socket) {
    console.log('joinUsersSocket is running');
    socket.join('users')
}

function emitUpdateTask(task) {
    console.log('task in socket service:', task._id);
    gIo.to('users').emit('updateTask', task);
}




