from django.shortcuts import render
from django.http import HttpResponseForbidden, HttpResponse
from django.views.decorators.csrf import csrf_exempt

from rest_framework.response import Response
from rest_framework import status

import os
import traceback

#--------------------------------------------------
import logging
logger = logging.getLogger('app')

#--------------------------------------------------
@csrf_exempt
def app(request):
    '''

    :param request:
    :return:
    '''

    try:
        contexts = {}
        LINE_APP_LIFFID = os.environ["LINE_APP_LIFFID"]
        contexts["line_app_liffId"] = LINE_APP_LIFFID
        return render(request, 'app/index.html', contexts)

    except Exception as e:
        traceback.print_exc()
        result = {"result": "error"}
        return Response(result, status=status.HTTP_404_NOT_FOUND)
