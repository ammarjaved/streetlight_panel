var lvdb_l1 = L.layerGroup();
var SFP_L2 = L.layerGroup();
var MFP_L3 = L.layerGroup();
var demand_point = L.layerGroup();
var current_dropdown_Lid='%';
var current_phase_val='%';
var latlngsarr = Array();
var l1;
var l2;
var l3;
var filter_polylines_arr=Array();
var point_polylines_arr=Array();
var line_l1_l2_l3_markers = L.layerGroup();
var current_dropdown_latlng;
var identifyme='';

var color1='red'
var color2='yellow'
var color3='blue'
var linescolor=['white','orange','grey']

   
    var street   = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'),
    dark  = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png'),
    googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
        maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3']
    });

    var non_surveyed_dp = L.tileLayer.wms("http://121.121.232.54:7090/geoserver/cite/wms", {
        layers: 'cite:demand_point_not_surveyed',
        format: 'image/png',
        maxZoom: 20,
        transparent: true
    });

    var pano_layer = L.tileLayer.wms("http://121.121.232.54:7090/geoserver/cite/wms", {
        layers: 'cite:pano_afi',
        format: 'image/png',
        maxZoom: 20,
        transparent: true
    });

    var map = L.map('map_div', {
        center: [2.3773940674819998, 102.21967220306398],
        // center: [31.5204, 74.3587],
        zoom: 15,
        layers: [googleSat, demand_point, non_surveyed_dp,pano_layer,lvdb_l1,SFP_L2,MFP_L3],
        attributionControl:false
    });

function preNext(status){
    $("#wg").html('');
    $.ajax({
        url: 'services/pre_next.php?id='+selectedId+'&st='+status,
        dataType: 'JSON',
        //data: data,
        method: 'GET',
        async: false,
        success: function callback(data) {

            //  alert(data
            var str='<div id="window1" class="window">' +
                '<div class="green">' +
                '<p class="windowTitle">Pano Images</p>' +
                '</div>' +
                '<div class="mainWindow">' +
                // '<canvas id="canvas" width="400" height="480">' +
                // '</canvas>' +
                '<div id="panorama" width="400px" height="480px"></div>'+
                '<div class="row"><button style="margin-left: 30%;" onclick=preNext("pre") class="btn btn-success">Previous</button><button  onclick=preNext("next")  style="float: right;margin-right: 35%;" class="btn btn-success">Next</button></div>'
            '</div>' +
            '</div>'

            $("#wg").html(str);

            createWindow(1);
            console.log(data)
            // var canvas = document.getElementById('canvas');
            // var context = canvas.getContext('2d');
            // context.clearRect(0,0 ,canvas.width,canvas.height)
            //     img.src = data.features[0].properties.image_path;
            //     init_pano('canvas')
            // setTimeout(function () {
            //     init_pano('canvas')
            // },1000)=
            selectedId=data[0].gid
            pannellum.viewer('panorama', {
                "type": "equirectangular",
                "panorama": data[0].photo,
                "compass": true,
                "autoLoad": true
            });

            if(identifyme!=''){
                map.removeLayer(identifyme)
            }
            identifyme = L.geoJSON(JSON.parse(data[0].geom)).addTo(map);


        }
    });

}

function activeSelectedLayerPano() {
//alert(val)
    map.off('click');
    map.on('click', function(e) {
        //map.off('click');
        $("#wg").html('');
        // Build the URL for a GetFeatureInfo
        var url = getFeatureInfoUrl(
            map,
            pano_layer,
            e.latlng,
            {
                'info_format': 'application/json',
                'propertyName': 'NAME,AREA_CODE,DESCRIPTIO'
            }
        );
        $.ajax({
            url: 'services/proxy.php?url='+encodeURIComponent(url),
            dataType: 'JSON',
            //data: data,
            method: 'GET',
            async: false,
            success: function callback(data) {

                //  alert(data
                var str='<div id="window1" class="window">' +
                    '<div class="green">' +
                    '<p class="windowTitle">Pano Images</p>' +
                    '</div>' +
                    '<div class="mainWindow">' +
                    // '<canvas id="canvas" width="400" height="480">' +
                    // '</canvas>' +
                    '<div id="panorama" width="400px" height="480px"></div>'+
                    '<div class="row"><button style="margin-left: 30%;" onclick=preNext("pre") class="btn btn-success">Previous</button><button  onclick=preNext("next")  style="float: right;margin-right: 35%;" class="btn btn-success">Next</button></div>'

                '</div>' +
                '</div>'

                $("#wg").html(str);


                console.log(data)
                if(data.features.length!=0){
                    createWindow(1);
                    selectedId=data.features[0].id.split('.')[1];
                    // var canvas = document.getElementById('canvas');
                    // var context = canvas.getContext('2d');
                    // context.clearRect(0,0 ,canvas.width,canvas.height)
                    //     img.src = data.features[0].properties.image_path;
                    //     init_pano('canvas')
                    // setTimeout(function () {
                    //     init_pano('canvas')
                    // },1000)
                    pannellum.viewer('panorama', {
                        "type": "equirectangular",
                        "panorama": data.features[0].properties.photo,
                        "compass": true,
                        "autoLoad": true
                    });
                    if(identifyme!=''){
                        map.removeLayer(identifyme)
                    }
                    identifyme = L.geoJSON(data.features[0].geometry).addTo(map);

                }

            }
        });




    });
}

function getFeatureInfoUrl(map, layer, latlng, params) {

    var point = map.latLngToContainerPoint(latlng, map.getZoom()),
        size = map.getSize(),

        params = {
            request: 'GetFeatureInfo',
            service: 'WMS',
            srs: 'EPSG:4326',
            styles: layer.wmsParams.styles,
            transparent: layer.wmsParams.transparent,
            version: layer._wmsVersion,
            format:layer.wmsParams.format,
            bbox: map.getBounds().toBBoxString(),
            height: size.y,
            width: size.x,
            layers: layer.wmsParams.layers,
            query_layers: layer.wmsParams.layers,
            info_format: 'application/json'
        };

    params[params.version === '1.3.0' ? 'i' : 'x'] = parseInt(point.x);
    params[params.version === '1.3.0' ? 'j' : 'y'] = parseInt(point.y);

    // return this._url + L.Util.getParamString(params, this._url, true);

    var url = layer._url + L.Util.getParamString(params, layer._url, true);
    if(typeof layer.wmsParams.proxy !== "undefined") {


        // check if proxyParamName is defined (instead, use default value)
        if(typeof layer.wmsParams.proxyParamName !== "undefined")
            layer.wmsParams.proxyParamName = 'url';

        // build proxy (es: "proxy.php?url=" )
        _proxy = layer.wmsParams.proxy + '?' + layer.wmsParams.proxyParamName + '=';

        url = _proxy + encodeURIComponent(url);

    }

    return url.toString();

}
function getProperties(){
    map.off('click');
    map.on('click', function(e) {
        map.off('click');

        // Build the URL for a GetFeatureInfo
        var url = getFeatureInfoUrl(
            map,
            non_surveyed_dp,
            e.latlng,
            {
                'info_format': 'application/json',
                'propertyName': 'NAME,AREA_CODE,DESCRIPTIO'
            }
        );
        $.ajax({
            url: 'services/proxy.php?url='+encodeURIComponent(url),
            dataType: 'JSON',
            //data: data,
            method: 'GET',
            async: false,
            success: function callback(data) {
                console.log(data.features[0].properties.acc_no)
                var str='<div style="height:200px; width:250px; overflow-y:scroll;"><table class="table table-bordered">';
                str = str + '<tr><td> id </td><td>' + data.features[0].properties.gid + '</td></tr>';
                str = str + '<tr><td> Account No. </td><td>' + data.features[0].properties.acc_no + '</td></tr>';
                str = str + '<tr><td> Pe Name  </td><td>' + data.features[0].properties.pe_name  + '</td></tr>'
                str = str + '<tr><td> Address  </td><td>' + data.features[0].properties.address  + '</td></tr>'
                str = str + '<tr><td> Meter no  </td><td>' + data.features[0].properties.bcrm_eqp  + '</td></tr>'
                str = str + '<tr><td> Device id  </td><td>' + data.features[0].properties.device_id  + '</td></tr>'
                str = str + '<tr><td> Installation id  </td><td>' + data.features[0].properties.install_id  + '</td></tr>'
                str = str + '<tr><td> Meter Type  </td><td>' + data.features[0].properties.meter_type  + '</td></tr>'
                str = str + '<tr><td> cd_id  </td><td>' + data.features[0].properties.cd_id  + '</td></tr>'
                str = str + '<tr><td> fd_no  </td><td>' + data.features[0].properties.fd_no  + '</td></tr>'
                str = str + '<tr><td> l1_id  </td><td>' + data.features[0].properties.l1_id  + '</td></tr>'
                str = str + '<tr><td> l2_id  </td><td>' + data.features[0].properties.l2_id  + '</td></tr>'
                str = str + '<tr><td> l3_id  </td><td>' + data.features[0].properties.l3_id  + '</td></tr>'
                str = str + '<tr><td> image  </td><td><a href="'+data.features[0].properties.image2 +'" class=\'example-image-link\' data-lightbox=\'example-set\' title=\'&lt;button class=&quot;primary &quot; onclick= rotate_img(&quot;pic1&quot)  &gt;Rotate image&lt;/button&gt;\'><img src="' + data.features[0].properties.image2 + '" width="20px" height="20px"></a></td></tr>'
                str = str + '</table></div>'
                $("#modalbody_id").html(str)

            }
        });
        $('#nonsurvedmodal').modal('show');
        activeSelectedLayerPano();
    });
    
}

        

