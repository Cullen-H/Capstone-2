import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import ServerDashboard from './components/ServerDashboard';
import Namespaces from './components/Namespaces';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAuth } from './helpers';
import { LOGOUT_USER } from './reducers';
import { appUrl, socketServerUrl } from './config';

/** App.js acts as a parent component for the frontend application.
  * This component handles all communication with the websocket server.
  */

function App() {
  const socket = useSelector(state => state.socket);
  const dispatch = useDispatch();
  const history = useHistory();
  const [nsSocket, setNsSocket] = useState(null);
  const [namespaces, setNamespaces] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [messages, setMessages] = useState([])
  const [nsActive, setNsActive] = useState(null);
  const [roomActive, setRoomActive] = useState(null);
  const [messageToSend, setMessageToSend] = useState('');
  const [nsToCreate, setNsToCreate] = useState(null);
  const [nsToJoin, setNsToJoin] = useState(null);
  const [activeMembers, setActiveMembers] = useState(0);
  const [user, setUser] = useState(null);
  const [roomToCreate, setRoomToCreate] = useState(null);
  
  /** This useEffect function handles the initial connection to the socket
    * server. It also handles any errors with authentication and receives 
    * and stores relevant user data.
    */
  useEffect(() => {
    if (!socket) {
      dispatch({
        type: LOGOUT_USER
      });
      return;
    }

    socket.on('connect_error', (err) => {
      console.error(`Connect error due to ${err.message}`);
    });

    socket.on('userData', (user) => {
      setUser(user);
      setNamespaces(user.nsList);
    });

    socket.on('error', (err) => {
      console.error(`ERR: ${err}`);
      dispatch({
        type: LOGOUT_USER
      });
    });

    socket.on('errorAuth', (err) => {
      console.error(`Authentication error: ${err}`);
      dispatch({
        type: LOGOUT_USER
      });
    });
  }, [namespaces, socket, user]);

  /** This useEffect function connects a user to the relevant namespace
    * for the server they are attempting to communicate with.
    */
  useEffect(() => {
    if (nsSocket) {
      nsSocket.close();
    }

    try {
      setNsSocket(io(`${socketServerUrl}${nsActive.slice(1)}`, getAuth()));
    } catch (err) {
      console.error(`Error connecting to namespace socket: ${err}`);
    }
  }, [nsActive]);

  /** This useEffect function intializes a servers rooms and messages
    * upon joining a room. It also updates the messages state when 
    * receiving a new message.
    */
  useEffect(() => {
    if (nsSocket) {
      nsSocket.on('nsRoomLoad', nsRooms => {
        setRooms(nsRooms);
      });

      nsSocket.on('messageToClients', (msg) => {
        setMessages([...messages, msg]);
      });

      nsSocket.on('connect_error', (err) => {
        console.error(`Error connecting to namespace socket: ${err}`);
      });
    }
  }, [nsSocket, messages]);

  /** This function sets the default active room when joining a server.
    */
  useEffect(() => {
    if (rooms.length && roomActive === null) {
      setRoomActive(rooms[0].roomId);
    }
  });
  
  /** This function updates the received messages when setting a room to active.
    */
  useEffect(() => {
    if (nsSocket) {
      if (roomActive) {
        nsSocket.on('getHistory', (history) => {
          setMessages(history);
        });
      }
    }
  }, [roomActive]);

  /** This function sends the message data to the socket server when necessary.
    */
  useEffect(() => {
    if (messageToSend) {
      nsSocket.emit('newMessageToServer', {
        username: user.username,
        namespace: nsActive,
        roomId: roomActive,
        text: messageToSend,
        avatar: user.avatar,
      });
    }
  }, [messageToSend]);

  /** This function sends the namespace data to the socket server when attempting
    * to create a new server(aka namespace).
    */
  useEffect(() => {
    if (nsToCreate) {
      const nsInfo = {
        ...nsToCreate,
        token: localStorage.getItem('chatToken')
      };
      socket.emit('createNamespace', nsInfo);
      setNsToCreate(null);
    }
  }, [nsToCreate]);

  /** This function allows a user to join an existing server.
    */
  useEffect(() => {
    if (nsToJoin) {
      const nsInfo = {
        ...nsToJoin,
        token: localStorage.getItem('chatToken')
      };
      socket.emit('joinNamespace', nsToJoin);
      setNsToJoin(null);
    }
  }, [nsToJoin]);

  /** This function sends the relevant data to the socket server
    * when creating a new channel(aka room).
    */
  useEffect(() => {
    if (roomToCreate) {
      const roomInfo = {
        ...roomToCreate,
        token: localStorage.getItem('chatToken')
      };
      nsSocket.emit('createRoom', roomInfo);
      setRoomToCreate(null);
    }
  }, [roomToCreate]);

  return (
    <div className="app">
      {
        nsActive ?
        <ServerDashboard
          nsActive={nsActive}
          rooms={rooms}
          setRoomActive={setRoomActive}
          roomActive={roomActive}
          messages={messages}
          setMessageToSend={setMessageToSend}
          setRoomToCreate={setRoomToCreate}
        /> : <Namespaces namespaces={namespaces} setNsActive={setNsActive} nsActive={nsActive} setNsToCreate={setNsToCreate} setNsToJoin={setNsToJoin} />
      }
    </div>
  );
}

export default App;
