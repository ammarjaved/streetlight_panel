<?php
session_start();
$loc = 'http://' . $_SERVER['HTTP_HOST'];
if (isset($_SESSION['logedin'])) {

} 
else {
    header("Location:" . $loc . "/p1/login/login/loginform.php");
}
?>
<!DOCTYPE html>
<html>
<head>
	<title></title>
</head>
<body>
<h1>wlcome</h1><br>
  <a href="services/logout.php"><span role="button"> Logout</span></a>


</body>
</html>