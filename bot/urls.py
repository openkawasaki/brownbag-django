from . import views
from django.urls import path

app_name = 'bot'

urlpatterns = [
    path('', views.callback, name='callback'),
]
