function grid_init() {
}
var home_grid = null;
function grid_show() {

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
function grid_hide() {
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
