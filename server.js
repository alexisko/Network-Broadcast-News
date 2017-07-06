/*jshint esversion: 6 */
const net = require('net');

const clients = [];
const clientUsernames = ["admin"];
const server = net.createServer();
// server.setEncoding('utf8');
server.listen(6969, '127.0.0.1', () => {
  console.log("Server listening on "+server.address().address+":"+server.address().port);
});

server.on('connection', function(socket) {

  var newClient = {
    username: null,
    socket: null
  };

  socket.setEncoding('utf8');

  //Print that a new connection with a client was made
  process.stdout.write("CONNECTED: " + socket.remoteAddress + ":" + socket.remotePort + "\n");

  //Ask new client for username
  socket.write("Enter a username: ");

  //Assign new clients socket variable
  newClient.socket = socket;

  // socket.name = socket.remoteAddress + ":" + socket.remotePort;
  clients.push(newClient); //Push new client to list

  //ADMIN MESSAGES
  //add comments
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', (chunk) => {
    //As long as the input isn't null, write message on clients side and pass message
    //to the server
    if(chunk !== null) {
      process.stdout.write("[ADMIN] : " + chunk);
      adminBroadcast("[ADMIN] : " + chunk);
    }
  });

  //add comments
  function adminBroadcast(msg) {
    clients.forEach((client) => {
      client.socket.write(msg);
    });
  }

  //CLIENT MESSAGES
  //When recieving data, broadcast message to all clients
  socket.on('data', (data) => {
    if(newClient.username === null) {
      var username = data.slice(0, data.length - 1);
      if(clientUsernames.indexOf(username) === -1) {
        newClient.username = username;
        clientUsernames.push(username);
        socket.write("Welcome to the chat room, " + newClient.username + ".\n");
        broadcast(newClient.username + " has joined the chat room.\n");
        process.stdout.write(socket.remoteAddress + ":" + socket.remotePort + " is now " + newClient.username + ".\n");
      } else {
        socket.write("That username is already taken, try again: ");
      }
    } else {
      process.stdout.write("SERVER BROADCAST FROM " + findClient(socket).username + " : " + data);
      broadcast(findClient(socket).username + " : " + data);
    }
  });

  function broadcast(msg) {
    //print on clients, except sender
    clients.forEach((client) => {
      client.socket.write(msg);
    });
  }

  //When a client closes print message
  socket.on('close', () => {
    var closedClient = findClient(socket);

    process.stdout.write(closedClient.username + " left the chat.\n");
    clients.splice(clients.indexOf(closedClient), 1);
    clientUsernames.splice(clientUsernames.indexOf(closedClient.username), 1);
    broadcast(closedClient.username + " left the chat.\n");
  });

  function findClient(socket) {
    for(var i = 0; i < clients.length; i++) {
      if(clients[i].socket === socket) {
        return clients[i];
      }
    }
  }

});

// server.on('data', (data) => {
//   process.stdout.write("hello");
// });



