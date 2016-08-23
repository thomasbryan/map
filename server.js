var express = require('express')
  , favicon = require('serve-favicon')
  , app = express()
  , bodyParser = require('body-parser')
  , http = require('http')
  , port = process.env.PORT || 9000
  , server = http.createServer(app)
  , fs = require('fs')
  , async = require('async')
  , users = __dirname+'/users/'
  , maps = __dirname+'/src/map/'
  , index = JSON.parse(fs.readFileSync(maps+'index.json','utf8'))
  ;
server.listen(port);
app.use(favicon(maps+'favicon.ico'));
app.use(express.static('pub'));
app.use(express.static(maps));
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
  async.series([
    function(next) { auth(req,next); },
    function(next) { 
      switch(req.body.dir) {
        case "0":left(req,next); break;
        case "1":up(req,next); break;
        case "2":right(req,next); break;
        case "3":down(req,next); break;
      }
    },
    function(next) { valid(req,next); },
    function(next) { save(req,next); }
  ],
  function(err,req) {
    if(err) {res.status(err); }
    res.jsonp(req[req.length-1]);
  });
});
app.post('/api/act', function(req, res) {
  async.series([
    function(next) { auth(req,next); },
    function(next) { valid(req,next); },
    function(next) {
      switch(req.body.act) {
        case "a":a(req,next); break;
        case "b":b(req,next); break;
        case "x":x(req,next); break;
        case "y":y(req,next); break;
      }
    }
  ],
  function(err,req) {
    if(err) {res.status(err); }
    res.jsonp(req[req.length-1]);
  });
});
function auth(req,cb) {
  fs.readFile(users+req.body.user+'.json','utf8', function(err,res) {
    if(err) cb(404,null);
    req.body.auth = JSON.parse(res);
    req.body.pos = JSON.parse(JSON.stringify(req.body.auth.pos));
    cb(null,JSON.parse(res));
  });
}
/** DIRECTION **/
function left(req,cb) {
  var pos = req.body.auth.pos;
  if(pos.e - 1 < 0) {
    if(pos.c - 1 < 0) {
      if(pos.a - 1 < 0) {
        pos.a = index.a;
      }else{
        pos.a = pos.a - 1;
      }
      pos.c = 24;
    }else{
      pos.c = pos.c - 1;
    }
    pos.e = 24;
  }else{
    pos.e = pos.e - 1;
  }
  cb(null,req.body);
}
function up(req,cb) {
  var pos = req.body.auth.pos;
  if(pos.f - 1 < 0) {
    if(pos.d - 1 < 0) {
      if(pos.b - 1 < 0) {
        pos.b = index.b;
      }else{
        pos.b = pos.b - 1;
      }
      pos.d = 24;
    }else{
      pos.d = pos.d - 1;
    }
    pos.f = 24;
  }else{
    pos.f = pos.f - 1;
  }
  cb(null,req.body);
}
function right(req,cb) {
  var pos = req.body.auth.pos;
  if(pos.e + 1 > 24) {
    if(pos.c + 1 > 24) {
      if(pos.a + 1 > index.a) {
        pos.a = 0;
      }else{
        pos.a = pos.a + 1;
      }
      pos.c = 0;
    }else{
      pos.c = pos.c + 1;
    }
    pos.e = 0;
  }else{
    pos.e = pos.e + 1;
  }
  cb(null,req.body);
}
function down(req,cb) {
  var pos = req.body.auth.pos;
  if(pos.f + 1 > 24) {
    if(pos.d + 1 > 24) {
      if(pos.b + 1 > index.b) {
        pos.b = 0;
      }else{
        pos.b = pos.b + 1;
      }
      pos.d = 0;
    }else{
      pos.d = pos.d + 1;
    }
    pos.f = 0;
  }else{
    pos.f = pos.f + 1;
  }
  cb(null,req.body);
}
function valid(req,cb) {
  var a = p(req.body.auth.pos.a)
    , b = p(req.body.auth.pos.b)
    , c = p(req.body.auth.pos.c)
    , d = p(req.body.auth.pos.d)
    , e = req.body.auth.pos.e
    , f = req.body.auth.pos.f
    ;
  fs.readFile(maps+a+b+'/'+c+d,'utf8', function ( err, res) {
    var rows = res.toString().split("\n")
      , cols = rows[f].toString().split(',')
      ;
    req.body.curr = cols[e];
    req.body.grid = res;
    if(req.body.auth.lvl >= cols[e]) {
      req.body.valid = true;
    }else{
      req.body.valid = false;
    }
    cb(null,req.body);
  });
}
function p(r) {
  var s = String(r);
  if(r<10) {
    s = "0"+s;
  }
  return s;
}
function save(req,cb) {
  if(!req.body.valid) {
    req.body.auth.pos = req.body.pos;
  }
  fs.writeFile(users+req.body.user+'.json', JSON.stringify(req.body.auth,null,4), function(err) {
    cb(null,req.body.auth.pos);
  });
}
function a(req,cb) {
  req.body.a = "roll dice and determine if item is found.";
  cb(null,req.body);
}
function b(req,cb) {
  req.body.b = "action to be deteremined";
  cb(null,req.body);
}
function x(req,cb) {
  if(req.body.curr == 0) {
    cb(null,req.body);
  }else{
    req.body.x="make this lower";
    cb(null,req.body);
  }
}
function y(req,cb) {
  if(req.body.curr < req.body.auth.lvl) {
    req.body.y="make this higher";
    cb(null,req.body);
  }else{
    cb(null,req.body);
  }
}
