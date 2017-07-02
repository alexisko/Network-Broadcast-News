const net = require('net');

const clients = [];
const server = net.createServer();

server.listen(6969, '127.0.0.1', () => {
  console.log("Server listening on "+server.address().address+":"+server.address().port);
});

server.on('connection', function(socket) {

  //Print that a new connection with a client was made
  process.stdout.write("CONNECTED: " + socket.remoteAddress + ":" + socket.remotePort);

  socket.name = socket.remoteAddress + ":" + socket.remotePort;
  clients.push(socket); //Push new client to list

  //When recieving data, broadcast message to all clients
  socket.on('data', (data) => {
    broadcast(socket.name + " : " + data, socket);
  });

  function broadcast(msg, sender) {
    clients.forEach((client) => {
      if(client === sender) return;
      client.write(msg);
    });
    process.stdout.write("SERVER BCAST FROM " + msg);
  }

  //When a client closes print message
  socket.on("close", (data) => {
    console.log("CLOSED: "+socket.name);
  });

});



