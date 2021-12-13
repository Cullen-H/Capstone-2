import React from 'react';
import Rooms from './Rooms';
import Chat from './Chat';

/** ServerDashboard.js acts as a parent component for a logged in user.
  */

function ServerDashboard({ nsActive, rooms, setRoomActive, roomActive, messages, setMessageToSend, setRoomToCreate }) {
  return (
    <div className="server-dashboard">
      <Rooms 
        nsActive={nsActive}
        rooms={rooms}
        setRoomActive={setRoomActive}
        roomActive={roomActive}
        setRoomToCreate={setRoomToCreate}
      />
      <div className="chat">
      {roomActive ?
        <Chat
          messages={messages}
          setMessageToSend={setMessageToSend}
          roomActive={roomActive}
        /> : <h1>Select a text channel to start</h1>
      }
      </div>
    </div>
  );
}

export default ServerDashboard;