var baseLayers = {
    "Street": street,
    "Satellite": googleSat,
    "Dark": dark,
};

var overlays = {
    "FPL_L1&nbsp&nbsp<img src='images/1.png' width='30' height='30'>": lvdb_l1,
    "SFP_L2&nbsp&nbsp<img src='images/2.png' width='30' height='30'>": SFP_L2,
    "MFP_L3&nbsp&nbsp<img src='images/3.png' width='30' height='30'>": MFP_L3,
    "Surveyed Demand Points &nbsp&nbsp ": demand_point,
    "Non Surveyed D/P": non_surveyed_dp,
    "Pano Layer":pano_layer
};

L.control.layers(baseLayers, overlays).addTo(map);


var Icont = L.icon({
    iconUrl: 'https://061.bz/scripts/AWIS/assets/img/1.png',
    iconSize:     [0, 0] // size of the icon
});
var Icon1 = L.icon({
    iconUrl: 'https://061.bz/scripts/AWIS/assets/img/1.png',
    iconSize:     [35, 35] // size of the icon
});
var Icon2 = L.icon({
    iconUrl: 'https://061.bz/scripts/AWIS/assets/img/2.png',
    iconSize:     [35, 35] // size of the icon
});
var Icon3 = L.icon({
    iconUrl: 'https://061.bz/scripts/AWIS/assets/img/3.png',
    iconSize:     [35, 35] // size of the icon
});
var ryb= L.icon({
    iconUrl: 'https://061.bz/scripts/AWIS/assets/img/ryb.png',
    iconSize:     [25, 25] // size of the icon
});

function fillDropDowns(di,lyr){
    
    $.ajax({
        url: "services/get_dropdn_values.php?lyr="+lyr+"&di="+di,
        type: "GET",
        dataType: "json",
        //data: JSON.stringify(geom,layer.geometry),
        contentType: "application/json; charset=utf-8",
        success: function callback(data) {
            // var r=JSON.parse(response)
            console.log(data)
            for(var j=0;j<data.count.length;j++){ 
                if(data.count[j].phase=="R"){       
                $("#sred").text(data.count[j].count);
                }
                if(data.count[j].phase=="Y"){
                $("#syellow").text(data.count[j].count);
                }
                if(data.count[j].phase=="B"){
                $("#sblue").text(data.count[j].count);
                }
                if(data.count[j].phase=="RYB"){
                $("#tryb").text(data.count[j].count);
                }
              }
              var total_sum=0;
              var total_sum=Number(data.count[0].count) + Number(data.count[1].count)  + Number(data.count[2].count)  + Number(data.count[3].count);
              $("#total_count").text(total_sum );
            $("#total_count_p").text(((total_sum*100)/10000)+'%');
            if(lyr=='fp'){
                var str='<option>Select FP</option>'
                //console.log(data.fp)
                if(data.fp!="false"){
                for(var i=0;i<data.fp.length;i++){
                    str=str+'<option value="'+ data.fp[i].l1_id+","+data.fp[i].x+"-"+data.fp[i].y+'">'+data.fp[i].l1_id+' ('+data.fp[i].pe_name+')'+'</option>';
                }
                $('select[name="fp"]').html(str)
            }
            }
            else if(lyr=='sfp'){
                if(data.sfp!="false"){
                    var str='<option>Select SFP</option>'
                for(var i=0;i<data.sfp.length;i++){  
                    str=str+'<option class="load_options" value="'+ data.sfp[i].l2_id+","+data.sfp[i].x+"-"+data.sfp[i].y+'">'+data.sfp[i].l2_id+' ( '+data.sfp[i].pe_name+')'+'</option>';
                }
                $('select[name="sfp"]').html(str)
            }
            }else if(lyr=='mfp') {
                if(data.mfp!="false"){
                    var str='<option>Select MFP</option>'
                    for (var i = 0; i < data.mfp.length; i++) {
                        str=str+'<option class="load_options" value="'+ data.mfp[i].l3_id+","+data.mfp[i].x+"-"+data.mfp[i].y+'">' + data.mfp[i].l3_id+' ('+data.mfp[i].pe_name+')'+'</option>';
                    }
                    $('select[name="mfp"]').html(str)
                }
            }
        }
    });
}

$('select[name="fp"]').on('change',function(e){

    //  console.log(demand_point)
      // function fp_zoom_to_feature(did){
      //     gj= JSON.parse(geojsonfromhiddenfld)
      //      for(var i=0;i<gj.features.length;i++){if(gj.features[i].properties.device_id==did){map.setView([gj.features[i].geometry.coordinates[1],gj.features[i].geometry.coordinates[0]],17)}}
      //      // console.log(did)
      //      // console.log(geojsonfromhiddenfld)
           
      //  }
    //   e.preventDefault();
      var l1_id= $(this).val();
      var spl1id=l1_id.split(',');
     // var did=spl1id[0];
      spl2id=spl1id[1].split('-');
      map.setView([spl2id[1],spl2id[0]],19);
            $("#sred").text('');
          $("#syellow").text('');
          $("#sblue").text('');
          $("#tryb").text('');
          $("#total_count").text('');
  
      fillDropDowns(spl1id[0],'sfp')

     // current_phase_val= spl1id[0].split(",")[0];

      $('#fd_details_div').show();
      current_dropdown_Lid=spl1id[0];
      current_dropdown_latlng=[spl2id[1],spl2id[0]];
      //get_dp_and_counts_against_dvid(l1_id); 
     // clickTopDropDowns(l1_id);
  });


