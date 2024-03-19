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
from core.views import  ImageTextDetailView, front,task,task_detail,ImageTextListView,ImageTextCreateView
from core.views import get_username,LoginView, LogoutView, register,csrf_token,get_user_profile,userdetails,update_user,createlocation
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
# from django.views.generic import TemplateView



urlpatterns = [
    path('admin/', admin.site.urls),
    path('', front, name = "front"),
    path('task/' ,task , name = "task"),
    path('task/<int:pk>/' ,task_detail , name = "detail"), 
    path('imagesfrom/', ImageTextListView.as_view()),
    path('imagesto/', ImageTextCreateView.as_view()),
    path('accounts/login/', LoginView.as_view(), name="login"),
    path('accounts/logout/', LogoutView.as_view(), name="logout"),
    path('register/', register, name="register"),
    path('get_username/', get_username, name='get_username'),
    path('accounts/', include('django.contrib.auth.urls')),
    path('csrf-token/', csrf_token, name='csrf_token'),
    path('profilepicture/', get_user_profile, name='get_user_profile'),
    path('viewprofile/' ,userdetails , name = "userdetails"),
    path('updateuser/', update_user, name='update_user'),
    path('imagetext/<int:id>/', ImageTextDetailView.as_view(), name='imagetext_detail'),
    path('locations/', createlocation, name='createlocation'),
   ]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)






