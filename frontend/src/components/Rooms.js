import React, { useState } from 'react';
import axios from 'axios';
import { serverUrl } from '../config';

/** Rooms.js lists all of a servers(namespaces) channels(rooms)
  * and allows a user to click on one to select it. When that room is
  * selected the roomActive prop is updated and that channels messages are
  * displayed to the user. If a user owns the server, they are given the 
  * option to create a new channel.
  */

function Rooms({ nsActive, rooms, setRoomActive, roomActive, setRoomToCreate }) {
  const initialFormData = {
    roomTitle: '',
    endpoint: ''
  }

  const [createRoomActive, setCreateRoomActive] = useState(false);
  const [formData, setFormData] = useState(initialFormData);

  const handleChange = evt => {
    setFormData({
      roomTitle: evt.target.value,
      endpoint: nsActive
    });
  };

  const gatherInput = evt => {
    evt.preventDefault();
    setRoomToCreate(formData);
    setFormData(initialFormData);
    setCreateRoomActive(false);
  };

  const isServerOwner = async () => {
    try {
      const data = {
        token: localStorage.getItem('chatToken'),
        endpoint: nsActive
      }
      const res = await axios.post(`${serverUrl}/is-ns-owner`, data);
      if (res.data.isOwner) return true;
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const toggleRoomActive = () => {
    setCreateRoomActive(!createRoomActive);
    if (!createRoomActive) setFormData(initialFormData);
  };

  return (
    <div className="rooms-container">
      <div className="rooms">
        {
          rooms.map(room => {
            let activeClass = room.roomId === roomActive ? 'font-bold font-white' : 'font-light';

            return (
              <div className={activeClass} key={room.roomId} onClick={() => setRoomActive(room.roomId)}>
                <span className="channel-title">#{room.roomTitle}</span>
              </div>
            );
          })
        }
        {isServerOwner() ?
          <div className={createRoomActive ? "new-channel-container-active" : "new-channel-container" }>
            <a className="new-channel-btn" onClick={() => setCreateRoomActive(!createRoomActive)}>{createRoomActive ? '- Cancel' : '+ add a new channel'}</a>
            {createRoomActive ?
            <form onSubmit={gatherInput}>
              <input
                className="new-room-input"
                name="roomTitle"
                value={formData.roomTitle}
                onChange={handleChange}
                required
              />
            </form> : null
            }
          </div> : null
        }
      </div>
    </div>
  );
}

export default Rooms;