$(document).ready(function(){
    //-----------counts----------
    // $.ajax({
    //     url: "services/get_total_counts_values.php?lid=%",
    //     type: "GET",
    //     dataType: "json",
    //     //data: JSON.stringify(geom,layer.geometry),
    //     contentType: "application/json; charset=utf-8",
    //     success: function callback(response) {
    //       console.log(response)
    //       $("#sred").text(response.Rsingle[0]["count"]);
    //       $("#syellow").text(response.Ysingle[0]["count"]);
    //       $("#sblue").text(response.Bsingle[0]["count"]);
    //       $("#tryb").text(response.RYBthree[0]["count"]);

    //     }
    // });
    setTimeout(function(){

        activeSelectedLayerPano();
         //-----------fp dropdown ids----------  
        fillDropDowns('%','fp')
        get_lvdb_l1_geojson('%');
        get_SFP_L2_geojson('%');
        get_MFP_L3_geojson('%');
        get_demand_point_geojson('%','%','%');
      
        //-----------geojson of layers----------  
    function get_lvdb_l1_geojson(l1_id){
        $.ajax({
            url: "services/get_lvdb_l1_geojson.php?l1_id="+l1_id,
            type: "GET",
            dataType: "json",
            //data: JSON.stringify(geom,layer.geometry),
            contentType: "application/json; charset=utf-8",
            success: function callback(response) {
                if(response==undefined || response==''){
                console.log(response);
                }else{
                lvdb_l1=L.geoJSON(response,{
                        pointToLayer: function (feature, latlng) {
                            return L.marker(latlng, {icon: Icon1});
                        },
                        onEachFeature: function (feature, layer) {
                            var str='<div style="height:200px; width:250px; overflow-y:scroll;"><table class="table table-bordered">';
                            str = str + '<tr><td> ID </td><td>' + feature.properties.id  + '</td></tr>';
                            str = str + '<tr><td> pe_name  </td><td>' + feature.properties.pe_name  + '</td></tr>'
                            str = str + '<tr><td> l1_id  </td><td>' + feature.properties.l1_id  + '</td></tr>'
                            str = str + '<tr><td> status  </td><td>' + feature.properties.status  + '</td></tr>'
                            str = str + '<tr><td> pe_fl  </td><td>' + feature.properties.pe_fl  + '</td></tr>'
                            str = str + '<tr><td> tx1_fl  </td><td>' + feature.properties.tx1_fl  + '</td></tr>'
                            str = str + '<tr><td> cd_id  </td><td>' + feature.properties.cd_id  + '</td></tr>' 
                            str = str + '<tr><td> image_1  </td><td><a href="'+feature.properties.image_1 +'" class=\'example-image-link\' data-lightbox=\'example-set\' title=\'&lt;button class=&quot;primary &quot; onclick= rotate_img(&quot;pic1&quot)  &gt;Rotate image&lt;/button&gt;\'><img src="' + feature.properties.image_1  + '" width="20px" height="20px"></a></td></tr>'
                            str = str + '<tr><td> image_2  </td><td><a href="'+feature.properties.image_2 +'" class=\'example-image-link\' data-lightbox=\'example-set\' title=\'&lt;button class=&quot;primary &quot; onclick= rotate_img(&quot;pic1&quot)  &gt;Rotate image&lt;/button&gt;\'><img src="' + feature.properties.image_2  + '" width="20px" height="20px"></a></td></tr>'
                            str = str + '<tr><td> image_3  </td><td><a href="'+feature.properties.image_3 +'" class=\'example-image-link\' data-lightbox=\'example-set\' title=\'&lt;button class=&quot;primary &quot; onclick= rotate_img(&quot;pic1&quot)  &gt;Rotate image&lt;/button&gt;\'><img src="' + feature.properties.image_3  + '" width="20px" height="20px"></a></td></tr>'
                            str = str + '<tr><td> image_4  </td><td><a href="'+feature.properties.image_4 +'" class=\'example-image-link\' data-lightbox=\'example-set\' title=\'&lt;button class=&quot;primary &quot; onclick= rotate_img(&quot;pic1&quot)  &gt;Rotate image&lt;/button&gt;\'><img src="' + feature.properties.image_4  + '" width="20px" height="20px"></a></td></tr>'
                            str = str + '<tr><td> image_5  </td><td><a href="'+feature.properties.image_5 +'" class=\'example-image-link\' data-lightbox=\'example-set\' title=\'&lt;button class=&quot;primary &quot; onclick= rotate_img(&quot;pic1&quot)  &gt;Rotate image&lt;/button&gt;\'><img src="' + feature.properties.image_5  + '" width="20px" height="20px"></a></td></tr>'
                            str = str + '<tr><td> image_6  </td><td><a href="'+feature.properties.image_6 +'" class=\'example-image-link\' data-lightbox=\'example-set\' title=\'&lt;button class=&quot;primary &quot; onclick= rotate_img(&quot;pic1&quot)  &gt;Rotate image&lt;/button&gt;\'><img src="' + feature.properties.image_6  + '" width="20px" height="20px"></a></td></tr>'
                            str = str + '<tr><td> image_7  </td><td><a href="'+feature.properties.image_7 +'" class=\'example-image-link\' data-lightbox=\'example-set\' title=\'&lt;button class=&quot;primary &quot; onclick= rotate_img(&quot;pic1&quot)  &gt;Rotate image&lt;/button&gt;\'><img src="' + feature.properties.image_7  + '" width="20px" height="20px"></a></td></tr>'
                            str = str + '<tr><td> image_8  </td><td><a href="'+feature.properties.image_8 +'" class=\'example-image-link\' data-lightbox=\'example-set\' title=\'&lt;button class=&quot;primary &quot; onclick= rotate_img(&quot;pic1&quot)  &gt;Rotate image&lt;/button&gt;\'><img src="' + feature.properties.image_8  + '" width="20px" height="20px"></a></td></tr>'
                            str = str + '<tr><td> image_9  </td><td><a href="'+feature.properties.image_9 +'" class=\'example-image-link\' data-lightbox=\'example-set\' title=\'&lt;button class=&quot;primary &quot; onclick= rotate_img(&quot;pic1&quot)  &gt;Rotate image&lt;/button&gt;\'><img src="' + feature.properties.image_9  + '" width="20px" height="20px"></a></td></tr>'
                            str = str + '<tr><td> image_10 </td><td><a href="'+feature.properties.image_10+'" class=\'example-image-link\' data-lightbox=\'example-set\' title=\'&lt;button class=&quot;primary &quot; onclick= rotate_img(&quot;pic1&quot)  &gt;Rotate image&lt;/button&gt;\'><img src="' + feature.properties.image_10 + '" width="20px" height="20px"></a></td></tr>'
                            str = str + '</table></div>'
                            layer.bindPopup(str);
                            layer.on('click', function (e) {
                                var dlatlng=[feature.geometry.coordinates[1], feature.geometry.coordinates[0]];
                                current_dropdown_latlng= dlatlng;
                                var did=feature.properties.l1_id;
                                get_dp_and_counts_against_fp_dvid(did)
                            });
                        }
                    }).addTo(lvdb_l1)
                }
            }
        });
    }
    function get_SFP_L2_geojson(l2_id){
        $.ajax({
            url: "services/get_SFP_L2_geojson.php?l2_id="+l2_id,
            type: "GET",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function callback(response) {
                if(response==undefined || response==''){
                console.log(response);
                }else{
                SFP_L2=L.geoJSON(response,{
                        pointToLayer: function (feature, latlng) {
                            return L.marker(latlng, {icon: Icon2});
                        },
                        onEachFeature: function (feature, layer) {
                            var str='<div style="height:200px; width:250px; overflow-y:scroll;"><table class="table table-bordered">';
                            str = str + '<tr><td> ID </td><td>' + feature.properties.gid  + '</td></tr>';
                            str = str + '<tr><td> pe_name  </td><td>' + feature.properties.pe_name  + '</td></tr>'
                            str = str + '<tr><td> l1_id  </td><td>' + feature.properties.l1_id  + '</td></tr>'
                            str = str + '<tr><td> l2_id  </td><td>' + feature.properties.l2_id  + '</td></tr>'
                            str = str + '<tr><td> status  </td><td>' + feature.properties.status  + '</td></tr>'
                            str = str + '<tr><td> pe_fl  </td><td>' + feature.properties.pe_fl  + '</td></tr>'
                            str = str + '<tr><td> tx1_fl  </td><td>' + feature.properties.tx1_fl  + '</td></tr>'
                            str = str + '<tr><td> cd_id  </td><td>' + feature.properties.cd_id  + '</td></tr>' 
                            str = str + '<tr><td> image_1  </td><td><a href="'+feature.properties.image_1 +'" class=\'example-image-link\' data-lightbox=\'example-set\' title=\'&lt;button class=&quot;primary &quot; onclick= rotate_img(&quot;pic1&quot)  &gt;Rotate image&lt;/button&gt;\'><img src="' + feature.properties.image_1  + '" width="20px" height="20px"></a></td></tr>'
                            str = str + '<tr><td> image_2  </td><td><a href="'+feature.properties.image_2 +'" class=\'example-image-link\' data-lightbox=\'example-set\' title=\'&lt;button class=&quot;primary &quot; onclick= rotate_img(&quot;pic1&quot)  &gt;Rotate image&lt;/button&gt;\'><img src="' + feature.properties.image_2  + '" width="20px" height="20px"></a></td></tr>'
                            str = str + '<tr><td> image_3  </td><td><a href="'+feature.properties.image_3 +'" class=\'example-image-link\' data-lightbox=\'example-set\' title=\'&lt;button class=&quot;primary &quot; onclick= rotate_img(&quot;pic1&quot)  &gt;Rotate image&lt;/button&gt;\'><img src="' + feature.properties.image_3  + '" width="20px" height="20px"></a></td></tr>'
                            str = str + '<tr><td> image_4  </td><td><a href="'+feature.properties.image_4 +'" class=\'example-image-link\' data-lightbox=\'example-set\' title=\'&lt;button class=&quot;primary &quot; onclick= rotate_img(&quot;pic1&quot)  &gt;Rotate image&lt;/button&gt;\'><img src="' + feature.properties.image_4  + '" width="20px" height="20px"></a></td></tr>'
                            str = str + '<tr><td> image_5  </td><td><a href="'+feature.properties.image_5 +'" class=\'example-image-link\' data-lightbox=\'example-set\' title=\'&lt;button class=&quot;primary &quot; onclick= rotate_img(&quot;pic1&quot)  &gt;Rotate image&lt;/button&gt;\'><img src="' + feature.properties.image_5  + '" width="20px" height="20px"></a></td></tr>'
                            str = str + '<tr><td> image_6  </td><td><a href="'+feature.properties.image_6 +'" class=\'example-image-link\' data-lightbox=\'example-set\' title=\'&lt;button class=&quot;primary &quot; onclick= rotate_img(&quot;pic1&quot)  &gt;Rotate image&lt;/button&gt;\'><img src="' + feature.properties.image_6  + '" width="20px" height="20px"></a></td></tr>'
                            str = str + '<tr><td> image_7  </td><td><a href="'+feature.properties.image_7 +'" class=\'example-image-link\' data-lightbox=\'example-set\' title=\'&lt;button class=&quot;primary &quot; onclick= rotate_img(&quot;pic1&quot)  &gt;Rotate image&lt;/button&gt;\'><img src="' + feature.properties.image_7  + '" width="20px" height="20px"></a></td></tr>'
                            str = str + '<tr><td> image_8  </td><td><a href="'+feature.properties.image_8 +'" class=\'example-image-link\' data-lightbox=\'example-set\' title=\'&lt;button class=&quot;primary &quot; onclick= rotate_img(&quot;pic1&quot)  &gt;Rotate image&lt;/button&gt;\'><img src="' + feature.properties.image_8  + '" width="20px" height="20px"></a></td></tr>'
                            str = str + '<tr><td> image_9  </td><td><a href="'+feature.properties.image_9 +'" class=\'example-image-link\' data-lightbox=\'example-set\' title=\'&lt;button class=&quot;primary &quot; onclick= rotate_img(&quot;pic1&quot)  &gt;Rotate image&lt;/button&gt;\'><img src="' + feature.properties.image_9  + '" width="20px" height="20px"></a></td></tr>'
                            str = str + '<tr><td> image_10 </td><td><a href="'+feature.properties.image_10+'" class=\'example-image-link\' data-lightbox=\'example-set\' title=\'&lt;button class=&quot;primary &quot; onclick= rotate_img(&quot;pic1&quot)  &gt;Rotate image&lt;/button&gt;\'><img src="' + feature.properties.image_10 + '" width="20px" height="20px"></a></td></tr>'
                            str = str + '</table></div>'
                            layer.bindPopup(str);
                            layer.on('click', function (e) {
                                var dlatlng=[feature.geometry.coordinates[1], feature.geometry.coordinates[0]];
                                current_dropdown_latlng= dlatlng;
                                var did=feature.properties.l2_id;
                                get_dp_and_counts_against_fp_dvid(did)
                            });
                        }
                    }).addTo(SFP_L2)
                }
            }
        });
    }
    function get_MFP_L3_geojson(l3_id){
        $.ajax({
            url: "services/get_MFP_L3_geojson.php?l3_id="+l3_id,
            type: "GET",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function callback(response) {
                if(response==undefined || response==''){
                console.log(response);
                }else{
                MFP_L3=L.geoJSON(response,{
                        pointToLayer: function (feature, latlng) {
                            return L.marker(latlng, {icon: Icon3});
                        },
                        onEachFeature: function (feature, layer) {
                            var str='<div style="height:200px; width:250px; overflow-y:scroll;"><table class="table table-bordered">';
                            str = str + '<tr><td> ID </td><td>' + feature.properties.gid  + '</td></tr>';
                            str = str + '<tr><td> pe_name  </td><td>' + feature.properties.pe_name  + '</td></tr>'
                            str = str + '<tr><td> l1_id  </td><td>' + feature.properties.l1_id  + '</td></tr>'
                            str = str + '<tr><td> l2_id  </td><td>' + feature.properties.l2_id  + '</td></tr>'
                            str = str + '<tr><td> l3_id  </td><td>' + feature.properties.l3_id  + '</td></tr>'
                            str = str + '<tr><td> status  </td><td>' + feature.properties.status  + '</td></tr>'
                            str = str + '<tr><td> pe_fl  </td><td>' + feature.properties.pe_fl  + '</td></tr>'
                            str = str + '<tr><td> tx1_fl  </td><td>' + feature.properties.tx1_fl  + '</td></tr>'
                            str = str + '<tr><td> cd_id  </td><td>' + feature.properties.cd_id  + '</td></tr>' 
                            str = str + '<tr><td> image_1  </td><td><a href="'+feature.properties.image_1 +'" class=\'example-image-link\' data-lightbox=\'example-set\' title=\'&lt;button class=&quot;primary &quot; onclick= rotate_img(&quot;pic1&quot)  &gt;Rotate image&lt;/button&gt;\'><img src="' + feature.properties.image_1  + '" width="20px" height="20px"></a></td></tr>'
                            str = str + '<tr><td> image_2  </td><td><a href="'+feature.properties.image_2 +'" class=\'example-image-link\' data-lightbox=\'example-set\' title=\'&lt;button class=&quot;primary &quot; onclick= rotate_img(&quot;pic1&quot)  &gt;Rotate image&lt;/button&gt;\'><img src="' + feature.properties.image_2  + '" width="20px" height="20px"></a></td></tr>'
                            str = str + '<tr><td> image_3  </td><td><a href="'+feature.properties.image_3 +'" class=\'example-image-link\' data-lightbox=\'example-set\' title=\'&lt;button class=&quot;primary &quot; onclick= rotate_img(&quot;pic1&quot)  &gt;Rotate image&lt;/button&gt;\'><img src="' + feature.properties.image_3  + '" width="20px" height="20px"></a></td></tr>'
                            str = str + '<tr><td> image_4  </td><td><a href="'+feature.properties.image_4 +'" class=\'example-image-link\' data-lightbox=\'example-set\' title=\'&lt;button class=&quot;primary &quot; onclick= rotate_img(&quot;pic1&quot)  &gt;Rotate image&lt;/button&gt;\'><img src="' + feature.properties.image_4  + '" width="20px" height="20px"></a></td></tr>'
                            str = str + '<tr><td> image_5  </td><td><a href="'+feature.properties.image_5 +'" class=\'example-image-link\' data-lightbox=\'example-set\' title=\'&lt;button class=&quot;primary &quot; onclick= rotate_img(&quot;pic1&quot)  &gt;Rotate image&lt;/button&gt;\'><img src="' + feature.properties.image_5  + '" width="20px" height="20px"></a></td></tr>'
                            str = str + '<tr><td> image_6  </td><td><a href="'+feature.properties.image_6 +'" class=\'example-image-link\' data-lightbox=\'example-set\' title=\'&lt;button class=&quot;primary &quot; onclick= rotate_img(&quot;pic1&quot)  &gt;Rotate image&lt;/button&gt;\'><img src="' + feature.properties.image_6  + '" width="20px" height="20px"></a></td></tr>'
                            str = str + '<tr><td> image_7  </td><td><a href="'+feature.properties.image_7 +'" class=\'example-image-link\' data-lightbox=\'example-set\' title=\'&lt;button class=&quot;primary &quot; onclick= rotate_img(&quot;pic1&quot)  &gt;Rotate image&lt;/button&gt;\'><img src="' + feature.properties.image_7  + '" width="20px" height="20px"></a></td></tr>'
                            str = str + '<tr><td> image_8  </td><td><a href="'+feature.properties.image_8 +'" class=\'example-image-link\' data-lightbox=\'example-set\' title=\'&lt;button class=&quot;primary &quot; onclick= rotate_img(&quot;pic1&quot)  &gt;Rotate image&lt;/button&gt;\'><img src="' + feature.properties.image_8  + '" width="20px" height="20px"></a></td></tr>'
                            str = str + '<tr><td> image_9  </td><td><a href="'+feature.properties.image_9 +'" class=\'example-image-link\' data-lightbox=\'example-set\' title=\'&lt;button class=&quot;primary &quot; onclick= rotate_img(&quot;pic1&quot)  &gt;Rotate image&lt;/button&gt;\'><img src="' + feature.properties.image_9  + '" width="20px" height="20px"></a></td></tr>'
                            str = str + '<tr><td> image_10 </td><td><a href="'+feature.properties.image_10+'" class=\'example-image-link\' data-lightbox=\'example-set\' title=\'&lt;button class=&quot;primary &quot; onclick= rotate_img(&quot;pic1&quot)  &gt;Rotate image&lt;/button&gt;\'><img src="' + feature.properties.image_10 + '" width="20px" height="20px"></a></td></tr>'
                            str = str + '</table></div>'
                            layer.bindPopup(str);
                            layer.on('click', function (e) {
                                var dlatlng=[feature.geometry.coordinates[1], feature.geometry.coordinates[0]];
                                current_dropdown_latlng= dlatlng;
                                var did=feature.properties.l3_id;
                                get_dp_and_counts_against_fp_dvid(did)
                            });
                        }
                    }).addTo(MFP_L3)
                }
            }
        });
    }
    function get_demand_point_geojson(lid,phase,fd){
        $.ajax({
            url: "services/get_demand_point_geojson.php?lid="+lid + "&fd_no="+fd+ "&phase=" + phase,
            type: "GET",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function callback(response) {
                console.log(response);
                demand_point=L.geoJSON(JSON.parse(response.geojson),{
                    pointToLayer: function (feature, latlng) {
                        if(feature.properties.phase == "R"){
                            return L.circleMarker(latlng, {
                                radius: 8,
                                fillColor: color1,
                                color: "#000",
                                weight: 1,
                                opacity: 1,
                                fillOpacity: 0.8
                            });
                        }
                        if(feature.properties.phase == "Y"){
                            return L.circleMarker(latlng, {
                                radius: 8,
                                fillColor: color2,
                                color: "#000",
                                weight: 1,
                                opacity: 1,
                                fillOpacity: 0.8
                            });
                        }if(feature.properties.phase == "B"){
                            return L.circleMarker(latlng, {
                                radius: 8,
                                fillColor: color3,
                                color: "#000",
                                weight: 1,
                                opacity: 1,
                                fillOpacity: 0.8
                            });
                        }if(feature.properties.phase == "RYB"){
                            return L.marker(latlng, {icon: ryb});
                        }else{
                            return L.circleMarker(latlng, {
                                radius: 8,
                                fillColor: "white",
                                color: "#000",
                                weight: 1,
                                opacity: 1,
                                fillOpacity: 0.8
                            });
                        }
                    },
                    onEachFeature: function (feature, layer) {
                        var str='<div style="height:200px; width:250px; overflow-y:scroll;"><table class="table table-bordered">';
                        str = str + '<tr><td> ID </td><td>' + feature.properties.gid  + '</td></tr>';
                        str = str + '<tr><td> pe_name  </td><td>' + feature.properties.pe_name  + '</td></tr>'
                        str = str + '<tr><td> cd_id  </td><td>' + feature.properties.cd_id  + '</td></tr>'
                        str = str + '<tr><td> fd_no  </td><td>' + feature.properties.fd_no  + '</td></tr>'
                        str = str + '<tr><td> l1_id  </td><td>' + feature.properties.l1_id  + '</td></tr>'
                        str = str + '<tr><td> l2_id  </td><td>' + feature.properties.l2_id  + '</td></tr>'
                        str = str + '<tr><td> l3_id  </td><td>' + feature.properties.l3_id  + '</td></tr>'
                        str = str + '<tr><td> acc_no  </td><td>' + feature.properties.acc_no  + '</td></tr>'
                        str = str + '<tr><td> address  </td><td>' + feature.properties.address  + '</td></tr>'
                        str = str + '<tr><td> install_id  </td><td>' + feature.properties.install_id  + '</td></tr>'
                        str = str + '<tr><td> meter_type  </td><td>' + feature.properties.meter_type  + '</td></tr>'
                        str = str + '<tr><td> bcrm_eqp  </td><td>' + feature.properties.bcrm_eqp  + '</td></tr>'
                        str = str + '<tr><td> site_eqp  </td><td>' + feature.properties.site_eqp  + '</td></tr>'
                        str = str + '<tr><td> phase  </td><td>' + feature.properties.phase  + '</td></tr>'
                        str = str + '<tr><td> image_1 </td><td><a href="'+feature.properties.images +'" class=\'example-image-link\' data-lightbox=\'example-set\' title=\'&lt;button class=&quot;primary &quot; onclick= rotate_img(&quot;pic1&quot)  &gt;Rotate image&lt;/button&gt;\'><img src="' + feature.properties.images  + '" width="20px" height="20px"></a></td></tr>'
                        str = str + '<tr><td> image_2  </td><td><a href="'+feature.properties.image2 +'" class=\'example-image-link\' data-lightbox=\'example-set\' title=\'&lt;button class=&quot;primary &quot; onclick= rotate_img(&quot;pic1&quot)  &gt;Rotate image&lt;/button&gt;\'><img src="' + feature.properties.image2  + '" width="20px" height="20px"></a></td></tr>'
                        str = str + '<tr><td> image_3  </td><td><a href="'+feature.properties.image3 +'" class=\'example-image-link\' data-lightbox=\'example-set\' title=\'&lt;button class=&quot;primary &quot; onclick= rotate_img(&quot;pic1&quot)  &gt;Rotate image&lt;/button&gt;\'><img src="' + feature.properties.image3  + '" width="20px" height="20px"></a></td></tr>'
                        str = str + '<tr><td> image_4  </td><td><a href="'+feature.properties.image4 +'" class=\'example-image-link\' data-lightbox=\'example-set\' title=\'&lt;button class=&quot;primary &quot; onclick= rotate_img(&quot;pic1&quot)  &gt;Rotate image&lt;/button&gt;\'><img src="' + feature.properties.image4  + '" width="20px" height="20px"></a></td></tr>'
                        str = str + '<tr><td> image_5  </td><td><a href="'+feature.properties.image5 +'" class=\'example-image-link\' data-lightbox=\'example-set\' title=\'&lt;button class=&quot;primary &quot; onclick= rotate_img(&quot;pic1&quot)  &gt;Rotate image&lt;/button&gt;\'><img src="' + feature.properties.image5  + '" width="20px" height="20px"></a></td></tr>'
                        str = str + '</table></div>'
                        layer.bindPopup(str);

                        layer.on('click', function (e) {
                            // map.removeLayer(line_l1_l2_l3_markers);
                            if (point_polylines_arr !== undefined && point_polylines_arr.length !== 0) {
                                for(var i=0; i<point_polylines_arr.length; i++){
                                    map.removeLayer(point_polylines_arr[i]);
                                }
                            }
                            
                            // map.removeLayer(demand_point)
                            feature_point=layer.toGeoJSON();
                            // console.log(e);
                            // console.log(layer);
                            var darr = Array();
                            darr.push([e.latlng.lat, e.latlng.lng])
                            console.log([feature_point.geometry.coordinates[1], feature_point.geometry.coordinates[0]])
                            if(feature_point.properties.l3_id){
                                var l3_id=feature_point.properties.l3_id
                                $.ajax({
                                    url: "services/get_MFP_L3_geojson.php?l3_id="+l3_id,
                                    type: "GET",
                                    async: false,
                                    dataType: "json",
                                    contentType: "application/json; charset=utf-8",
                                    success: function callback(response) {
                                         // console.log(response);
                                         darr.push([response.features[0].geometry.coordinates[1], response.features[0].geometry.coordinates[0]])
                                        var latlng3=[response.features[0].geometry.coordinates[1], response.features[0].geometry.coordinates[0]]
                                         L.marker(latlng3, {icon: Icont}).addTo(line_l1_l2_l3_markers);
                                     }
                                })
                            }
                            if(feature_point.properties.l2_id){
                                var l2_id=feature_point.properties.l2_id
                                $.ajax({
                                    url: "services/get_SFP_L2_geojson.php?l2_id="+l2_id,
                                    type: "GET",
                                    async: false,
                                    dataType: "json",
                                    contentType: "application/json; charset=utf-8",
                                    success: function callback(response) {
                                        // console.log(response);
                                        darr.push([response.features[0].geometry.coordinates[1], response.features[0].geometry.coordinates[0]])
                                        var latlng2=[response.features[0].geometry.coordinates[1], response.features[0].geometry.coordinates[0]]
                                        L.marker(latlng2, {icon: Icont}).addTo(line_l1_l2_l3_markers);
                                    }
                                })
                            }
							if(feature_point.properties.l1_id){
                                var l1_id=feature_point.properties.l1_id
                                $.ajax({
                                    url: "services/get_lvdb_l1_geojson.php?l1_id="+l1_id,
                                    type: "GET",
                                    async: false,
                                    dataType: "json",
                                    contentType: "application/json; charset=utf-8",
                                    success: function callback(response) {
                                        // console.log(response);
                                        darr.push([response.features[0].geometry.coordinates[1], response.features[0].geometry.coordinates[0]])
                                        var latlng1=[response.features[0].geometry.coordinates[1], response.features[0].geometry.coordinates[0]]
                                        L.marker(latlng1, {icon: Icont}).addTo(line_l1_l2_l3_markers);
                                        // console.log([response.features[0].geometry.coordinates[1], response.features[0].geometry.coordinates[0]])

                                    }
                                })
                            }
							
							
                            setTimeout(function(){ 
                                // var polyline = L.polyline(arr, {color: 'white', weight: '8'}).addTo(map);
                                var polyline = L.polyline(darr);
                                // console.log(darr)
                                setPolylineColors(polyline,linescolor)
                                line_l1_l2_l3_markers.addTo(map);
                                // point_polylines_arr.push(polyline);
                             }, 400);
                            
                            
                        });
                    }
                }).addTo(demand_point)
            }
        });
    }
       
       
}, 2000);
});
//-----------add remove geojson----------  
function addRemoveLayer(name){
    if(name=='lvdb_l1'){
            var ckb = $("#lvdb_l1").is(':checked');
            if(ckb==true){
                map.addLayer(lvdb_l1)
            }else{
                 map.removeLayer(lvdb_l1)
            }
        }

    if(name=='SFP_L2'){
        var ckb = $("#SFP_L2").is(':checked');
        if(ckb==true){
        
            map.addLayer(SFP_L2)
        }else{
            map.removeLayer(SFP_L2)
        }
    }
    if(name=='MFP_L3'){
        var ckb = $("#MFP_L3").is(':checked');
        if(ckb==true){
        
            map.addLayer(MFP_L3)
        }else{
            map.removeLayer(MFP_L3)
        }
    }

    if(name=='demand_point'){
        var ckb = $("#demand_point").is(':checked');
        if(ckb==true){
        
            map.addLayer(demand_point)
        }else{
            if (point_polylines_arr !== undefined && point_polylines_arr.length !== 0) {
                for(var i=0; i<point_polylines_arr.length; i++){
                    map.removeLayer(point_polylines_arr[i])
                }
            }
            map.removeLayer(demand_point)
        }
    }
}


