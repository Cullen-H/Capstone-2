const mongoose = require('mongoose');
const { Schema } = mongoose;

/** Collaborator user model.
  * github_userId: immutable github id for a given user.
  * username: mutable username received from github.
  * avatar: mutable link to a users profile image.
  * token: mutable jsonwebtoken. This will be updated and used when a user logs in. Used to authenticate each private route and socket event.
  * namespaces: an array containing namespace endpoints(ids) that a user belongs to.
  */
const userSchema = new Schema({
  github_userId: String,
  username: String,
  avatar: String,
  token: String,
  namespaces: [
    {
      type: String
    }
  ]
});

mongoose.model('users', userSchema);
