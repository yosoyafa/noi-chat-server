const app = require('express')();
const server = require('http').createServer(app);
const cors = require('cors');

const router = require('./utils/router');
const options = require('./socket/options');
const { onStart } = require('./socket/handlers');
const io = require('socket.io')(server, options);

app.use(router);
app.use(cors());

onStart(io);

const PORT = 3333;
server.listen(PORT, () => console.log(`Server up on port ${PORT}`));
