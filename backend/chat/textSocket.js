const mongoose = require('mongoose');
const moment = require('moment');
const jwt = require('jsonwebtoken');
// const { uuid } = require('uuidv4');
// const uuid = { v4 } = require('uuid');
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

// TODO: Do I need? I doubt I need this...
function updateUsersInRoom(io, namespace, room) {
  const clients = io.of(namespace.endpoint).adapter.rooms.get(room);
  const numClients = clients ? clients.size : 0;
  io.of(namespace.endpoint).to(room).emit('updateMembers', numClients);
}

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

// TODO: ensure io is passed to this function properly in all places
function setNamespaceSocket(io, namespace) {
  io.of(namespace.endpoint).on('connection', (nsSocket) => {
    nsSocket.emit('nsRoomLoad', namespace.rooms);

    nsSocket.on('joinRoom', async (roomToJoin, numUserCb) => {
      // TODO: completely remodel this...
      const roomToLeave = Object.keys(nsSocket.rooms)[1];
      if (roomToLeave) nsSocket.leave(roomToLeave);
      updateUsersInRoom(io, namespace, roomToLeave);
      nsSocket.join(roomToJoin);
      const nsRoomServer = await Server.findOne({ endpoint: namespace.endpoint }).exec()
      // console.log('nsRoomServer:::::::::::::', nsRoomServer);
      const getNsRoom = () => {
        for (let i = 0; i < nsRoomServer.rooms.length; i++) {
          if (nsRoomServer.rooms[i].roomId === roomToJoin) return nsRoomServer.rooms[i];
        }
      };
      const nsRoom = getNsRoom();
      // console.log('nsRoom: ', nsRoom);

      // nsRoom = namespace.rooms.find(room => {
      //   return room.roomTitle === roomToJoin;
      // });
      if (roomToJoin) {
        // console.log(nsRoom.history);
        // console.log(roomToJoin);
        // console.log('nsRoom01: ', nsRoom);
        nsSocket.emit('getHistory', nsRoom.history);
      }
      // TODO: Get rid of these
      updateUsersInRoom(io, namespace, roomToJoin)
    });

    nsSocket.on('newMessageToServer', async (msg) => {
      // TODO: add this
      // console.log('msg: ', msg);
      const messageToSave = {
        messageId: uuid(),
        username: msg.username,
        date: moment().unix(),
        text: msg.text,
        avatar: msg.avatar,
        roomId: msg.roomId
      }
      const serverToUpdate = await Server.findOne({ endpoint: namespace.endpoint });
      // TODO: get the index of the room in question
      // const roomIndex = _ = () => {
        // for (let i = 0; i < serverToUpdate.rooms.length; i++) {
        //   if (serverToUpdate.rooms[i].roomId === msg.roomId) return i;
        // }
      // };
      const getRoomIndex = () => {
        // console.log(serverToUpdate.rooms);
        for (let i = 0; i < serverToUpdate.rooms.length; i++) {
          // console.log('serverToUpdate.rooms[i].roomId: ', serverToUpdate.rooms[i].roomId);
          // console.log('msg.roomId:                   : ', msg.roomId);
          if (serverToUpdate.rooms[i].roomId === msg.roomId) return i;
        }
      };
      const roomIndex = getRoomIndex();
      // console.log('roomIndex: ', roomIndex);
      // console.log('room[roomIndex]: ', serverToUpdate.rooms[roomIndex]);
      serverToUpdate.rooms[roomIndex].history.push(messageToSave);
      await serverToUpdate.save();
      // TODO: broadcast the new messages
      io.of(namespace.endpoint).to(msg.roomId).emit('messageToClients', messageToSave);
    });

    // TODO: add create a channel to here instead
    nsSocket.on('createRoom', async (roomInfo) => {
      try {
        console.log('attempting to create a room');
        const serverUser = await getUser(roomInfo.token);
        const serverToAddRoom = await Server.findOne({ endpoint: roomInfo.endpoint }).exec();
        // console.log(serverToAddRoom);
        // console.log(typeof(serverToAddRoom.ownerId));
        // console.log(typeof(serverUser.github_userId));
        if (serverToAddRoom.ownerId === serverUser.github_userId) {
          // console.log('roomInfo.title', roomInfo.roomTitle);
          serverToAddRoom.rooms.push({
            roomId: uuid(),
            roomTitle: roomInfo.roomTitle
          });
          // await serverToAddRoom.save();
          console.log('serverToAddRoom', serverToAddRoom);
          await serverToAddRoom.save();
          // console.log('serverToAddRoom.rooms', serverToAddRoom.rooms[0].roomTitle);
          // TODO: find a way to broadcast the updated server to the user
          nsSocket.emit('nsRoomLoad', serverToAddRoom.rooms);
        }
      } catch(err) {
        console.log('failed to create a new room. ', err);
      }
    });
  });
}

function textSocket(server) {
  let io;
  if (NODE_ENV === 'production') {
    io = require('socket.io')(server);
    console.log('production socket server started');
  } else {
    io = require('socket.io')(server, { cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["content-type", "authorization"],
    }
    });
    console.log('developement socket server started');
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
      console.log('no user');
      socket.emit('errorAuth', { error: 'errorAuth: issue establishing a connection' });
      return;
    } 
    User.find({}).select('github_userId').exec((err, users) => {
      users.forEach(user => {
        // console.log(user);
      });
    });
    Server.find({}).select('endpoint').exec((err, servers) => {
      servers.forEach(server => {
        // console.log(server);
      });
    });
    
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
        // TODO: is this as ideal as possible? and do I need to change token to ownerId elsewhere as well?
        const newServer = await Server.create({
          endpoint: `/${uuid()}`,
          img: nsInfo.img,
          nsTitle: nsInfo.title,
          ownerId: user.github_userId
        });
        const serverOwner = await User.findOneAndUpdate({ token: nsInfo.token }, { $push: { namespaces: newServer.endpoint } }, { new: true });
        setNamespaceSocket(io, newServer);
        // TODO: Fix the nsList here and in joinNamespace
        const nsList = [];
        // console.log('user:::: ', user);
        // console.log('user.namespaces', user.namespaces);
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
        console.log('failed to create a new namespace: ', err);
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
        console.log('faled to add user to namespace: ', err);
      }
    });
    
  });
  
  Server.find({}, (err, servers) => {
    // TODO: implement error handling
    servers.map(namespace => setNamespaceSocket(io, namespace));
  });
}

module.exports = textSocket;
