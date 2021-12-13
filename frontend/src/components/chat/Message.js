import React, { useState } from 'react';
import moment from 'moment';

/** Message.js contains the data and html of an individual message
  * displayed in the chat box.
  */

function Message({ msg: { username, text, date, avatar } }) {
  const parsedTime = `${moment.unix(date).format('h: mm a')}`;
  const parsedDate = `${moment.unix(date).fromNow()} - ${moment.unix(date).format('D MMM YYYY, h:mm a')}`;
  return (
    <div className="message">
      <div className="message-metadata">
        <img className="message-avatar" src={avatar} />
        <p className="message-username">{username}</p>
        <div className="message-date-container">
          <p className="message-date">{parsedDate}</p>
          <p className="message-time">{parsedTime}</p>
        </div>
      </div>
      <div className="message-body">
        <p className="message-text">{text}</p>
      </div>
    </div>
  );
}

export default Message;
