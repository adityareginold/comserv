from rest_framework import serializers
from .models import ImageText, Task, UserProfile,User,Location
from rest_framework_gis.serializers import GeoFeatureModelSerializer

class TaskSerializer(serializers.ModelSerializer):
	class Meta:
		model = Task
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

class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImageText
        fields = ('id', 'user_id', 'image', 'title', 'descr', 'objectives', 'tasks', 'skills', 'experience', 'contact')

    def create(self, validated_data):
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            return ImageText.objects.create(user=request.user, **validated_data)
        raise serializers.ValidationError("User must be authenticated to create an ImageText object.")
    

class LocationSerializer(GeoFeatureModelSerializer):
    image_text_id = serializers.PrimaryKeyRelatedField(source='image_text', queryset=ImageText.objects.all())
    class Meta:
        model = Location
        geo_field = 'point'
        fields = ('id', 'name', 'point', 'image_text_id')