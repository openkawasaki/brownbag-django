from django.urls import include, path
from . import views

# set the application namespace
app_name = 'accounts'

urlpatterns = [
    path('token', views.token),
    path('certificate', views.certification.as_view(), name='apis_certification_view'),
]
