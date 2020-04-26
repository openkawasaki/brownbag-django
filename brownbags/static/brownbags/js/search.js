//---------------------------------------
function search_int() {
    make_selector(GENRE_CLASS,"search-genre");
    make_selector(AREA_CLASS, "search-area");
    make_selector(CATEGORY_CLASS, "search-category");
    make_selector(GROUP_CLASS, "search-group");
}

//---------------------------------------
var g_genre_sel    = null;
var g_area_sel     = null;
var g_category_sel = null;
var g_group_sel    = null;

var listItems      = null;

function filterListItemsSelect(val_key, val_sel, items, item_nums) {

    if (val_sel !== null && val_sel !== -1) {
        var item_nums_sel = [];

        for (var ii=0; ii<item_nums.length; ii++) {
            var no = item_nums[ii];
            var item = items[no];
            if (item[val_key] === val_sel) {
                item_nums_sel.push(no);
            }
        }
        return item_nums_sel;
    }

    return item_nums;
}

function setListItems() {
    if (g_genre_sel !== null) {
        $('#search-genre').val(g_genre_sel);
    }
    if (g_area_sel !== null) {
        $('#search-area').val(g_area_sel);
    }
    if (g_category_sel !== null) {
        $('#search-category').val(g_category_sel);
    }
    if (g_group_sel !== null) {
        $('#search-group').val(g_group_sel);
    }
}

function getListItemNames() {
    var name = [];

    if (g_genre_sel !== null && g_genre_sel !== -1) {
        name.push(get_sel_name(GENRE_CLASS, g_genre_sel));
    }
    if (g_area_sel !== null && g_area_sel !== -1) {
        name.push(get_sel_name(AREA_CLASS, g_area_sel));
    }
    if (g_category_sel !== null && g_category_sel !== -1) {
        name.push(get_sel_name(CATEGORY_CLASS, g_category_sel));
    }
    if (g_group_sel !== null && g_group_sel !== -1) {
        name.push(get_sel_name(GROUP_CLASS, g_group_sel));
    }

    if (name.length === 0) {
        return '指定なし';
    } else {
        return name.join('、');
    }
}

function setFilterName() {
    // 検索条件
    $('#filter_name').text(getListItemNames());
}

function filterListItems() {
    g_genre_sel    = parseInt($('#search-genre').val());
    g_area_sel     = parseInt($('#search-area').val());
    g_category_sel = parseInt($('#search-category').val());
    g_group_sel    = parseInt($('#search-group').val());

    console.log("g_genre_sel    = " + g_genre_sel);
    console.log("g_area_sel     = " + g_area_sel);
    console.log("g_category_sel = " + g_category_sel);
    console.log("g_group_sel    = " + g_group_sel);

    var items = getShopItems();

    var item_nums = [];
    for (ii=0; ii<items.length; ii++) {
        item_nums.push(ii);
    }

    item_nums = filterListItemsSelect("genre_sel", g_genre_sel, items, item_nums);
    item_nums = filterListItemsSelect("area_sel", g_area_sel, items, item_nums);
    item_nums = filterListItemsSelect("category_sel", g_category_sel, items, item_nums);
    item_nums = filterListItemsSelect("group_sel", g_group_sel, items, item_nums);

    listItems = item_nums;
    updateList();
}

function resetListItems() {
    listItems      = null;

    g_genre_sel    = null;
    g_area_sel     = null;
    g_category_sel = null;
    g_group_sel    = null;

    updateList();

    setFilterName();

    $(".select-input").val("-1");
}

function countListItems() {
    if (listItems === null) {
        return getShopItemCount();
    } else {
        return listItems.length;
    }
}

function createListItems(index) {
    if (listItems === null) {
        return createItem(index);

    } else if (0 <= index && index < listItems.length) {
        var ii = listItems[index];
        return createItem(ii);

    } else {
        return ons.createElement(`
                <ons-list-item modifier="chevron">
                </ons-list-item>
            `);
    }
}

