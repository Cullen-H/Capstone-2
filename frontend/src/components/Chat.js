import React, { useState } from 'react';
import Messages from './chat/Messages';
import axios from 'axios';

/** Chat.js contains all messages within the active channel(room) within a server(namespace).
  * It also contains a form for sending a new message within the selected channel(room).
  */

function Chat({ messages, setMessageToSend, roomActive }) {
  const [inputValue, setInputValue] = useState('');

  const handleChange = evt => {
    setInputValue(evt.target.value);
  };

  const gatherInput = evt => {
    evt.preventDefault();
    setMessageToSend(inputValue);
    setInputValue('');
  };

  return (
    <div className="chat-container" data-testid="chat-container">
      <div>
        <div className="messages-container">
          <Messages messages={messages} />
        </div>
        <div className="input-message-container">
          <form onSubmit={gatherInput}>
            <input className="message-input" placeholder="Message..." value={inputValue} onChange={handleChange} />
          </form>
        </div>
      </div>
    </div>
  );
}

export default Chat;
