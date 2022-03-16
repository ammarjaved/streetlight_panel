<?php
session_start();
include 'connection.php';
$output = array();



$sql1="select *,st_X(geom) as x,st_Y(geom) as y from demand_point_panel ";
 

//echo $sql1."<br/>";
$query1=pg_query($sql1);


if($query1)
{
    $output= pg_fetch_all($query1);
}

echo  json_encode($output);

?>