var app = {};
//TODO: loaded map regions
$(document).ready(function() {
  //TODO: auth
  var auth = {"user":0};
  $.post("/api/users",auth)
  .done(function(res) {
    app = res;
    $('#name').html(app.name);
    var pad = "";
    if(app.lvl + 1 < 10 ) pad = "0";
    $('#lvl').html(pad+(app.lvl + 1));
    app.id = auth.user;
    app.map = []
    map();
  });
});
$(document).on('click touch', '#nav div',function() {
  move($(this).data('move'));
});
$(document).keyup(function(e) {
  switch(e.which) {
    case 37: case 97: move(0); break;
    case 38: case 100: move(1); break;
    case 39: case 115: move(2); break;
    case 40: case 119: move(3); break;
  }
  e.preventDefault();
});
function map() {
  var a = p(app.pos.a)
    , b = p(app.pos.b)
    , c = p(app.pos.c)
    , d = p(app.pos.d)
    ;
// preload next map grid
  if(app.map[a+b+c+d] === undefined){
    $.get('/map/'+a+b+'/'+c+d,function(res) {
      app.map[a+b+c+d] = res;
      map();
    });
  }else{
//get x y and determine if any maps need to be loaded.
    var rows = app.map[a+b+c+d].toString().split("\n")
      , html = ""
      ;
    rows.pop();//remove extra line
//TODO handle edge cases
//TODO DRY!!! fix logic!
    for(var i = app.pos.f - 2;i <= app.pos.f + 2;i++) {
      if(i < 0 || i > 24) {
        html+="<div class='row'>";
        if(i < 0) {
          c = p(app.pos.c-1);
          if( app.map[a+b+c+d] === undefined) {
            $.get('/map/'+a+b+'/'+c+d,function(res) {
              app.map[a+b+c+d] = res;
              map();
            });
          }else{
            var up = app.map[a+b+c+d].toString().split("\n");
            up.pop();
            var cols = rows[i+24].toString().split(',');
            for(var j = app.pos.e - 2;j <= app.pos.e + 2;j++) {
              if(j < 0 || j > 24) {
                html+="<div class='col tile-x'>edge</div>";
              }else{
                html+="<div class='col tile-"+cols[j]+"'></div>";
              }
            }
          }
        }else{
          c = p(app.pos.c+1);
          if( app.map[a+b+c+d] === undefined) {
            $.get('/map/'+a+b+'/'+c+d,function(res) {
              app.map[a+b+c+d] = res;
              map();
            });
          }else{
            var down = app.map[a+b+c+d].toString().split("\n");
            down.pop();
            var cols = rows[i-24].toString().split(',');
            for(var j = app.pos.e - 2;j <= app.pos.e + 2;j++) {
              if(j < 0 || j > 24) {
                html+="<div class='col tile-x'>edge</div>";
              }else{
                html+="<div class='col tile-"+cols[j]+"'></div>";
              }
            }
          }
        }
        html+="</div>";
      }else{
        var cols = rows[i].toString().split(',');
        html+="<div class='row'>";
        for(var j = app.pos.e - 2;j <= app.pos.e + 2;j++) {
          if(j < 0 || j > 24) {
            if(j<0) {

          d = p(app.pos.d-1);
          if( app.map[a+b+c+d] === undefined) {
            $.get('/map/'+a+b+'/'+c+d,function(res) {
              app.map[a+b+c+d] = res;
              map();
            });
          }else{
            var left = app.map[a+b+c+d].toString().split("\n");
            left.pop();
            var leftcols = rows[i].toString().split(',');
            html+="<div class='col tile-"+leftcols[j+24]+"'></div>";
          }
            }else{
          d = p(app.pos.d+1);
          if( app.map[a+b+c+d] === undefined) {
            $.get('/map/'+a+b+'/'+c+d,function(res) {
              app.map[a+b+c+d] = res;
              map();
            });
          }else{
            var right = app.map[a+b+c+d].toString().split("\n");
            right.pop();
            var rightcols = rows[i].toString().split(',');
            html+="<div class='col tile-"+rightcols[j-24]+"'></div>";
          }

            }
          }else{
            html+="<div class='col tile-"+cols[j]+"'></div>";
          }
        }
        html+="</div>";
      }
    }
    $('#map').html(html);
    $('#name').html(app.name+'<br />'+app.pos.e+'/'+app.pos.f);
  }
}
function move(req) {
  //TODO player face direction
  $.post("/api/move",{"user":app.id,"dir":req})
  .done(function(res) {
    //TODO better logic
    if(
      app.pos.a == res.a
      &&
      app.pos.b == res.b
      &&
      app.pos.c == res.c
      &&
      app.pos.d == res.d
      &&
      app.pos.e == res.e
      &&
      app.pos.f == res.f
    ) {
    }else{
      app.pos = res;
      map();
    }
  });
}
function p(r) {
  var s = String(r);
  if(r<10) {
    s = "0"+s;
  }
  return s;
}
