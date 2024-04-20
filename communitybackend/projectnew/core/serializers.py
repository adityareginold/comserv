from rest_framework import serializers
from .models import ImageText, Task, UserProfile,User,Location,Participation,CompletedParticipation,Feedback
from rest_framework_gis.serializers import GeoFeatureModelSerializer
from django.shortcuts import get_object_or_404

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
        fields = ('id', 'user_id', 'image', 'title', 'descr', 'objectives', 'tasks', 'skills', 'experience', 'contact','date','enddate')

    def create(self, validated_data):
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            return ImageText.objects.create(user=request.user, **validated_data)
        raise serializers.ValidationError("User must be authenticated to create an ImageText object.")


class LocationSerializer(GeoFeatureModelSerializer):
    image_text_id = serializers.PrimaryKeyRelatedField(queryset=ImageText.objects.all())

    class Meta:
        model = Location
        geo_field = 'point'
        fields = ('id', 'name', 'point', 'image_text_id')

    def create(self, validated_data):
        image_text = validated_data.pop('image_text_id')
        location = Location.objects.create(image_text=image_text, **validated_data)
        return location

class ParticipationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Participation
        fields = '__all__'
    
class CompletedParticipationSerializer(serializers.ModelSerializer):
    image_text = ImageSerializer()  

    class Meta:
        model = CompletedParticipation
        fields = ['id', 'image_text', 'user_id', 'image_text_id']  

class ParticipateSerializer(serializers.ModelSerializer):
    image_text = ImageSerializer()  
    class Meta:
        model = Participation
        fields = ['id','image_text', 'user_id', 'image_text_id']  

class SearchSerializer(serializers.Serializer):
    keyword = serializers.CharField(max_length=100)


class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = ['id', 'user_id', 'rating', 'general_comments', 'organization_feedback', 'experience_feedback', 'suggestions']

    def create(self, validated_data):
        # Get the authenticated user
        user = self.context['request'].user

        # Get the CompletedParticipation instance
        cp_id = self.context['id']
        completed_participation = get_object_or_404(CompletedParticipation, id=cp_id)

        # Create the Feedback instance
        feedback = Feedback.objects.create(user=user, completed_participation=completed_participation, **validated_data)
        return feedback
    
class DetailedParticipationSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    image_text = ImageSerializer(read_only=True)

    class Meta:
        model = Participation
        fields = ['id', 'user', 'image_text']

class FeedbackReSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    completed_participation = CompletedParticipationSerializer(read_only=True)
    class Meta:
        model = Feedback
        fields = ['id', 'user','completed_participation','rating', 'general_comments', 'organization_feedback', 'experience_feedback', 'suggestions']