//-----------on change fp dropdown----------  


$('select[name="sfp"]').on('change',function(e){
    var l1_id= $(this).val();
    var spl1id=l1_id.split(',');
    spl2id=spl1id[1].split('-');
    map.setView([spl2id[1],spl2id[0]],19);
          $("#sred").text('');
        $("#syellow").text('');
        $("#sblue").text('');
        $("#tryb").text('');
        $("#total_count").text('');
    fillDropDowns(spl1id[0],'mfp')
    $('#fd_details_div').show();
    current_dropdown_Lid=spl1id[0];
    current_dropdown_latlng=[spl2id[1],spl2id[0]];


    // e.preventDefault();
    // var l2id= $(this).val();
    // fillDropDowns(l2id,'mfp')
    // $("#sred").text('');
    // $("#syellow").text('');
    // $("#sblue").text('');
    // $("#tryb").text('');
    // $("#total_count").text('');

    // $('#fd_details_div').show();

    // current_dropdown_Lid=l2id;
    // get_dp_and_counts_against_dvid(l2id);
});
$('select[name="mfp"]').on('change',function(e){
    var l1_id= $(this).val();
    var spl1id=l1_id.split(',');
    spl2id=spl1id[1].split('-');
    map.setView([spl2id[1],spl2id[0]],19);
          $("#sred").text('');
        $("#syellow").text('');
        $("#sblue").text('');
        $("#tryb").text('');
        $("#total_count").text('');
    fillDropDowns(spl1id[0],'mfp')
    $('#fd_details_div').show();
    current_dropdown_Lid=spl1id[0];
    current_dropdown_latlng=[spl2id[1],spl2id[0]];

    e.preventDefault();
    var l3id= $(this).val();
    $("#sred").text('');
    $("#syellow").text('');
    $("#sblue").text('');
    $("#tryb").text('');
    $("#total_count").text('');
    // just blank show fd_details_div
    $('#fd_details_div').show();

    current_dropdown_Lid=l3id;
    get_dp_and_counts_against_dvid(l3id);
    
});


