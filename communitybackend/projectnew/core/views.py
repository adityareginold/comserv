from django.shortcuts import get_object_or_404,render
from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from rest_framework import status
from .serializers import ImageSerializer,UserSerializer,ParticipationSerializer, UserProfileSerializer,LocationSerializer,SearchSerializer,ParticipateSerializer,CompletedParticipationSerializer,FeedbackSerializer,DetailedParticipationSerializer,FeedbackReSerializer
from .models import ImageText, Task, UserProfile,Location,Participation,CompletedParticipation,Feedback
from rest_framework.views import APIView, status
from rest_framework.permissions import IsAuthenticated,AllowAny
from django.http import JsonResponse,Http404
from django.contrib.auth import authenticate, login ,logout
from django.middleware.csrf import get_token
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist
import logging,time,base64,struct
from django.contrib.auth import get_user_model
from django.db.models import Q
from django.utils import timezone
from rest_framework.pagination import PageNumberPagination
from rest_framework.generics import CreateAPIView
from rest_framework.exceptions import ValidationError
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_text
from django.contrib.sites.shortcuts import get_current_site
from django_otp.plugins.otp_totp.models import TOTPDevice
from django_otp.oath import totp
from django.http import HttpResponseRedirect
from rest_framework.permissions import IsAdminUser



class IsSuperUserView(APIView):
    def get(self, request):
        is_superuser = request.user.is_superuser
        return Response({'is_superuser': is_superuser})

from django.http import Http404

class UserListView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        users = User.objects.select_related('userprofile').all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

    def delete(self, request, pk, format=None):
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            raise Http404
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

UserModel = get_user_model()
@api_view(['POST'])
def password_reset_request(request):
    if request.method == "POST":
        email = request.data.get('email')
        user = UserModel.objects.filter(email=email).first()
        if user:
            token = default_token_generator.make_token(user)
            device = TOTPDevice.objects.create(user=user, name='default')
            key = base64.b32encode(struct.pack('>I', user.pk))  # Use user's primary key as secret key
            otp_token = totp(key, digits=6, step=30)  # Generate a 6-digit OTP token
            mail_subject = 'Password Reset Instruction'
            message = render_to_string('password_reset_email.html', {
                'user': user,
                'domain': get_current_site(request).domain,
                'uid': urlsafe_base64_encode(force_bytes(user.pk)),
                'token': token,
                'otp_token': otp_token,
            })
            send_mail(mail_subject, message, 'adityareginold@gmail.com', [email])
            return Response({"status": "Password reset email sent"}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "No user found with this email address"}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({"error": "Invalid request"}, status=status.HTTP_400_BAD_REQUEST)

def password_reset_redirect(request, uidb64, token):
    react_url = f'http://127.0.0.1:8000/resetredirect/{uidb64}/{token}'
    return HttpResponseRedirect(react_url)

