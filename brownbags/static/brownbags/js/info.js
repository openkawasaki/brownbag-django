function info(self) {
    var index = parseInt(self.data.index);
    var item = getShopItem(index);

    // 店名設定
    var name = item["name"];
    self.querySelector('ons-toolbar .center').innerHTML = name;
    self.querySelector('#shop_name').textContent = name;

    // 店舗画像
    var html = get_image_html(item["images"]["name"]);
    $("#image_name").html(html);

    // ジャンル
    var genre = get_genre_sel_name(item["genre_sel"]);
    self.querySelector('#shop_genre').textContent = genre;

    // 店舗概要
    var description = item["description"];
    self.querySelector('#shop_description').textContent = description;

    // テイクアウト（持ち帰り）
    var html = get_image_html(item["images"]["takeaway"]);
    $("#image_name").html(html);


    /*
    var imageurl = get_image_takeaway(item, null);
    if (!isEmpty(imageurl)) {
        self.querySelector('#shop_image_takeaway').innerHTML = '<div class="image_center"><img src="' + imageurl + '" width="50%"></div>';
    } else {
        self.querySelector('#shop_image_takeaway').innerHTML = '<div class="camera"><div class="focus"></div></div>';
    }
    */
    var takeaway_menu = item["takeaway_menu"];
    self.querySelector('#shop_takeaway_menu').textContent = takeaway_menu;
    var takeaway_note = item["takeaway_note"];
    self.querySelector('#shop_takeaway_note').textContent = takeaway_note;

    // デリバリーサービス（出前・配達）
    //self.querySelector('#shop_delivery').textContent = delivery;

    // 電話番号
    var phone = item["phone"];
    self.querySelector('#shop_phone').innerHTML = '<address><a href="tel:' + phone + '">' + phone + '</a></address>';

    // 営業時間
    var opening_hours = item["opening_hours"];
    self.querySelector('#shop_opening_hours').textContent = opening_hours;
    // 定休日
    var close_day = item["close_day"];
    self.querySelector('#shop_close_day').textContent = close_day;

    // Webサイト>
    var website = item["website"];
    if (!isEmpty(website)) {
        self.querySelector('#shop_website').innerHTML = '<a href="' + website + '">' + website + '</a>';
    }

    // メモ
    var note = item["note"];
    self.querySelector('#shop_note').textContent = note;

    // マップ
    var lat = item["latitude"];
    var lon = item["longitude"];
    map_info(lat, lon);
}

function get_image_html(images_name) {

    var html = "<ons-row>";
    for (var ii = 0; ii < images_name.length; ii++) {
        var img = images_name[ii];
        var imageurl = get_image_url(img, null);

        html += '<ons-col width="33%">';

        if (imageurl) {
            html += '<img src="' + imageurl + '" style="width:30vh;">';
        } else {
            html += '<div class="camera"><div class="focus"></div></div>';
        }
        html += '</ons-col>';
    }
    html += '</ons-row>';

    return html;
}