from django.shortcuts import get_object_or_404, render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import TaskSerializer,ImageSerializer,UserSerializer, UserProfileSerializer,LocationSerializer
from .models import ImageText, Task, UserProfile,Location
from rest_framework.views import APIView, status
from rest_framework.permissions import IsAuthenticated,AllowAny
from django.http import JsonResponse
from django.contrib.auth import authenticate, login ,logout
from django.middleware.csrf import get_token
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User


@api_view(['GET', 'POST'])  # Specify allowed HTTP methods
def createlocation(request):
    """
    List all locations or create a new location.

    GET requests return a list of all locations.
    POST requests create a new location.
    """

    if request.method == 'GET':
        locations = Location.objects.all()
        serializer = LocationSerializer(locations, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = LocationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)  # Handle invalid methods


# Get the CSRF token
def csrf_token(request):
    csrf_token = get_token(request)
    return JsonResponse({'csrfToken': csrf_token})


# Create your views here.
def front (request):
    context = { }
    return render(request, 'index.html', context)

#registerdirecttodb
@api_view(['GET','POST'])
def task(request):
    if request.method == 'GET':
        task = Task.objects.all()
        serializer = TaskSerializer(task, many = True)
        return Response(serializer.data)


    elif request.method == 'POST':
        serializer = TaskSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Get the username of the currently authenticated user
@login_required
def get_username(request):
    username = request.user.username
    return JsonResponse({'username': username})

# Get the profile picture of a user
@login_required
def get_user_profile(request):
    user_id = request.user
    try:
        user_profile = UserProfile.objects.get(user_id=user_id)
        profile_picture_url = user_profile.image.url if user_profile.image else None
        return JsonResponse({'profile_picture_url': profile_picture_url})
    except UserProfile.DoesNotExist:
        return JsonResponse({'error': 'User profile not found'}, status=404)


class ImageTextDetailView(APIView):
    def get(self, request, id):
        image_text = get_object_or_404(ImageText, id=id)
        serializer = ImageSerializer(image_text)
        return Response(serializer.data)


class ImageTextListView(APIView):
    def get(self, request):
        dashview = ImageText.objects.all()
        serializer = ImageSerializer(dashview, many=True)
        return Response(serializer.data) 


class ImageTextCreateView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        serializer = ImageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)       
        if user is not None:
            login(request, user)            
            return Response({"detail": "Successfully logged in."})
        else:
            return Response({"detail": "Invalid credentials."}, status=status.HTTP_400_BAD_REQUEST)

#logout from current user
class LogoutView(APIView):
    def post(self, request, *args, **kwargs):
        logout(request)       
        return Response({"detail": "Successfully logged out."})
    
   

@api_view(['POST'])
def register(request):
    if request.method == 'POST':
        first_name = request.data.get('fname')
        last_name = request.data.get('lname')
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email')
        phone = request.data.get('phone')
        address = request.data.get('address')
        interest = request.data.get('interest')
        skills = request.data.get('skills')
        image = request.data.get('image')
        option = request.data.get('option')
        
        if not (username and password and email and first_name and last_name and option):
            return JsonResponse({'error': 'Please provide all required fields'}, status=400)

        # Create user using Django's default authentication system
        user = User.objects.create_user(username=username, email=email, password=password, first_name=first_name, last_name=last_name)
        print(user.id)
        # Create UserProfile instance
        UserProfile.objects.create(user_id=user.id, option=option, phone=phone, address=address, interest=interest, skills=skills, image=image )


        return JsonResponse({'success': 'User registered successfully'})
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)

@api_view(['PUT'])
def update_user(request):
    if request.method == 'PUT':
        user_id = request.data.get('user_id')
        first_name = request.data.get('fname')
        last_name = request.data.get('lname')
        email = request.data.get('email')
        phone = request.data.get('phone')
        address = request.data.get('address')
        interest = request.data.get('interest')
        skills = request.data.get('skills')

        # Update user using Django's default authentication system
        user = User.objects.get(id=user_id)
        user.first_name = first_name
        user.last_name = last_name
        user.email = email
        user.save()

        # Update UserProfile instance
        profile = UserProfile.objects.get(user_id=user.id)
        profile.phone = phone
        profile.address = address
        profile.interest = interest
        profile.skills = skills
        profile.save()

        # Serialize the updated user and profile instances
        user_serializer = UserSerializer(user)
        profile_serializer = UserProfileSerializer(profile)

        return JsonResponse({
            'success': 'User updated successfully',
            'user': user_serializer.data,
            'profile': profile_serializer.data
        })
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)

# Get the details of the currently authenticated user
@login_required
@api_view(['GET'])
def userdetails(request):
    user_id = request.user.id
    print(user_id)
    user = User.objects.get(id=user_id)
    user_profile = UserProfile.objects.get(user_id=user_id)

    data = {
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'phone': user_profile.phone,
        'address': user_profile.address,
        'interest': user_profile.interest,
        'skills': user_profile.skills,
    }
    return JsonResponse(data)




@api_view(['DELETE'])
def task_detail(request, pk):
    try:
        task = Task.objects.get(pk=pk)
    except Task.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'DELETE':
        task.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)