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
    app.grid = new Array();
    app.top = false;
    app.left = false;
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
  var a = p(app.pos.a)
    , b = p(app.pos.b)
    , c = p(app.pos.c)
    , d = p(app.pos.d)
    , grid = 0
    ;
  gridneighbor(0);
  if(app.pos.e < 5) {
    grid++;
    gridneighbor(1);
    $('#map').css({"width":"3200px","height":"1600px"});
    app.left = true;
  }
  if(app.pos.f < 5) {
    grid++;
    gridneighbor(2);
    $('#map').css({"height":"3200px","width":"1600px"});
    app.top = true;
  }
  if(app.pos.e > 20) {
    grid++;
    gridneighbor(3);
    $('#map').css({"width":"3200px","height":"1600px"});
  }
  if(app.pos.f > 20) {
    grid++;
    gridneighbor(4);
    $('#map').css({"height":"3200px","width":"1600px"});
  }
  switch(grid) {
    case 0: 
      load(a+b,c+d); $('.map').not('#map-'+a+b+c+d).remove();
    break;
    case 2:
      $('#map').css({"height":"3200px","width":"3200px"});
      var neighbor = 5;
      if(app.top) { neighbor = neighbor + 1; }
      if(app.left) { neighbor = neighbor + 2; }
      gridneighbor(neighbor);
    case 1:
      if(app.grid.length == 2) {
        $.each($('.map'),function(k,v) {
          if($.inArray( $(this).attr('data-a')+ $(this).attr('data-b')+ $(this).attr('data-c')+ $(this).attr('data-d'),app.grid) == -1) {
            $(this).remove();
          }
        });
      }
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
  if( app.grid.indexOf((p(a)+p(b)+p(c)+p(d))) <0) {
  app.grid.push((p(a)+p(b)+p(c)+p(d)))
  }
    break;//self
    case 1:
  if( app.grid.indexOf((p(a)+p(b)+p(c-1)+p(d))) <0) {
  app.grid.push((p(a)+p(b)+p(c-1)+p(d)))
  }
    break;//left
    case 2:
  if( app.grid.indexOf((p(a)+p(b)+p(c)+p(d-1))) <0) {
  app.grid.push((p(a)+p(b)+p(c)+p(d-1)))
  }
    break;//up
    case 3:
  if( app.grid.indexOf((p(a)+p(b)+p(c+1)+p(d))) <0) {
  app.grid.push((p(a)+p(b)+p(c+1)+p(d)))
  }
    break;//right
    case 4:
  if( app.grid.indexOf((p(a)+p(b)+p(c)+p(d+1))) <0) {
  app.grid.push((p(a)+p(b)+p(c)+p(d+1)))
  }
    break;//down
    case 5:
  if( app.grid.indexOf((p(a)+p(b)+p(c+1)+p(d+1))) <0) {
  app.grid.push((p(a)+p(b)+p(c+1)+p(d+1)))
  }
    break;//right+down
    case 6:
  if( app.grid.indexOf((p(a)+p(b)+p(c+1)+p(d-1))) <0) {
  app.grid.push((p(a)+p(b)+p(c+1)+p(d-1)))
  }
    break;//right+up
    case 7:
  if( app.grid.indexOf((p(a)+p(b)+p(c-1)+p(d+1))) <0) {
  app.grid.push((p(a)+p(b)+p(c-1)+p(d+1)))
  }
    break;//left+down
    case 8:
  if( app.grid.indexOf((p(a)+p(b)+p(c-1)+p(d-1))) <0) {
  app.grid.push((p(a)+p(b)+p(c-1)+p(d-1)))
  }
    break;//left+up
  }
}
function load(i,j) {
  if(!$('#map-'+i+j).length) {
    $.get('/map/'+i+'/'+j,function(res) {
      var rows = res.toString().split("\n")
        , a = i.substring(0,2)
        , b = i.substring(2)
        , c = j.substring(0,2)
        , d = j.substring(2)
        , dom = '<div id="map-'+i+j+'" data-a="'+a+'" data-b="'+b+'" data-c="'+c+'" data-d="'+d+'" class="map">'
        , bigc = $('#map div[data-c="'+(parseInt(c)+1)+'"]')
        , bigd = $('#map div[data-c="'+c+'"][data-d="'+(parseInt(d)+1)+'"]')
        , x = new Array()
        , y = new Array()
        , html = "";
      rows.pop();
      if(bigc.length == 0 && bigd.length == 0 ){
        $('#map').append(dom);
      }else{
        if(bigc.length > 0 ) {
          $(bigc[0]).before(dom);
        }else{
          $(bigd[0]).before(dom);
        }
      }
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
    if(app.left) l = l - 1600;
    if(app.top) t = t - 1600;
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
