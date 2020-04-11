var maxImageFileNames  = 3;
var maxImageFileTakeways = 3;
var acceptFileTypes = /^image\/(gif|jpe?g|png)$/i;
var maxImageFileSize = (1024 * 1024 * 10);  // 10MB

var inputImageFileNames = 0;
var inputImageFileTakeways = 0;

function form_init(self) {

    // 店の画像
    $('#fileupload_cancel_name').on('click touchstart', function () {
        for (var ii=0; ii<maxImageFileNames; ii++) {
            $("#fileupload_image_name" + ii).attr("src", null);
        }
        inputImageFileNames = 0;
    });
    $("#fileupload_submit_name").fileupload({
        disableImageResize: false,
        add: function (e, data) {
            if (data.files && data.files[0]) {
                if (data.files[0]['type'].length && !acceptFileTypes.test(data.files[0]['type'])) {
                    var errtext = "画像ファイルを指定してください。";
                    ons.notification.toast(errtext, { timeout: 1000, animation: 'fall' });
                    return;
                } else if (data.files[0]['size'] > maxImageFileSize) {
                    var errtext = "画像が大きすぎます。選択できる画像のサイズは、" + (maxImageFileSize/1024) + "Kバイトまでです。";
                    ons.notification.toast(errtext, { timeout: 1000, animation: 'fall' });
                    return;
                } else if (inputImageFileNames >= maxImageFileNames) {
                    var errtext = "選択できる画像は、" + maxImageFileNames + "個までです。";
                    ons.notification.toast(errtext, { timeout: 1000, animation: 'fall' });
                    return;
                }
                var reader = new FileReader();
                reader.onload = function (e) {
                    $("#fileupload_image_name" + inputImageFileNames).attr("src", e.target.result);
                    inputImageFileNames ++;
                };
                reader.readAsDataURL(data.files[0]);
            }
        }
    });

    // テイクアウトの画像
    $('#fileupload_cancel_takeway').on('click touchstart', function () {
        for (var ii=0; ii<maxImageFileTakeways; ii++) {
            $("#fileupload_image_takeway" + ii).attr("src", null);
        }
        inputImageFileTakeways = 0;
    });
    $("#fileupload_submit_takeway").fileupload({
        disableImageResize: false,
        add: function (e, data) {
            if (data.files && data.files[0]) {
                if (data.files[0]['type'].length && !acceptFileTypes.test(data.files[0]['type'])) {
                    var errtext = "画像ファイルを指定してください。";
                    ons.notification.toast(errtext, { timeout: 1000, animation: 'fall' });
                    return;
                } else if (data.files[0]['size'] > maxImageFileSize) {
                    var errtext = "画像が大きすぎます。選択できる画像のサイズは、" + (maxImageFileSize/1024) + "Kバイトまでです。";
                    ons.notification.toast(errtext, { timeout: 1000, animation: 'fall' });
                    return;
                } else if (inputImageFileTakeways >= maxImageFileTakeways) {
                    var errtext = "選択できる画像は、" + maxImageFileTakeways + "個までです。";
                    ons.notification.toast(errtext, { timeout: 1000, animation: 'fall' });
                    return;
                }
                var reader = new FileReader();
                reader.onload = function (e) {
                    $("#fileupload_image_takeway" + inputImageFileTakeways).attr("src", e.target.result);
                    inputImageFileTakeways ++;
                };
                reader.readAsDataURL(data.files[0]);
            }
        }
    });
}


