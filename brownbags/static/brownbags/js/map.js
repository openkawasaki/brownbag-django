var LAT = 35.48639282474548;
var LON = 139.59228515625003;

var map = null;
var map_shop = null;
var markers = [];
var markers_shop = [];

function map_init() {
    map = L.map('map').setView([LAT, LON], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    $.getJSON("/static/brownbags/data/kawasaki.geojson", function (data) {
        var style = {
            "color": "#0000ff",
            "weight": 1.0,
            "fillOpacity": 0.0
        };
        L.geoJson(data, {
            style: style
            }).addTo(map);
    });

    $.getJSON("/static/brownbags/data/yokohama.geojson", function (data) {
        var style = {
            "color": "#ff00ff",
            "weight": 1.0,
            "fillOpacity": 0.0
        };
        L.geoJson(data, {
            style: style
            }).addTo(map);
    });

    // Locate
    var option = {
        position: 'topright',
        strings: {
            title: "現在地を表示",
            popup: "いまここ"
        },
        locateOptions: {
            maxZoom: 16
        }
    };
    var lc = L.control.locate(option).addTo(map);

    //クリックイベント
    map.on('click', function(e) {
        //クリック位置経緯度取得
        var lat = e.latlng.lat;
        var lng = e.latlng.lng;
        //経緯度表示
        console.log("lat: " + lat + ", lng: " + lng);
    });
}

function map_show() {
    var items = getShopItems();
    if (items !== null) {
        // アイコンを作成する
        var markerIcon = L.icon({
            iconUrl: '/static/images/marker.png', // アイコン画像のURL
            iconSize:     [20, 28], // アイコンの大きさ
            iconAnchor:   [16, 32], // 画像内でマーカーの位置を指し示す点の位置
            popupAnchor:  [0, -32]  // ポップアップが出現する位置（iconAnchorからの相対位置）
        });

        for (var ii=0; ii<items.length; ii++) {
            var lon   = items[ii]["longitude"];
            var lat   = items[ii]["latitude"];
            var name  = items[ii]["name"];
            var phone = items[ii]["phone"];
            var genre = get_sel_name(GENRE_CLASS, items[ii]["genre_sel"]);

            if (lat !== 0.0 && lon !== 0.0) {
                // 上記で作成したアイコンを使用してマーカーを作成する
                var marker = L.marker([lat, lon], {icon: markerIcon}).addTo(map)
                    .bindPopup('店名：' + name + "<br>" + 'ジャンル：' + genre + "<br>" + '電話：' + phone);

                markers.push(marker);
            }
        }
    }
}

function map_hide() {
    for (var ii=0; ii<markers.length; ii++) {
        var marker = markers[ii];
        map.removeLayer(marker);
    }
    markers = [];
}

function map_info_init() {

    var lat0 = LAT;
    var lon0 = LON;

    map_shop = L.map('info_map').setView([lat0, lon0], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map_shop);

    $.getJSON("/static/brownbags/data/kawasaki.geojson", function (data) {
        var style = {
            "color": "#0000ff",
            "weight": 1.0,
            "fillOpacity": 0.0
        };
        L.geoJson(data, {
            style: style
        }).addTo(map_shop);
    });

    $.getJSON("/static/brownbags/data/yokohama.geojson", function (data) {
        var style = {
            "color": "#ff00ff",
            "weight": 1.0,
            "fillOpacity": 0.0
        };
        L.geoJson(data, {
            style: style
        }).addTo(map_shop);
    });

    // Locate
    var option = {
        position: 'topright',
        strings: {
            title: "現在地を表示",
            popup: "いまここ"
        },
        locateOptions: {
            maxZoom: 16
        }
    };
    var lc = L.control.locate(option).addTo(map_shop);

    //クリックイベント
    map_shop.on('click', function(e) {
        //クリック位置経緯度取得
        var lat = e.latlng.lat;
        var lng = e.latlng.lng;
        //経緯度表示
        console.log("lat: " + lat + ", lng: " + lng);
    });
}

function map_info_show(lat, lon, name) {
    if (lat != 0.0 &&  lon != 0.0) {
        // アイコンを作成する
        var markerIcon = L.icon({
            iconUrl: '/static/images/marker.png', // アイコン画像のURL
            iconSize:     [20, 28], // アイコンの大きさ
            iconAnchor:   [16, 32], // 画像内でマーカーの位置を指し示す点の位置
            popupAnchor:  [0, -32]  // ポップアップが出現する位置（iconAnchorからの相対位置）
        });

        markers_shop[0] = L.marker([lat, lon], {icon: markerIcon}).addTo(map_shop)
            .bindPopup(name)
            .openPopup();
    }
}

function map_info_hide() {
    for (var ii=0; ii<markers_shop.length; ii++) {
        var marker = markers_shop[ii];
        map_shop.removeLayer(marker);
    }
    markers_shop = [];
}
