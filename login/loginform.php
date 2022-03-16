<?php
session_start();
$loc='http://' . $_SERVER['HTTP_HOST'];
if(isset($_SESSION['logedin11'])){
        header("Location:".$loc. "/streetlight_panel/index.php");

}
?>
<!DOCTYPE html>
<html>
<head>
<title>Login</title>

<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7/jquery.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.form/4.3.0/jquery.form.js"></script>


	 <script>
        addEventListener("load", function () {
            setTimeout(hideURLbar, 0);
        }, false);

        function hideURLbar() {
            window.scrollTo(0, 1);
        }
    </script>


	<!-- Custom Theme files -->
	<link href="css/style.css" rel="stylesheet" type="text/css" media="all" />
	<link href="css/font-awesome.min.css" rel="stylesheet" type="text/css" media="all" />
	<!-- //Custom Theme files -->

	<!-- web font -->
	<link href="//fonts.googleapis.com/css?family=Hind:300,400,500,600,700" rel="stylesheet">
	<!-- //web font -->


	 <script>

        $(document).ready(function() {
            // bind 'myForm' and provide a simple callback function
            $('#login-form').ajaxForm(function(response) {
                if(response=='success'){
                    window.location="../index.php";
                }else{
                    $("#errormessage").html("<p style='color: orange'>Failed To Loging Wrong Username or Password</p>");
                }
            });


        });

    </script>

</head>
<body>

<!-- main -->
<div class="w3layouts-main" > 
	<div class="bg-layer">
		<h1 class="hed">.</h1>
		<div class="header-main">
			<div class="main-icon">
			<img src="images/logo.png" alt="Aerosybergy" height="50" width="160" style="margin-bottom: 20px;">
			</div>
			<div class="header-left-bottom">
				<form id="login-form" method="post" action="../services/login.php">
					<div class="icon1">
						<span class="fa fa-user"></span>
                         <input type="text" name="username" placeholder="Username" required=""/>						
					</div>
					<div class="icon1">
						<span class="fa fa-lock"></span>
						<input type="password" name="password" placeholder="Password" required=""/>
					</div>
					
					<div class="bottom">

						<button class="btn">LogIn</button>

						
					</div>
					<div style="margin-top: 5px;">
						<!-- <span style="color: white">Not Registered ? </span>
							<a class="cc" href="signup.php">Create an Account </a> -->
					
					</div>
				
				</form>	
			</div>
			<div class="form-group text-center" id="errormessage">
			
		</div>
		</div>
		<!-- copyright -->
	<!-- 	<div class="copyright">
			<p>Designed and Developed By :  <a href="#" target="_blank"></a></p>
		</div> -->
		<!-- //copyright --> 

	</div>

</div>	
<!-- //main -->

</body>
</html>