from django.urls import include, path
from . import views
from django.views.generic.base import RedirectView
from rest_framework import routers

from . import apis

# アプリケーションの名前空間
app_name = 'brownbags'

urlpatterns = [
    path('', views.index, name='index'),
    path('edit/', views.edit, name='edit'),

    path('api/v1.0/shop/list/', apis.shop_list.as_view(), name='apis_shop_list'),
    path('api/v1.0/shop/', apis.shop.as_view(), name='apis_shop'),

    #path('api-auth/', include('rest_framework.urls', namespace='rest_framework'))
]

from rest_framework import routers
from .apis import ShopViewSet, ImageDataViewSet

#---------------------------------------------

router = routers.DefaultRouter()
router.register('api/1.0/data/shop', ShopViewSet)
router.register('api/1.0/data/image', ImageDataViewSet)

urlpatterns += router.urls