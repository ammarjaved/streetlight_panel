<?php
session_start();
include 'connection.php';
$output = array();

$id=$_GET['di'];

$sql1="select st_X(geom) as x,st_Y(geom) as y from demand_point_panel where device_id='$id'";
 

//echo $sql1."<br/>";
$query1=pg_query($sql1);

$sql2="select count(*),type from stree_light_panel  where dmd_pnt_id='$id' group by type";
//echo $sql1."<br/>";
$query2=pg_query($sql2);


if($query1)
{
    $output['xy']= pg_fetch_all($query1);
}
if($query2)
{
    $output['count']= pg_fetch_all($query2);
}

echo  json_encode($output);

?>