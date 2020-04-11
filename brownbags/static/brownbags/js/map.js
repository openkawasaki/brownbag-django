var LAT = 35.581105;
var LON = 139.606619;

function map() {
    var map = L.map('map').setView([LAT, LON], 10);
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

    var items = getShopItems();
    if (items !== null) {
        for (var ii=0; ii<items.length; ii++) {
            var lon =　items[ii]["lon"];
            var lat =　items[ii]["lat"];
            var name = items[ii]["name"];
            var addr = items[ii]["addr"];
            var phone = items[ii]["phone"];
            var category = items[ii]["category"];
            var genre = items[ii]["genre"];

            /*
            L.marker([lat, lon]).addTo(map)
                .bindPopup('店名：' + name +　"<br>" + 'カテゴリ：' + category +　"<br>"  + 'ジャンル：' + genre +　"<br>"  + '電話：' + phone +　"<br>" + '住所：' + addr);
            */
        }
    }

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
}

function map_info(lat, lon) {

    var lat0 = lat;
    var lon0 = lon;

    if (lat == 0.0 || lon == 0.0) {
        lat0 = LAT;
        lon0 = LON;
    }

    var map = L.map('info_map').setView([lat0, lon0], 10);
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

    if (lat != 0.0 &&  lon != 0.0) {
        L.marker([lat, lon]).addTo(map)
            .bindPopup(name)
            .openPopup();
    }

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
}
