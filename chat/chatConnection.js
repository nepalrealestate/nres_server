const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);


function Chat(){
    
    io.on('connection', chatSocket);
    
    function chatSocket(socket){

      console.log("User Connected")

        socket.on("chat",(payload)=> socket.emit('clientChat',{message:"Welcome to Our Chat System"}));
        
       

        socket.on('disconnect', () => {
            console.log('user disconnected');
          });
    }
    
    this.chatServer=()=>{server.listen(5000,()=>console.log("chat server running on port 5000"))};
}

module.exports = {Chat};
