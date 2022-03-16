


<?php
include("connection.php");

class LED extends connection {
    function __construct()
    {
        $this->connectionDB();

    }

    public function getfp_l1() {
        $di=$_REQUEST['di'];
      
            $sql = "SELECT json_build_object('type', 'FeatureCollection','crs',  json_build_object('type','name', 'properties', json_build_object('name', 'EPSG:4326'  )),'features', json_agg(json_build_object('type','Feature','p_id',p_id,'geometry',ST_AsGeoJSON(geom)::json,
            'properties', json_build_object(
            'p_id', p_id,
            'remarks', remarks,
            'device_id',device_id ,
            'aoi',aoi,
            'phasing',phasing,
            'dmd_pnt_id', dmd_pnt_id,
            'pole_type', pole_type,
            'pole_number',pole_number,
            'watt',watt,
            'type', type,
            'brand', brand
            ))))
            FROM ( SELECT p_id, remarks, device_id, aoi, phasing, dmd_pnt_id, geom, pole_type, pole_number, watt, type, brand
	FROM public.stree_light_panel where dmd_pnt_id='$di') as tbl1;";
        

        $output = array();
        $result_query = pg_query($sql);
        if ($result_query) {
             $arrq = pg_fetch_all($result_query);
             // print_r($arrq);
             // exit();
             $arr = json_decode(json_encode($arrq), true);
                    $g=implode("",$arr[0]);
                    $geojson=$g;
                    $output = $geojson;
        }

        return $output;

        $this->closeConnection();
    }
}

$json = new LED();
//$json->closeConnection();
echo $json->getfp_l1();

