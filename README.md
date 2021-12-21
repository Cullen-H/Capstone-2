# Collaborator
### Description
<p>Collaborator is a chat application based on discord and slack. It allows users to join servers 
and create and participate in different text channels. This functionality is directly based upon the
previously mentioned chat platforms. This application also uses GitHub oAuth as a platform for users.</p>
**
### Tests
<p>The tests can be run by executing the command: "npm test"

### User Flow
<p>When first entering the website, a new user will be presented with the option to log in with GitHub. 
After clicking this button they will be redirected and asked for access permission. After granting 
access, they will be redirected back to Collaborator. The user will then see a dashboard where they 
can create or join a server. If the user is already a member of some server or servers, those will 
be listed as options for the user to join. After a user clicks on one of their servers, they will be
brought to a dashboard displayin the selected rooms chat history as well as an input box allowing them to 
send a new message to that room. On the left side of the screen the user can see a servers rooms and will 
be able to switch between them. If they are the server owner, they will also have the option to add new channels.</p>

### Tech Stack
#### Frontend
<ul>
  <li>React</li>
  <li>React Redux</li>
  <li>Moment</li>
  <li>Socket.io-client</li>
  <li>Axios</li>
  <li>mdi-react</li>
</ul>
#### Backend
<ul>
  <li>NodeJS</li>
  <li>Express</li>
  <li>Socket.io</li>
  <li>MongoDB</li>
  <li>Mongoose</li>
  <li>jsonwebtoken</li>
  <li>nodemon</li>
  <li>uuid</li>
  <li>dotenv</li>
  <li>moment</li>
</ul>
