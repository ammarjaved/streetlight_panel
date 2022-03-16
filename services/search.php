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

        $key=$_GET['key'];
        $tblname = $_REQUEST['tblname'];

        if ($tblname == 'fpl1') {
            $sql = "select l1_id from public.fpl1 where l1_id ilike '%{$key}%' limit 5;";
        } else if ($tblname == 'sfp_l2') {
            $sql = "select l2_id from public.sfp_l2 where l2_id ilike '%{$key}%' limit 5;";
        } else if ($tblname == 'mfp_l3') {
            $sql = "select l3_id from public.mfp_l3 where l3_id ilike '%{$key}%' limit 5;";
        } else if ($tblname == 'dp') {
            $sql = "select gid from public.demand_point where gid>=$key limit 5;";
        }

        $output = array();

        $result_query = pg_query($sql);
        if($result_query)
        {
           // $output = pg_fetch_assoc($result_query);
            while($row=pg_fetch_assoc($result_query))
            {
                if ($tblname == 'fpl1') {
                    $output[] = $row['l1_id'];
                } else if ($tblname == 'sfp_l2') {
                    $output[] = $row['l2_id'];
                } else if ($tblname == 'mfp_l3') {
                    $output[] = $row['l3_id'];
                }else if ($tblname == 'dp') {
                    $output[] = $row['gid'];
                }
            }
        }

        $this->closeConnection();
        return json_encode($output);
    }

}

$json = new Divisions();
echo $json->loadData();
?>