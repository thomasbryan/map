var express = require('express')
  , app = express()
  , http = require('http')
  , server = http.createServer(app)
  ;
server.listen(9000);
app.use(express.static('pub'));
console.log("Server started: http://localhost:9000");
