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
from django.core.exceptions import ObjectDoesNotExist
import logging
from django.contrib.auth import get_user_model



@api_view(['GET', 'POST'])
def createlocation(request):
    if request.method == 'GET':
        locations = Location.objects.all()
        serializer = LocationSerializer(locations, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = LocationSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    else:
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)


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

@login_required
def get_option(request):
    user_id = request.user.id
    try:
        user_profile = UserProfile.objects.get(user_id=user_id)
        option = user_profile.option
        return JsonResponse({'option': option})
    except UserProfile.DoesNotExist:
        return JsonResponse({'error': 'User profile not found'}, status=404)


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
        Services = get_object_or_404(ImageText, id=id)
        serializer = ImageSerializer(Services)
        return Response(serializer.data)


class ImageTextListView(APIView):
    def get(self, request):
        dashview = ImageText.objects.all()
        serializer = ImageSerializer(dashview, many=True)
        return Response(serializer.data) 


class ImageTextCreateView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        serializer = ImageSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.validated_data['user_id'] = request.user.id
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# class LoginView(APIView):
#     def post(self, request, *args, **kwargs):
#         username = request.data.get('username')
#         password = request.data.get('password')
#         user = authenticate(request, username=username, password=password)       
#         if user is not None:
#             login(request, user)            
#             return Response({"detail": "Successfully logged in."})
#         else:
#             return Response({"detail": "Invalid credentials."}, status=status.HTTP_400_BAD_REQUEST)
    
 

class LoginView(APIView):
    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        password = request.data.get('password')
        User = get_user_model()
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"detail": "Invalid credentials."}, status=status.HTTP_400_BAD_REQUEST)
        
        if user.check_password(password):
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
        first_name = request.data.get('first_name')
        last_name = request.data.get('last_name')
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email')
        phone = request.data.get('phone')
        address = request.data.get('address')
        interest = request.data.get('interest')
        skills = request.data.get('skills')
        image = request.data.get('image')
        option = request.data.get('option')
        organization_name = request.data.get('organization_name')
        
        if not (username and password and email and first_name and last_name and option):
            return JsonResponse({'error': 'Please provide all required fields'}, status=400)

        # Create user using Django's default authentication system
        user = User.objects.create_user(username=username, email=email, password=password, first_name=first_name, last_name=last_name)
        print(user.id)
        # Create UserProfile instance
        UserProfile.objects.create(user_id=user.id, option=option, phone=phone, address=address, interest=interest, skills=skills, image=image , organization_name = organization_name)

        return JsonResponse({'success': 'User registered successfully'})
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)


logger = logging.getLogger(__name__)
@login_required
@api_view(['PUT'])
def update_user(request):
    try:
        if request.method == 'PUT':
            user_id = request.user.id
            logger.info('Updating user with id %s', user_id)
            logger.info('Request data: %s', request.data)
            first_name = request.data.get('first_name')
            last_name = request.data.get('last_name')
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
    except ObjectDoesNotExist as e:
        return JsonResponse({'error': 'User or UserProfile does not exist'}, status=404)
    except Exception as e:
        print(e)
        return JsonResponse({'error': str(e)}, status=500)



@login_required
@api_view(['PUT'])
def update_services(request, pk):
    try:
        if request.method == 'PUT':
            logger.info('Updating ImageText with id %s', pk)
            logger.info('Request data: %s', request.data)

            # Get the fields from the request
            title = request.data.get('title')
            descr = request.data.get('descr')
            contact = request.data.get('contact')
            tasks = request.data.get('tasks')
            objectives = request.data.get('objectives')
            skills = request.data.get('skills')
            experience = request.data.get('experience')
            image = request.data.get('image')

            # Get the ImageText instance and update its fields
            image_text = ImageText.objects.get(pk=pk)
            image_text.title = title
            image_text.descr = descr
            image_text.contact = contact
            image_text.tasks = tasks
            image_text.objectives = objectives
            image_text.skills = skills
            image_text.experience = experience
            image_text.image = image
            image_text.save()

            # Serialize the updated ImageText instance
            serializer = ImageSerializer(image_text)

            return JsonResponse({
                'success': 'ImageText updated successfully',
                'image_text': serializer.data
            })
        else:
            return JsonResponse({'error': 'Method not allowed'}, status=405)
    except ObjectDoesNotExist as e:
        return JsonResponse({'error': 'ImageText does not exist'}, status=404)
    except Exception as e:
        logger.error(e)
        return JsonResponse({'error': str(e)}, status=500)
    



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


@login_required
@api_view(['GET'])
def view_services(request):
    user_id = request.user.id
    image_texts = ImageText.objects.filter(user_id=user_id)
    serializer = ImageSerializer(image_texts, many=True)
    return Response(serializer.data)


@api_view(['DELETE'])
def task_detail(request, pk):
    try:
        task = Task.objects.get(pk=pk)
    except Task.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'DELETE':
        task.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)