/* jshint node:true */

var cluster = require('cluster');
 
if (cluster.isMaster) {
 
  // Fork workers.
  for (var i = 0; i < require('os').cpus().length; i++) {
    cluster.fork();
  }
 
  return ;
}




var Duplex, backend, Primus, PrimusCluster, connect, livedb, livedbMongo, port, share, sharejs, webserver;

Duplex = require('stream').Duplex;

Primus = require('primus');

connect = require('connect');

livedb = require('livedb');

livedbMongo = require('livedb-mongo');

sharejs = require('share');

webserver =  require('http').createServer(connect(connect.static(__dirname + "/dist"), connect.static(sharejs.scriptsDir)));
webserver.on('error',function(err){
  console.log(err);
})
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
var primus = new Primus(webserver,{
  transformer : 'sockjs'
});

PrimusCluster = require('primus-cluster');

primus.use('cluster', PrimusCluster);

primus.on('connection', function (spark) {
  var stream;
  stream = new Duplex({
    objectMode: true
  });
  stream._write = function(chunk, encoding, callback) {
    // console.log('s->c ', chunk);
    if (spark.state !== 'closed') {
      spark.write(chunk);
    }
    return callback();
  };
  stream._read = function() {};
  stream.headers = spark.headers;
  stream.remoteAddress = stream.address;
  spark.on('data', function(data) {
    // console.log('c->s ', data);
    return stream.push(data);
  });
  stream.on('error', function(msg) {
    return spark.emit('error',msg);
  });
  spark.on('end', function(reason) {
    stream.emit('close');
    stream.emit('end');
    return stream.end();
  });
  return share.listen(stream);
});
primus.save(__dirname +'/public/assets/js/primus.js');
port = process.env.PORT || 7007;

webserver.listen(port);

console.log("Listening on http://localhost:" + port + "/");
