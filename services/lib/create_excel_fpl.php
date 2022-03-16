<?php
include '../connection.php';
require 'vendor/autoload.php';
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;


$spreadsheet = new Spreadsheet();



// Add some data
//$helper->log('Add some data');
$spreadsheet->setActiveSheetIndex(0)
    ->setCellValue('B2', 'Date SO Generation')
    ->setCellValue('B3', 'SO Number')
    ->setCellValue('B4', 'Created by')
    ->setCellValue('B5', "Percentage Done (%)")
    ->setCellValue('B6', "Total Customer")
    ->setCellValue('B7', "Date Handover to TNB ES");



$spreadsheet->setActiveSheetIndex(0)
    ->setCellValue('A9', "NO.")
    ->setCellValue('B9', "PE Name")
    ->setCellValue('C9', "PE FL")
    ->setCellValue('D9', "FP ID")
    ->setCellValue('E9', "SFP ID")
    ->setCellValue('F9', "MFP ID")
    ->setCellValue('G9', "Demand Point ID")
    ->setCellValue('H9', "CD No.")
    ->setCellValue('I9', "Phase")
    ->setCellValue('J9', "Feeder")
    ->setCellValue('K9', "Meter No.")
    ->setCellValue('L9', "Installation ID")
    ->setCellValue('M9', "Meter Location")
    ->setCellValue('N9', "Image Link");

$output=array();
$l1id=$_REQUEST['l1_id'];
$sql = "with foo as(select * from fpl1 where status='Completed' and l1_id='$l1id')
select a.*,st_x((ST_Dump(a.geom)).geom)||','||st_y((ST_Dump(a.geom)).geom) as location,images||','||image2||','||image3||','||image4||','||image5 as pic from public.demand_point a,foo b where  b.l1_id=a.l1_id;";
$query = pg_query($sql);
if($query) {
    $output = pg_fetch_all($query);
}

$comp=$output;
//print_r($comp);
$spreadsheet->setActiveSheetIndex(0)
    ->setCellValue('C5', (sizeof($comp))*100/10000)
    ->setCellValue('C6', '10000')
    ->setCellValue('C7',  date("l jS \of F Y h:i:s A"));
$j=9;
for($i=0;$i<sizeof($comp);$i++) {
   // echo $comp[$i]['pe_name'] ;
    $j=$j+1;
    $no=$i+1;
    $spreadsheet->setActiveSheetIndex(0)
        ->setCellValue('A'.$j,$no )
        ->setCellValue('B'.$j, $comp[$i]['pe_name'])
        ->setCellValue('C'.$j, '')
        ->setCellValue('D'.$j, $comp[$i]['l1_id'])
        ->setCellValue('E'.$j, $comp[$i]['l2_id'])
        ->setCellValue('F'.$j, $comp[$i]['l3_id'])
        ->setCellValue('G'.$j,  $comp[$i]['gid'])
        ->setCellValue('H'.$j, $comp[$i]['cd_id'])
        ->setCellValue('I'.$j, $comp[$i]['phase'])
        ->setCellValue('J'.$j, $comp[$i]['fd_no'])
        ->setCellValue('K'.$j, $comp[$i]['site_eqp'])
        ->setCellValue('L'.$j, $comp[$i]['install_id'])
        ->setCellValue('M'.$j, $comp[$i]['location'])
        ->setCellValue('N'.$j, $comp[$i]['pic']);
}
//$spreadsheet->getStyle('A6:C6')->getFill()
    //->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)
  //  ->getStartColor()->setARGB('FFA0A0A0');
//NO.																			
//$spreadsheet->setActiveSheetIndex(0)
//    ->setCellValue('B'.$j+2, "SO Total Customer")
//    ->setCellValue('B'.$j+3, "Total Customer Submited")
//    ->setCellValue('B'.$j+4, "Total Customer")
//    ->setCellValue('B'.$j+5, "% Completed")
//    ->setCellValue('B'.$j+7, "Preapred By")
//    ->setCellValue('B'.$j+8, "Date")
//    ->setCellValue('B'.$j+11, "Accepted By")
//    ->setCellValue('B'.$j+11, "Date");
// Rename worksheet
//$helper->log('Rename worksheet');
$spreadsheet->getActiveSheet()
    ->setTitle('report');
$name='report'.rand();
$writer = new Xlsx($spreadsheet);	
$writer->save($name.'.xlsx');
echo $name;
// Save
//$helper->write($spreadsheet, __FILE__, ['Xlsx', 'Xls', 'Ods']);