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
    app.grid = new Array();
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
  $('#name').html(app.name+'<br />'+app.pos.e+'/'+app.pos.f);
  var a = p(app.pos.a)
    , b = p(app.pos.b)
    , c = p(app.pos.c)
    , d = p(app.pos.d)
    , grid = 0
    ;
  gridneighbor(4);
  if(app.pos.e < 5) {
    grid++;
    gridneighbor(0);
    console.log('e < 5');
  }
  if(app.pos.f < 5) {
    grid++;
    gridneighbor(1);
    console.log('f < 5');
  }
  if(app.pos.e > 20) {
    grid++;
    gridneighbor(2);
    console.log('e > 20');
  }
  if(app.pos.f > 20) {
    grid++;
    gridneighbor(3);
    console.log('f > 20');
  }
  if(app.grid.length > 3) {
    gridcleanup();
  }
  switch(grid) {
    case 0: load(a+b,c+d); break;
    case 1:
    //offset??
    //calculate placement
    $.each(app.grid,function(k) {
      load(app.grid[k].substr(0,4),app.grid[k].substr(-4));
    });
    break;
    case 2:
    console.log('load 4 grid');
    $.each(app.grid,function(k) {
      load(app.grid[k].substr(0,4),app.grid[k].substr(-4));
    });
    break;
  }
}
function gridneighbor(req) {
  var a = app.pos.a
    , b = app.pos.b
    , c = app.pos.c
    , d = app.pos.d
    ;
  //TODO add logic for determining -1 or +24
  switch(req) {
    case 0:
  if( app.grid.indexOf((p(a)+p(b)+p(c-1)+p(d))) <0) {
  app.grid.push((p(a)+p(b)+p(c-1)+p(d)))
  }
    break;//left
    case 1:
  if( app.grid.indexOf((p(a)+p(b)+p(c)+p(d-1))) <0) {
  app.grid.push((p(a)+p(b)+p(c)+p(d-1)))
  }
    break;//up
    case 2:
  if( app.grid.indexOf((p(a)+p(b)+p(c+1)+p(d))) <0) {
  app.grid.push((p(a)+p(b)+p(c+1)+p(d)))
  }
    break;//right
    case 3:
  if( app.grid.indexOf((p(a)+p(b)+p(c)+p(d+1))) <0) {
  app.grid.push((p(a)+p(b)+p(c)+p(d+1)))
  }
    break;//down
    case 4:
  if( app.grid.indexOf((p(a)+p(b)+p(c)+p(d))) <0) {
  app.grid.push((p(a)+p(b)+p(c)+p(d)))
  }
    break;
  }
}
function gridcleanup() {
    console.log('clean up');
    console.log(app.grid);
}
function load(a,b) {
  if(!$('#map-'+a+b).length) {
    $.get('/map/'+a+'/'+b,function(res) {
      var rows = res.toString().split("\n")
        , html = "";
      rows.pop();
      $('#map').append('<div id="map-'+a+b+'">');
      $.each(rows,function(k,v) {
        html+='<div class="row">';
        var cols = v.toString().split(',');
        $.each(cols,function(kk,vv) {
          html+="<div class='col tile-"+vv+"'></div>";
        });
        html+='</div>';
      });
      $('#map-'+a+b).html(html);
    placement();
    });
  }else{
    placement();
  }
}
function placement() {
  //TODO MATH!
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
  $('#map-'+p(app.pos.a)+p(app.pos.b)+p(app.pos.c)+p(app.pos.d)).css({
      "margin-top":ts+t+"px",
      "margin-left":ls+l+"px",
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
  if(r<10) {
    s = "0"+s;
  }
  return s;
}
