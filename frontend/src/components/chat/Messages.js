import React from 'react';
import moment from 'moment';
import Message from './Message';

/** Messages.js contains a list of all messages in the
  * selected room.
  */

function Messages({ messages }) {
  return (
    <div className="messages" data-testid="messages-container">
      {
        messages.map(msg => {
          return <Message key={msg.date} msg={msg} />
        })
      }
    </div>
  );
}

export default Messages;
