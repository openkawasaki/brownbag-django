from django.db import models
#from django.contrib.gis.db import models
from django.utils import timezone
from django.forms.models import model_to_dict
from django.utils.translation import ugettext as _

# Create your models here.

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

    image_name     = models.CharField('image_name',     max_length=102400, blank=False, null=True, default=None)
    image_takeaway = models.CharField('image_takeaway', max_length=102400, blank=False, null=True, default=None)
    image_delivery = models.CharField('image_delivery', max_length=102400, blank=False, null=True, default=None)

    # 作成・修正
    created_date = models.DateTimeField('作成日', default=timezone.now)
    update_date  = models.DateTimeField('修正日', blank=True, null=True)

    def to_dict(self):
        return model_to_dict(self)

    def update(self):
        self.update_date = timezone.now()
        self.save()

    def __str__(self):
        return self.name
