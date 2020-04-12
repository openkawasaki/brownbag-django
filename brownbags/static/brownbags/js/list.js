function getItem(index) {
    var item = getShopItem(index);
    if (!item) {
        return null;
    }
    var name = "";
    if ("name" in item)
        name = item["name"];

    var phone = "";
    if ("phone" in item)
        phone = item["phone"];

    var genre = "";
    if ("genre_sel" in item)
        genre = get_genre_sel_name(item["genre_sel"]);

    var imageurl = "";
    if (item["images"]["name"].length > 0) {
        imageurl = get_image_url(item["images"]["name"][0],"/static/brownbags/images/none.png");
    } else {
        imageurl = "/static/brownbags/images/none.png";
    }

    var data = {
        id: index,
        name: name,
        url: imageurl,
        phone: phone,
        genre: genre
    };
    //console.log("getItem1: " + JSON.stringify(data));
    return data;
}

function createItem(index) {
    var item = getItem(index);
    if (!item) {
        return null;
    }
    //console.log("createItem: " + JSON.stringify(item));
    if (!isEmpty(item["phone"])) {
        return ons.createElement(`
            <ons-list-item onclick="fn.pushPage({'id':'/static/brownbags/html/info.html', 'title':'${item.name}', 'index':'${index}'})" modifier="chevron">
                <div class="left">
                    <img class="list-item__thumbnail" src="${item.url}">
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
                    <img class="list-item__thumbnail" src="${item.url}">
                </div>
                <div class="center">
                    <span class="list-item__title">${item.name}</span><span class="list-item__subtitle">${item.genre}</span>
                </div>
            </ons-list-item>
        `);
    }
}
