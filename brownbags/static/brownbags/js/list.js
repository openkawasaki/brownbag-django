function list_show() {
    setFilterName();
}

function updateList() {
    var infiniteList = document.getElementById('infinite-list');
    infiniteList.delegate = {
        createItemContent: function(index) {
            return createListItems(index);
        },
        countItems: function() {
            return countListItems();
        },
        /*
        calculateItemHeight: function(index) {
            var height = 200;
            return height; // Return the height of an item in pixels.
        },
         */
    };
    infiniteList.refresh();
}

function getItem(index) {
    var item = getShopItem(index);
    if (!item) {
        return null;
    }

    var shop_id  = item["shop_id"];
    var name     = item["name"];
    var phone    = item["phone"];
    var genre    = get_sel_name(GENRE_CLASS, item["genre_sel"]);

    var image_id = item["image_id"];
    var imageurl = "";
    if (!isEmpty(item["src"])) {
        imageurl = item["src"];
    } else {
        imageurl = "/static/brownbags/images/noimage.png";
    }

    var data = {
        id: index,
        shop_id: shop_id,
        name: name,
        phone: phone,
        genre: genre,
        image_id: image_id,
        url: imageurl
    };
    return data;
}

function createItem(index) {
    var item = getItem(index);
    if (!item) {
        return ons.createElement('<ons-list-item></ons-list-item>');
    }
    //console.log("createItem: " + JSON.stringify(item));
    if (!isEmpty(item["phone"])) {
        return ons.createElement(`
            <ons-list-item onclick="fn.pushPage({'id':'/static/brownbags/html/info.html', 'title':'${item.name}', 'index':'${index}'})" modifier="chevron">
                <div class="left">
                    <img class="list-item__thumbnail" src="${item.url}" style="border:1px #000 solid;">
                </div>
                <div class="center">
                    <span class="list-item__title">${item.name}</span><span class="list-item__subtitle">${item.genre}<br><a href='tel:${item.phone}'>${item.phone}</a></span>
                </div>
            </ons-list-item>
        `);
    } else {
        return ons.createElement(`
            <ons-list-item onclick="fn.pushPage({'id':'/static/brownbags/html/info.html', 'title':'${item.name}', 'index':'${index}'})" modifier="chevron">
                <div class="left">
                    <img class="list-item__thumbnail" src="${item.url}" style="border:1px #000 solid;">
                </div>
                <div class="center">
                    <span class="list-item__title">${item.name}</span><span class="list-item__subtitle">${item.genre}</span>
                </div>
            </ons-list-item>
        `);
    }
}
