# Generated by Django 3.2.24 on 2024-04-11 05:04

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0003_alter_location_image_text'),
    ]

    operations = [
        migrations.AddField(
            model_name='imagetext',
            name='date',
            field=models.DateField(default=django.utils.timezone.now),
            preserve_default=False,
        ),
    ]