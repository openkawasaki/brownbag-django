from django.db import models
#from django.contrib.gis.db import models
from django.utils import timezone
from django.forms.models import model_to_dict
from django.utils.translation import ugettext as _

import config.settings as settings
import logging
logger = logging.getLogger('api')
import traceback

from django.utils import timezone
#from django.contrib.auth.models import Group
from datetime import datetime,timedelta

from django.core.files.base import ContentFile
import os
import base64
import six
#import uuid

from io import BytesIO
from PIL import Image

from imagekit.models import ImageSpecField
from imagekit.processors import ResizeToFill

from .validators import validate_file_extension

# データタイプ
DATA_TYPE_CLASS = (
    (0, 'オーナー'),
    (1, 'ユーザー'),
    (-1, '---'),
)

# 区分
IMAGE_DATA_CLASS = (
    (0, 'その他'),
    (1, '店舗'),
    (2, 'テイクアウト'),
    (-1, '---'),
)

# ジャンル
GENRE_CLASS = (
    (0, 'その他'),
    (1, 'お弁当・お惣菜'),
    (2, '中華料理'),
    (3, '和食・日本料理・お寿司'),
    (4, 'ピザ・パスタ'),
    (5, '洋食・西洋料理・とんかつ'),
    (6, '居酒屋・ダイニングバー・焼鳥'),
    (7, 'アジア・エスニック・カレー'),
    (8, 'ステーキ・ハンバーグ・焼肉・ホルモン'),
    (9, '創作料理・無国籍料理'),
    (10, 'ラーメン'),
    (11, 'カフェ・喫茶店'),
    (12, 'バー・パブ・ラウンジ'),
    (13, 'パン・サンドイッチ'),
    (14, 'スイーツ'),
    (15, 'スーパーマーケット・コンビニエンスストア'),
    (-1, 'ジャンルなし'),
)

# 地域
AREA_CLASS = (
    (0, 'その他'),
    (1, '武蔵小杉・新丸子・元住吉'),
    (2, '武蔵新城・武蔵中原'),
    (3, '溝の口・梶ヶ谷・鷺沼'),
    (4, '登戸・稲田堤'),
    (5, '川崎・平間'),
    (6, '百合ヶ丘・新百合ヶ丘'),
    (-1,'地域の指定なし'),
)

# カテゴリー
CATEGORY_CLASS = (
    (0, 'その他'),
    (1, 'テイクアウト（持ち帰り）'),
    (2, 'デリバリーサービス（出前・配達）'),
    (-1,'指定なし'),
)

# テイクアウト（持ち帰り）
TAKEAWAY_CLASS= (
    (0, 'その他'),
    (1, '対応している'),
    (2, '対応してない'),
    (3, '準備中'),
    (-1,'指定なし'),
)

