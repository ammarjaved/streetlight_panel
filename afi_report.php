<html>
<head>
<link rel="stylesheet" href="https://cdn.datatables.net/1.10.2/css/jquery.dataTables.min.css">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.0/css/bootstrap.min.css">
<script type="application/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
    <script type="application/javascript" src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.0/js/bootstrap.min.js"></script>
<script type="text/javascript" src="https://cdn.datatables.net/1.10.2/js/jquery.dataTables.min.js"></script>
</head>
<body>
<div class="container">
    <div class="row header" style="text-align:center;color:green">
        <h3>Afi Complete AFI LIST</h3>
    </div>
    <table id="example" class="table table-striped table-bordered" style="width:100%">
        <thead>
        <tr>
            <th>id</th>
            <th>Pe Name</th>
            <th>device_id</th>
            <th>status</th>
            <th>cd_id</th>
            <th>download</th>
        </tr>
        </thead>
        <tbody id="tb_new">

        </tbody>
        <tfoot>

        </tfoot>
    </table>
</div>
<div id="myDiv" style="display: none;"></div>
</body>
</html>
<script>
    $(document).ready(function() {


        $.ajax({
                        url: "services/getCompletefpl.php",
                        type: "GET",
                        async: false,
                        dataType: "json",
                        contentType: "application/json; charset=utf-8",
                        success: function callback(response) {
                            var str='';
                            for(var i=0;i<response.length;i++) {
                                str = str + '<tr><td>' + (i + 1) + '</td><td>' + response[i].pe_name + '</td><td>' + response[i].l1_id + '</td><td>' + response[i].status + '</td><td>' + response[i].cd_id + '</td><td><a class="pull-right btn btn-danger btn-sm" style="color: white; margin-top: 10px !important;margin-right: 10px;" onclick=exportExcel('+'"'+response[i].l1_id+'"'+')>Export Excel</a></td></tr>'
                            }

                            $("#tb_new").html(str);
                            $('#example').DataTable();
                         }
                    })

    } );

    function exportExcel(di){
        $.ajax({
            url : 'services/lib/create_excel_fpl.php?l1_id='+di,
            type : "GET",
            success:function(res){
                var mydiv = document.getElementById("myDiv");
                $(mydiv).html('');
                var aTag = document.createElement('a');
                aTag.setAttribute('href',"services/lib/"+res+".xlsx");
                aTag.setAttribute('id',"exp11");
                aTag.innerText = "link text";
                mydiv.appendChild(aTag);

                $("#exp11")[0].click();



            }
        });
    }

</script>