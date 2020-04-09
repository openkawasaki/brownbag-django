from django.urls import include, path
from . import views
from django.views.generic.base import RedirectView

from . import apis

# アプリケーションの名前空間
app_name = 'brownbags'

urlpatterns = [
    path('', views.index, name='index'),

    path('api/v1.0/shop/', apis.shop.as_view(), name='apis_shop'),
]
