#from django.shortcuts import render
#from django.contrib.auth.decorators import login_required
#from django.contrib.auth import authenticate
#from django.http import JsonResponse

#from django.shortcuts import render, redirect
#from django.views.decorators.http import require_POST

#from django.utils.translation import ugettext as _
#import os
#import sys
#import mimetypes
#import json
#import datetime

import logging
logger = logging.getLogger('api')
#import traceback

from django.contrib.auth import authenticate
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
#from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAuthenticatedOrReadOnly
#from rest_framework.authentication import TokenAuthentication
#from rest_framework import generics, permissions
from rest_framework.decorators import permission_classes


# ---------------------------------------------
@csrf_exempt
def token(request):
    try:
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(username=username, password=password)
        print(username, password, user)
        if not user:
            return JsonResponse({"detail":"no such user"}, status=400)

        token = Token.objects.get_or_create(user=user)
        return JsonResponse({'token': str(token), 'id':str(user.pk) })

    except Exception as e:
        logger.error("{}".format(e))
        result = {"code":"-1", 'message': '{}'.format(e)}
        return JsonResponse(result, status=status.HTTP_400_BAD_REQUEST)

# ---------------------------------------------
@permission_classes([IsAuthenticatedOrReadOnly])
class certification(APIView):
    """
    certification
    """

    def get(self, request, *args, **keywords):
        try:
            result = {"code": "1", "message": "complete"}
            response = JsonResponse(result, status=status.HTTP_200_OK)

        except Exception as e:
            result = {"code": "-1", 'message': '{}'.format(e)}
            response = JsonResponse(result, status=status.HTTP_404_NOT_FOUND)

        return response
