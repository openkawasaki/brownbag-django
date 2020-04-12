from django.contrib import admin

from django.contrib.auth.models import User, Group
from django.utils.safestring import mark_safe

from brownbags.models import Shop, ImageData

#----------------------------
#admin.site.register(Shop)
class ShopAdmin(admin.ModelAdmin):
    # 一覧画面に表示させる項目
    list_display = ('id', 'name', 'mail')  # 一覧に出したい項目

    # 詳細画面へのリンクを付ける項目
    list_display_links = ('id', 'name', 'mail')  # 修正リンクでクリックできる項目

    # ソート順を指定する
    #ordering = ['id', 'facility_id', 'facility_name']

    # 右端のフィルター項目
    #list_filter = ['target_year', 'area_name', "operator"]

    # 検索窓で対象となる項目
    #search_fields = ['facility_id', 'facility_name']

    # 変指定フィールドの日付を使って日付ベースで絞り込み
    #date_hierarchy = 'created_date'

    # 変更リストをページ分割(paginate) - ページあたりの項目数(default:100)
    list_per_page = 15

admin.site.register(Shop, ShopAdmin)

#----------------------------
class ImageDataAdmin(admin.ModelAdmin):
    # 一覧画面に表示させる項目
    list_display = ('id', 'get_shop_name', 'image_data_class', 'image_tag')  # 一覧に出したい項目

    # 詳細画面へのリンクを付ける項目
    list_display_links = ('id', 'get_shop_name')  # 修正リンクでクリックできる項目

    def image_tag(self, obj):
        return mark_safe('<img src="{}" style="width:50px;height:auto;">'.format(obj.image_data_thumbnail.url))

    # 一覧画面に表示
    def get_shop_name(self, obj):
        return obj.shop.name

    get_shop_name.admin_order_field = 'name' # Allows column order sorting
    get_shop_name.short_description = '店舗'   #   Renames column head

    # ソート順を指定する
    #ordering = ['id', 'facility_id', 'facility_name']

    # 右端のフィルター項目
    #list_filter = ['target_year', 'area_name', "operator"]

    # 検索窓で対象となる項目
    search_fields = ['shop__name', 'image_data_class']

    # 変指定フィールドの日付を使って日付ベースで絞り込み
    #date_hierarchy = 'created_date'

    # 変更リストをページ分割(paginate) - ページあたりの項目数(default:100)
    list_per_page = 15

admin.site.register(ImageData, ImageDataAdmin)
