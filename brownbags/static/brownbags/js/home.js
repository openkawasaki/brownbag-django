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
    //make_selector(CATEGORY_CLASS, "home-category");
    make_selector(GROUP_CLASS, "home-group");
}

var home_grid = null;
function home_show() {
    home_hide();

    var grid_list = getShopItems();

    //var items = [];
    for (var ii = 0; ii < grid_list.length; ii++) {
        var item = grid_list[ii];
        var name  = item["name"];
        var genre_sel = item["genre_sel"];
        var genre = get_genre_sel_name(genre_sel);
        var image_thumbnail = '/static/brownbags/images/noimage.png';
        var image_src = image_thumbnail;

        if (!isEmpty(item["middle"])) {
            image_thumbnail = item["middle"];
        }
        if (!isEmpty(item["big"])) {
            image_src = item["big"];
        }

        var elem = `<ons-card class="grid_item"
                        data-name="${name}" data-genre="${genre_sel}" 
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

    home_grid = new Muuri('.home_grid');


    /*
    $('.list-btn li.filter-genre').click(function(){
        home_grid.filter(function (item) {
            var element = item.getElement();
            var data_genre = element.getAttribute('data-genre');

            var item_data = parseInt(data_genre, 10);
            if (isNaN(item_data))
                item_data = -1;
            return item_data === -1;
        });
    });

    $('.list-btn li.filter-clear').click(function(){
        home_grid.filter('.grid_item');
    });
    */
}
function home_hide() {
    $("#home_grid").children().remove();
    home_grid = null;
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
