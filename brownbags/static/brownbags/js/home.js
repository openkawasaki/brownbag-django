/*
function carousel_init() {
    var data_list = [
        {image: "/static/brownbags/images/lunchbox.jpg"},
        {image: "/static/brownbags/images/home0.png"},
        {image: "/static/brownbags/images/home1.png"},
        {image: "/static/brownbags/images/home2.png"},
    ];

    for (var ii=0; ii<data_list.length; ii++) {
        var item = data_list[ii];

        var elem = `<ons-carousel-item>
                        <div class="home_carousel_item">
                            <img src='${item.image}'>
                        </div>
                    </ons-carousel-item>`;

        $('.home_carousel').append(elem);
    }
}
*/

function home_init() {
    /*carousel_init();*/
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

            var elem = `<div class="grid_item"
                           data-genre="${genre_sel}" data-area="${area_sel}" data-category="${category_sel}" data-group="${group_sel}" 
                           onclick="fn.pushPage({'id':'/static/brownbags/html/info.html', 'title':'${name}', 'index':'${ii}'})">
                           <div class="grid_item_content">                        
                               <img src="${image_src}" alt="${name}" style="width: 100%">
                               <ul style="list-style-type: none">
                                  <li>${name}</li>
                                  <li>ジャンル：${genre}</li>
                               </ul>
                           </div>
                         </div>`;

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
    $("#home-genre").val("-1");
    $("#home-area").val("-1");
    $("#home-category").val("-1");
    $("#home-group").val("-1");
    //$(".select-input").val("-1");
}

function checkGridFilter(element, attribute, value) {
    if (value === -1) {
        return true;
    }

    var data_attr = parseInt(element.getAttribute(attribute), 10);
    if (isNaN(data_attr))
        return true;

    if (value !== data_attr)
        return false;

    return true;
}

function setGridFilter() {
    if (home_grid!== null) {
        debuglog("選択変更しました。");

        home_grid.filter(function (item) {
            var genre_sel    = parseInt($("#home-genre").val());
            var area_sel     = parseInt($("#home-area").val());
            var category_sel = parseInt($("#home-category").val());
            var group_sel    = parseInt($("#home-group").val());

            var element = item.getElement();

            if (!checkGridFilter(element, 'data-genre', genre_sel)){
                return false;
            }
            if (!checkGridFilter(element, 'data-area', area_sel)){
                return false;
            }
            if (!checkGridFilter(element, 'data-category', category_sel)){
                return false;
            }
            if (!checkGridFilter(element, 'data-group', group_sel)){
                return false;
            }
            return true;
        });
    }
}

function debuglog(text) {
    ons.notification.toast(text, { timeout: 1000, animation: 'fall' });
}


// ページをreloadする方法
function doReload() {
    window.location.reload();
}
function doReloadNoCache() {
    // キャッシュを無視してサーバーからリロード
    window.location.reload(true);

}
