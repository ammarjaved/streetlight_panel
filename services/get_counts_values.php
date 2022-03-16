<?php
session_start();
include 'connection.php';
$output = array();



$sql1="select count(*) from stree_light_panel";
$sql2="select count(*) from stree_light_panel where type='LED'";
$sql3="select count(*) from stree_light_panel where type='SODIUM'";   
$sql4="select sum(watt::integer) from stree_light_panel";   

//echo $sql1."<br/>";
$query1=pg_query($sql1);
$query2=pg_query($sql2);
$query3=pg_query($sql3);
$query4=pg_query($sql4);


if($query1)
{
    $output['total'] = pg_fetch_all($query1);
}
if($query2)
{
    $output['led'] = pg_fetch_all($query2);
}
if($query3)
{
    $output['sodium'] = pg_fetch_all($query3);
}
if($query4)
{
    $output['watt'] = pg_fetch_all($query4);
}
echo  json_encode($output);

?>