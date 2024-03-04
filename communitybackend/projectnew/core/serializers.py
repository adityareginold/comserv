from rest_framework import serializers
from .models import ImageText, Task, UserProfile,User

class TaskSerializer(serializers.ModelSerializer):
	class Meta:
		model = Task
		fields ='__all__'

		
class ImageSerializer(serializers.ModelSerializer):
	class Meta:
		model = ImageText
		fields ='__all__'


# class UserProfileSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = UserProfile
#         fields = '__all__'  # Adjust fields as needed


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer()

    class Meta:
        model = User
        fields = ['username', 'email', 'profile']