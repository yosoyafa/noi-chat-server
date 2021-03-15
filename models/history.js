const rooms = [];

const addRoom = name => {
    if (!!rooms.find(room => room.name === name)) {
        return { error: 'room already exists' };
    }

    const room = {
        id: rooms.length,
        name: name,
        history: []
    };

    rooms.push(room);

    return room;
};

const storeHistory = (name, message) => {
    const room = rooms.find(r => r.name === name);

    if (!room) {
        return { error: 'room not found' };
    }

    let historyAux = room.history;
    historyAux.push(message);

    return room;
};

const getRoomHistory = name => {
    const room = rooms.find(r => r.name === name);

    if (!room) {
        return { error: 'room not found' };
    }

    return room.history;
};

module.exports = { addRoom, storeHistory, getRoomHistory };