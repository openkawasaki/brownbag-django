/*
function grid_init() {
}
*/
function grid_show() {
    grid_list = getShopItems();

    for (var ii = 0; ii < grid_list.length; ii++) {
        var item = grid_list[ii];
        var name = item["name"];
        var image_thumbnail = '/static/brownbags/images/noimage.png';
        var image_src = image_thumbnail;

        if (!isEmpty(item["middle"])) {
            image_thumbnail = item["middle"];
        }
        if (!isEmpty(item["big"])) {
            image_src = item["big"];
        }

        var elem = `<ons-card class="grid" onclick="fn.pushPage({'id':'/static/brownbags/html/info.html', 'title':'${name}', 'index':'${ii}'})">
                        <img src="${image_src}" alt="${name}" style="width: 100%">
                        <div class="content">
                          <ons-list>
                            <ons-list-item>${name}</ons-list-item>
                          </ons-list>
                        </div>
                    </ons-card>`;

        //$("#masonry").append(html);
        $("#masonry").isotope()
          .append( elem )
          .isotope( 'appended', elem )
          .isotope('layout');
    }

    /*
    jQuery(document).ready(function () {
        $('#masonry').masonry({
            itemSelector: '.grid',
            isFitWidth: true,
            isAnimated: true
        });
    });
    */
    jQuery(document).ready(function () {
        $('#masonry').isotope({
            // options
            itemSelector: '.grid',
            layoutMode: 'fitRows',
            masonry: {
                columnWidth: 300
            }
        });
        //$('#masonry').isotope( 'reloadItems' ).isotope( { sortBy: 'original-order' } );
        //$('#masonry').isotope('reloadItems')
        //$('#masonry').redraw();

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
function grid_hide() {
    $("#masonry").children().remove();
    //$("#masonry").empty();
    //$('#masonry').isotope('reloadItems')
    $("#masonry").isotope('destroy')
}