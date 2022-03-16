<?php
session_start();
include("connection.php");
class Divisions extends connection
{
    function __construct()
    {
        $this->connectionDB();

    }
    public function loadData()
    {

        $id=(int)$_GET['id'];
        $st=$_GET['st'];

        if($st=='next') {
			$idn=$id+1;
            $sql = "select gid, photo, filename, directory, altitude, direction, longitude, latitude, st_asgeojson(geom) as geom from pano_layer where gid= $idn order by gid limit 1";
        }else{
			$idp=$id-1;
            $sql = "select gid, photo, filename, directory, altitude, direction, longitude, latitude, st_asgeojson(geom) as geom from pano_layer where gid=$idp order by gid limit 1";
        }

        $output = array();

        $result_query = pg_query($sql);
        if($result_query)
        {
           // $output = pg_fetch_assoc($result_query);
            $output = pg_fetch_all($result_query);
        }

        $this->closeConnection();
        return json_encode($output);
    }

}

$json = new Divisions();
echo $json->loadData();
?>