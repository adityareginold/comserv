from django.db import models
from django.contrib.auth.models import User
from django.contrib.gis.db import models

# Create your models here.
class Task(models.Model):
    fname = models.CharField(max_length=200)
    lname = models.CharField(max_length=200)
    phone = models.CharField(max_length=200)
    email = models.EmailField(max_length=200)
    address = models.CharField(max_length=200)
    skills = models.CharField(max_length=200)
    interest = models.CharField(max_length=200)
    image =models.ImageFieldimage = models.ImageField(upload_to="profilepicture/", blank=True, null=True)
    def __str__(self):
      return self.fname


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    option = models.CharField(max_length=100)
    phone = models.CharField(max_length=200)
    address = models.CharField(max_length=200)
    skills = models.CharField(max_length=200)
    interest = models.CharField(max_length=200)
    organization_name = models.CharField(max_length=200)
    image =models.ImageFieldimage = models.ImageField(upload_to="profilepicture/", blank=True, null=True)
    def upload_to(instance, filename):
        return 'profilepicture/{filename}'.format(filename=filename)
    # ... (other relevant fields)

class ImageText(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    image = models.ImageField(upload_to="images/", blank=True, null=True)
    title = models.CharField(max_length=100)
    descr = models.CharField(max_length=200)
    objectives = models.CharField(max_length=200)
    tasks = models.CharField(max_length=200)
    skills = models.CharField(max_length=200)
    experience = models.CharField(max_length=200)
    contact = models.CharField(max_length=200)  
    def upload_to(instance, filename):
        return 'images/{filename}'.format(filename=filename)
    
class Participation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    image_text = models.ForeignKey(ImageText, on_delete=models.CASCADE)
    
    def __str__(self):
        return f'Registration for {self.user.username} on {self.image_text.title}'
    
    
class Location(models.Model): 
    name = models.CharField(max_length=200)
    point = models.PointField() 
    image_text = models.ForeignKey(ImageText, on_delete=models.CASCADE)
    def __str__(self):
        return self.name