// now filling color and values to fd_details_div
$('.countdiv').on('click',function(){
    var phase_val = $(this).attr("id");
            // console.log(phase_val)
            if(phase_val=="R"){
                $('.fd_p').css({'background': '#EF5350'});
            }
            if(phase_val=="Y"){
                $('.fd_p').css({'background': '#FFC107'});
            }
            if(phase_val=="B"){
                $('.fd_p').css({'background': '#007BFF'});
            }
            if(phase_val=="RYB"){
                $('.fd_p').css({'background': '#7d26cd'});
            }

    $.ajax({
        url : 'services/get_fd_counts.php?phase='+phase_val + "&lid=" + current_dropdown_Lid,
        type : "GET",
        success:function(d){
            console.log(d);
            var data = JSON.parse(d);
            console.log(data);
            for(var j=1;j<=12;j++){
                $("#fd_"+j).text(0);  
            }
            for(var i=0; i<data.length; i++){ 
                $("#fd_"+data[i].fd_no).text(data[i].count);
            }
            current_phase_val=phase_val;
        }
    });
});

$('.fd_p').on('click',function(){
    var id = $(this).attr("id");
    var fd_no=id.replace("fd_p", "");

    // map.removeLayer(demand_point)
    // console.log(current_phase_val+','+fd_no)
    $.ajax({
        url: "services/get_demand_point_geojson.php?lid="+current_dropdown_Lid + "&fd_no=" + fd_no+ "&phase=" + current_phase_val,
        type: "GET",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function callback(response) {
            console.log(response)
            drawlines_against_fp_geojson(response)
        }
    });
});


