// ==UserScript==
// @name         IngressMosaic KML Exporter
// @namespace    https://github.com/erikchristiansson/im-kml-export/
// @version      0.1.20190927
// @description  Export KML files of mission paths, for import into Google MyMaps
// @author       Erik Christiansson, Sajjen
// @match        https://ingressmosaic.com/mosaic/*
// @match        https://ingressmosaik.com/mosaic/*
// @grant        none
// ==/UserScript==

function save(filename, data) {
    var blob = new Blob([data], {type: 'text/csv'});
    if(window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, filename);
    }
    else{
        var elem = window.document.createElement('a');
        elem.href = window.URL.createObjectURL(blob);
        elem.download = filename;
        document.body.appendChild(elem);
        elem.click();
        document.body.removeChild(elem);
    }
}
function export_kml() {
    var mosaic_name = document.querySelector("#mosaik-id").textContent.trim();

    var kml = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>`;
    kml = kml + mosaic_name + `</name>
    <Style id="line-7CB342-2000-normal">
      <LineStyle>
        <color>ff42b37c</color>
        <width>2</width>
      </LineStyle>
    </Style>
    <Style id="line-7CB342-2000-highlight">
      <LineStyle>
        <color>ff42b37c</color>
        <width>3</width>
      </LineStyle>
    </Style>
    <StyleMap id="line-7CB342-2000">
      <Pair>
        <key>normal</key>
        <styleUrl>#line-7CB342-2000-normal</styleUrl>
      </Pair>
      <Pair>
        <key>highlight</key>
        <styleUrl>#line-7CB342-2000-highlight</styleUrl>
      </Pair>
    </StyleMap>
    <Placemark>
      <name>`;
    kml = kml + mosaic_name + `</name>
      <description>`;
    kml = kml + window.location.href + `</description>
      <styleUrl>#line-7CB342-2000</styleUrl>
      <LineString>
        <tessellate>1</tessellate>
        <coordinates>`;

    for(var i = 0, l = lang_txt_M[4][0].length; i < l; i++) {
        var mission = lang_txt_M[4][0][i];
        for(var wi = 0, wl = mission['data']['waypoints'].length; wi < wl; wi++) {
            var waypoint = mission['data']['waypoints'][wi];
            kml = kml + waypoint['latLng'][1] + "," + waypoint['latLng'][0] + ",0\n";
        }
    }

    kml = kml + `        </coordinates>
      </LineString>
    </Placemark>
  </Document>
</kml>`;
    save(mosaic_name + ".kml", kml);
    return false;
}
(function() {
    'use strict';
    //export_kml();
    var button = document.querySelector("body > div:nth-child(2) > div.hidden-xs.hidden-sm > div > div:nth-child(1)").cloneNode(true);
    button.title = 'Export';
    button.querySelector('a').href = '';
    button.querySelector('a').onclick = export_kml;
    button.querySelector('button').classList.remove('btn-1');
    button.querySelector('button').classList.add('btn-5');
    button.querySelector("button > span").classList.remove('glyphicon-home');
    button.querySelector("button > span").classList.add('glyphicon-floppy-save');
    document.querySelector("body > div:nth-child(2) > div.hidden-xs.hidden-sm > div.btn-group.btn-group-justified").append(button);
})();
