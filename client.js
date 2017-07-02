const net = require('net');

const client  = new net.Socket();
client.connect(6969, '127.0.0.1', function() {

  //Print that the client sucessfully connected to the server
  var clientAddress = client.remoteAddress + ":" + client.remotePort;
  console.log("CONNECTED TO: " + clientAddress);

  process.stdin.setEncoding('utf8');
  process.stdin.on('readable', () => {
    var chunk = process.stdin.read();
    //As long as the input isn't null, write message on clients side and pass message
    //to the server
    if(chunk !== null) {
      process.stdout.write(clientAddress + " : " + chunk);
      client.write(chunk);
    }
  });

  //Print out data that is recieved from the server
  client.on('data', (data) => {
    process.stdout.write(data);
  });
});