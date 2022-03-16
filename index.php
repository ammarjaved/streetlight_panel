<!doctype html>
<?php
session_start();
$loc = 'http://' . $_SERVER['HTTP_HOST'];
if (isset($_SESSION['logedin11'])) {

} 
else {
    header("Location:" . $loc . "/streetlight_panel/login/loginform.php");
}
?>
<html>
<head>
    <meta charset="UTF-8">
    <title>LED</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://coryasilva.github.io/Leaflet.ExtraMarkers/css/leaflet.extra-markers.min.css" />
    <!-- Bootstrap -->
    <link rel="stylesheet" href="libs/bootstrap/css/bootstrap.css"/>
    <link href="libs/material-design/css/ripples.min.css" rel="stylesheet">


    <link rel="stylesheet" href="styles/custom_style.css"/>

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

	<link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
    <script src="https://coryasilva.github.io/Leaflet.ExtraMarkers/js/leaflet.extra-markers.min.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css"/>
    <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js"></script>
    <script type="text/javascript" src="libs/html5pano.js"></script>
    <link rel="stylesheet" href="https://cdn.datatables.net/1.10.2/css/jquery.dataTables.min.css">

    <style>
        #panorama {
            width: 400px;
            height: 400px;
        }
    </style>
</head>
<body class="claro">
 <nav class="navbar navbar-expand-lg py-1 navbar-light bg-light shadow-sm fixed-top" style="margin-bottom: 0px !important;">

            <div class="col-lg-12 npnm">
                <div class="row npnm">

                    <div class="col-lg-12 npnm">
                   
                        <img src="images/logo.png" width="150"  height="47" alt=""
                             class="d-inline-block align-middle mr-2">

                        <span class="text-uppercase font-weight-bold text-muted">LED</span>
                        <button class="btn btn-danger" onclick="getProperties('dp_panel')">Click Panel</button>
                        <button class="btn btn-danger" onclick="getProperties('light_panel')">Click LED</button>
                        <a href="services/logout.php" class="pull-right btn btn-danger" style="color: white; margin-top: 3px !important;">Logout</a>

                    </div>



                   
                </div>

            </div>

    </nav>
<div class="container-fluid" style="padding:0 0 0 0;">
   

    
    <div id="content">
 
		<div class="row">
                <div class="col-md-3">
                    <div style="cursor:pointer" class="countdiv card-counter info" id="RYB">
                            <i class="fa fa-bolt"></i>
                            <span class="count-numbers" id="tryb"></span>
                            <span class="count-name">Total Street Light</span>
                    </div>
                </div>	
                <div class="col-md-3">
                    
                    <div style="cursor:pointer" class="countdiv card-counter color1" id="R">
                    <i class="fa fa-bolt"></i>
                    <span class="count-numbers" id="sred"></span>
                    <span class="count-name">Total LED Street Light</span>
                    </div>

                </div>
                
                <div class="col-md-3">
                    <div style="cursor:pointer;" class=" countdiv card-counter color2" id="Y">
                        <i class="fa fa-bolt"></i>
                        <span class="count-numbers" id="syellow"></span>
                        <span class="count-name">Total Sodium Street Light</span>
                    </div>
                </div>
                
                <div class="col-md-3">
                    <div style="cursor:pointer" class="countdiv card-counter color3" id="B">
                        <i class="fa fa-bolt"></i>
                        <span class="count-numbers" id="sblue"></span>
                        <span class="count-name">Total Asset Light Watt</span>
                    </div>
                </div>
            
                
                

            
              
        </div>


<!--        <div class="row">-->
<!--        <div class="row header" style="text-align:center;color:green">-->
<!--        <h3>Demand Point Table</h3>-->
<!--    </div>-->
<!--        <table id="example" class="table table-striped table-bordered" style="width:90%;height:300px;overflow:scroll;">-->
<!--        <thead>-->
<!--            <tr>-->
<!--                <th>id</th>-->
<!--                <th>House No</th>-->
<!--                <th>Street</th>-->
<!--                <th>device_id</th>-->
<!--                <th>Remarks</th>-->
<!--           -->
<!--            </tr>-->
<!--        </thead>-->
<!--        <tbody id="dpt">-->
<!--        </tbody>-->
<!--        <tfoot>-->
<!--            <tr>-->
<!--                <th>id</th>-->
<!--                <th>House No</th>-->
<!--                <th>Street</th>-->
<!--                <th>device_id</th>-->
<!--                <th>Remarks</th>-->
<!--              -->
<!--            </tr>-->
<!--        </tfoot>-->
<!--    </table>-->
<!--        </div>-->

        <div class="row">
            <div class="col-md-12 " style="z-index: 1;">
                <div class="panel panel-default">

                    <div id="r1p1" class="panel-collapse collapse in">
                        <div class="panel-body" id="map_div" style="height:85vh;padding: 0;  margin-bottom: 0px !important;z-index: 1;">

                            <div class="modal" id="nonsurvedmodal" role="dialog" style="">
                                <div class="modal-dialog">
                                
                                <!-- Modal content-->
                                <div class="modal-content">
                                    <div class="modal-header">
                                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                                    <h4 class="modal-title">Non surveyed Demand Point</h4>
                                    </div>
                                    <div class="modal-body" id="modalbody_id">
                                    
                                    </div>
                                    <div class="modal-footer">
                                    <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
                                    </div>
                                </div>
                                
                                </div>
                            </div>
                           
                        </div>
                    </div>
                </div>
            </div>
        <div id="wg" class="windowGroup">

        </div>

        <div id="wg1" class="windowGroup">

        </div>
        </div>


    </div>

</div>


<button type="button" class="btn btn-info btn-lg" data-toggle="modal" data-target="#myModal" style="display: none;" id="model_btn_click">Open Modal</button>
<!-- Modal -->
<div class="modal fade" id="myModal" role="dialog">
    <div class="modal-dialog">

        <!-- Modal content-->
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title" id="layer_title" ></h4>
                <!--<p style="text-align: right;"><img src="images/cornoa.jpg" width="80" height="75" alt=""/></p>-->
            </div>
            <div class="modal-body">
                <table class="table table-bordered table-responsive" id="layers_infos">
                </table>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
            </div>
        </div>

    </div>
</div>

<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
<script src="libs/bootstrap/js/bootstrap.min.js"></script>
<link rel="stylesheet" href="libs/images_slider/css-view/lightbox.css" type="text/css" />
<script src="libs/images_slider/js-view/lightbox-2.6.min.js"></script>
<script src="libs/images_slider/js-view/jQueryRotate.js"></script>
<link rel="stylesheet" href="libs/window-engine.css" />
<script src="libs/window-engine.js"></script>
<script src="scripts/map.js"></script>
<script src="libs/typeahead.min.js"></script>
<script type="text/javascript" src="scripts/jquery.dataTables.js"></script>


 <div id="myDiv" style="display: none;"></div>
</body>
</html>