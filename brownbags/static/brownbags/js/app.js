//ons.bootstrap();

// CordovaのAPIを呼び出す準備が整った
ons.ready(function() {
    //console.log("ons.ready");
    readShopList();
});

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

function readShopList() {
    get("/api/v1.0/shop/", {}, readShopListDone);
}

function updateShopList(done) {
    get("/api/v1.0/shop/", {}, done);
}

function readShopListDone(data) {
    g_shop_list = data["shop"];
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
    // ラベル設定
    document.querySelector('ons-toolbar .center')
        .innerHTML = event.tabItem.getAttribute('label');
});

//--------------------------
// initイベント
//--------------------------
document.addEventListener("init", function(event) {
    var page = event.target;
    /*
    if (page.id === "home-page") {
        console.log("home-page");
    } else if (page.id === "list-page") {
        console.log("list-page");
    } else if (page.id === "map-page") {
        console.log("map-page");
    } else if (page.id === "info-page") {
        console.log("info-page");
    } else if (page.id === "form-page") {
        console.log("form-page");
    } else if (page.id === "form-edit-page") {
        console.log("form-edit-page");
    } else if (page.id === "about-page") {
        console.log("about-page");
    } else {
        console.log(page.id);
    }
    */
});
