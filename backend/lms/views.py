from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from .models import User, Group, GroupStudent, Feed, FeedResult
from .serializers import UserSerializer, GroupSerializer, GroupStudentSerializer, FeedSerializer, FeedResultSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

class GroupStudentViewSet(viewsets.ModelViewSet):
    queryset = GroupStudent.objects.all()
    serializer_class = GroupStudentSerializer

class FeedViewSet(viewsets.ModelViewSet):
    queryset = Feed.objects.all()
    serializer_class = FeedSerializer

class FeedResultViewSet(viewsets.ModelViewSet):
    queryset = FeedResult.objects.all()
    serializer_class = FeedResultSerializer
