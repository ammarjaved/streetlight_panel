<?php
session_start();
$loc='http://' . $_SERVER['HTTP_HOST'];
if(isset($_SESSION['geoportal'])){
        header("Location:".$loc. "/pss1/pss1.php");

}
?>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>pss1 login</title>
    <link rel="stylesheet" href="style.css"/>
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7/jquery.js"></script>
    <script src="http://malsup.github.com/jquery.form.js"></script>

    <script>

        $(document).ready(function() {
            // bind 'myForm' and provide a simple callback function
            $('#login-form').ajaxForm(function(response) {
                if(response=='success'){
                    window.location="../index.php";
                }else{
                    $("#errormessage").html("<h4 style='color: white'>Failed to loging wrong username or password</h4>");
                }
            });


        });

    </script>

</head>
<body>

<div class="login-page">
    <div class="form">
        <!--<form class="register-form">-->
            <!--<input type="text" placeholder="name"/>-->
            <!--<input type="password" placeholder="password"/>-->
            <!--<input type="text" placeholder="email address"/>-->
            <!--<button>create</button>-->
            <!--<p class="message">Already registered? <a href="#">Sign In</a></p>-->
        <!--</form>-->
        <form id="login-form" method="post" class="login-form" action="../services/login.php">
            <input type="text" name="username" placeholder="username"/>
            <input type="password" name="password" placeholder="password"/>
            <button>login</button>
            <!--<p class="message">Not registered? <a href="#">Create an account</a></p>-->
        </form>
    </div>
    <div class="form-group text-center" id="errormessage">

    </div>
</div>

</body>
</html>