function get_dp_and_counts_against_fp_dvid(did){
    $("#sred").text('0');
    $("#syellow").text('0');
    $("#sblue").text('0');
    $("#tryb").text('0');
    $("#total_count").text('0');
    $.ajax({
        url: "services/get_demand_point_geojson.php?lid="+did + "&fd_no=%"+ "&phase=%",
        type: "GET",
        dataType: "json",
        async: false,
        contentType: "application/json; charset=utf-8",
        success: function callback(response) {

            drawlines_against_fp_geojson(response)
        }
    });
    $.ajax({
        url: "services/get_total_counts_values.php?lid="+did,
        type: "GET",
        dataType: "json",
        async: false,
        //data: JSON.stringify(geom,layer.geometry),
        contentType: "application/json; charset=utf-8",
        success: function callback(response) {
          $("#sred").text(response.Rsingle[0]["count"]);
          $("#syellow").text(response.Ysingle[0]["count"]);
          $("#sblue").text(response.Bsingle[0]["count"]);
          $("#tryb").text(response.RYBthree[0]["count"]);
          $("#total_count").text(Number(response.Rsingle[0]["count"])+Number(response.Ysingle[0]["count"])+Number(response.Bsingle[0]["count"])+Number(response.RYBthree[0]["count"]));

        }
    });
}

function drawlines_against_fp_geojson(response){
    

    if (point_polylines_arr !== undefined && point_polylines_arr.length !== 0) {
        for(var i=0; i<point_polylines_arr.length; i++){
            map.removeLayer(point_polylines_arr[i])
        }
    }

    if (filter_polylines_arr.length !== 0) {
        for(var i=0; i<filter_polylines_arr.length; i++){
            map.removeLayer(filter_polylines_arr[i])
        }
    }
    filter_polylines_arr=[];
    point_polylines_arr=[];
    // map.removeLayer(demand_point)
    console.log(JSON.parse(response.geojson));
    demand_point=L.geoJSON(JSON.parse(response.geojson),{

        pointToLayer: function (feature, latlng) {
            let arr = Array();
            arr.push(current_dropdown_latlng);
            arr.push(latlng);
            var polyline = L.polyline(arr, {color: 'red'});
            filter_polylines_arr.push(polyline);

            if (filter_polylines_arr !== undefined && filter_polylines_arr.length !== 0) {
                for(var i=0; i<filter_polylines_arr.length; i++){
                    map.addLayer(filter_polylines_arr[i])
                    $('#clearlinesbtn').show();
                }
            }
        
            if(feature.properties.phase == "R"){
                return L.circleMarker(latlng, {
                    radius: 8,
                    fillColor: color1,
                    color: "#000",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                });
            }
            if(feature.properties.phase == "Y"){
                return L.circleMarker(latlng, {
                    radius: 8,
                    fillColor: color2,
                    color: "#000",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                });
            }if(feature.properties.phase == "B"){
                return L.circleMarker(latlng, {
                    radius: 8,
                    fillColor: color3,
                    color: "#000",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                });
            }if(feature.properties.phase == "RYB"){
                return L.marker(latlng, {icon: ryb});
            }else{
                return L.circleMarker(latlng, {
                    radius: 8,
                    fillColor: "black",
                    color: "#000",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                });
            }
        },
        onEachFeature: function (feature, layer) {

            var str='<div style="height:200px; width:250px; overflow-y:scroll;"><table class="table table-bordered">';
            str = str + '<tr><td> ID </td><td>' + feature.properties.gid  + '</td></tr>';
            str = str + '<tr><td> pe_name  </td><td>' + feature.properties.pe_name  + '</td></tr>'
            str = str + '<tr><td> cd_id  </td><td>' + feature.properties.cd_id  + '</td></tr>'
            str = str + '<tr><td> fd_no  </td><td>' + feature.properties.fd_no  + '</td></tr>'
            str = str + '<tr><td> l1_id  </td><td>' + feature.properties.l1_id  + '</td></tr>'
            str = str + '<tr><td> l2_id  </td><td>' + feature.properties.l2_id  + '</td></tr>'
            str = str + '<tr><td> l3_id  </td><td>' + feature.properties.l3_id  + '</td></tr>'
            str = str + '<tr><td> acc_no  </td><td>' + feature.properties.acc_no  + '</td></tr>'
            str = str + '<tr><td> address  </td><td>' + feature.properties.address  + '</td></tr>'
            str = str + '<tr><td> install_id  </td><td>' + feature.properties.install_id  + '</td></tr>'
            str = str + '<tr><td> meter_type  </td><td>' + feature.properties.meter_type  + '</td></tr>'
            str = str + '<tr><td> bcrm_eqp  </td><td>' + feature.properties.bcrm_eqp  + '</td></tr>'
            str = str + '<tr><td> site_eqp  </td><td>' + feature.properties.site_eqp  + '</td></tr>'
            str = str + '<tr><td> phase  </td><td>' + feature.properties.phase  + '</td></tr>'
            str = str + '<tr><td> image_1 </td><td><a href="'+feature.properties.images +'" class=\'example-image-link\' data-lightbox=\'example-set\' title=\'&lt;button class=&quot;primary &quot; onclick= rotate_img(&quot;pic1&quot)  &gt;Rotate image&lt;/button&gt;\'><img src="' + feature.properties.images  + '" width="20px" height="20px"></a></td></tr>'
            str = str + '<tr><td> image_2  </td><td><a href="'+feature.properties.image2 +'" class=\'example-image-link\' data-lightbox=\'example-set\' title=\'&lt;button class=&quot;primary &quot; onclick= rotate_img(&quot;pic1&quot)  &gt;Rotate image&lt;/button&gt;\'><img src="' + feature.properties.image2  + '" width="20px" height="20px"></a></td></tr>'
            str = str + '<tr><td> image_3  </td><td><a href="'+feature.properties.image3 +'" class=\'example-image-link\' data-lightbox=\'example-set\' title=\'&lt;button class=&quot;primary &quot; onclick= rotate_img(&quot;pic1&quot)  &gt;Rotate image&lt;/button&gt;\'><img src="' + feature.properties.image3  + '" width="20px" height="20px"></a></td></tr>'
            str = str + '<tr><td> image_4  </td><td><a href="'+feature.properties.image4 +'" class=\'example-image-link\' data-lightbox=\'example-set\' title=\'&lt;button class=&quot;primary &quot; onclick= rotate_img(&quot;pic1&quot)  &gt;Rotate image&lt;/button&gt;\'><img src="' + feature.properties.image4  + '" width="20px" height="20px"></a></td></tr>'
            str = str + '<tr><td> image_5  </td><td><a href="'+feature.properties.image5 +'" class=\'example-image-link\' data-lightbox=\'example-set\' title=\'&lt;button class=&quot;primary &quot; onclick= rotate_img(&quot;pic1&quot)  &gt;Rotate image&lt;/button&gt;\'><img src="' + feature.properties.image5  + '" width="20px" height="20px"></a></td></tr>'
            str = str + '</table></div>'
            layer.bindPopup(str);

            layer.on('click', function (e) {
                if (point_polylines_arr !== undefined && point_polylines_arr.length !== 0) {
                    for(var i=0; i<point_polylines_arr.length; i++){
                        map.removeLayer(point_polylines_arr[i]);
                    }
                }
                
                // map.removeLayer(demand_point)
                feature_point=layer.toGeoJSON();
                // console.log(feature_point);
                let arr = Array();
                arr.push([e.latlng.lat, e.latlng.lng])
                if(feature_point.properties.l3_id){
                    var l3_id=feature_point.properties.l3_id
                    $.ajax({
                        url: "services/get_MFP_L3_geojson.php?l3_id="+l3_id,
                        type: "GET",
                        async: false,
                        dataType: "json",
                        contentType: "application/json; charset=utf-8",
                        success: function callback(response) {
                             // console.log(response);
                             arr.push([response.features[0].geometry.coordinates[1], response.features[0].geometry.coordinates[0]])
                            var latlng3=[response.features[0].geometry.coordinates[1], response.features[0].geometry.coordinates[0]]
                             L.marker(latlng3, {icon: Icont}).addTo(line_l1_l2_l3_markers);
                         }
                    })
                }
                if(feature_point.properties.l2_id){
                    var l2_id=feature_point.properties.l2_id
                    $.ajax({
                        url: "services/get_SFP_L2_geojson.php?l2_id="+l2_id,
                        type: "GET",
                        async: false,
                        dataType: "json",
                        contentType: "application/json; charset=utf-8",
                        success: function callback(response) {
                            // console.log(response);
                            arr.push([response.features[0].geometry.coordinates[1], response.features[0].geometry.coordinates[0]])
                            var latlng2=[response.features[0].geometry.coordinates[1], response.features[0].geometry.coordinates[0]]
                            L.marker(latlng2, {icon: Icont}).addTo(line_l1_l2_l3_markers);
                        }
                    })
                }
                if(feature_point.properties.l1_id){
                    var l1_id=feature_point.properties.l1_id
                    $.ajax({
                        url: "services/get_lvdb_l1_geojson.php?l1_id="+l1_id,
                        type: "GET",
                        async: false,
                        dataType: "json",
                        contentType: "application/json; charset=utf-8",
                        success: function callback(response) {
                            // console.log(response);
                            arr.push([response.features[0].geometry.coordinates[1], response.features[0].geometry.coordinates[0]])
                            var latlng1=[response.features[0].geometry.coordinates[1], response.features[0].geometry.coordinates[0]]
                            L.marker(latlng1, {icon: Icont}).addTo(line_l1_l2_l3_markers);
                        }
                    })
                }
                
                
                setTimeout(function(){ 
                    // var polyline = L.polyline(arr, {color: 'white', weight: '8'}).addTo(map);
                    var polyline = L.polyline(arr);
                    setPolylineColors(polyline,linescolor)
                    line_l1_l2_l3_markers.addTo(map);
                    // point_polylines_arr.push(polyline);
                 }, 400);
            });
            
        }
        
    }).addTo(demand_point)

    demand_point.addTo(map);
  
}



