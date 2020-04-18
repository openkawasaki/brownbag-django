function info(self) {
    var index = self.data.index;
    var item = getShopItem(index);
    var shop_id = item["shop_id"];

    readShop(shop_id, info_done);
}

function info_done(data) {
    var item = data["shop"];

    // 店名設定
    var name = item["name"];
    //self.querySelector('ons-toolbar .center').innerHTML = name;
    //self.querySelector('#shop_name').textContent = name;
    $('ons-toolbar .center').html(name);
    $('#shop_name').text(name);

    // 店舗画像
    $("#image_name").html(info_gallery("image_name", item["images"]["name"], name));

    // ジャンル
    $('#shop_genre').text(get_genre_sel_name(item["genre_sel"]));

    // 店舗概要
    if (!isEmpty(item["description"]))
        $('#shop_description').text(item["description"]);

    // 店舗の地域
    $('#shop_area').text(get_area_sel_name(item["area_sel"]));

    // カテゴリ
    $('#shop_category').text(get_category_sel_name(item["category_sel"]));

    // メニュー情報
    $("#image_takeway").html(info_gallery("image_takeway", item["images"]["takeaway"], name));

    // テイクアウト（持ち帰り）
    $('#shop_takeaway_sel').text(get_takeaway_sel_name(item["takeaway_sel"]));

    // テイクアウト（持ち帰り）メニュー
    if (!isEmpty(item["takeaway_menu"]))
        $('#shop_takeaway_menu').html(conv_br(item["takeaway_menu"]));

    // テイクアウトに関してのお知らせ
    if (!isEmpty(item["takeaway_note"]))
        $('#shop_takeaway_note').html(conv_br(item["takeaway_note"]));

    // デリバリーサービス（出前・配達）
    $('#shop_delivery').text(get_delivery(item));

    // デリバリーサービス（出前・配達）関してのお知らせ
    if (!isEmpty(item["delivery_note"]))
        $('#shop_delivery_note').html(conv_br(item["delivery_note"]));

    // 電話番号
    var phone = item["phone"];
    if (!isEmpty(phone))
        $("#shop_phone").html('<address><a href="tel:' + phone + '">' + phone + '</a></address>');

    // 定休日・営業時間
    if (!isEmpty(item["open_day"]))
        $('#shop_open_day').html(conv_br(item["open_day"]));

    // 住所
    if (!isEmpty(item["addr_sel"]) && !isEmpty(item["addr"]))
        $('#shop_addr').text(item["addr_sel"] + item["addr"]);
    else if (!isEmpty(item["addr_sel"]) && isEmpty(item["addr"]))
        $('#shop_addr').text(item["addr_sel"]);
    else if (isEmpty(item["addr_sel"]) && !isEmpty(item["addr"]))
        $('#shop_addr').text(item["addr"]);

    // Webサイト>
    var website = item["website"];
    if (!isEmpty(website)) {
        $("#shop_website").html('<a href="' + website + '" target="_blank" rel="noopener noreferrer">' + website + '</a>');
    }

    // SNS
    var twitter = item["twitter"];
    if (!isEmpty(twitter))
        $("#shop_twitter").html('<a href="https://twitter.com/' + twitter + '" target="_blank" rel="noopener noreferrer">' + twitter + '</a>');

    var facebook = item["facebook"];
    if (!isEmpty(facebook))
        $("#shop_facebook").html('<a href="https://www.facebook.com/' + facebook + '" target="_blank" rel="noopener noreferrer">' + facebook + '</a>');

    var instagram = item["instagram"];
    if (!isEmpty(instagram))
        $("#shop_instagram").html('<a href="https://www.instagram.com/' + instagram + '" target="_blank" rel="noopener noreferrer">' + instagram + '</a>');

    if (!isEmpty(item["line"]))
        $('#shop_line').text(item["line"]);
    if (!isEmpty(item["sns_other"]))
        $('#shop_sns_other').text(item["sns_other"]);

    // 支払い方法
    $('#shop_payment').text(get_payment(item));

    // 支払い方法に関してのお知らせ
    if (!isEmpty(item["payment_note"]))
        $('#shop_payment_note').html(conv_br(item["payment_note"]));

    // アクセス・交通手段
    if (!isEmpty(item["transportation"]))
        $('#shop_transportation').html(conv_br(item["transportation"]));

    // ベジタリアン
    if (!isEmpty(item["diet_note"]))
        $('#shop_diet_note').html(conv_br(item["diet_note"]));

    // アレルギー
    if (!isEmpty(item["allergy_note"]))
        $('#shop_allergy_note').html(conv_br(item["allergy_note"]));

    // covid19
    if (!isEmpty(item["covid19_note"]))
        $('#shop_covid19_note').html(conv_br(item["covid19_note"]));

    // メモ
    if (!isEmpty(item["note"]))
        $('#shop_note').html(conv_br(item["note"]));

    // マップ
    var lat = item["latitude"];
    var lon = item["longitude"];

    map_info_show(lat, lon, name);
}

function conv_br(str) {
    var text = str.replace(/\r?\n/g, '<br>');
    return text;
}

function info_gallery(selector, images_name, name) {

    if (images_name.length === 0){
        var imageurl = '/static/brownbags/images/noimage.png';
        var html = '<img src="' + imageurl + '" data-image="' + imageurl + '">';
        $("#" + selector).append(html);

    } else {
        for (var ii=0; ii<images_name.length; ii++) {
            var image_thumbnail = get_image_url(images_name[ii], '/static/brownbags/images/noimage.png', ImageSize.small);
            var image_src       = get_image_url(images_name[ii], '/static/brownbags/images/noimage.png', ImageSize.middle);

            /*
            alt - image title (optional)
            src - url of the thumbnail image
            data-image - url of the big image.
            data-description - the description of the image (optional)
            */
            var html = '<img src="' + image_thumbnail + '" data-image="' + image_src + '" data-description="' + name +  '">';
            $("#" + selector).append(html);
        }
    }

    jQuery(document).ready(function(){
		jQuery("#" + selector).unitegallery({
		    gallery_theme:"default",

            theme_enable_fullscreen_button: true,	//show, hide the theme fullscreen button. The position in the theme is constant
            theme_enable_play_button: false,		//show, hide the theme play button. The position in the theme is constant
			theme_enable_hidepanel_button: false,	//show, hide the hidepanel button
			theme_enable_text_panel: true,			//enable the panel text panel.
            slider_enable_zoom_panel: true,	         //true,false - enable the zoom buttons, works together with zoom control.

            gallery_width: "100%",
            //gallery_height: "400px",
        });
	});
}
