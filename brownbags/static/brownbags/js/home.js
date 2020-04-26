function carousel_init() {

    var data_list = [
        {image: "/static/brownbags/images/ogp.png"},
        {image: "/static/brownbags/images/home1.png"},
        {image: "/static/brownbags/images/home2.png"},
    ];

    for (var ii=0; ii<data_list.length; ii++) {
        var item = data_list[ii];

        var elem = `<ons-carousel-item>
                        <div class="home_carousel_item">
                            <img src='${item.image}' width="100%">
                        </div>
                    </ons-carousel-item>`;

        $('.home_carousel').append(elem);
    }
}

function home_init() {
    carousel_init();

    make_selector(GENRE_CLASS,"home-genre");
    make_selector(AREA_CLASS, "home-area");
    make_selector(CATEGORY_CLASS, "home-category");
    make_selector(GROUP_CLASS, "home-group");
}

var home_grid = null;
function home_show() {
    home_hide();

    var grid_list = getShopItems();
    if (grid_list !== null) {
        for (var ii=0; ii<grid_list.length; ii++) {
            var item = grid_list[ii];
            var name = item["name"];

            var genre_sel    = item["genre_sel"];
            var area_sel     = item["area_sel"];
            var category_sel = item["category_sel"];
            var group_sel    = item["group_sel"];

            var genre = get_sel_name(GENRE_CLASS, genre_sel);

            var image_thumbnail = '/static/brownbags/images/noimage.png';
            var image_src = image_thumbnail;

            if (!isEmpty(item["middle"])) {
                image_thumbnail = item["middle"];
            }
            if (!isEmpty(item["big"])) {
                image_src = item["big"];
            }

            var elem = `<ons-card class="grid_item"
                                data-genre="${genre_sel}" data-area="${area_sel}" data-category="${category_sel}" data-group="${group_sel}" 
                                onclick="fn.pushPage({'id':'/static/brownbags/html/info.html', 'title':'${name}', 'index':'${ii}'})">
                                <img src="${image_src}" alt="${name}" style="width: 100%">
                                <div class="content">
                                  <ons-list>
                                    <ons-list-item>${name}</ons-list-item>
                                    <ons-list-item>${genre}</ons-list-item>
                                  </ons-list>
                                </div>
                            </ons-card>`;

            $('.home_grid').append(elem);
        }
    }

    home_grid = new Muuri('.home_grid');
}

function home_hide() {
    $("#home_grid").children().remove();
    home_grid = null;
    resetHomeFilter();
}

function resetHomeFilter() {
    if (home_grid !== null){
        home_grid.filter('.grid_item');
    }
    /*
    $("#home_grid").val("-1");
    $("#home_area").val("-1");
    $("#home_category").val("-1");
    $("#home_group").val("-1");
    */
    $(".select-input").val("-1");
}

function setHomeFilter(filter, value) {
    home_grid.filter(function (item) {
        var element = item.getElement();
        var data_area = element.getAttribute(filter);

        var item_data = parseInt(data_area, 10);
        if (isNaN(item_data))
            item_data = -1;
        return item_data === value;
    });
}

// ページをreloadする方法
// reloadの基本的な使い方
function doReload() {
    // reloadメソッドによりページをリロード
    window.location.reload();
}
function doReloadNoCache() {

    // キャッシュを無視してサーバーからリロード
    window.location.reload(true);

}
