
<!DOCTYPE html>
<html>
<head>
<title>PSS Login</title>

<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7/jquery.js"></script>
    <script src="http://malsup.github.com/jquery.form.js"></script>

 <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.0/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-validate/1.19.0/jquery.validate.min.js">
</script>


<script>
	
	$(document).ready(function() {
  $("#login-form").validate({
      rules : {
                password : {
                    minlength : 5
                },
                cpassword : {
                    minlength : 5,
                    equalTo : "#pas"
                }
            }
  });

});
	
</script>



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




</head>
<body>

<!-- main -->
<div class="w3layouts-main" > 
	<div class="bg-layer">
		<h5 class="hed">.</h5>
		<div class="header-main">
			<div class="main-icon">
			<img src="images/logo.png" alt="Aerosybergy" height="50" width="160" style="margin-bottom: 20px;">			</div>
			<div class="header-left-bottom">
				<form id="login-form" method="post" action="../services/signup.php" >
					<div class="icon1">
						<span class="fa fa-user"></span>
                         <input type="text" name="name" placeholder="Name" required=""/>						
					</div>
					<div class="icon1">
						<span class="fa fa-envelope"></span>
                         <input type="email" name="email" placeholder="Email" required=""/>						
					</div>
					<div class="icon1">
						<span class="fa fa-lock"></span>
						<input type="password" id="pas" name="password" placeholder="Password" required>
					</div>
					<div class="icon1">
						<span class="fa fa-lock"></span>
						<input type="password" id="cpas" name="cpassword" placeholder="Confirm Password" required=""/>
					</div>
					
					
					<div class="bottom">

						<button id="Signupbtn" class="btn">SignUp</button>

						
					</div>
					<div style="margin-top: 5px;">
						<span style="color: white">Already Have an Account?</span>
							<a class="cc" href="loginform.php">Signin</a>
					
					</div>
				
				</form>	
			</div>
			<div class="form-group text-center" id="errormessage">
				<div class="error-msg" id="error-msg"></div>
			
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


