<?php
session_start();
include 'connection.php';
$output = array();

Class Dropdowns
{

public function fillDropdown(){
    $lyr = $_REQUEST['lyr'];
    $did = $_REQUEST['did'];


        if ($lyr == 'fpl1') {
            $sql = "select st_x((st_dump(geom)).geom) as x,st_y((st_dump(geom)).geom) as y from public.fpl1 where l1_id='$did';";
        } else if ($lyr == 'sfp_l2') {
            $sql = "select st_x((st_dump(geom)).geom) as x,st_y((st_dump(geom)).geom) as y from public.sfp_l2 where l2_id='$did';";

        } else if ($lyr == 'mfp_l3') {
            $sql = "selectst_x((st_dump(geom)).geom) as x,st_y((st_dump(geom)).geom) as y from public.mfp_l3 where l3_id='$did';";
        } else if ($lyr == 'dp') {
            $sql = "select st_x((st_dump(geom)).geom) as x,st_y((st_dump(geom)).geom) as y from public.demand_point where gid='$did';";
        //echo $sql;
        }else{
            'not found';
        }

// echo $sql;
// exit();


    $query1 = pg_query($sql);
        $output = pg_fetch_all($query1);
        return $output;
}
}
$rs=new Dropdowns();
echo  json_encode($rs->fillDropdown());

?>