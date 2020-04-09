from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils.translation import ugettext as _
from django.http import JsonResponse

#import config.settings as settings
import logging
logger = logging.getLogger('api')
import traceback

#import os

#from wsgiref.util import FileWrapper
#from django.http import StreamingHttpResponse
#import urllib.parse

from django.core.exceptions import MultipleObjectsReturned

from brownbags.models import Shop

#---------------------------------------------
class shop(APIView):
    """
    店舗データ
    """

    def get(self, request, *args, **keywords):
        try:
            logger.debug("GET: shop()")
            #facility_id = request.GET.get('facility_id', "")
            result = {}
            response = Response(result, status=status.HTTP_200_OK)

        except Exception as e:
            traceback.print_exc()
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
            name = post_data["name"]

            if name is None or len(name) <= 0:
                raise Exception("name is None")

            try:
                obj_shop = Shop.objects.get(name=name)
            except MultipleObjectsReturned:
                obj_shop = Shop.objects.filter(name=name).order_by('id').first()
            except Shop.DoesNotExist:
                obj_shop = Shop()

            obj_shop.type      = post_data["type"]
            obj_shop.agreement = post_data["agreement"]

            obj_shop.mail = post_data["mail"]
            obj_shop.name = post_data["name"]

            obj_shop.description = post_data["description"]
            obj_shop.addr_sel    = post_data["addr_sel"]
            obj_shop.addr        = post_data["addr"]

            obj_shop.area_sel = post_data["area_sel"]
            obj_shop.takeaway = post_data["takeaway"]
            obj_shop.takeaway_menu = post_data["takeaway_menu"]
            obj_shop.takeaway_note = post_data["takeaway_note"]

            obj_shop.delivery_demaekan = post_data["delivery"]["demaekan"]
            obj_shop.delivery_ubereats = post_data["delivery"]["ubereats"]
            obj_shop.delivery_own      = post_data["delivery"]["own"]
            obj_shop.delivery_other    = post_data["delivery"]["other"]
            obj_shop.delivery_menu     = post_data["delivery"]["menu"]
            obj_shop.delivery_note     = post_data["delivery"]["note"]

            obj_shop.phone         = post_data["phone"]
            obj_shop.opening_hours = post_data["opening_hours"]
            obj_shop.close_day     = post_data["close_day"]

            obj_shop.payment_cash   = post_data["payment"]["cash"]
            obj_shop.payment_card   = post_data["payment"]["card"]
            obj_shop.payment_qr     = post_data["payment"]["qr"]
            obj_shop.payment_emoney = post_data["payment"]["emoney"]
            obj_shop.payment_note   = post_data["payment"]["note"]

            obj_shop.website = post_data["website"]

            obj_shop.twitter   = post_data["sns"]["twitter"]
            obj_shop.facebook  = post_data["sns"]["facebook"]
            obj_shop.instagram = post_data["sns"]["instagram"]
            obj_shop.line      = post_data["sns"]["line"]
            obj_shop.sns_other = post_data["sns"]["other"]

            obj_shop.transportation = post_data["transportation"]
            obj_shop.diet_note      = post_data["diet_note"]
            obj_shop.allergy_note   = post_data["allergy_note"]

            obj_shop.latitude  = float(post_data["latitude"]) if len(post_data["latitude"]) > 0 else 0.0
            obj_shop.longitude = float(post_data["longitude"]) if len(post_data["longitude"]) > 0 else 0.0

            obj_shop.covid19 = post_data["covid19"]
            obj_shop.note = post_data["note"]

            obj_shop.image_name     = post_data["images"]["name"][0] if len(post_data["images"]["name"]) > 0 else None
            obj_shop.image_takeaway = post_data["images"]["takeaway"][0] if len(post_data["images"]["takeaway"]) > 0 else None
            obj_shop.image_delivery = post_data["images"]["delivery"][0] if len(post_data["images"]["delivery"]) > 0 else None

            obj_shop.update()

            result   = {}
            response = Response(result, status=status.HTTP_200_OK)

        except Exception as e:
            traceback.print_exc()
            result   = {}
            response = Response(result, status=status.HTTP_404_NOT_FOUND)

        return response
