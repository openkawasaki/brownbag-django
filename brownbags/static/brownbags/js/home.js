var home_grid = null;

function home_init() {
}

function home_show() {
    home_hide();

    var grid_list = getItemList();
    if (grid_list !== null) {
        for (var ii=0; ii<grid_list.length; ii++) {
            var item = grid_list[ii];
            var name = item["name"];

            var shop_id      = item["shop_id"];
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
                           onclick="fn.pushPage({'id':'/static/brownbags/html/info.html', 'title':'${name}', 'index':'${shop_id}', 'param':''})">
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
    updateGrid();0
}

function home_hide() {
    if (home_grid !== null) {
        $("#home_grid").children().remove();
        home_grid = null;
    }
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

function updateGrid() {

    if (home_grid !== null) {
        home_grid.filter(function (item) {
            var genre_sel    = g_genre_sel;
            var area_sel     = g_area_sel;
            var category_sel = g_category_sel;
            var group_sel    = g_group_sel;

            var element = item.getElement();

            if (genre_sel !== null) {
                if (!checkGridFilter(element, 'data-genre', genre_sel)) {
                    return false;
                }
            }
            if (area_sel !== null) {
                if (!checkGridFilter(element, 'data-area', area_sel)) {
                    return false;
                }
            }
            if (category_sel !== null) {
                if (!checkGridFilter(element, 'data-category', category_sel)) {
                    return false;
                }
            }
            if (group_sel !== null) {
                if (!checkGridFilter(element, 'data-group', group_sel)) {
                    return false;
                }
            }
            return true;
        });
    }

    // 検索条件
    $('#filter_home_name').text(getListItemNames());
}

// ページをreloadする方法
function doReload() {
    window.location.reload();
}
function doReloadNoCache() {
    // キャッシュを無視してサーバーからリロード
    window.location.reload(true);

}
