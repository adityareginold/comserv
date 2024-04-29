"""projectnew URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.urls import path,include
from core.views import  ImageTextDetailView, front,ImageTextListView,ImageTextCreateView,get_option,view_services,update_services,delete_service
from core.views import get_username,LoginView, LogoutView, register,csrf_token,get_user_profile,userdetails,update_user,createlocation, filter_view,sort_images
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from core.views import *

# from django.views.generic import TemplateView



urlpatterns = [
        # Catch-all pattern to serve your React app
   
    path('admin/', admin.site.urls),
    path('', front, name = "front"),
    path('imagesfrom/', ImageTextListView.as_view()),
    path('imagesto/', ImageTextCreateView.as_view()),
    path('accounts/login/', LoginView.as_view(), name="login"),
    path('accounts/logout/', LogoutView.as_view(), name="logout"),
    path('register/', register, name="register"),
    path('get_username/', get_username, name='get_username'),
    path('get_option/',get_option,name='get_option'),
    path('accounts/', include('django.contrib.auth.urls')),
    path('csrf-token/', csrf_token, name='csrf_token'),
    path('profilepicture/', get_user_profile, name='get_user_profile'),
    path('viewprofile/' ,userdetails , name = "userdetails"),
    path('updateuser/', update_user, name='update_user'),
    path('imagetext/<int:id>/', ImageTextDetailView.as_view(), name='imagetext_detail'),
    path('locations/', createlocation, name='createlocation'),
    path('locations/<int:image_text>/', createlocation, name='createlocationbyimageid'),
    path('view_services/',view_services, name= 'view_services'),
    path('update_services/<int:pk>/',update_services, name= 'update_services'),
    path('delete_service/<int:pk>/',delete_service, name= 'delete_service'),
    path('participation/',participation,name='participation'),
    path('search/', search, name='search'),
    path('filter/', filter_view, name='filter_view'),
    path('sort_images/', sort_images, name='sort_images'),
    path('getuserservices/', get_user_participations,name ='getuserservices'),
    path('deleteuserservices/<int:id>/' ,delete_user_participation, name='deleteuserservices'),
    path('participated/', ParticipateView.as_view(), name='participate'),
    path('feedback/<int:id>/', store_feedback, name='store_feedback'),
    # path('participations/<int:user_id>/', get_participants_for_service_provider, name='get_participations_for_service_provider'),
    path('getparticipants/', viewparticipants, name='completed_participation'),
    path('feedback/', viewServiceProviderFeedback, name='view_feedback_reviews'),
    path('password_reset/', password_reset_request, name='password_reset'),
    path('verifyotp/', verify_otp, name='verify_otp'),
    path('reset/<uidb64>/<token>/', password_reset_confirm, name='password_reset_confirm'),
    path('viewusers/', UserListView.as_view(), name='user-list'),
    path('users/<int:pk>/', UserListView.as_view(), name='user-detail'),
    path('is_superuser/', IsSuperUserView.as_view(), name='is-superuser'),
    path('imageadmin/', ImageAdminView.as_view(), name='imagetext-list'),
    path('imageadmin/<int:pk>/', ImageAdminView.as_view(), name='imagetext-detail'),

    
   ]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)






