import React from 'react';
import moment from 'moment';
import Message from './Message';

/** 
  */

function Messages({ messages }) {
  console.log('messages: ', messages);

  return (
    <div className="messages">
      {
        messages.map(msg => {
          return <Message key={msg.date} msg={msg} />
        })
      }
    </div>
  );
}

export default Messages;
