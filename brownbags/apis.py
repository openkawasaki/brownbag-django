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

from brownbags.models import Shop
from brownbags.models import ImageData
from brownbags.models import IMAGE_DATA_CLASS

#---------------------------------------------
class shop(APIView):
    """
    店舗データ
    """

    def get(self, request, *args, **keywords):
        try:
            logger.debug("GET: shop()")
            name = request.GET.get('name', None)

            if name is None or len(name) <= 0:
                raise Exception("name is None")

            dict_shop = shop_get(name)

            result   = { "shop": dict_shop }
            response = Response(result, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error("GET: shop : {}".format(e))
            result = {}
            response = Response(result, status=status.HTTP_404_NOT_FOUND)

        return response

    def post(self, request, *args, **keywords):
        try:
            logger.debug("POST: shop()")

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
            result   = {}
            response = Response(result, status=status.HTTP_404_NOT_FOUND)

        return response

#---------------------------------------------
def shop_get(name):

    try:
        try:
            obj_shop = Shop.objects.get(name=name)
        except MultipleObjectsReturned:
            obj_shop = Shop.objects.filter(name=name).order_by('id').first()
        except Shop.DoesNotExist:
            raise Exception("shop does not exist")

        dict_shop = obj_shop.to_dict()
        dict_shop["images"] = {}

        """
        expired_date ??
        last day ??
        """

        # ImageData:name
        image_list = ImageData.objects.filter(shop=obj_shop, image_data_class=IMAGE_DATA_CLASS[1][0])
        image_data_name_list = []
        for row in image_list:
            image_data = row.image_data
            file = image_data.file
            filename = os.path.basename(file.name)
            url  = image_data.url

            image_dict = {
                "id": row.pk,
                "name": filename,
                "src": url
            }
            image_data_name_list.append(image_dict)

        dict_shop["images"]["name"] = image_data_name_list

        # ImageData:takeaway
        image_list = ImageData.objects.filter(shop=obj_shop, image_data_class=IMAGE_DATA_CLASS[2][0])
        image_data_takeaway_list = []
        for row in image_list:
            image_data = row.image_data
            file = image_data.file
            filename = os.path.basename(file.name)
            url = image_data.url

            image_dict = {
                "id": row.pk,
                "name": filename,
                "src": url
            }
            image_data_takeaway_list.append(image_dict)

        dict_shop["images"]["takeaway"] = image_data_takeaway_list

        # ImageData:delivery
        image_list = ImageData.objects.filter(shop=obj_shop, image_data_class=IMAGE_DATA_CLASS[3][0])
        image_data_delivery_list = []
        for row in image_list:
            image_data = row.image_data
            file = image_data.file
            filename = os.path.basename(file.name)
            url = image_data.url

            image_dict = {
                "id": row.pk,
                "name": filename,
                "src": url
            }
            image_data_delivery_list.append(image_dict)

        dict_shop["images"]["delivery"] = image_data_delivery_list

        return dict_shop

    except Exception as e:
        traceback.print_exc()
        raise Exception(e)
#---------------------------------------------
def shop_post(post_data):

    try:
        name = post_data["name"]

        if name is None or len(name) <= 0:
            raise Exception("name is None")

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

        obj_shop.description = post_data["description"]
        obj_shop.addr_sel = post_data["addr_sel"]
        obj_shop.addr = post_data["addr"]

        obj_shop.area_sel = post_data["area_sel"]
        obj_shop.takeaway = post_data["takeaway"]
        obj_shop.takeaway_menu = post_data["takeaway_menu"]
        obj_shop.takeaway_note = post_data["takeaway_note"]

        obj_shop.delivery_demaekan = post_data["delivery"]["demaekan"]
        obj_shop.delivery_ubereats = post_data["delivery"]["ubereats"]
        obj_shop.delivery_own = post_data["delivery"]["own"]
        obj_shop.delivery_other = post_data["delivery"]["other"]
        obj_shop.delivery_menu = post_data["delivery"]["menu"]
        obj_shop.delivery_note = post_data["delivery"]["note"]

        obj_shop.phone = post_data["phone"]
        obj_shop.opening_hours = post_data["opening_hours"]
        obj_shop.close_day = post_data["close_day"]

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

        obj_shop.latitude = float(post_data["latitude"]) if len(post_data["latitude"]) > 0 else 0.0
        obj_shop.longitude = float(post_data["longitude"]) if len(post_data["longitude"]) > 0 else 0.0

        obj_shop.covid19 = post_data["covid19"]
        obj_shop.note = post_data["note"]

        # obj_shop.image_name     = post_data["images"]["name"][0] if len(post_data["images"]["name"]) > 0 else None
        # obj_shop.image_takeaway = post_data["images"]["takeaway"][0] if len(post_data["images"]["takeaway"]) > 0 else None
        # obj_shop.image_delivery = post_data["images"]["delivery"][0] if len(post_data["images"]["delivery"]) > 0 else None

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

        # ImageData:delivery
        if "images" in post_data and "delivery" in post_data["images"]:
            for row in post_data["images"]["delivery"]:
                if row is None or len(row) <= 0:
                    continue

                obj_image = ImageData(shop=obj_shop)
                obj_image.image_data = obj_image.decode_base64_file(obj_shop.pk, row)
                obj_image.image_data_class = IMAGE_DATA_CLASS[3][0]
                obj_image.update()

    except Exception as e:
        traceback.print_exc()
        raise Exception(e)


