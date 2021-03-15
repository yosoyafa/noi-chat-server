const app = require('express')();
const server = require('http').createServer(app);
const cors = require('cors');
const router = require('./utils/router');

app.use(cors());
app.use(router);

const options = require('./socket/options');
const { onStart } = require('./socket/handlers');
const io = require('socket.io')(server, options);

onStart(io);

server.listen(process.env.PORT || 5000, () => console.log(`Server has started.`));
