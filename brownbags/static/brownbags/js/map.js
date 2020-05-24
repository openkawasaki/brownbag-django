var LAT = 35.48639282474548;
var LON = 139.59228515625003;

var map = null;
var map_shop = null;
var markers = [];
var markers_shop = [];
var cCtrl = null;
var cCtrl_shop = null;
var photoLayer = null;
var photoLayer_shop = null;

function map_init() {
    map = L.map('map').setView([LAT, LON], 11);
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
        //var lat = e.latlng.lat;
        //var lng = e.latlng.lng;
        //経緯度表示
        //console.log("lat: " + lat + ", lng: " + lng);
        cCtrl.setCoordinates(e);
    });

    // Coordinates Control
    var options = {
        latitudeText: "緯度", // default lat
        longitudeText: "経度", // default lon
        precision: 5 // default 4 緯度経度の精度（小数点以下の桁数）
    }
    cCtrl = new L.Control.Coordinates(options);
    cCtrl.addTo(map);
}

function map_show() {
    var items = getShopItems();
    if (items !== null) {
        // アイコンを作成する
        /*
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
        */
        photoLayer = L.photo.cluster().on('click', function (evt) {
            var photo = evt.layer.photo,
            template = '<img src="{url}"/></a><p>{caption}</p>';
            if (photo.video && (!!document.createElement('video').canPlayType('video/mp4; codecs=avc1.42E01E,mp4a.40.2'))) {
                template = '<video autoplay controls poster="{url}"><source src="{video}" type="video/mp4"/></video>';

            };

            evt.layer.bindPopup(L.Util.template(template, photo), {
                className: 'leaflet-popup-photo',
                minWidth: 300
            }).openPopup();
        });

        var photos = [];
        for (var ii=0; ii<items.length; ii++) {
            var item  = items[ii];
            var lon   = item["longitude"];
            var lat   = item["latitude"];
            var name  = item["name"];
            var phone = item["phone"];
            var genre = get_sel_name(GENRE_CLASS, item["genre_sel"]);

            var image_thumbnail = '/static/brownbags/images/noimage.png';
            var image_src = '/static/brownbags/images/noimage.png';

            if (!isEmpty(item["small"])) {
                image_thumbnail = item["small"];
                image_src = item["small"];
            }

            if (lat !== 0.0 && lon !== 0.0) {
                var caption = '店名：' + name + "<br>" + 'ジャンル：' + genre + "<br>" + '電話：' + phone
                photos.push({
                    lat: lat,
                    lng: lon,
                    url: image_src ,
                    caption: caption,
                    thumbnail: image_thumbnail,
                });
            }
        }
        photoLayer.add(photos).addTo(map);
        shop.fitBounds(photoLayer.getBounds());
    }
}

function map_hide() {
    for (var ii=0; ii<markers.length; ii++) {
        var marker = markers[ii];
        map.removeLayer(marker);
    }
    markers = [];

    if (photoLayer !== null) {
        map.removeLayer(photoLayer);
        photoLayer = null;
    }
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
        //var lat = e.latlng.lat;
        //var lng = e.latlng.lng;
        //経緯度表示
        //console.log("lat: " + lat + ", lng: " + lng);
        cCtrl_shop.setCoordinates(e);
    });

    // Coordinates Control
    var options = {
        latitudeText: "緯度", // default lat
        longitudeText: "経度", // default lon
        precision: 5 // default 4 緯度経度の精度（小数点以下の桁数）
    }
    cCtrl_shop = new L.Control.Coordinates(options);
    cCtrl_shop.addTo(map_shop);
}

function map_info_show(item) {
    var lat = item["latitude"];
    var lon = item["longitude"];

    if (lat != 0.0 &&  lon != 0.0) {
        /*
        // アイコンを作成する
        var markerIcon = L.icon({
            iconUrl: '/static/images/marker.png', // アイコン画像のURL
            iconSize:     [20, 28], // アイコンの大きさ
            iconAnchor:   [16, 32], // 画像内でマーカーの位置を指し示す点の位置
            popupAnchor:  [0, -32]  // ポップアップが出現する位置（iconAnchorからの相対位置）
        });

        //markers_shop[0] = L.marker([lat, lon], {icon: markerIcon, draggable:true, autoPan:true}).addTo(map_shop)
        markers_shop[0] = L.marker([lat, lon], {icon: markerIcon}).addTo(map_shop)
            .bindPopup(name)
            .openPopup();

       // markers_shop[0].on("drag", function(e) {
       //     var marker = e.target;
       //     var position = marker.getLatLng();
       //     map.panTo(new L.LatLng(position.lat, position.lng));
       // });

       map_shop.panTo(new L.LatLng(lat, lon));
       */
        photoLayer_shop = L.photo.cluster().on('click', function (evt) {
            var photo = evt.layer.photo,
            template = '<img src="{url}"/></a><p>{caption}</p>';
            if (photo.video && (!!document.createElement('video').canPlayType('video/mp4; codecs=avc1.42E01E,mp4a.40.2'))) {
                template = '<video autoplay controls poster="{url}"><source src="{video}" type="video/mp4"/></video>';

            };

            evt.layer.bindPopup(L.Util.template(template, photo), {
                className: 'leaflet-popup-photo',
                minWidth: 300
            }).openPopup();
        });

        var name = item["name"];
        var image_thumbnail = get_image_url(item["images"]["name"][0], '/static/brownbags/images/noimage.png', ImageSize.thumbnail);
        var image_src = get_image_url(item["images"]["name"][0], '/static/brownbags/images/noimage.png', ImageSize.small);

        var photos = [];
        for (var ii=0; ii<1; ii++) {
            photos.push({
                lat: lat,
                lng: lon,
                url: image_src ,
                caption: name,
                thumbnail: image_thumbnail,
            });
        }

        photoLayer_shop.add(photos).addTo(map_shop);
        map_shop.fitBounds(photoLayer_shop.getBounds());
    }
}

function map_info_hide() {
    for (var ii=0; ii<markers_shop.length; ii++) {
        var marker = markers_shop[ii];
        map_shop.removeLayer(marker);
    }
    markers_shop = [];

    if (photoLayer_shop !== null) {
        map_shop.removeLayer(photoLayer_shop);
        photoLayer_shop = null;
    }
}
