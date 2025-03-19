from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
    ]

    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    bio = models.TextField(max_length=500, blank=True, verbose_name="个性签名")
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, blank=True, verbose_name="性别")
    age = models.PositiveIntegerField(null=True, blank=True, verbose_name="年龄")