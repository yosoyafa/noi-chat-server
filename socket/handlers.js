const { addUser, removeUser, getUser, getUsersInRoom } = require('../models/users');
const { addRoom, storeHistory, getRoomHistory } = require('../models/history');

const onStart = io => {

    io.on('connection', socket => {
        onJoin(io, socket);
        onEntered(io, socket);
        onMessage(io, socket);
        onDisconnect(io, socket);
    });

};

const onJoin = (io, socket) => {
    socket.on('join', ({ nickname, room }, callback) => {
        const { error } = addUser({ id: socket.id, nickname, room });

        if (!!error) {
            return callback(error);
        }

        addRoom(room);

        callback();
    });
};

const onEntered = (io, socket) => {
    socket.on('entered', ({ nickname, room }, callback) => {
        socket.emit('message', { user: 'admin', text: `Welcome to ${room}` });

        const history = getRoomHistory(room);
        history.forEach(element => socket.emit('message', element));

        const msg = { user: 'admin', text: `${nickname} has joined` };
        socket.broadcast.to(room).emit('message', msg);
        storeHistory(room, msg);

        socket.join(room);

        io.to(room).emit('roomData', { room: room, users: getUsersInRoom(room) });
        callback();
    });
}

const onMessage = (io, socket) => {
    socket.on('sendMessage', (message, time, isGif, callback) => {
        const { nickname, room } = getUser(socket.id);

        const msg = { user: nickname, text: message, time, isGif: isGif };
        io.to(room).emit('message', msg);
        storeHistory(room, msg);

        io.to(room).emit('roomData', { room: room, users: getUsersInRoom(room) });

        callback();
    });
};

const onDisconnect = (io, socket) => {
    socket.on('disconnect', () => {
        const user = removeUser(socket.id);

        if (user) {
            const msg = { user: 'admin', text: `${user.nickname} has left` };
            io.to(user.room).emit('message', msg);
            storeHistory(user.room, msg);
            io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
        }
    });
};

module.exports = { onStart };