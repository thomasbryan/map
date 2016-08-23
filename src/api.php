<?php $api = new API;
class API {
  function __construct() {
    if(isset($_GET['req'])) {
      switch($_GET['req']) {
        case "users":users();break;
      }
    }
  }
  private function users() {
    $res=file_get_contents('../users/'.$_POST['user'].'.json');
    json($res);
  }
# JSON RESPONSE #
  private function json($d=false) {
    header("Content-type: application/json");
    if(array_key_exists('callback', $_GET) == TRUE){
      $d=json_encode($d);
      print $_GET['callback']."(".$d.")"; 
    }else{
      echo json_encode($d);
    }
    exit;
  } 
}
?>
