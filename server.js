var express = require('express')
  , app = express()
  , bodyParser = require('body-parser')
  , http = require('http')
  , server = http.createServer(app)
  ;
server.listen(9000);
app.use(express.static('pub'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
console.log("Server started: http://localhost:9000");
app.post('/api/users', function(req, res) {
  res.send(req.body);
});
