var express = require('express')
  , app = express()
  , bodyParser = require('body-parser')
  , http = require('http')
  , server = http.createServer(app)
  , fs = require('fs')
  , users = __dirname+'/users/'
  ;
server.listen(9000);
app.use(express.static('pub'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
console.log("Server started: http://localhost:9000");
app.post('/api/users', function(req, res) {
  fs.readFile(users+req.body.user+'.json','utf8', function ( err, data) {
    if (err) res.send('{}');
    res.send(JSON.parse(data));
  });
});
app.post('/api/move', function(req, res) {
  var user={},X=4,Y=4;
  fs.readFile(users+req.body.user+'.json','utf8', function ( err, data) {
    if(err) res.send('{}');
    user=JSON.parse(data);
    switch(req.body.dir) {
      case "0": user.pos.x = (user.pos.x - 1 < 0 ? X : user.pos.x - 1); break;
      case "1": user.pos.y = (user.pos.y - 1 < 0 ? Y : user.pos.y - 1); break;
      case "2": user.pos.x = (user.pos.x + 1 > X ? 0 : user.pos.x + 1); break;
      case "3": user.pos.y = (user.pos.y + 1 > Y ? 0 : user.pos.y + 1); break;
    }
    fs.writeFile(users+req.body.user+'.json', JSON.stringify(user,null,4), function(err) {
      if(err) {
        res.send('{}');
      }else{
        res.send(user.pos);
      }
    });
  });
/*
get requested position sprite > check that user can exist in this position. 

[event] >> load map encroaching edge. creature encounter.

/X/Y/x/y.json

x % 625
y % 625
*/
});
