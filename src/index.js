const express = require('express')
const app = express();

const http = require('http');
const server = http.Server(app);

const socketIO = require('socket.io');
const io = socketIO(server);
var {User}=require('./Userclass');
const port = process.env.PORT || 3000;
var users=new User();
io.on('connection', (socket) => {
    let channel_name=socket.handshake.query.channel_name;
    let user_name=socket.handshake.query.user_name;
    console.log('user connected');
    //Joining the particular Channel
    socket.join(channel_name);
    users.Addusername(socket.id,user_name,channel_name);
    socket.on('new-message', (message) => {
        console.log(message);
        io.emit('newmessage',message);
    });
    // Remove on disconnect
    socket.on("disconnect",function(){
        var user=users.RemoveUser(socket.id);
        if(user){
            io.to(user.room).emit("namelist",users.GetUserList(user.room));
        }
    });
});
server.listen(port, () => {
    console.log(`started on port: ${port}`);
});