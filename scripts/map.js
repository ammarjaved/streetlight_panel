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
var phase_val="";

   
    var street   = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'),
    dark  = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png'),
    googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
        maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3']
    });
	

    grid = L.tileLayer.wms("http://121.121.232.54:7090/geoserver/cite/wms", {
        layers: 'cite:5x5_sub_grid',
        format: 'image/png',
        maxZoom: 21,
        transparent: true
    }, {buffer: 10});

    boundary = L.tileLayer.wms("http://121.121.232.54:7090/geoserver/cite/wms", {
            layers: 'cite:boundary_bangi_east_',
            format: 'image/png',
            maxZoom: 21,
            transparent: true
        }, {buffer: 10});
    
  
    dp_panel = L.tileLayer.wms("http://121.121.232.54:7090/geoserver/TNB/wms", {
            layers: 'TNB:demand_point_panel',
            format: 'image/png',
            maxZoom: 21,
            transparent: true
        }, {buffer: 10});
        
    light_panel = L.tileLayer.wms("http://121.121.232.54:7090/geoserver/TNB/wms", {
            layers: '	TNB:stree_light_panel',
            format: 'image/png',
            maxZoom: 21,
            transparent: true
        }, {buffer: 10});    
        poles_panel = L.tileLayer.wms("http://121.121.232.54:7090/geoserver/TNB/wms", {
            layers: 'TNB:poles_panel',
            format: 'image/png',
            maxZoom: 21,
            transparent: true
        }, {buffer: 10});    

        
    var map = L.map('map_div', {
        center: [3.016603, 101.858382],
        // center: [31.5204, 74.3587],
        zoom: 12,
        layers: [googleSat,grid,boundary,dp_panel,light_panel,poles_panel],
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
          //  console.log(data)
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
function getProperties(layer1){
    var layer=''
    if(layer1=='dp_panel'){
        layer=dp_panel;
    }
    if(layer1=='light_panel'){
        layer=light_panel;
    }
    map.off('click');
    map.on('click', function(e) {
       // map.off('click');

        // Build the URL for a GetFeatureInfo
        var url = getFeatureInfoUrl(
            map,
            layer,
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
               console.log(data.features[0].properties.device_id)
                if(layer1=='dp_panel') {
                    getdpxy(data.features[0].properties.device_id, data.features[0].geometry.coordinates[0], data.features[0].geometry.coordinates[1])
                }else{
                    getAllDemandpoints1(data.features[0].properties.dmd_pnt_id)
                }
            }
        });
      //  $('#nonsurvedmodal').modal('show');
       // activeSelectedLayerPano();
    });
    
}

        

var baseLayers = {
    "Street": street,
    "Satellite": googleSat,
    "Dark": dark,
};

var overlays = {
    "5x5 Grid":grid,
    "boundry":boundary,
     "demand point":dp_panel,
     "poles":poles_panel,
     "street light":light_panel,
   
};

L.control.layers(baseLayers, overlays).addTo(map);






function fillCounts(){
    
    $.ajax({
        url: "services/get_counts_values.php",
        type: "GET",
        dataType: "json",
        //data: JSON.stringify(geom,layer.geometry),
        contentType: "application/json; charset=utf-8",
        success: function callback(data) {
            // var r=JSON.parse(response)
              
                 $("#tryb").text(data.total[0].count);
           
                 $("#sred").text(data.led[0].count);
           
                 $("#syellow").text(data.sodium[0].count);
            
                 $("#sblue").text(data.watt[0].sum);
           
            //   }
            }     
    });
}


function getAllDemandpoints(){
    
    $.ajax({
        url: "services/get_all_dp.php",
        type: "GET",
        dataType: "json",
        //data: JSON.stringify(geom,layer.geometry),
        contentType: "application/json; charset=utf-8",
        success: function callback(data) {
          // console.log(data)
           var str='';
           for(var i=0;i<data.length;i++){
            
            str=str+'<tr id='+data[i].p_id+' onclick="getdpxy('+"'"+data[i].device_id+"'"+','+data[i].x+','+data[i].y+')">'+'<td>'+data[i].p_id+'</td>'+'<td>'+data[i].house_no+'</td>'+'<td>'+data[i].str_name+'</td>'+'<td>'+data[i].device_id+'</td>'+'<td>'+data[i].remarks+'</td>'+'</tr>';
           }
           $("#dpt").html(str);
           $('#example').DataTable();
           

         

        }     
    });
}

var newMarker1='';
function getAllDemandpoints1(di){

    $.ajax({
        url: "services/get_all_dp1.php?di="+di,
        type: "GET",
        dataType: "json",
        //data: JSON.stringify(geom,layer.geometry),
        contentType: "application/json; charset=utf-8",
        success: function callback(data) {
            console.log(data)
              var y=parseFloat(data[0].y)
            var x=parseFloat(data[0].x)
            map.setView([y, x], 20);
            if (newMarker1 != '') {
                map.removeLayer(newMarker)
            }
            newMarker1 = new L.marker([y, x]).addTo(map);


        }
    });
}


var newMarker='';
var dataLayer='';

function getdpxy(id,x,y){

        map.setView([y, x], 20);
        if (newMarker != '') {
            map.removeLayer(newMarker)
        }
        newMarker = new L.marker([y, x]).addTo(map);

        $.ajax({
            url: "services/strret_lights.php?di=" + id,
            type: "GET",
            dataType: "json",
            //data: JSON.stringify(geom,layer.geometry),
            contentType: "application/json; charset=utf-8",
            success: function callback(data) {
                var myIcon = L.icon({
                    iconUrl: 'images/test.gif',
                    iconSize: [22, 27],
                    iconAnchor: [16, 37],
                    popupAnchor: [0, -28]
                });

                if (dataLayer != '') {
                    map.removeLayer(dataLayer)
                }
                dataLayer = L.geoJson(data, {
                    pointToLayer: function (feature, latlng) {
                        //return L.circleMarker(latlng, geojsonMarkerOptions);
                        console.log(feature)
                        return L.marker(latlng, {icon: myIcon});
                    }
                    ,
                    onEachFeature: function (feature, layer) {

                        layer.bindPopup('<table><tr><td>id</td><td>' + feature.properties.p_id + '</td></tr><tr><td>pole type</td><td>' + feature.properties.pole_type + '</td></tr><tr><td>type</td><td>' + feature.properties.type + '</td></tr> <tr><td>pole number</td><td>' + feature.properties.pole_number + '</td></tr> <tr><td>Watt</td><td>' + feature.properties.watt + '</td></tr> <tr><td>phasing</td><td>' + feature.properties.phasing + '</td></tr></table>');
                    }
                });
                dataLayer.addTo(map);

            }
        });
       // alert(id+x+y);
   
}

function clearAll(){

}

$(document).ready(function(){
    fillCounts();
    //getProperties()
   // getAllDemandpoints();
    
});
//-----------add remove geojson----------  



//-----------on change fp dropdown----------  









