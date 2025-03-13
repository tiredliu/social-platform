from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    bio = models.TextField('简介', blank=True, default='')
    avatar = models.ImageField('头像', upload_to='avatars/', blank=True)
    created_at = models.DateTimeField('创建时间', auto_now_add=True)
    class Meta:
        app_label = 'core'  # 添加此行以确保 app_label 正确配置

class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    content = models.TextField('内容')
    image = models.ImageField('图片', upload_to='posts/', blank=True)
    created_at = models.DateTimeField('创建时间', auto_now_add=True)
    updated_at = models.DateTimeField('更新时间', auto_now=True)

class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField('内容')
    created_at = models.DateTimeField('创建时间', auto_now_add=True)

class Like(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='likes')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField('创建时间', auto_now_add=True)

class Friendship(models.Model):
    STATUS_CHOICES = [
        ('pending', '等待确认'),
        ('accepted', '已接受'),
        ('rejected', '已拒绝')
    ]
    from_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_requests')
    to_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_requests')
    status = models.CharField('状态', max_length=10, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField('创建时间', auto_now_add=True)

    class Meta:
        unique_together = ('from_user', 'to_user')