#-------------------------------------------------------
class Shop(models.Model):
    """
    お店のモデル
    """
    class Meta:
        verbose_name = _('店舗')  # オブジェクトの人間が読める名前(単数)小文字でよい
        verbose_name_plural = _('店舗')  # オブジェクトの複数の名前 小文字でよい

    type = models.IntegerField("type", choices=DATA_TYPE_CLASS, default=-1)

    agreement = models.BooleanField('agreement', blank=False, null=False, default=False)

    mail = models.CharField('mail', max_length=512, blank=False, null=True, default=None)
    name = models.CharField('name', max_length=512, blank=False, null=True, default=None, unique=True)

    genre_sel = models.IntegerField("genre_sel", choices=GENRE_CLASS, default=-1)

    description = models.CharField('description', max_length=256, blank=True, null=True, default=None)
    addr_sel    = models.CharField('addr_sel', max_length=256, blank=True, null=True, default=None)
    addr        = models.CharField('addr', max_length=256, blank=True, null=True, default=None)

    area_sel    = models.IntegerField("area_sel", choices=AREA_CLASS, default=-1)

    takeaway_sel  = models.IntegerField("takeaway_sel", choices=TAKEAWAY_CLASS, default=-1)
    takeaway_menu = models.TextField('takeaway_menu', max_length=1024, blank=True, null=False, default="")
    takeaway_note = models.TextField('takeaway_note', max_length=1024, blank=True, null=False, default="")

    delivery_demaekan = models.BooleanField('delivery_demaekan', blank=False, null=False, default=False)
    delivery_ubereats = models.BooleanField('delivery_ubereats', blank=False, null=False, default=False)
    delivery_own      = models.BooleanField('delivery_own', blank=False, null=False, default=False)
    delivery_other    = models.BooleanField('delivery_other', blank=False, null=False, default=False)
    delivery_note     = models.TextField('delivery_note', max_length=512, blank=True, null=False, default="")

    phone    = models.CharField('phone', max_length=256, blank=True, null=True, default=None)
    open_day = models.TextField('open_day', max_length=1024, blank=True, null=False, default="")

    payment_cash = models.BooleanField('payment_cash', blank=False, null=False, default=False)
    payment_card = models.BooleanField('payment_card', blank=False, null=False, default=False)
    payment_qr   = models.BooleanField('payment_qr', blank=False, null=False, default=False)
    payment_emoney = models.BooleanField('payment_emoney', blank=False, null=False, default=False)
    payment_note = models.TextField('payment_note', max_length=512, blank=True, null=False, default="")

    website     = models.CharField('website', max_length=1024, blank=True, null=True, default=None)

    twitter   = models.CharField('twitter', max_length=256, blank=True, null=True, default=None)
    facebook  = models.CharField('facebook', max_length=256, blank=True, null=True, default=None)
    instagram = models.CharField('instagram', max_length=256, blank=True, null=True, default=None)
    line      = models.CharField('line', max_length=256, blank=True, null=True, default=None)
    sns_other = models.CharField('sns_other', max_length=256, blank=True, null=True, default=None)

    transportation = models.TextField('transportation', max_length=512, blank=True, null=False, default="")
    diet_note      = models.TextField('diet_note', max_length=512, blank=True, null=False, default="")
    allergy_note   = models.TextField('allergy_note', max_length=512, blank=True, null=False, default="")

    latitude  = models.FloatField('latitude', blank=False, null=False, default=0.0)
    longitude = models.FloatField('longitude', blank=False, null=False, default=0.0)

    covid19_note = models.TextField('covid19_note', max_length=512, blank=True, null=False, default="")
    note         = models.TextField('note', max_length=512, blank=True, null=False, default="")

    ## 各種ステータス情報
    expired_shop_date = models.DateTimeField(blank=True, null=True) # お店無効
    closes_shop_date  = models.DateTimeField(blank=True, null=True) # お店休止・閉店
    soldout_takeaway_date = models.DateTimeField(blank=True, null=True) # テイクアウト売り切れ
    soldout_delivery_date = models.DateTimeField(blank=True, null=True) # デリバリー売り切れ

    created_date = models.DateTimeField('作成日', default=timezone.now)
    update_date  = models.DateTimeField('修正日', blank=True, null=True)

    def to_dict(self):
        return model_to_dict(self)

    def update(self):
        self.update_date = timezone.now()
        self.save()

    def __str__(self):
        return self.name

# ----------------------------------
def image_get_default_data(width=None, height=None):
    '''
    デフォルトイメージ取得
    :param width:
    :param height:
    :return:
    '''
    try:
        pathname = os.path.join(settings.BASE_DIR, 'static', 'brownbags', 'images', 'noimage.png')

        if width is not None and height is not None:
            image_data_str = image_as_base64(pathname, width, height)
        else:
            image_data_str = image_as_base64(pathname)

        if image_data_str is None:
            image_data_str = ""

        return image_data_str

    except Exception as e:
        logger.error('system error: %s' % e)
        traceback.print_exc()
        return ""

#------------------------------------------------------
def image_as_base64(image_file, width=None, height=None):
    """
    :param image_file: `image_file` for the complete path of image.
    :param width:
    :param height:
    :return: base64 string data
    """

    try:
        if not os.path.isfile(image_file):
            return None

        if width is not None and height is not None:
            img = Image.open(image_file)

            format = img.format

            img_resize = img.resize((width, height))

            buffered = BytesIO()
            img_resize.save(buffered, format=format)
            img_str = base64.b64encode(buffered.getvalue())
            image_string = img_str.decode('utf-8')

            return 'data:image/%s;base64,%s' % (format, image_string)

        else:
            with open(image_file, 'rb') as img_f:
                decoded_file = img_f.read()
                extension = get_file_extension(image_file, decoded_file)
                encoded_string = base64.b64encode(decoded_file)
                image_string   = encoded_string.decode('utf-8')

            return 'data:image/%s;base64,%s' % (extension, image_string)

    except Exception as e:
        logger.error('system error: %s' % e)
        traceback.print_exc()
        raise Exception("image_as_base64() error: " + image_file)

