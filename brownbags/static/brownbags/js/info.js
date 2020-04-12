function info(self) {
    var index = parseInt(self.data.index);
    var item = getShopItem(index);

    // 店名設定
    var name = item["name"];
    self.querySelector('ons-toolbar .center').innerHTML = name;
    self.querySelector('#shop_name').textContent = name;

    // 店舗画像
    $("#image_name").html(get_image_html("image_name", item["images"]["name"]));

    // ジャンル
    self.querySelector('#shop_genre').textContent = get_genre_sel_name(item["genre_sel"]);

    // 店舗概要
    self.querySelector('#shop_description').textContent = item["description"];

    // メニュー情報
    $("#image_takeway").html(get_image_html("image_takeway", item["images"]["takeaway"]));

    // テイクアウト（持ち帰り）
    self.querySelector('#shop_takeaway_sel').textContent = get_takeaway_sel_name(item["takeaway_sel"]);

    // テイクアウト（持ち帰り）メニュー
    self.querySelector('#shop_takeaway_menu').textContent = item["takeaway_menu"];

    // テイクアウトに関してのお知らせ
    self.querySelector('#shop_takeaway_note').textContent = item["takeaway_note"];

    // デリバリーサービス（出前・配達）
    self.querySelector('#shop_delivery').textContent = get_delivery(item);

    // デリバリーサービス（出前・配達）関してのお知らせ
    self.querySelector('#shop_delivery_note').textContent = item["delivery_note"];

    // 電話番号
    var phone = item["phone"];
    $("#shop_phone").html('<address><a href="tel:' + phone + '">' + phone + '</a></address>');

    // 営業時間
    self.querySelector('#shop_opening_hours').textContent = item["opening_hours"];

    // 定休日
    self.querySelector('#shop_close_day').textContent = item["close_day"];

    // 住所
    self.querySelector('#shop_addr').textContent = item["addr_sel"] + item["addr"];

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

    self.querySelector('#shop_line').textContent = item["line"];
    self.querySelector('#shop_sns_other').textContent = item["sns_other"];

    // 支払い方法
    self.querySelector('#shop_payment').textContent = get_payment(item);

    // 支払い方法に関してのお知らせ
    self.querySelector('#shop_payment_note').textContent = item["payment_note"];

    // アクセス
    self.querySelector('#shop_transportation').textContent = item["transportation"];

    // ベジタリアン
    self.querySelector('#shop_diet_note').textContent = item["diet_note"];

    // アレルギー
    self.querySelector('#shop_allergy_note').textContent = item["allergy_note"];

    // covid19
    self.querySelector('#shop_covid19').textContent = item["covid19"];

    // メモ
    self.querySelector('#shop_note').textContent = item["note"];

    // マップ
    var lat = item["latitude"];
    var lon = item["longitude"];
    map_info(lat, lon);
}
/* slick
 Version: 1.6.0
  Author: Ken Wheeler
 Website: http://kenwheeler.github.io
    Docs: http://kenwheeler.github.io/slick
    Repo: http://github.com/kenwheeler/slick
  Issues: http://github.com/kenwheeler/slick/issues
slick.jsの使い方まとめ
    http://cly7796.net/wp/javascript/plugin-slick/
Doc
    https://kenwheeler.github.io/slick/
*/
function get_image_html(selector, images_name) {
    var html_deffault = '<div class="camera"><div class="focus"></div></div>';

    for (var ii=0; ii<images_name.length; ii++) {
        var imageurl = get_image_url(images_name[ii], null);
        if (!imageurl) {
            imageurl = html_deffault;
        }
        //var html = '<div class="" style="border:1px"><img src="' + imageurl + '" style="width:70%;height:200px"></div>';
        var html = '<div class="" style="border:1px"><img src="' + imageurl + '" style="height:300px"></div>';
        $("#" + selector).append(html);
    }

    $("#" + selector).slick({
        slidesToShow: 1,
        slidesToScroll: 2,
        centerMode: true,
        centerPadding: '0px',
        dots: true,
        infinite: true,
        speed: 500,
        //fade: true,
        cssEase: 'linear'
    });

}