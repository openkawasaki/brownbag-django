from rest_framework import serializers
from .models import Shop, ImageData

#----------------------------
class ShopSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shop
        fields = ('type', 'category_sel', 'name')


#----------------------------
class ImageDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImageData
        fields = ('image_data')