#------------------------------------------------------
def get_file_extension(file_name, decoded_file):
    """
    :param `file_name` for the complete path of image.
    :param `decoded_file` is image data
    """
    import imghdr

    extension = imghdr.what(file_name, decoded_file)
    extension = "jpg" if extension == "jpeg" else extension

    return extension

# ------------------------------------------------------
def get_image_path(self, filename):
    """カスタマイズした画像パスを取得する.
    :param self: インスタンス (models.Model)
    :param filename: 元ファイル名
    :return: カスタマイズしたファイル名を含む画像パス
    """

    timetext  = datetime.now().strftime("%Y%m%d%H%M%S%f")
    extension = os.path.splitext(filename)[-1]
    savefilename = timetext + extension

    return os.path.join("images", str(self.shop.pk), savefilename)

#------------------------------------------------------
class ImageData(models.Model):
    '''
    画像データ
    see also: https://qiita.com/felyce/items/57421ea191ab89175e9e
    '''
    class Meta:
        verbose_name = _('画像')
        verbose_name_plural = _('画像')

    shop = models.ForeignKey(Shop, verbose_name='Shop', related_name='image', on_delete=models.CASCADE)

    image_data = models.ImageField(_('画像'), upload_to=get_image_path,  default="/static/brownbags/images/noimage.png", blank=True, null=True, validators=[validate_file_extension])  # 画像

    image_data_thumbnail = ImageSpecField(source='image_data',
                                          processors=[ResizeToFill(80, 80)],
                                          format='JPEG',
                                          options={'quality': 60})

    image_data_small = ImageSpecField(source='image_data',
                                        processors=[ResizeToFill(240,160)],
                                        format="JPEG",
                                        options={'quality': 60}
                                        )

    image_data_middle = ImageSpecField(source='image_data',
                                       processors=[ResizeToFill(480, 320)],
                                       format="JPEG",
                                       options={'quality': 75})

    image_data_big   = ImageSpecField(source='image_data',
                                       processors=[ResizeToFill(720, 480)],
                                       format="JPEG",
                                       options={'quality': 75})

    image_data_class = models.IntegerField("クラス", choices=IMAGE_DATA_CLASS, default=-1)
    image_data_order = models.IntegerField("順番", default=0)

    expired_date = models.DateTimeField(blank=True, null=True)

    created_date = models.DateTimeField(default=timezone.now)
    update_date  = models.DateTimeField(blank=True, null=True)


    def get_pathname(self):
        """
        get file path name
        """
        return self.image_data.path

    def get_cover_base64(self, width=None, height=None):
        """
        convert to base64
        """
        return image_as_base64(self.image_data.path, width, height)

    def decode_base64_file(self, image_id, data):
        # Check if this is a base64 string
        if isinstance(data, six.string_types):
            # Check if the base64 string is in the "data:" format
            if 'data:' in data and ';base64,' in data:
                # Break out the header from the base64 content
                header, data = data.split(';base64,')

            # Try to decode the file. Return validation error if it fails.
            decoded_file = None
            try:
                decoded_file = base64.b64decode(data)
            except TypeError:
                TypeError('invalid_image')

            # Generate file name:
            file_name = datetime.now().strftime("%Y%m%d%H%M%S%f")
            file_extension = get_file_extension(file_name, decoded_file)

            complete_file_name = "%s.%s" % (file_name, file_extension,)

            complete_file_path = os.path.join(str(image_id), complete_file_name)

            return ContentFile(decoded_file, name=complete_file_path)

    def get_name(self):
        return self.shop.name

    get_name.short_description = 'name'

    def to_dict(self):
        return model_to_dict(self)

    def update(self):
        self.update_date = timezone.now()
        self.save()

    def __str__(self):
        return self.shop.name

