const mongoose = require('mongoose');
const moment = require('moment');
const jwt = require('jsonwebtoken');
const uuid = require('uuid').v4;
const { secretJwt, dbName, NODE_ENV } = require('../config');

mongoose.connect(`mongodb://localhost:27017/${dbName}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

require('../models/User');
require('../models/Server');

const User = mongoose.model('users');
const Server = mongoose.model('servers');


/** Ensures a user has a valid jwt.
  */
function isValid(token) {
  if (!token) return false;
  try {
    const res = jwt.verify(token, secretJwt);
    return !!res;
  } catch (err) {
    return false;
  }
}

/** Retrieves and returns a collaborator user based on their active token.
  */
async function getUser(token) {
  let res = false;
  if (token) {
    try {
      res = await User.findOne({ token });
      return res;
    } catch (err) {
      return res;
    }
  }
}

function setNamespaceSocket(io, namespace) {
  io.of(namespace.endpoint).on('connection', (nsSocket) => {
    nsSocket.emit('nsRoomLoad', namespace.rooms);

    nsSocket.on('joinRoom', async (roomToJoin, numUserCb) => {
      const roomToLeave = Object.keys(nsSocket.rooms)[1];
      if (roomToLeave) nsSocket.leave(roomToLeave);
      updateUsersInRoom(io, namespace, roomToLeave);
      nsSocket.join(roomToJoin);
      const nsRoomServer = await Server.findOne({ endpoint: namespace.endpoint }).exec()
      const getNsRoom = () => {
        for (let i = 0; i < nsRoomServer.rooms.length; i++) {
          if (nsRoomServer.rooms[i].roomId === roomToJoin) return nsRoomServer.rooms[i];
        }
      };
      const nsRoom = getNsRoom();

      if (roomToJoin) {
        nsSocket.emit('getHistory', nsRoom.history);
      }
    });

    nsSocket.on('newMessageToServer', async (msg) => {
      const messageToSave = {
        messageId: uuid(),
        username: msg.username,
        date: moment().unix(),
        text: msg.text,
        avatar: msg.avatar,
        roomId: msg.roomId
      }
      const serverToUpdate = await Server.findOne({ endpoint: namespace.endpoint });
      const getRoomIndex = () => {
        for (let i = 0; i < serverToUpdate.rooms.length; i++) {
          if (serverToUpdate.rooms[i].roomId === msg.roomId) return i;
        }
      };
      const roomIndex = getRoomIndex();
      serverToUpdate.rooms[roomIndex].history.push(messageToSave);
      await serverToUpdate.save();
      io.of(namespace.endpoint).to(msg.roomId).emit('messageToClients', messageToSave);
    });

    nsSocket.on('createRoom', async (roomInfo) => {
      try {
        const serverUser = await getUser(roomInfo.token);
        const serverToAddRoom = await Server.findOne({ endpoint: roomInfo.endpoint }).exec();
        if (serverToAddRoom.ownerId === serverUser.github_userId) {
          serverToAddRoom.rooms.push({
            roomId: uuid(),
            roomTitle: roomInfo.roomTitle
          });
          await serverToAddRoom.save();
          nsSocket.emit('nsRoomLoad', serverToAddRoom.rooms);
        }
      } catch(err) {
        console.error('failed to create a new room. ', err);
      }
    });
  });
}

function textSocket(server) {
  let io;
  if (NODE_ENV === 'production') {
    io = require('socket.io')(server);
  } else {
    io = require('socket.io')(server, { cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["content-type", "authorization"],
    }
    });
  }

  /** Authorization middleware for each socket event.
    */
  io.use((socket, next) => {
    const token = (socket.handshake.headers['authorization'] || '').split(' ')[1]
    if (token) {
      if (isValid(token)) {
        if (!socket.token) socket.token = token;
        next();
      }
    } else {
      return next(new Error('Authorization error: token is invalid.'));
    }
  });

  io.on('connection', async (socket) => {
    const user = await getUser(socket.token);
    if (!user) {
      socket.emit('errorAuth', { error: 'errorAuth: issue establishing a connection' });
      return;
    } 
    
    const nsList = [];
    for (let i = 0; i < user.namespaces.length; i++) {
      const serverNs = await Server.findOne({ endpoint:user.namespaces[i] });
      nsList.push({ endpoint: serverNs.endpoint, img: serverNs.img, ownerId: serverNs.ownerId, nsTitle: serverNs.nsTitle });
    }
    
    const data = {
      username: user.username,
      avatar: user.avatar,
      nsList: nsList,
      github_userId: user.github_userId
    }
    socket.emit('userData', data);

    // create and join events
    socket.on('createNamespace', async (nsInfo) => {
      try {
        const user = await getUser(nsInfo.token);
        const newServer = await Server.create({
          endpoint: `/${uuid()}`,
          img: nsInfo.img,
          nsTitle: nsInfo.title,
          ownerId: user.github_userId
        });
        const serverOwner = await User.findOneAndUpdate({ token: nsInfo.token }, { $push: { namespaces: newServer.endpoint } }, { new: true });
        setNamespaceSocket(io, newServer);
        const nsList = [];
        for (let i = 0; i < user.namespaces.length; i++) {
          const serverNs = await Server.findOne({ endpoint:user.namespaces[i] });
          nsList.push({ endpoint: serverNs.endpoint, img: serverNs.img, ownerId: serverNs.ownerId, nsTitle: serverNs.nsTitle });
        }
        const data = {
          username: serverOwner.username,
          avatar: serverOwner.avatar,
          nsList: nsList,
          github_userId: serverOwner.github_userId
        }
        socket.emit('userData', data);
      } catch(err) {
        console.error('failed to create a new namespace: ', err);
      }
    });

    socket.on('joinNamespace', async (nsInfo) => {
      try {
        const serverToJoin = await Server.findOne({ endpoint: nsInfo.endpoint });
        if (serverToJoin) {
          const serverUser = await User.findOneAndUpdate({ token: nsInfo.token }, { $push: { namespaces: serverToJoin.endpoint } }, { new: true });
          for (let i = 0; i < user.namespaces.length; i++) {
            const serverNs = await Server.findOne({ endpoint:user.namespaces[i] });
            nsList.push({ endpoint: serverNs.endpoint, img: serverNs.img, ownerId: serverNs.ownerId, nsTitle: serverNs.nsTitle });
          }
          const data = {
            username: serverUser.username,
            avatar: serverUser.avatar,
            nsList: nsList,
            github_userId: serverOwner.github_userId
          }
          socket.emit('userData', data);
        }
      } catch(err) {
        console.error('faled to add user to namespace: ', err);
      }
    });
    
  });
  
  Server.find({}, (err, servers) => {
    servers.map(namespace => setNamespaceSocket(io, namespace));
  });
}

module.exports = textSocket;
