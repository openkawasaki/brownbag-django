//ons.bootstrap();

// CordovaのAPIを呼び出す準備が整った
ons.ready(function() {
    //console.log("ons.ready");
    //readShopList(readShopListDone);
});

//--------------------
var g_shop_list = null;
function getShopItem(index) {
    if (g_shop_list == null) {
        return null;
    } else if (index　<　0 ||　g_shop_list.length <= index) {
        return null;
    }
    return g_shop_list[index];
}
function getShopItems() {
    return g_shop_list;
}
function getShopItemCount() {
    if (g_shop_list == null) {
        return 0;
    }
    return g_shop_list.length;
}

function readShopListPrams(area_sel, category_sel, genre_sel, done) {
    var param = {
        area_sel: area_sel,
        category_sel: category_sel,
        genre_sel: genre_sel,
    };
    get("/api/v1.0/shop/list/",param, done);
}
function readShopList(done) {
    //console.log("readShopList()");
    get("/api/v1.0/shop/list/", {}, done);
}

function readShopListDone(data) {
    //console.log("readShopListDone()");
    g_shop_list = data["shop"];

    grid_show();
    /*
    updateList();
    map_init();
    map_show();
    */
}

function readShop(shop_id, done) {
    //console.log("readShopList()");
    get("/api/v1.0/shop/", {shop_id:shop_id}, done);
}

//--------------------------
// for sidemenu & pushpage
//--------------------------
window.fn = {};

window.fn.toggleMenu = function () {
    document.getElementById('appSplitter').right.toggle();
};

window.fn.loadView = function (index) {
    document.getElementById('appTabbar').setActiveTab(index);
    document.getElementById('sidemenu').close();
};

window.fn.loadLink = function (url) {
    window.open(url, '_blank');
};

window.fn.pushPage = function (page, anim) {
    if (anim) {
        document.getElementById('appNavigator').pushPage(page.id, { data: { title: page.title, index: page.index }, animation: anim });
    } else {
        document.getElementById('appNavigator').pushPage(page.id, { data: { title: page.title, index: page.index } });
    }
};

//--------------------------
// アクティブなタブが変わる前に発火します。
//--------------------------
document.addEventListener('prechange', function(event) {
    //console.log("prechange()");

    // ラベル設定
    document.querySelector('ons-toolbar .center')
        .innerHTML = event.tabItem.getAttribute('label');
});

//--------------------------
// initイベント <ons-page>がDOMにアタッチされる
//--------------------------
document.addEventListener("init", function(event) {
    var page = event.target;
    if (page.id === "home-page") {
        grid_init();
        readShopList(readShopListDone);
        console.log("home-page: init()");
    } else if (page.id === "list-page") {
        console.log("list-page: init()");
    } else if (page.id === "map-page") {
        console.log("map-page: init()");
    } else if (page.id === "info-page") {
        info_init();
        info_show(page.data);
        console.log("info-page: init()");
    } else if (page.id === "form-page") {
        console.log("form-page: init()");
    } else if (page.id === "form-edit-page") {
        console.log("form-edit-page: init()");
    } else if (page.id === "about-page") {
        console.log("about-page: init()");
    } else if (page.id === "search-page") {
        console.log("search-page: init()");
    } else {
        //console.log(page.id);
    }
});
//--------------------------
// destroyイベント <ons-page>がDOMからデアタッチされる直前
//--------------------------
/*
document.addEventListener("destroy", function(event) {
    var page = event.target;
    if (page.id === "home-page") {
        console.log("home-page: destroy()");
    } else if (page.id === "list-page") {
        console.log("list-page: destroy()");
    } else if (page.id === "map-page") {
        console.log("map-page: destroy()");
    } else if (page.id === "info-page") {
        console.log("info-page: destroy()");
    } else if (page.id === "form-page") {
        console.log("form-page: destroy()");
    } else if (page.id === "form-edit-page") {
        console.log("form-edit-page: destroy()");
    } else if (page.id === "about-page") {
        console.log("about-page: destroy()");
    } else if (page.id === "search-page") {
        console.log("search-page: destroy()");
    } else {
        //console.log(page.id);
    }
});
*/
//--------------------------
// showイベント <ons-page>が画面に現れるたび
//--------------------------
/*
document.addEventListener("show", function(event) {
    var page = event.target;
    if (page.id === "home-page") {
        console.log("home-page: show()");
    } else if (page.id === "list-page") {
        console.log("list-page: show()");
    } else if (page.id === "map-page") {
        console.log("map-page: show()");
    } else if (page.id === "info-page") {
        console.log("info-page: show()");
    } else if (page.id === "form-page") {
        console.log("form-page: show()");
    } else if (page.id === "form-edit-page") {
        console.log("form-edit-page: show()");
    } else if (page.id === "about-page") {
        console.log("about-page: show()");
    } else if (page.id === "search-page") {
        console.log("search-page: show()");
    } else {
        //console.log(page.id);
    }
});
*/
//--------------------------
// hideイベント <ons-page>が画面から隠れた場合
//--------------------------
/*
document.addEventListener("hide", function(event) {
    var page = event.target;
    if (page.id === "home-page") {
        console.log("home-page: hide()");
    } else if (page.id === "list-page") {
        console.log("list-page: hide()");
    } else if (page.id === "map-page") {
        console.log("map-page: hide()");
    } else if (page.id === "info-page") {
        console.log("info-page: hide()");
    } else if (page.id === "form-page") {
        console.log("form-page: hide()");
    } else if (page.id === "form-edit-page") {
        console.log("form-edit-page: hide()");
    } else if (page.id === "about-page") {
        console.log("about-page: hide()");
    } else if (page.id === "search-page") {
        console.log("search-page: hide()");
    } else {
        //console.log(page.id);
    }
});
*/