from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Task(models.Model):
    uname = models.CharField(max_length=200)
    phone = models.CharField(max_length=200)
    email = models.EmailField(max_length=200)
    place =models.CharField(max_length=200)
    password= models.CharField(max_length=200)
    def __str__(self):
      return self.uname
    
    


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    option = models.CharField(max_length=100)
    # ... (other relevant fields)

class ImageText(models.Model):
    image = models.ImageField(upload_to="images/", blank=True, null=True)
    title = models.CharField(max_length=100)
    descr = models.CharField(max_length=200)
    
    def upload_to(instance, filename):
        return 'images/{filename}'.format(filename=filename)
