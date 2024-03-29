# Generated by Django 3.2.24 on 2024-03-25 13:38

from django.conf import settings
import django.contrib.gis.db.models.fields
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='ImageText',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(blank=True, null=True, upload_to='images/')),
                ('title', models.CharField(max_length=100)),
                ('descr', models.CharField(max_length=200)),
                ('objectives', models.CharField(max_length=200)),
                ('tasks', models.CharField(max_length=200)),
                ('skills', models.CharField(max_length=200)),
                ('experience', models.CharField(max_length=200)),
                ('contact', models.CharField(max_length=200)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Task',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fname', models.CharField(max_length=200)),
                ('lname', models.CharField(max_length=200)),
                ('phone', models.CharField(max_length=200)),
                ('email', models.EmailField(max_length=200)),
                ('address', models.CharField(max_length=200)),
                ('skills', models.CharField(max_length=200)),
                ('interest', models.CharField(max_length=200)),
                ('image', models.ImageField(blank=True, null=True, upload_to='profilepicture/')),
            ],
        ),
        migrations.CreateModel(
            name='UserProfile',
            fields=[
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to='auth.user')),
                ('option', models.CharField(max_length=100)),
                ('phone', models.CharField(max_length=200)),
                ('address', models.CharField(max_length=200)),
                ('skills', models.CharField(max_length=200)),
                ('interest', models.CharField(max_length=200)),
                ('organizationname', models.CharField(max_length=200)),
                ('image', models.ImageField(blank=True, null=True, upload_to='profilepicture/')),
            ],
        ),
        migrations.CreateModel(
            name='Participation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image_text', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.imagetext')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Location',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('point', django.contrib.gis.db.models.fields.PointField(srid=4326)),
                ('image_text', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='core.imagetext')),
            ],
        ),
    ]
