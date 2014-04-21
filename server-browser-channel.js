var Duplex, backend, browserChannel, connect, livedb, livedbMongo, port, share, sharejs, webserver;

Duplex = require('stream').Duplex;

browserChannel = require('browserchannel').server;

connect = require('connect');

livedb = require('livedb');

livedbMongo = require('livedb-mongo');

sharejs = require('share');

webserver = connect(connect.static(__dirname + "/public"), connect.static(sharejs.scriptsDir));

backend = livedb.client(livedbMongo('localhost:27017/test?auto_reconnect', {
  safe: false
}));

share = sharejs.server.createClient({
  backend: backend
});
// create initial docs 
backend.fetch('room', '3',function(err,data){
  if(data.v === 0)
  {
    backend.submit('room', '3', {create:{type:'json0', data:{count:0,messages:[{message:"Welcome to Ember-Share demo"}]}}}, function(err, version, transformedByOps, snapshot) {});
  }
});
backend.fetch('todo', '3',function(err,data){
  if(data.v === 0)
  {
    backend.submit('todo', '3', {create:{type:'json0', data:{count:0,items:[{id:0,title:"Make a todo app",done:false}]}}}, function(err, version, transformedByOps, snapshot) {});
  }
});
webserver.use(browserChannel({
  webserver: webserver,
  cors:"*"
}, function(client) {
  var stream;
  stream = new Duplex({
    objectMode: true
  });
  stream._write = function(chunk, encoding, callback) {
    console.log('s->c ', chunk);
    if (client.state !== 'closed') {
      client.send(chunk);
    }
    return callback();
  };
  stream._read = function() {};
  stream.headers = client.headers;
  stream.remoteAddress = stream.address;
  client.on('message', function(data) {
    console.log('c->s ', data);
    return stream.push(data);
  });
  stream.on('error', function(msg) {
    return client.stop();
  });
  client.on('close', function(reason) {
    stream.emit('close');
    stream.emit('end');
    return stream.end();
  });
  return share.listen(stream);
}));

port = process.env.PORT || 7007;

webserver.listen(port);

console.log("Listening on http://localhost:" + port + "/");

