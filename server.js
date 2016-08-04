var express = require('express')
  , app = express()
  , bodyParser = require('body-parser')
  , http = require('http')
  , server = http.createServer(app)
  , fs = require('fs')
  , users = __dirname+'/users/'
  , maps = __dirname+'/pub/map/'
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
  fs.readFile(users+req.body.user+'.json','utf8', function ( e, d) {
    if(e) res.send('{}');
    user=JSON.parse(d);
    switch(req.body.dir) {
      case "0": user.pos.x = (user.pos.x - 1 < 0 ? X : user.pos.x - 1); break;
      case "1": user.pos.y = (user.pos.y - 1 < 0 ? Y : user.pos.y - 1); break;
      case "2": user.pos.x = (user.pos.x + 1 > X ? 0 : user.pos.x + 1); break;
      case "3": user.pos.y = (user.pos.y + 1 > Y ? 0 : user.pos.y + 1); break;
    }
    var xx = Math.floor(user.pos.x/625)|0
      , yy = Math.floor(user.pos.y/625)|0
      , x = Math.floor((user.pos.x - (xx * 625) ) / 25)|0
      , y = Math.floor((user.pos.y - (yy * 625) ) / 25)|0
      , map = maps+xx+'/'+yy+'/'+x+'/'+y+'.json'
      ;
    fs.readFile(map,'utf8', function ( ee, dd) {
      //TODO: handle file not found.
      //if(ee.code === 'ENOENT') {
        //var dd = JSON.parse(d);
        //res.send(JSON.stringify(dd.pos,null,4));
      //}
      var dd = JSON.parse(dd);
      if(user.lvl >= dd[user.pos.x][user.pos.y]) {
        fs.writeFile(users+req.body.user+'.json', JSON.stringify(user,null,4), function(err) {
          if(err) {
            var dd = JSON.parse(d);
            res.send(JSON.stringify(dd.pos,null,4));
          }else{
            res.send(user.pos);
          }
        });
      }else{
        var dd = JSON.parse(d);
        res.send(JSON.stringify(dd.pos,null,4));
      }
    });
  });
});
