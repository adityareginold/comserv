# Generated by Django 3.2.24 on 2024-02-16 14:32

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Task',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('phone', models.CharField(max_length=200)),
                ('aadhaar', models.CharField(max_length=200)),
                ('place', models.CharField(max_length=200)),
                ('pop', models.CharField(max_length=200)),
            ],
        ),
    ]
