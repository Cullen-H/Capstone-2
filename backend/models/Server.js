const mongoose = require('mongoose');
const { Schema } = mongoose;

/** Server(namespace) model.
  * endpoint: unique id prepended by a '/' used as a namespace endpoint for socket.io.
  * img: url to a namespaces image.
  * owner: the id of the user that created the server.
  * nsTitle: a title for the namespace, specified by the owner.
  * rooms: an array containg rooms(channels) within a server; [
    * roomId: immutable unique id of a room.
    * roomTitle: mutable room title.
    * history: an array containing room message history; [
      * username: username of message sender.
      * date: date/time the message was sent.
      * text: content of the message.
      * avatar: the avatar of the user who sent the message.
      * ]
    * ]
  */
const serverSchema = new Schema({
  endpoint: String,
  img: String,
  nsTitle: String,
  ownerId: String,
  rooms: [
    {
      roomId: String,
      roomTitle: String,
      history: [
        {
          messageId: String,
          username: String,
          date: String,
          text: String,
          avatar: String
        }
      ]
    }
  ]
});

mongoose.model('servers', serverSchema);
