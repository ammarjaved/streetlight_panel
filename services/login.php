<?php
session_start();
include('connection.php');

class LoginUser extends connection
{
    function __construct()
    {
        $this->connectionDB();
    }

  function login()
  {
      $user_name = $_REQUEST['username'];
      $user_pass = $_REQUEST['password'];

      // print_r($user_name);
      // print_r($user_pass);
      // exit();

      $check_sql = "select id, user_name, password FROM public.tbl_users where user_name='$user_name' and password='$user_pass'";
      //echo $check_sql;
      $check_query = pg_query($check_sql);

      $rs = pg_fetch_array($check_query);
    //  print_r($rs);
      if ($rs['user_name'] == $user_name && $rs['password']==$user_pass) {
          $_SESSION['logedin11']=$rs['user_name'];
          $_SESSION['user_id']=$rs['id'];

          return "success";
      }else{
          return "failed";
      }
  }

}
   $loginuser=new LoginUser();

   if(isset($_SESSION['logedin11'])){
       echo "you are already login";
   }else {
       echo $loginuser->login();
   }
?>