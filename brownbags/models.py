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

# 区分
IMAGE_DATA_CLASS = (
    (0, 'その他'),
    (1, '店舗'),
    (2, 'テイクアウト'),
    (3, 'デリバリー'),
    (-1, '---'),
)

#-------------------------------------------------------
class Shop(models.Model):
    """
    お店のモデル
    """
    class Meta:
        verbose_name = _('店')  # オブジェクトの人間が読める名前(単数)小文字でよい
        verbose_name_plural = _('店')  # オブジェクトの複数の名前 小文字でよい

    type = models.IntegerField('type', blank=False, null=False, default=0)

    agreement = models.BooleanField('agreement', blank=False, null=False, default=False)

    mail = models.CharField('mail', max_length=256, blank=False, null=True, default=None)
    name = models.CharField('name', max_length=256, blank=False, null=True, default=None, unique=True)

    description = models.CharField('description', max_length=256, blank=False, null=True, default=None)
    addr_sel    = models.CharField('addr_sel', max_length=256, blank=False, null=True, default=None)
    addr        = models.CharField('addr', max_length=256, blank=False, null=True, default=None)

    area_sel    = models.CharField('area_sel', max_length=256, blank=False, null=True, default=None)
    takeaway    = models.CharField('takeaway', max_length=256, blank=False, null=True, default=None)
    takeaway_menu = models.CharField('takeaway_menu', max_length=256, blank=False, null=True, default=None)
    takeaway_note = models.CharField('takeaway_note', max_length=256, blank=False, null=True, default=None)

    delivery_demaekan = models.BooleanField('delivery_demaekan', blank=False, null=False, default=False)
    delivery_ubereats = models.BooleanField('delivery_ubereats', blank=False, null=False, default=False)
    delivery_own      = models.BooleanField('delivery_own', blank=False, null=False, default=False)
    delivery_other    = models.BooleanField('delivery_other', blank=False, null=False, default=False)
    delivery_menu = models.CharField('delivery_menu', max_length=256, blank=False, null=True, default=None)
    delivery_note = models.CharField('delivery_note', max_length=256, blank=False, null=True, default=None)

    phone = models.CharField('phone', max_length=256, blank=False, null=True, default=None)
    opening_hours = models.CharField('opening_hours', max_length=256, blank=False, null=True, default=None)
    close_day     = models.CharField('close_day', max_length=256, blank=False, null=True, default=None)

    payment_cash = models.BooleanField('payment_cash', blank=False, null=False, default=False)
    payment_card = models.BooleanField('payment_card', blank=False, null=False, default=False)
    payment_qr   = models.BooleanField('payment_qr', blank=False, null=False, default=False)
    payment_emoney = models.BooleanField('payment_emoney', blank=False, null=False, default=False)
    payment_note = models.CharField('payment_note', max_length=256, blank=False, null=True, default=None)

    website     = models.CharField('website', max_length=256, blank=False, null=True, default=None)

    twitter   = models.CharField('twitter', max_length=256, blank=False, null=True, default=None)
    facebook  = models.CharField('facebook', max_length=256, blank=False, null=True, default=None)
    instagram = models.CharField('instagram', max_length=256, blank=False, null=True, default=None)
    line      = models.CharField('line', max_length=256, blank=False, null=True, default=None)
    sns_other = models.CharField('sns_other', max_length=256, blank=False, null=True, default=None)

    transportation = models.CharField('transportation', max_length=256, blank=False, null=True, default=None)
    diet_note    = models.CharField('diet_note', max_length=256, blank=False, null=True, default=None)
    allergy_note = models.CharField('allergy_note', max_length=256, blank=False, null=True, default=None)

    latitude  = models.FloatField('latitude', blank=False, null=False, default=0.0)
    longitude = models.FloatField('longitude', blank=False, null=False, default=0.0)

    covid19 = models.CharField('covid19', max_length=256, blank=False, null=True, default=None)

    note = models.TextField('note', max_length=512, blank=True, null=False, default="")

    #image_name     = models.CharField('image_name',     max_length=102400, blank=False, null=True, default=None)
    #image_takeaway = models.CharField('image_takeaway', max_length=102400, blank=False, null=True, default=None)
    #image_delivery = models.CharField('image_delivery', max_length=102400, blank=False, null=True, default=None)

    ## 各種ステータス情報
    expired_shop_date = models.DateTimeField(blank=False, null=True) # お店無効
    closes_shop_date = models.DateTimeField(blank=False, null=True) # お店休止・閉店
    soldout_takeaway_date = models.DateTimeField(blank=False, null=True) # テイクアウト売り切れ
    soldout_delivery_date = models.DateTimeField(blank=False, null=True) # デリバリー売り切れ

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
        pathname = os.path.join(settings.BASE_DIR, 'static', 'brownbags', 'images', 'none.png')

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

#------------------------------------------------------
class ImageData(models.Model):
    '''
    画像データ
    '''
    class Meta:
        verbose_name = _('画像')
        verbose_name_plural = _('画像')

    shop = models.ForeignKey(Shop, verbose_name='Shop', related_name='image', on_delete=models.CASCADE)

    # https://qiita.com/kojionilk/items/da20c732642ee7377a78
    image_data = models.ImageField(_('画像'), upload_to='images/',  default="/static/brownbags/images/none.png", blank=True, null=True)  # 画像
    image_data_thumbnail = ImageSpecField(source='image_data', processors=[ResizeToFill(80, 80)], format='JPEG', options={'quality': 60})

    image_data_class = models.IntegerField("区分", choices=IMAGE_DATA_CLASS, default=-1)

    expired_date = models.DateTimeField(blank=False, null=True)

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
        """
        Save Base64 String into Django ImageField
        https://stackoverflow.com/questions/36993615/save-base64-string-into-django-imagefield
        """

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
            #file_name = str(uuid.uuid4())[:12]  # 12 characters are more than enough.
            file_name = datetime.now().strftime("%Y%m%d%H%M%S%f")  # マイクロ秒まで
            # Get the file name extension:
            file_extension = get_file_extension(file_name, decoded_file)

            complete_file_name = "%s.%s" % (file_name, file_extension,)

            #timestamp = datetime.now()
            #year = timestamp.strftime("%Y")
            #month = timestamp.strftime("%m")
            #day = timestamp.strftime("%d")
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