function form_read(type) {
    var agreement = $('#agreement').prop('checked');
    var mail = $('#mail').val();

    var name = $('#name').val();
    var genre_sel = $('#genre-sel').val();
    var description = $('#description').val();

    var addr_sel = $('#addr-sel').val();
    var addr = $('#addr').val();

    var area_sel  = $('#area-sel').val();

    // 要素を取得 ラジオボタンこれでいいの？
    //var takeaway_sel = $('input[name="takeaway"]:checked').val();
    var elements = document.getElementsByName("takeaway");
    var takeaway_sel = -1;
    for (var ll=0; ll<elements.length; ll++) {
        if ( elements[ll].checked ) {
            takeaway_sel = elements[ll].value;
            break ;
        }
    }

    var takeaway_menu = $('#takeaway_menu').val();
    var takeaway_note = $('#takeaway_note').val();

    var delivery_demaekan = $('#delivery-check-demaekan').prop('checked');
    var delivery_ubereats = $('#delivery-check-ubereats').prop('checked');
    var delivery_own      = $('#delivery-check-own').prop('checked');
    var delivery_other    = $('#delivery-check-other').prop('checked');
    var delivery_note     = $('#delivery_note').val();

    var phone         = $('#phone').val();
    var opening_hours = $('#opening_hours').val();
    var close_day     = $('#close_day').val();

    var payment_cash   = $('#payment-check-cash').prop('checked');
    var payment_card   = $('#payment-check-card').prop('checked');
    var payment_qr     = $('#payment-check-qr').prop('checked');
    var payment_emoney = $('#payment-check-emoney').prop('checked');
    var payment_note   = $('#payment_note').val();

    var website  = $('#website').val();

    var twitter_account    = $('#twitter_account').val();
    var facebook_account   = $('#facebook_account').val();
    var instagram_account  = $('#instagram_account').val();
    var line_account       = $('#line_account').val();
    var sns_other_account  = $('#sns_other_account').val();

    var transportation  = $('#transportation').val();
    var diet_note       = $('#diet_note').val();
    var allergy_note    = $('#allergy_note').val();

    var latitude  = $('#latitude').val();
    var longitude = $('#longitude').val();

    var covid19 = $('#covid19').val();
    var note    = $('#note').val();

    var name_image_list = [];
    for (var ii=0; ii<maxImageFileNames; ii++) {
        var name_image = $("#fileupload_image_name" + ii);
        var baseURI0 = name_image[0].baseURI;
        var src0     = name_image[0].src;
        if (baseURI0 !== src0 && src0.length > 0) {
            name_image_list.push(src0);
        }
    }
    var takeaway_image_list = [];
    for (var jj=0; jj<maxImageFileTakeways; jj++) {
        var takeaway_image = $("#fileupload_image_takeway" + jj);
        var baseURI1 = takeaway_image[0].baseURI;
        var src1     = takeaway_image[0].src;
        if (baseURI1 !== src1 && src1.length > 0) {
            takeaway_image_list.push(src1);
        }
    }
    var images = { name:name_image_list, takeaway:takeaway_image_list };

    if (!agreement) {
        ons.notification.toast("投稿の注意点に同意をしてください。", { timeout: 1000, animation: 'fall' });
        return;
    } else if (mail === null || mail.length <= 0) {
        ons.notification.toast("投稿者の連絡先メールアドレスがありません。", { timeout: 1000, animation: 'fall' });
        return;
    } else if (name === null || name.length <= 0) {
        ons.notification.toast("店名がありません。", { timeout: 1000, animation: 'fall' });
        return;
    }

    var jsondata = {
        type: type,
        agreement: agreement,
        mail: mail,
        name: name,
        genre_sel: genre_sel,
        description: description,
        addr_sel: addr_sel,
        addr: addr,
        area_sel: area_sel,
        takeaway_sel: takeaway_sel,
        takeaway_menu: takeaway_menu,
        takeaway_note: takeaway_note,
        delivery: {
            demaekan: delivery_demaekan,
            ubereats: delivery_ubereats,
            own: delivery_own,
            other: delivery_other,
            note: delivery_note,
        },
        phone : phone,
        opening_hours: opening_hours,
        close_day: close_day,
        payment: {
            cash: payment_cash,
            card:payment_card,
            qr: payment_qr,
            emoney: payment_emoney,
            note:payment_note
        },
        website: website,
        sns: {
            twitter: twitter_account,
            facebook: facebook_account,
            instagram: instagram_account,
            line : line_account,
            other: sns_other_account
        },
        transportation: transportation,
        diet_note: diet_note,
        allergy_note: allergy_note,

        latitude: latitude,
        longitude: longitude,

        covid19: covid19,
        note:note,
        images: images
    };

    post("/api/v1.0/shop/ ", jsondata, form_read_done);
    console.log("form_read(): " + JSON.stringify(jsondata));
}

function form_read_done(data) {
    ons.notification.toast("登録完了", { timeout: 1000, animation: 'fall' });
}
// ------------------------------
// セレクト値変換
// ------------------------------

