var app = {};
//TODO: loaded map regions
$(document).ready(function() {
  //TODO: auth
  var auth = {"user":0};
  $.post("/api/users",auth)
  .done(function(res) {
    app = res;
    app.id = auth.user;
    map();
  });
});
$(document).keypress(function(e) {
  switch(e.which) {
    case 97: move(0); break;
    case 100: move(2); break;
    case 115: move(3); break;
    case 119: move(1); break;
//    default: console.log(e.which);break;
  }
});
function map() {
//get x y and determine if any maps need to be loaded.
console.log(app.pos);
/* shift
[][][]
[][][]
[][][]
*/
}
function move(req) {
  $.post("/api/move",{"user":app.id,"dir":req})
  .done(function(res) {
    //trigger: encounter ?
    console.log(res);
    //map();
  });
}
