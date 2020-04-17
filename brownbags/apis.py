from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils.translation import ugettext as _
from django.http import JsonResponse

#import config.settings as settings
import logging
logger = logging.getLogger('api')
import traceback

import os

#from wsgiref.util import FileWrapper
#from django.http import StreamingHttpResponse
#import urllib.parse

from django.core.exceptions import MultipleObjectsReturned
#from django.db.models import Avg, Max, Min, Sum
from django.db.models import Q

from brownbags.models import Shop
from brownbags.models import ImageData
from brownbags.models import IMAGE_DATA_CLASS

#---------------------------------------------
class shop_list(APIView):
    """
    店舗リストデータ
    """

    def get(self, request, *args, **keywords):
        try:
            #logger.debug("GET: shop_list()")

            area_sel     = request.GET.get('area_sel', None)
            genre_sel    = request.GET.get('genre_sel', None)
            category_sel = request.GET.get('category_sel', None)

            shop_list = shop_get_list(area_sel, genre_sel, category_sel)

            result   = { "shop": shop_list }
            response = Response(result, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error("GET: shop : {}".format(e))
            result = {'message': '{}'.format(e)}
            response = Response(result, status=status.HTTP_404_NOT_FOUND)

        return response

#---------------------------------------------
class shop(APIView):
    """
    店舗データ
    """

    def get(self, request, *args, **keywords):
        try:
            #logger.debug("GET: shop()")

            shop_id = request.GET.get('shop_id', None)
            if shop_id is None:
                raise Exception("shop_id is None")

            shop_id = int(shop_id)
            shop = shop_get(shop_id)
            result   = { "shop": shop }
            response = Response(result, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error("GET: shop : {}".format(e))
            result = {'message': '{}'.format(e)}
            response = Response(result, status=status.HTTP_404_NOT_FOUND)

        return response

    def post(self, request, *args, **keywords):
        try:
            #logger.debug("POST: shop()")

            # 現在ログインしている?
            #if not request.user.is_authenticated:
            #    raise Exception("authenticated error")

            # BodyからPOSTデータ取得
            """
            body_data = request.body
            body_data_str = body_data.decode("utf-8")  # bytes -> string
            post_data = json.loads(body_data_str)  # string -> json
            """
            post_data = request.data
            shop_post(post_data)

            result   = {}
            response = Response(result, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error("POST: shop : {}".format(e))
            result = {'message': '{}'.format(e)}
            response = Response(result, status=status.HTTP_404_NOT_FOUND)

        return response

#------------------------------------------------------
"""
def get_queries_or(ids):

    # OR条件でフィルター作成
    #queries = [Q(device__deviceID=deviceID) for deviceID in deviceIDs]
    queries = [Q(device__id=id) for id in ids]
    device_query = queries.pop()
    for item in queries:
        device_query |= item

    return device_query
"""
#------------------------------------------------------
def get_queryset(area_sel=None, genre_sel=None, category_sel=None):

    # 検索条件
    condition_area_sel  = Q()
    condition_genre_sel = Q()
    condition_category  = Q()

    if area_sel is not None:
        condition_area_sel = Q(area_sel=area_sel)

    if genre_sel is not None:
        condition_genre_sel = Q(genre_sel=genre_sel)

    if category_sel is not None:
        condition_category = Q(category_sel=category_sel)

    return condition_area_sel, condition_genre_sel, condition_category

#---------------------------------------------
def shop_get_list(area_sel=None, genre_sel=None, category_sel=None):

    try:
        if area_sel is None and genre_sel is None and category_sel is None:
            shops = Shop.objects.all().values_list('id','name', 'phone', 'genre_sel', 'latitude', 'longitude', flat=False).order_by('id').distinct('id')
        else:
            condition_area_sel, condition_genre_sel, category_sel = get_queryset(area_sel, genre_sel, category_sel)
            shops = Shop.objects.filter(condition_area_sel & condition_genre_sel & category_sel).values_list('id','name', 'phone', 'genre_sel', 'latitude', 'longitude', flat=False).order_by('id').distinct('id')

        shop_list = []
        for row in shops:
            shop_id = row[0]
            image_data = ImageData.objects.filter(shop_id=shop_id, image_data_class=IMAGE_DATA_CLASS[1][0]).order_by('image_data_order').first()
            url = image_data.image_data_thumbnail.url
            data = {
                "shop_id": shop_id,
                "name": row[1],
                "phone": row[2] if row[2] is not None else "",
                "genre_sel": row[3],
                "latitude": row[4],
                "longitude": row[5],
                "image_id": image_data.pk,
                "src": url if url is not None else "",
            }

            shop_list.append(data)

        return shop_list

    except Exception as e:
        traceback.print_exc()
        raise Exception(e)

#---------------------------------------------
def shop_get(shop_id):

    try:
        shop = Shop.objects.filter(id=shop_id).order_by('id').first()
        if shop is None:
            raise Exception("shop not found")

        data = shop_get_data(shop)
        return data

    except Exception as e:
        traceback.print_exc()
        raise Exception(e)

#---------------------------------------------
def shop_get_data(obj_shop):

    dict_shop = {}

    try:
        dict_shop = obj_shop.to_dict()
        dict_shop["images"] = {}

        #if "name" in dict_shop:
        #    logger.debug("shop_get_data(): name = {}".format(dict_shop["name"]))

        # ImageData:name
        image_list = ImageData.objects.filter(shop=obj_shop, image_data_class=IMAGE_DATA_CLASS[1][0]).order_by('image_data_order')
        image_data_name_list = []
        for row in image_list:
            if row.expired_date is not None:
                continue

            image_dict = {
                "id": row.pk,
                "src"      : row.image_data.url,
                "thumbnail": row.image_data_thumbnail.url,
                "small"    : row.image_data_small.url,
                "middle"   : row.image_data_middle.url,
                "big"      : row.image_data_big.url
            }
            image_data_name_list.append(image_dict)

        dict_shop["images"]["name"] = image_data_name_list

        # ImageData:takeaway
        image_list = ImageData.objects.filter(shop=obj_shop, image_data_class=IMAGE_DATA_CLASS[2][0]).order_by('image_data_order')
        image_data_takeaway_list = []
        for row in image_list:
            if row.expired_date is not None:
                continue

            image_dict = {
                "id": row.pk,
                "src"      : row.image_data.url,
                "thumbnail": row.image_data_thumbnail.url,
                "small"    : row.image_data_small.url,
                "middle"   : row.image_data_middle.url,
                "big"      : row.image_data_big.url
            }
            image_data_takeaway_list.append(image_dict)

        dict_shop["images"]["takeaway"] = image_data_takeaway_list

        return dict_shop

    except Exception as e:
        if "name" in dict_shop:
            logger.error("shop_get_data(): name = {}".format(dict_shop["name"]))
        else:
            logger.error("shop_get_data()")
        traceback.print_exc()
        raise Exception(e)

#---------------------------------------------
def shop_post(post_data):

    try:
        name = post_data["name"]

        if name is None or len(name) <= 0:
            raise Exception("name is None")

        logger.info("POST: shop = " + name)

        try:
            obj_shop = Shop.objects.get(name=name)
        except MultipleObjectsReturned:
            obj_shop = Shop.objects.filter(name=name).order_by('id').first()
        except Shop.DoesNotExist:
            obj_shop = Shop()

        obj_shop.type = post_data["type"]
        obj_shop.agreement = post_data["agreement"]

        obj_shop.mail = post_data["mail"]
        obj_shop.name = post_data["name"]

        obj_shop.genre_sel = int(post_data["genre_sel"]) if len(post_data["genre_sel"]) > 0 else -1

        obj_shop.description = post_data["description"]
        obj_shop.addr_sel = post_data["addr_sel"]
        obj_shop.addr = post_data["addr"]

        obj_shop.area_sel = int(post_data["area_sel"]) if len(post_data["area_sel"]) > 0 else -1

        obj_shop.takeaway_sel  = int(post_data["takeaway_sel"]) if len(post_data["takeaway_sel"]) > 0 else -1
        obj_shop.takeaway_menu = post_data["takeaway_menu"]
        obj_shop.takeaway_note = post_data["takeaway_note"]

        obj_shop.delivery_demaekan = post_data["delivery"]["demaekan"]
        obj_shop.delivery_ubereats = post_data["delivery"]["ubereats"]
        obj_shop.delivery_own = post_data["delivery"]["own"]
        obj_shop.delivery_other = post_data["delivery"]["other"]
        obj_shop.delivery_note = post_data["delivery"]["note"]

        obj_shop.phone = post_data["phone"]
        obj_shop.open_day = post_data["open_day"]

        obj_shop.payment_cash = post_data["payment"]["cash"]
        obj_shop.payment_card = post_data["payment"]["card"]
        obj_shop.payment_qr = post_data["payment"]["qr"]
        obj_shop.payment_emoney = post_data["payment"]["emoney"]
        obj_shop.payment_note = post_data["payment"]["note"]

        obj_shop.website = post_data["website"]

        obj_shop.twitter = post_data["sns"]["twitter"]
        obj_shop.facebook = post_data["sns"]["facebook"]
        obj_shop.instagram = post_data["sns"]["instagram"]
        obj_shop.line = post_data["sns"]["line"]
        obj_shop.sns_other = post_data["sns"]["other"]

        obj_shop.transportation = post_data["transportation"]
        obj_shop.diet_note = post_data["diet_note"]
        obj_shop.allergy_note = post_data["allergy_note"]

        addr = post_data["addr_sel"] + post_data["addr"]
        if is_float(post_data["latitude"]) and is_float(post_data["longitude"]):
            obj_shop.latitude  = float(post_data["latitude"])
            obj_shop.longitude = float(post_data["longitude"])
        elif len(addr) > 0:
            coordinates = geocoding(addr)
            obj_shop.longitude = coordinates[0]["longitude"]
            obj_shop.latitude  = coordinates[0]["latitude"]
        else:
            obj_shop.longitude = 0.0
            obj_shop.latitude  = 0.0

        obj_shop.covid19_note = post_data["covid19_note"]
        obj_shop.note = post_data["note"]

        obj_shop.update()

        # ImageData:name
        if "images" in post_data and "name" in post_data["images"]:
            for row in post_data["images"]["name"]:
                if row is None or len(row) <= 0:
                    continue

                obj_image = ImageData(shop=obj_shop)
                obj_image.image_data = obj_image.decode_base64_file(obj_shop.pk, row)
                obj_image.image_data_class = IMAGE_DATA_CLASS[1][0]
                obj_image.update()

        # ImageData:takeaway
        if "images" in post_data and "takeaway" in post_data["images"]:
            for row in post_data["images"]["takeaway"]:
                if row is None or len(row) <= 0:
                    continue

                obj_image = ImageData(shop=obj_shop)
                obj_image.image_data = obj_image.decode_base64_file(obj_shop.pk, row)
                obj_image.image_data_class = IMAGE_DATA_CLASS[2][0]
                obj_image.update()

    except Exception as e:
        traceback.print_exc()
        raise Exception(e)


#-----------------------------------
def is_float(n):
    try:
        float(n)
    except ValueError:
        return False

    return True

#-----------------------------------

import requests
import urllib.parse
import xml.etree.ElementTree as ET

def geocoding(addr):
    '''
    ジオコーディング
    :param addr:住所文字列
    :return:
    '''

    coordinates = []

    try:
        addr_enc = urllib.parse.quote(addr)

        # 東京大学空間情報科学研究センター
        # CSISシンプルジオコーディング実験
        # http://newspat.csis.u-tokyo.ac.jp/geocode/modules/geocode/index.php?content_id=1
        url = "http://geocode.csis.u-tokyo.ac.jp/cgi-bin/simple_geocode.cgi?charset=UTF8&addr=" + addr_enc

        # HTTP GET: 緯度経度取得
        read_data = requests.get(url)
        # 読み込みデータ取得
        xml_string = read_data.text

        # xmlデータを読み込みます
        root = ET.fromstring(xml_string)

        # candidate => longitude, latitude
        candidates = root.findall('candidate')
        for row in candidates:
            # 座標取得
            longitude = float(row.find("longitude").text)
            latitude  = float(row.find("latitude").text)
            coordinates.append({"longitude":longitude, "latitude":latitude})

    except Exception as e:
        traceback.print_exc()
        raise Exception('geocoding() error = {}'.format(e))

    return coordinates
