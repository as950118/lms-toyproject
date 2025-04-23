from rest_framework import viewsets
from .models import (
    User, Level, Grade, Group, GroupStudent, Feed, VideoFeed, QuizFeed,
    FeedSchedule, FeedResult, VideoResult, QuizResult
)
from .serializers import (
    UserSerializer, LevelSerializer, GradeSerializer, GroupSerializer, GroupStudentSerializer,
    FeedSerializer, VideoFeedSerializer, QuizFeedSerializer, FeedScheduleSerializer,
    FeedResultSerializer, VideoResultSerializer, QuizResultSerializer
)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class LevelViewSet(viewsets.ModelViewSet):
    queryset = Level.objects.all()
    serializer_class = LevelSerializer

class GradeViewSet(viewsets.ModelViewSet):
    queryset = Grade.objects.all()
    serializer_class = GradeSerializer

class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

class GroupStudentViewSet(viewsets.ModelViewSet):
    queryset = GroupStudent.objects.all()
    serializer_class = GroupStudentSerializer

class FeedViewSet(viewsets.ModelViewSet):
    queryset = Feed.objects.all()
    serializer_class = FeedSerializer

class VideoFeedViewSet(viewsets.ModelViewSet):
    queryset = VideoFeed.objects.all()
    serializer_class = VideoFeedSerializer

class QuizFeedViewSet(viewsets.ModelViewSet):
    queryset = QuizFeed.objects.all()
    serializer_class = QuizFeedSerializer

class FeedScheduleViewSet(viewsets.ModelViewSet):
    queryset = FeedSchedule.objects.all()
    serializer_class = FeedScheduleSerializer

class FeedResultViewSet(viewsets.ModelViewSet):
    queryset = FeedResult.objects.all()
    serializer_class = FeedResultSerializer

class VideoResultViewSet(viewsets.ModelViewSet):
    queryset = VideoResult.objects.all()
    serializer_class = VideoResultSerializer

class QuizResultViewSet(viewsets.ModelViewSet):
    queryset = QuizResult.objects.all()
    serializer_class = QuizResultSerializer