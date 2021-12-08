const express = require('express');
const path = require('path')
const dotenv = require('dotenv');
const logger  = require('morgan');
const cookieParser = require('cookie-parser');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
  } = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//ejs
app.set('view engine','ejs');

//estaticos
app.use(express.static(path.join(__dirname,'public')));

//envio de datos
app.use(express.urlencoded({extended:true}));
app.use(express.json());

//variables
dotenv.config({path: './env/.env'});

//cookies
app.use(cookieParser());

//llamar al router
app.use('/',require('./routes/router'));

/*app.get('/', (req, res)=>{
    res.render('index');
});*/

const botName='Gestion IPN';


//Socket 
io.on('connection', socket => {
    socket.on('joinRoom', ({ username, room }) => {
      const user = userJoin(socket.id, username, room);
  
      socket.join(user.room);
  
      // Welcome current user
      socket.emit('message', formatMessage(botName, 'Welcome to ChatCord!'));
  
      // Broadcast when a user connects
      socket.broadcast
        .to(user.room)
        .emit(
          'message',
          formatMessage(botName, `${user.username} has joined the chat`)
        );
  
      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    });
  
    // Listen for chatMessage
    socket.on('chatMessage', msg => {
      const user = getCurrentUser(socket.id);
  
      io.to(user.room).emit('message', formatMessage(user.username, msg));
    });
  
    // Runs when client disconnects
    socket.on('disconnect', () => {
      const user = userLeave(socket.id);
  
      if (user) {
        io.to(user.room).emit(
          'message',
          formatMessage(botName, `${user.username} has left the chat`)
        );
  
        // Send users and room info
        io.to(user.room).emit('roomUsers', {
          room: user.room,
          users: getRoomUsers(user.room)
        });
      }
    });
  });

//ajustes
const PORT = 3003 || process.env.PORT;

//inicio de servidor
server.listen(PORT,() => console.log(`Server running on port ${PORT}`));