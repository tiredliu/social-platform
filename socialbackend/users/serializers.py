from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import CustomUser

class RegisterSerializer(serializers.ModelSerializer):
    confirmPassword = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password', 'confirmPassword']
        extra_kwargs = {
            'password': {'write_only': True},
            'email': {'required': True},
        }

    def validate(self, data):
        if data['password'] != data['confirmPassword']:
            raise serializers.ValidationError("两次输入的密码不一致")
        return data

    def create(self, validated_data):
        validated_data.pop('confirmPassword')  # 移除confirmPassword字段
        validated_data['password'] = make_password(validated_data['password'])  # 对密码进行加密
        user = CustomUser.objects.create(**validated_data)
        return user