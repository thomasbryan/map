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
    app.pos = res;
    //trigger: encounter ?
    console.log(res);
    console.log(app);
    //map();
  });
}
