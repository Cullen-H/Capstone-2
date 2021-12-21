"use strict";

const app = require('./app');
const http = require('http');

/** Opens up express routes on port 8000 */

app.listen(8000, () => {
  console.log('express server listening on *:8000');
});

const server = http.createServer(app);

/** Opens up the socket server on port 8001 */

server.listen(8001, () => {
  console.log('socket server listening on *:8001');
});

const textSocket = require('./chat/textSocket');
textSocket(server);
