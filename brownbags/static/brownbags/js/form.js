function form_read(type) {
    var agreement = $('#agreement').prop('checked');
    var mail = $('#mail').val();

    var name = $('#name').val();
    var description = $('#description').val();

    var addr_sel = $('#addr-sel').val();
    var addr = $('#addr').val();

    var area_sel = $('#area-sel').val();

    // 要素を取得
    //var takeaway      = $('input[name="takeaway"]:checked').val();
    var elements = document.getElementsByName("takeaway");
    for ( var a="", i=elements.length; i--; ) {
        if ( elements[i].checked ) {
            var a = elements[i].value;
            break ;
        }
    }
    var takeaway = "";
    if ( a === "" ) {
        takeaway = "";
    } else {
        takeaway = a;
    }

    var takeaway_menu = $('#takeaway_menu').val();
    var takeaway_note = $('#takeaway_note').val();

    var delivery_demaekan = $('#delivery-check-demaekan').prop('checked');
    var delivery_ubereats = $('#delivery-check-ubereats').prop('checked');
    var delivery_own      = $('#delivery-check-own').prop('checked');
    var delivery_other    = $('#delivery-check-other').prop('checked');
    var delivery_menu = $('#delivery_menu').val();
    var delivery_note = $('#delivery_note').val();

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

    var name_image     = $('#fileupload_name_image');
    var takeaway_image = $('#fileupload_takeaway_image');
    var delivery_image = $('#fileupload_delivery_image');

    var name_image_list = [];
    for (var ii=0; ii<name_image.length; ii++) {
        var baseURI0 = name_image[ii].baseURI;
        var src0     = name_image[ii].src;
        if (baseURI0 !== src0 && src0.length > 0) {
            name_image_list.push(src0);
        }
    }
    var takeaway_image_list = [];
    for (var jj=0; jj<takeaway_image.length; jj++) {
        var baseURI1 = takeaway_image[jj].baseURI;
        var src1     = takeaway_image[jj].src;
        if (baseURI1 !== src1 && src1.length > 0) {
            takeaway_image_list.push(src1);
        }
    }
    var delivery_image_list = [];
    for (var kk=0; kk<delivery_image.length; kk++) {
        var baseURI2 = delivery_image[kk].baseURI;
        var src2     = delivery_image[kk].src;
        if (baseURI2 !== src2 && src2.length > 0) {
            delivery_image_list.push(src2);
        }
    }
    var images = { name:name_image_list, takeaway:takeaway_image_list, delivery:delivery_image_list };

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
        description: description,
        addr_sel: addr_sel,
        addr: addr,
        area_sel: area_sel,
        takeaway: takeaway,
        takeaway_menu: takeaway_menu,
        takeaway_note: takeaway_note,
        delivery: {
            demaekan: delivery_demaekan,
            ubereats: delivery_ubereats,
            own: delivery_own,
            other: delivery_other,
            menu: delivery_menu,
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