from rest_framework import serializers
from .models import User, Group, GroupStudent, Feed, FeedResult


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = '__all__'


class GroupStudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupStudent
        fields = '__all__'


class FeedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feed
        fields = '__all__'


class FeedResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeedResult
        fields = '__all__'
