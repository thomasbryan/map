var app = {};
//TODO: loaded map regions
$(document).ready(function() {
  //TODO: auth
  var auth = {"user":0};
  $.post("/api/users",auth)
  .done(function(res) {
    app = res;
    app.id = auth.user;
    app.map = []
    map();
  });
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
//TODO handle edge cases
    for(var i = app.pos.f - 2;i <= app.pos.f + 2;i++) {
      var cols = rows[i].toString().split(',');
      html+="<div class='row'>";
      for(var j = app.pos.e - 2;j <= app.pos.e + 2;j++) {
        html+="<div class='col tile-"+cols[j]+"'></div>";
      }
      html+="</div>";
    }
    $('#map').html(html);
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