function setPolylineColors(line,colors){
  
    var latlngs = line.getLatLngs();
  
  latlngs.forEach(function(latlng, idx){
          if(idx+1 < latlngs.length ){
           var polyline =  L.polyline([latlng,latlngs[idx+1]],{color: colors[idx]}).addTo(map);
           point_polylines_arr.push(polyline);
           $('#clearlinesbtn').show();
       }
  })
}





// function get_dp_and_counts_against_dvid(lid){
//     $.ajax({
//         url: "services/get_demand_point_geojson.php?lid="+lid + "&fd_no=%"+ "&phase=%",
//         type: "GET",
//         dataType: "json",
//         async: false,
//         contentType: "application/json; charset=utf-8",
//         success: function callback(response) {

//             drawlines_against_geojson(response)
//         }
//     });
//     $.ajax({
//         url: "services/get_total_counts_values.php?lid="+lid,
//         type: "GET",
//         dataType: "json",
//         async: false,
//         //data: JSON.stringify(geom,layer.geometry),
//         contentType: "application/json; charset=utf-8",
//         success: function callback(response) {
//           $("#sred").text(response.Rsingle[0]["count"]);
//           $("#syellow").text(response.Ysingle[0]["count"]);
//           $("#sblue").text(response.Bsingle[0]["count"]);
//           $("#tryb").text(response.RYBthree[0]["count"]);

//         }
//     });
// }

// function drawlines_against_geojson(response){

//     if (point_polylines_arr !== undefined && point_polylines_arr.length !== 0) {
//         for(var i=0; i<point_polylines_arr.length; i++){
//             map.removeLayer(point_polylines_arr[i])
//         }
//     }
    
//     // map.removeLayer(polyline)
//     if (filter_polylines_arr.length !== 0) {
//         for(var i=0; i<filter_polylines_arr.length; i++){
//             map.removeLayer(filter_polylines_arr[i])
//         }
//     }
//     filter_polylines_arr=[];

//     if(response.incoming){
//         var incoming=response.incoming[0];
//     }

//     map.removeLayer(demand_point)
//     // map.removeLayer(line_l1_l2_l3_markers)
//     demand_point=L.geoJSON(JSON.parse(response.geojson),{
//         pointToLayer: function (feature, latlng) {
//             feature_point=feature;
//             let arr = Array();
//             if(feature_point.properties.l3_id){
//                 var l3_id=feature_point.properties.l3_id
//                 $.ajax({
//                     url: "services/get_MFP_L3_geojson.php?l3_id="+l3_id,
//                     type: "GET",
//                     async: false,
//                     dataType: "json",
//                     contentType: "application/json; charset=utf-8",
//                     success: function callback(response) {
//                          // console.log(response);
//                         //  arr.push([response.features[0].geometry.coordinates[1], response.features[0].geometry.coordinates[0]])
//                          var latlng3=[response.features[0].geometry.coordinates[1], response.features[0].geometry.coordinates[0]]
//                          arr.push(latlng3);
//                          //  L.marker(latlng3, {icon: Icon3}).addTo(line_l1_l2_l3_markers);
//                          map.setView(latlng3, 18);
//                      }
//                 })
//             }
//             if(feature_point.properties.l2_id){
//                 var l2_id=feature_point.properties.l2_id
//                 $.ajax({
//                     url: "services/get_SFP_L2_geojson.php?l2_id="+l2_id,
//                     type: "GET",
//                     async: false,
//                     dataType: "json",
//                     contentType: "application/json; charset=utf-8",
//                     success: function callback(response) {
//                         // console.log(response);
//                         // arr.push([response.features[0].geometry.coordinates[1], response.features[0].geometry.coordinates[0]])
//                         var latlng2=[response.features[0].geometry.coordinates[1], response.features[0].geometry.coordinates[0]]
//                         arr.push(latlng2);
//                         // L.marker(latlng2, {icon: Icon2}).addTo(line_l1_l2_l3_markers);
//                         map.setView(latlng2, 18);
//                     }
//                 })
//             }
//             if(feature_point.properties.l1_id){
//                 var l1_id=feature_point.properties.l1_id
//                 $.ajax({
//                     url: "services/get_lvdb_l1_geojson.php?l1_id="+l1_id,
//                     type: "GET",
//                     async: false,
//                     dataType: "json",
//                     contentType: "application/json; charset=utf-8",
//                     success: function callback(response) {
//                         // console.log(response);
//                         // arr.push([response.features[0].geometry.coordinates[1], response.features[0].geometry.coordinates[0]])
//                         var latlng1=[response.features[0].geometry.coordinates[1], response.features[0].geometry.coordinates[0]]
//                         arr.push(latlng1);
//                         // L.marker(latlng1, {icon: Icon1}).addTo(line_l1_l2_l3_markers);
//                         map.setView(latlng1, 18);
//                     }
//                 })
//             }
//             arr.push(latlng);
//             var polyline = L.polyline(arr, {color: 'red'});
//             filter_polylines_arr.push(polyline);

//             if (filter_polylines_arr !== undefined && filter_polylines_arr.length !== 0) {
//                 for(var i=0; i<filter_polylines_arr.length; i++){
//                     map.addLayer(filter_polylines_arr[i])
//                 }
//             }

//             // line_l1_l2_l3_markers.addTo(map);
            
//             // setTimeout(function(){ 
//             //     var polyline = L.polyline(arr);
//             //     setPolylineColors(polyline,['yellow','pink','green'])
//             //     line_l1_l2_l3_markers.addTo(map);
               
//             //  }, 400);
        
        
//             if(feature.properties.phase == "R"){
//                 return L.circleMarker(latlng, {
//                     radius: 8,
//                     fillColor: "red",
//                     color: "#000",
//                     weight: 1,
//                     opacity: 1,
//                     fillOpacity: 0.8
//                 });
//             }
//             if(feature.properties.phase == "Y"){
//                 return L.circleMarker(latlng, {
//                     radius: 8,
//                     fillColor: "yellow",
//                     color: "#000",
//                     weight: 1,
//                     opacity: 1,
//                     fillOpacity: 0.8
//                 });
//             }if(feature.properties.phase == "B"){
//                 return L.circleMarker(latlng, {
//                     radius: 8,
//                     fillColor: "blue",
//                     color: "#000",
//                     weight: 1,
//                     opacity: 1,
//                     fillOpacity: 0.8
//                 });
//             }if(feature.properties.phase == "RYB"){
//                 return L.marker(latlng, {icon: ryb});
//             }else{
//                 return L.circleMarker(latlng, {
//                     radius: 8,
//                     fillColor: "black",
//                     color: "#000",
//                     weight: 1,
//                     opacity: 1,
//                     fillOpacity: 0.8
//                 });
//             }
//         },
//         onEachFeature: function (feature, layer) {

