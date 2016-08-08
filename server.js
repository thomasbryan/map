var express = require('express')
  , app = express()
  , bodyParser = require('body-parser')
  , http = require('http')
  , server = http.createServer(app)
  , fs = require('fs')
  , users = __dirname+'/users/'
  , maps = __dirname+'/pub/map/'
  , index = JSON.parse(fs.readFileSync(maps+'index.json','utf8'))
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
  //async?
  fs.readFile(users+req.body.user+'.json','utf8', function ( e, d) {
    //user not found
    if(e) res.send('{}');
    var user = JSON.parse(d)
      , copy = JSON.parse(JSON.stringify(user));
      ;
    switch(req.body.dir) {
      case "0": user = left(user,copy); break;
      case "1": user = up(user,copy); break;
      case "2": user = right(user,copy); break;
      case "3": user = down(user,copy); break;
    }
    fs.writeFile(users+req.body.user+'.json', JSON.stringify(user,null,4), function(err) {
      res.send(JSON.stringify(user.pos));
    });
  });
});
/** DIRECTION **/
function left(req,res) {
  if(req.pos.e - 1 < 0) {
    if(req.pos.c - 1 < 0) {
      if(req.pos.a - 1 < 0) {
        req.pos.a = index.a;
      }else{
        req.pos.a = req.pos.a - 1;
      }
      req.pos.c = 24;
    }else{
      req.pos.c = req.pos.c - 1;
    }
    req.pos.e = 24;
  }else{
    req.pos.e = req.pos.e - 1;
  }
  if(!valid(req)) {
    req = res;
  }
  return req;
}
function up(req,res) {
  if(req.pos.f - 1 < 0) {
    if(req.pos.d - 1 < 0) {
      if(req.pos.b - 1 < 0) {
        req.pos.b = index.b;
      }else{
        req.pos.b = req.pos.b - 1;
      }
      req.pos.d = 24;
    }else{
      req.pos.d = req.pos.d - 1;
    }
    req.pos.f = 24;
  }else{
    req.pos.f = req.pos.f - 1;
  }
  if(!valid(req)) {
    req = res;
  }
  return req;
}
function right(req,res) {
  if(req.pos.e + 1 > 24) {
    if(req.pos.c + 1 > 24) {
      if(req.pos.a + 1 > index.a) {
        req.pos.a = 0;
      }else{
        req.pos.a = req.pos.a + 1;
      }
      req.pos.c = 0;
    }else{
      req.pos.c = req.pos.c + 1;
    }
    req.pos.e = 0;
  }else{
    req.pos.e = req.pos.e + 1;
  }
  if(!valid(req)) {
    req = res;
  }
  return req;
}
function down(req,res) {
  if(req.pos.f + 1 > 24) {
    if(req.pos.d + 1 > 24) {
      if(req.pos.b + 1 > index.b) {
        req.pos.b = 0;
      }else{
        req.pos.b = req.pos.b + 1;
      }
      req.pos.d = 0;
    }else{
      req.pos.d = req.pos.d + 1;
    }
    req.pos.f = 0;
  }else{
    req.pos.f = req.pos.f + 1;
  }
  if(!valid(req)) {
    req = res;
  }
  return req;
}
function valid(req) {
  var res = false
    , a = p(req.pos.a)
    , b = p(req.pos.b)
    , c = p(req.pos.c)
    , d = p(req.pos.d)
    , e = req.pos.e
    , f = req.pos.f
    ;
  fs.readFile(maps+a+b+'/'+c+d,'utf8', function ( err, data) {
    var rows = data.toString().split('\n')
      , cols = rows[f].toString().split(',')
      ;
    if(req.lvl >= cols[e]) {
      res = true;
    }
    console.log(res)
    console.log(rows[f]+e);
    return res;
  });
}
function p(r) {
  var s = String(r);
  if(r<10) {
    s = "0"+s;
  }
  return s;
}
