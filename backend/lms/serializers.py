from rest_framework import serializers
from .models import (
    User, Level, Grade, Group, GroupStudent, Feed, VideoFeed, QuizFeed,
    FeedSchedule, FeedResult, VideoResult, QuizResult
)

class LevelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Level
        fields = '__all__'

class GradeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Grade
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class GroupSerializer(serializers.ModelSerializer):
    level = LevelSerializer(read_only=True)
    level_id = serializers.PrimaryKeyRelatedField(
        queryset=Level.objects.all(), source='level', write_only=True
    )
    grade = GradeSerializer(read_only=True)
    grade_id = serializers.PrimaryKeyRelatedField(
        queryset=Grade.objects.all(), source='grade', write_only=True
    )
    teacher = UserSerializer(read_only=True)
    teacher_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role='teacher'), source='teacher', write_only=True
    )

    class Meta:
        model = Group
        fields = [
            'group_id', 'name', 'level', 'level_id', 'grade', 'grade_id', 'teacher', 'teacher_id'
        ]

class GroupStudentSerializer(serializers.ModelSerializer):
    group = GroupSerializer(read_only=True)
    group_id = serializers.PrimaryKeyRelatedField(
        queryset=Group.objects.all(), source='group', write_only=True
    )
    student = UserSerializer(read_only=True)
    student_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role='student'), source='student', write_only=True
    )

    class Meta:
        model = GroupStudent
        fields = [
            'group_student_id', 'group', 'group_id', 'student', 'student_id', 'joined_at'
        ]

class FeedSerializer(serializers.ModelSerializer):
    group = GroupSerializer(read_only=True)
    group_id = serializers.PrimaryKeyRelatedField(
        queryset=Group.objects.all(), source='group', write_only=True
    )

    class Meta:
        model = Feed
        fields = [
            'feed_id', 'group', 'group_id', 'title', 'description', 'feed_type', 'created_at'
        ]

class VideoFeedSerializer(serializers.ModelSerializer):
    feed = FeedSerializer(read_only=True)
    feed_id = serializers.PrimaryKeyRelatedField(
        queryset=Feed.objects.filter(feed_type='video'), source='feed', write_only=True
    )

    class Meta:
        model = VideoFeed
        fields = [
            'feed', 'feed_id', 'video_url', 'duration_seconds'
        ]

class QuizFeedSerializer(serializers.ModelSerializer):
    feed = FeedSerializer(read_only=True)
    feed_id = serializers.PrimaryKeyRelatedField(
        queryset=Feed.objects.filter(feed_type__in=['multiple_choice', 'grammar']), source='feed', write_only=True
    )

    class Meta:
        model = QuizFeed
        fields = [
            'feed', 'feed_id', 'question', 'question_type', 'options', 'answer'
        ]

class FeedScheduleSerializer(serializers.ModelSerializer):
    feed = FeedSerializer(read_only=True)
    feed_id = serializers.PrimaryKeyRelatedField(
        queryset=Feed.objects.all(), source='feed', write_only=True
    )

    class Meta:
        model = FeedSchedule
        fields = [
            'schedule_id', 'feed', 'feed_id', 'scheduled_time', 'duration_minutes'
        ]

class FeedResultSerializer(serializers.ModelSerializer):
    feed = FeedSerializer(read_only=True)
    feed_id = serializers.PrimaryKeyRelatedField(
        queryset=Feed.objects.all(), source='feed', write_only=True
    )
    student = UserSerializer(read_only=True)
    student_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role='student'), source='student', write_only=True
    )

    class Meta:
        model = FeedResult
        fields = [
            'feed_result_id', 'feed', 'feed_id', 'student', 'student_id',
            'status', 'score', 'submitted_at'
        ]

class VideoResultSerializer(serializers.ModelSerializer):
    feed_result = FeedResultSerializer(read_only=True)
    feed_result_id = serializers.PrimaryKeyRelatedField(
        queryset=FeedResult.objects.all(), source='feed_result', write_only=True
    )

    class Meta:
        model = VideoResult
        fields = [
            'feed_result', 'feed_result_id', 'watch_time_seconds'
        ]

class QuizResultSerializer(serializers.ModelSerializer):
    feed_result = FeedResultSerializer(read_only=True)
    feed_result_id = serializers.PrimaryKeyRelatedField(
        queryset=FeedResult.objects.all(), source='feed_result', write_only=True
    )

    class Meta:
        model = QuizResult
        fields = [
            'feed_result', 'feed_result_id', 'selected_answer', 'is_correct'
        ]