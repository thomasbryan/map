var app = {};
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
  app.grid = new Array();
  app.top = false;
  app.left = false;
  var a = app.pos.a
    , b = app.pos.b
    , c = app.pos.c
    , d = app.pos.d
    , e = app.pos.e
    , f = app.pos.f
    , i = ""
    , j = ""
    , l = c+1
    , t = d+1
    , grid = 0
    , index = 3
    ;
//TODO add logic for determining c,d -1 or +24
  $('#loc').html(':A:'+p(a)+p(b)+'<br />:B:'+p(c)+p(d)+'<br />X'+p(e)+'|Y'+p(f));
  if(f < 5) {
    app.top = true;
    grid++;
    app.grid.push(p(a)+p(b)+p(c)+p(d-1));
    $('#map').css({"height":"3200px","width":"1600px"});
  }
  if(e < 5) {
    app.left = true;
    grid++;
    app.grid.push(p(a)+p(b)+p(c-1)+p(d));
    $('#map').css({"width":"3200px","height":"1600px"});
  }
  app.grid.push(p(a)+p(b)+p(c)+p(d));
  if(e > 20) {
    grid++;
    app.grid.push(p(a)+p(b)+p(c+1)+p(d));
    $('#map').css({"width":"3200px","height":"1600px"});
  }
  if(f > 20) {
    grid++;
    app.grid.push(p(a)+p(b)+p(c)+p(d+1));
    $('#map').css({"height":"3200px","width":"1600px"});
  }
  if(grid == 2) {
    if(app.left) { l = c-1; index = index - 1;}
    if(app.top) { t = d-1; index = index - 2;}
    app.grid.splice(index, 0, p(a)+p(b)+p(l)+p(t));
    $('#map').css({"height":"3200px","width":"3200px"});
  }
  app.step = app.step + 1;
  $('#map').append('<div id="step-'+app.step+'" class="step">');
  $('.step').not('#step-'+app.step).remove();
  $.each(app.grid,function(k,v) {
    load(v.substring(0,4),v.substring(4));
  });
}
function load(i,j) {
  if($('#map-'+i+j).length == 0) {
    $.get('/map/'+i+'/'+j,function(res) {
      var rows = res.toString().split("\n")
        , a = i.substring(0,2)
        , b = i.substring(2)
        , c = j.substring(0,2)
        , d = j.substring(2)
        , dom = '<div id="map-'+i+j+'" data-a="'+a+'" data-b="'+b+'" data-c="'+c+'" data-d="'+d+'" class="map">'
        , x = new Array()
        , y = new Array()
        , html = "";
      rows.pop();
      $('#step-'+app.step).append(dom);
      $.each(rows,function(k,v) {
        html+='<div class="row">';
        var cols = v.toString().split(',');
        $.each(cols,function(kk,vv) {
          html+="<div class='col tile-"+vv+"'></div>";
        });
        html+='</div>';
      });
      $('#map-'+i+j).html(html);
      placement();
    });
  }else{
    $('#map-'+i+j).appendTo('#step-'+app.step);
    placement();
  }
}
function placement() {
  var l = ( app.pos.e * 64 ) - 128
    , t = ( app.pos.f * 64 ) - 128
    , ls = "-"
    , ts = "-"
    ;
  if(l <= 0) {
    ls = "";
    l = Math.abs(l);
  }
  if(t <= 0) {
    ts = "";
    t = Math.abs(t);
  }
  if(app.left) {
    l = (ls.length == 0 ? l - 1600 : l + 1600) ;
  }
  if(app.top) {
    t = (ts.length == 0 ? t - 1600 : t + 1600) ;
  }
  $('#map').css({
      "margin-left":ls+l+"px",
      "margin-top":ts+t+"px",
  });
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
  if(r<10) s = "0"+s;
  return s;
}
