from rest_framework import serializers
from .models import ImageText, Task, UserProfile,User,Location
from rest_framework_gis.serializers import GeoFeatureModelSerializer

class TaskSerializer(serializers.ModelSerializer):
	class Meta:
		model = Task
		fields ='__all__'

class ImageSerializer(serializers.ModelSerializer):
	class Meta:
		model = ImageText
		fields ='__all__'

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)
    class Meta:
        model = User
        fields = ['id','username', 'email', 'profile','first_name','last_name']

class LocationSerializer(GeoFeatureModelSerializer):
      class Meta:
            model=Location
            geo_field = 'point'
            fields = '__all__'
            # fields = ['id','name','point']