// ジャンル
var GENRE_CLASS = [
    [0, 'その他'],
    [1, 'お弁当・お惣菜'],
    [2, '中華料理'],
    [3, '和食・日本料理・お寿司'],
    [4, 'ピザ・パスタ'],
    [5, '洋食・西洋料理・とんかつ'],
    [6, '居酒屋・ダイニングバー・焼鳥'],
    [7, 'アジア・エスニック・カレー'],
    [8, 'ステーキ・ハンバーグ・焼肉・ホルモン'],
    [9, '創作料理・無国籍料理'],
    [10, 'ラーメン'],
    [11, 'カフェ・喫茶店'],
    [12, 'バー・パブ・ラウンジ'],
    [13, 'パン・サンドイッチ'],
    [14, 'スイーツ'],
    [15, 'スーパーマーケット・コンビニエンスストア'],
    [-1, 'ジャンルなし'],
];

//  地域
var AREA_CLASS = [
    [0, 'その他'],
    [1, '武蔵小杉・新丸子・元住吉'],
    [2, '武蔵新城・武蔵中原'],
    [3, '溝の口・梶ヶ谷・鷺沼'],
    [4, '登戸・稲田堤'],
    [5, '川崎・平間'],
    [6, '百合ヶ丘・新百合ヶ丘'],
    [-1,'地域の指定なし'],
];

// カテゴリー
var CATEGORY_CLASS = [
    [0, 'その他'],
    [1, 'テイクアウト（持ち帰り）'],
    [2, 'デリバリーサービス（出前・配達）'],
    [-1,'指定なし'],
];

// テイクアウト（持ち帰り）
var TAKEAWAY_CLASS = [
    [0, 'その他'],
    [1, '対応している'],
    [2, '対応してない'],
    [3, '準備中'],
    [-1,'指定なし'],
];

// デリバリー
var DELIVERY_CLASS = [
    [0, 'その他'],
    [1, '出前館'],
    [2, 'UberEats（ウーバーイーツ）'],
    [3, '自店で配達・出前をしている'],
    [-1,'指定なし'],
];

// 支払い方法
var PAYMENT_CLASS = [
    [0, 'その他'],
    [1, '現金'],
    [2, 'クレジットカード'],
    [3, 'QRコード決済 (PayPay, LINE Pay等)'],
    [4, '電子マネー (Suica、PASMO等)'],
    [-1,'指定なし'],
];

function get_genre_sel_name(genre_sel) {
    for (var ii=0; ii<GENRE_CLASS.length; ii++) {
        if (GENRE_CLASS[ii][0] === genre_sel) {
            return GENRE_CLASS[ii][1];
        }
    }
    return "";
}

function get_area_sel_name(area_sel) {
    for (var ii=0; ii<AREA_CLASS.length; ii++) {
        if (AREA_CLASS[ii][0] === area_sel) {
            return AREA_CLASS[ii][1];
        }
    }
    return "";
}

function get_category_sel_name(category_sel) {
    for (var ii=0; ii<CATEGORY_CLASS.length; ii++) {
        if (CATEGORY_CLASS[ii][0] === category_sel) {
            return CATEGORY_CLASS[ii][1];
        }
    }
    return "";
}

function get_takeaway_sel_name(takeaway_sel) {
    for (var ii=0; ii<TAKEAWAY_CLASS.length; ii++) {
        if (TAKEAWAY_CLASS[ii][0] === takeaway_sel) {
            return TAKEAWAY_CLASS[ii][1];
        }
    }
    return "";
}

function get_image_url(img, default_url) {
    var imageurl = default_url;
    if (!isEmpty(img["src"])) {
        imageurl = img["src"];
    }
    return imageurl;
}

function get_delivery(item) {
    var delivery_list = [];

    if (item["delivery_demaekan"]) {
        delivery_list.push(DELIVERY_CLASS[1][1])
    }
    if (item["delivery_ubereats"]) {
        delivery_list.push(DELIVERY_CLASS[2][1])
    }
    if (item["delivery_own"]) {
        delivery_list.push(DELIVERY_CLASS[3][1])
    }
    if (item["delivery_other"]) {
        delivery_list.push(DELIVERY_CLASS[0][1])
    }

    return delivery_list.join('、');
}

function get_payment(item) {
    var payment_list = [];

    if (item["payment_cash"]) {
        payment_list.push(PAYMENT_CLASS[1][1])
    }
    if (item["payment_card"]) {
        payment_list.push(PAYMENT_CLASS[2][1])
    }
    if (item["payment_qr"]) {
        payment_list.push(PAYMENT_CLASS[3][1])
    }
    if (item["payment_emoney"]) {
        payment_list.push(PAYMENT_CLASS[4][1])
    }
    return payment_list.join('、');
}
