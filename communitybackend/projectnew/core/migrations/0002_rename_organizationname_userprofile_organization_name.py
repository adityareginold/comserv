# Generated by Django 3.2.24 on 2024-03-25 13:48

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='userprofile',
            old_name='organizationname',
            new_name='organization_name',
        ),
    ]