//             if(current_dropdown_Lid !='a111' && current_dropdown_Lid !='a222'){
//                 var str='<div style="height:200px; width:250px; overflow-y:scroll;"><table class="table table-bordered">';
//                 str = str + '<tr><td> ID </td><td>' + feature.properties.gid  + '</td></tr>';
//                 str = str + '<tr><td> pe_name  </td><td>' + feature.properties.pe_name  + '</td></tr>'
//                 str = str + '<tr><td> cd_id  </td><td>' + feature.properties.cd_id  + '</td></tr>'
//                 str = str + '<tr><td> fd_no  </td><td>' + feature.properties.fd_no  + '</td></tr>'
//                 str = str + '<tr><td> l1_id  </td><td>' + feature.properties.l1_id  + '</td></tr>'
//                 str = str + '<tr><td> l2_id  </td><td>' + feature.properties.l2_id  + '</td></tr>'
//                 str = str + '<tr><td> l3_id  </td><td>' + feature.properties.l3_id  + '</td></tr>'
//                 // str = str + '<tr><td> lvf1_fd  </td><td>' + incoming.lvf1_fd  + '</td></tr>'
//                 // str = str + '<tr><td> lvf2_fd  </td><td>' + incoming.lvf2_fd  + '</td></tr>'
//                 str = str + '<tr><td> image  </td><td><a href="'+feature.properties.images +'" class=\'example-image-link\' data-lightbox=\'example-set\' title=\'&lt;button class=&quot;primary &quot; onclick= rotate_img(&quot;pic1&quot)  &gt;Rotate image&lt;/button&gt;\'><img src="' + feature.properties.images  + '" width="20px" height="20px"></a></td></tr>'
//                 str = str + '</table></div>'
//                 layer.bindPopup(str);
//             }
//             else{
//                 var str='<div style="height:200px; width:250px; overflow-y:scroll;"><table class="table table-bordered">';
//                 str = str + '<tr><td> ID </td><td>' + feature.properties.gid  + '</td></tr>';
//                 str = str + '<tr><td> pe_name  </td><td>' + feature.properties.pe_name  + '</td></tr>'
//                 str = str + '<tr><td> cd_id  </td><td>' + feature.properties.cd_id  + '</td></tr>'
//                 str = str + '<tr><td> fd_no  </td><td>' + feature.properties.fd_no  + '</td></tr>'
//                 str = str + '<tr><td> l1_id  </td><td>' + feature.properties.l1_id  + '</td></tr>'
//                 str = str + '<tr><td> l2_id  </td><td>' + feature.properties.l2_id  + '</td></tr>'
//                 str = str + '<tr><td> l3_id  </td><td>' + feature.properties.l3_id  + '</td></tr>'
//                 str = str + '<tr><td> image  </td><td><a href="'+feature.properties.images +'" class=\'example-image-link\' data-lightbox=\'example-set\' title=\'&lt;button class=&quot;primary &quot; onclick= rotate_img(&quot;pic1&quot)  &gt;Rotate image&lt;/button&gt;\'><img src="' + feature.properties.images  + '" width="20px" height="20px"></a></td></tr>'
//                 str = str + '</table></div>'
//                 layer.bindPopup(str);
//             }
			
//             layer.on('click', function (e) {
//                 map.removeLayer(line_l1_l2_l3_markers);
//                 if (point_polylines_arr !== undefined && point_polylines_arr.length !== 0) {
//                     for(var i=0; i<point_polylines_arr.length; i++){
//                         map.removeLayer(point_polylines_arr[i]);
//                     }
//                 }
                
//                 // map.removeLayer(demand_point)
//                 feature_point=layer.toGeoJSON();
//                 // console.log(feature_point);
//                 let arr = Array();
//                 arr.push([feature_point.geometry.coordinates[0][1], feature_point.geometry.coordinates[0][0]])
//                 if(feature_point.properties.l3_id){
//                     var l3_id=feature_point.properties.l3_id
//                     $.ajax({
//                         url: "services/get_MFP_L3_geojson.php?l3_id="+l3_id,
//                         type: "GET",
//                         async: false,
//                         dataType: "json",
//                         contentType: "application/json; charset=utf-8",
//                         success: function callback(response) {
//                                 // console.log(response);
                           
//                                 arr.push([response.features[0].geometry.coordinates[1], response.features[0].geometry.coordinates[0]])
//                                 var latlng3=[response.features[0].geometry.coordinates[1], response.features[0].geometry.coordinates[0]]
//                              L.marker(latlng3, {icon: Icon3}).addTo(line_l1_l2_l3_markers);
//                          }
//                     })
//                 }
//                 if(feature_point.properties.l2_id){
//                     var l2_id=feature_point.properties.l2_id
//                     $.ajax({
//                         url: "services/get_SFP_L2_geojson.php?l2_id="+l2_id,
//                         type: "GET",
//                         async: false,
//                         dataType: "json",
//                         contentType: "application/json; charset=utf-8",
//                         success: function callback(response) {
                          
//                             arr.push([response.features[0].geometry.coordinates[1], response.features[0].geometry.coordinates[0]])
//                             var latlng2=[response.features[0].geometry.coordinates[1], response.features[0].geometry.coordinates[0]]
//                             L.marker(latlng2, {icon: Icon2}).addTo(line_l1_l2_l3_markers);
//                         }
//                     })
//                 }
//                 if(feature_point.properties.l1_id){
//                     var l1_id=feature_point.properties.l1_id
//                     $.ajax({
//                         url: "services/get_lvdb_l1_geojson.php?l1_id="+l1_id,
//                         type: "GET",
//                         async: false,
//                         dataType: "json",
//                         contentType: "application/json; charset=utf-8",
//                         success: function callback(response) {
//                             // console.log(response);
                           
//                             arr.push([response.features[0].geometry.coordinates[1], response.features[0].geometry.coordinates[0]])
//                             var latlng1=[response.features[0].geometry.coordinates[1], response.features[0].geometry.coordinates[0]]
//                             L.marker(latlng1, {icon: Icon1}).addTo(line_l1_l2_l3_markers);
//                         }
//                     })
//                 }
                
                
//                 setTimeout(function(){ 
//                     var polyline = L.polyline(arr);
//                     setPolylineColors(polyline,['yellow','pink','green'])
//                     // line_l1_l2_l3_markers.addTo(map);
                   
//                  }, 400);

                
                
//             });
            
//         }
        
//     }).addTo(demand_point)

//     demand_point.addTo(map);
  
// }








// function retur_nmarker_and_color(latlng, color) {
//     return L.circleMarker(latlng, {
//         radius: 8,
//         fillColor: color,
//         color: "#000",
//         weight: 1,
//         opacity: 1,
//         fillOpacity: 0.8
//     });
// }

// if(feature.properties.phase == "R"){
//     var color="R"
//     retur_nmarker_and_color(latlng, color)
// }if(feature.properties.phase == "Y"){
//     var color="Y"
//     retur_nmarker_and_color(latlng, color)
// }if(feature.properties.phase == "B"){
//     var color="B"
//     retur_nmarker_and_color(latlng, color)
// }if(feature.properties.phase == "RYB"){
//     var color="RYB"
//     retur_nmarker_and_color(latlng, color)
// }else{
//     var color="white"
//     retur_nmarker_and_color(latlng, color)
// }

// $('#filterbtn').on('click',function(){

//     var fdatarr={
//             // page: page,
//             phase_color: $('#phase_color').val(),
//             fp: $('#fp').val(),
//             sfp: $('#sfp').val(),
//             mfp: $('#mfp').val(),
//         };
//             console.log(fdatarr)
//     $.ajax({
//         url : 'services/filterdata.php?fdatarr='+JSON.stringify(fdatarr),
//         type : "GET",
//         success:function(data){
//             console.log(data);
//         }
//     });
// });




// $('select[name="phase_color"]').on('change',function(e){
//     e.preventDefault();
//     var phase_color= $(this).val();
//     // console.log(phase_color);
//     if(phase_color)
//     {
//         $.ajax({
//             url : 'services/get_fp_device_ids.php?phase_color='+phase_color,
//             type : "GET",
//             dataType : "json",
//             success:function(data){
//                 console.log(data);
//                 $('select[name="fp"]').empty();
//                 for(var i=0;i<data.length;i++){
//                     $('select[name="fp"]').append('<option value="'+ data[i].device_id +'">'+ data[i].device_id +'</option>');
//                 }
//             }
//         });
//     }
//     else
//     {
//         $('select[name="fp"]').empty();
//     }
// });

function exportExcel(){
    $.ajax({
        url : 'services/lib/create_excel.php',
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






