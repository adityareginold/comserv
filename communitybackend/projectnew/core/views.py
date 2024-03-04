from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import TaskSerializer,ImageSerializer
from .models import ImageText, Task, UserProfile
from rest_framework.views import APIView, status
from rest_framework.permissions import IsAuthenticated,AllowAny
from django.http import JsonResponse
from django.contrib.auth import authenticate, login ,logout
from django.middleware.csrf import get_token
from django.contrib.auth.decorators import login_required



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

# @api_view(['GET','POST'])
# def dashview(request):
#     if request.method == 'GET':
#         dashview = ImageText.objects.all()
#         serializer = ImageSerializer(dashview, many =True)
#         return Response(serializer.data)

#     elif request.method == 'POST':
#         serializer = ImageSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#         return Response(status=status.HTTP_201_CREATED)
#     return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

 
# class ImageList(APIView):
#     def get(self, request):
#         if request.session.get('user_id'):
#             user_id = request.session.get('user_id')
#             dashview = ImageText.objects.filter(user_id=user_id)
#         else:
#              dashview = ImageText.objects.none()  # Return an empty queryset if no user is authenticated
#              serializer = ImageSerializer(dashview, many=True)
#              return Response(serializer.data)

#              from django.contrib.auth.models import User



# Get the username of the currently authenticated user
@login_required
def get_username(request):
    username = request.user.username
    return JsonResponse({'username': username})



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
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email')
        first_name = request.data.get('fname')
        last_name = request.data.get('lname')
        option = request.data.get('option')

        if not (username and password and email and first_name and last_name and option):
            return JsonResponse({'error': 'Please provide all required fields'}, status=400)

        # Create user using Django's default authentication system
        user = User.objects.create_user(username=username, email=email, password=password, first_name=first_name, last_name=last_name)
        print(user.id)
        # Create UserProfile instance
        UserProfile.objects.create(user_id=user.id, option=option)

        return JsonResponse({'success': 'User registered successfully'})
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)




@api_view(['DELETE'])
def task_detail(request, pk):
    try:
        task = Task.objects.get(pk=pk)
    except Task.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'DELETE':
        task.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    