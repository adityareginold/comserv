# Generated by Django 3.2.24 on 2024-02-21 06:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0006_alter_imagetext_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='imagetext',
            name='image',
            field=models.TextField(blank=True, max_length=200, null=True),
        ),
    ]