@api_view(['POST'])
def password_reset_confirm(request, uidb64, token):
    if request.method == "POST":
        try:
            uid = force_text(urlsafe_base64_decode(uidb64))
            user = UserModel.objects.get(pk=uid)
        except(TypeError, ValueError, OverflowError, UserModel.DoesNotExist):
            user = None

        if user is not None and default_token_generator.check_token(user, token):
            otp_token = request.data.get('otp_token')
            new_password = request.data.get('new_password')
            device = TOTPDevice.objects.filter(user=user, name='default').first()

            if device.verify_token(otp_token):
                user.set_password(new_password)
                user.save()
                return Response({"status": "Password has been reset"}, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({"error": "Invalid request"}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
def viewServiceProviderFeedback(request):
    try:
        # Get the service provider's User from the request
        user = request.user

        # Get the ImageText instances uploaded by this service provider
        image_texts = ImageText.objects.filter(user=user)

        # Get the CompletedParticipation instances for these ImageText instances
        participations = CompletedParticipation.objects.filter(image_text__in=image_texts)

        # Get the Feedback instances for these participations
        feedbacks = Feedback.objects.filter(completed_participation__in=participations)
        feedbacks_serializer = FeedbackReSerializer(feedbacks, many=True)

        return Response(feedbacks_serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": "An unexpected error occurred: " + str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def viewparticipants(request):
    try:
        # Get the User from the request
        user = request.user

        # Get the ImageText instances for this user
        image_texts = ImageText.objects.filter(user=user)

        # Get the Participation instances for these services
        participations = Participation.objects.filter(image_text__in=image_texts)
        participations_serializer = DetailedParticipationSerializer(participations, many=True)

        for participation in participations_serializer.data:
            user_profile = UserProfile.objects.get(user_id=participation['user']['id'])
            user_profile_serializer = UserProfileSerializer(user_profile)
            participation['user']['profile'] = user_profile_serializer.data

        return Response(participations_serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": "An unexpected error occurred: " + str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


logger = logging.getLogger(__name__)
@api_view(['POST'])
def store_feedback(request, id):
    try:
        feedback_data = request.data
        feedback_data['user'] = request.user.id

        # Get the CompletedParticipation with the given id
        completed_participation = get_object_or_404(CompletedParticipation, id=id)
        feedback_data['completed_participation'] = completed_participation.id
        if Feedback.objects.filter(user=request.user, completed_participation=completed_participation).exists():
            return Response({"message": "Feedback already given"}, status=status.HTTP_400_BAD_REQUEST)
        serializer = FeedbackSerializer(data=feedback_data, context={'request': request, 'id': id})
        if serializer.is_valid(raise_exception=True):  # This will raise a ValidationError if the serializer is not valid
            feedback = serializer.save()
            return Response(FeedbackSerializer(feedback).data, status=status.HTTP_201_CREATED)
    except Http404:
        logger.exception("CompletedParticipation not found")
        return Response({"error": "CompletedParticipation not found"}, status=status.HTTP_404_NOT_FOUND)
    except ValidationError as e:
        logger.exception("Validation error")
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        logger.exception("An unexpected error occurred")
        return Response({"error": "An unexpected error occurred: " + str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ParticipateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        participations = Participation.objects.filter(user=request.user)

        for participation in participations:
            if participation.image_text.enddate < timezone.now().date():
                CompletedParticipation.objects.create(
                    image_text=participation.image_text,
                    user=participation.user,
                    # Set other fields as needed
                )
                participation.delete()

        completed_participations = CompletedParticipation.objects.filter(user=request.user)
        serializer = CompletedParticipationSerializer(completed_participations, many=True)
        return Response(serializer.data)
    
@login_required
@api_view(['GET'])
def get_user_participations(request):
    participations = Participation.objects.filter(user_id=request.user.id)
    serializer = ParticipateSerializer(participations, many=True)
    return Response(serializer.data)

from rest_framework import status
from rest_framework.response import Response

@login_required
@api_view(['DELETE'])
def delete_user_participation(request, id):
    try:
        participation = Participation.objects.get(id=id, user_id=request.user.id)
    except Participation.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    participation.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
def filter_view(request):
    start_date = request.GET.get('startDate')
    end_date = request.GET.get('endDate')
    skills = request.GET.getlist('skills')
    location = request.GET.get('location')  
    title = request.GET.get('title')  

    queryset = ImageText.objects.all()

    if start_date and end_date:
        queryset = queryset.filter(date__range=[start_date, end_date])

    if location:
        queryset = queryset.filter(location__icontains=location)

    if skills:
        q_objects = Q()
        for skill in skills:
            q_objects |= Q(skills__icontains=skill)
        queryset = queryset.filter(q_objects)

    if title:
        q_objects = Q()
        for t in title:  # Change this line
            q_objects |= Q(title__icontains=t)  # And this line
        queryset = queryset.filter(q_objects)
        print(queryset)

    results_serializer = ImageSerializer(queryset, many=True)
    return Response(results_serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
def sort_images(request):
    sort_order = request.query_params.get('order', 'asc')
    sort_field = request.query_params.get('sort', 'title')
    start_date = request.query_params.get('startDate', None)
    end_date = request.query_params.get('endDate', None)

    if sort_order.lower() == 'asc':
        sort_field = sort_field
    elif sort_order.lower() == 'desc':
        sort_field = '-' + sort_field
    else:
        return Response({"error": "Invalid sort order"}, status=status.HTTP_400_BAD_REQUEST)

    queryset = ImageText.objects.all()

    if start_date and end_date:
        try:
            start_date = timezone.datetime.strptime(start_date, '%Y-%m-%d').date()
            end_date = timezone.datetime.strptime(end_date, '%Y-%m-%d').date()
            queryset = queryset.filter(date__range=[start_date, end_date])
        except ValueError:
            return Response({"error": "Invalid date format. Expected YYYY-MM-DD."}, status=status.HTTP_400_BAD_REQUEST)

    queryset = queryset.order_by(sort_field)
    serializer = ImageSerializer(queryset, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
def search(request):
    serializer = SearchSerializer(data=request.query_params)
    if serializer.is_valid():
        keyword = serializer.validated_data['keyword']
        results = ImageText.objects.filter(
            Q(title__icontains=keyword)|
            Q(objectives__icontains=keyword) |
            Q(experience__icontains=keyword) |
            Q(skills__icontains=keyword) |
            Q(tasks__icontains=keyword)
        )
        print(results)
        results_serializer = ImageSerializer(results, many=True)
        return Response(results_serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def participation(request):
    user = request.user
    if 'imageTextId' not in request.data:
        return Response({"error": "imageTextId is required"}, status=status.HTTP_400_BAD_REQUEST)

    image_text_id = request.data['imageTextId']

    try:
        if Participation.objects.filter(user=user, image_text=image_text_id).exists():
            return Response({"message": "User is already registered for this activity"}, status=status.HTTP_400_BAD_REQUEST)
        image_text = ImageText.objects.get(id=image_text_id)
    except ImageText.DoesNotExist:
        return Response({"error": "ImageText does not exist"}, status=status.HTTP_404_NOT_FOUND)
    serializer = ParticipationSerializer(data={'user': user.id, 'image_text': image_text_id})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST'])
def createlocation(request, image_text=None):
    if request.method == 'GET':
        if image_text is not None:  # If image_id is provided
            locations = Location.objects.filter(image_text=image_text)  # Filter locations by image_text_id
        else:
            locations = Location.objects.all()  # If image_id is not provided, return all locations
        serializer = LocationSerializer(locations, many=True)
        return Response(serializer.data)


    elif request.method == 'POST':
        print(request.data)
        serializer = LocationSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print(serializer.errors) 
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


# Get the username of the currently authenticated user
@login_required
def get_username(request):
    username = request.user.username
    return JsonResponse({'username': username})

#Get the option volunteer or organization
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


# more details of the services
class ImageTextDetailView(APIView):
    def get(self, request, id):
        Services = get_object_or_404(ImageText, id=id)
        serializer = ImageSerializer(Services)
        return Response(serializer.data)
    
class StandardResultsSetPagination(PageNumberPagination):
    page_size = 8
    page_size_query_param = 'page_size'
    max_page_size = 1000
class ImageTextListView(APIView):
    def get(self, request):
        paginator = StandardResultsSetPagination()
        dashview = ImageText.objects.all()
        result_page = paginator.paginate_queryset(dashview, request)
        serializer = ImageSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)
    
# View the services in cards
# class ImageTextListView(APIView):
#     def get(self, request):
#         dashview = ImageText.objects.all()
#         serializer = ImageSerializer(dashview, many=True)
#         return Response(serializer.data) 

# Create new services
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


#login using username and password
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
    
 
#login using email and password
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
            if user.is_superuser:
                return Response({"detail": "Admin successfully logged in."})
            else:
                return Response({"detail": "Successfully logged in."})
        else:
            return Response({"detail": "Invalid credentials."}, status=status.HTTP_400_BAD_REQUEST)

#logout from current user
class LogoutView(APIView):
    def post(self, request, *args, **kwargs):
        logout(request)       
        return Response({"detail": "Successfully logged out."})
    
   
# Django Default authentication system with additional fields
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

#update user details
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

#View the services of the currenltly authenticated user
@login_required
@api_view(['GET'])
def view_services(request):
    user_id = request.user.id
    image_texts = ImageText.objects.filter(user_id=user_id)
    serializer = ImageSerializer(image_texts, many=True)
    return Response(serializer.data)




# Update the services
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
            date = request.data.get('date')
            enddate = request.data.get('enddate')
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
            image_text.date = date
            image_text.enddate = enddate
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
    


# Delete the services
@api_view(['DELETE'])
def delete_service(request, pk):
    try:
        image_text = get_object_or_404(ImageText, pk=pk)
    except ImageText.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'DELETE':
        image_text.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


