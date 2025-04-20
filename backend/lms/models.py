from django.db import models

# Create your models here.
from django.db import models


class User(models.Model):
    ROLE_CHOICES = [
        ('teacher', 'Teacher'),
        ('student', 'Student'),
    ]
    user_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password_hash = models.CharField(max_length=128)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.role})"


class Group(models.Model):
    group_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    level = models.CharField(max_length=50)
    grade = models.CharField(max_length=20)
    teacher = models.ForeignKey(User, on_delete=models.CASCADE, related_name='groups')

    def __str__(self):
        return self.name


class GroupStudent(models.Model):
    group_student_id = models.AutoField(primary_key=True)
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='group_students')
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='student_groups')
    joined_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.student.name} in {self.group.name}"


class Feed(models.Model):
    FEED_TYPE_CHOICES = [
        ('video', 'Video'),
        ('multiple_choice', 'Multiple Choice'),
        ('grammar', 'Grammar'),
        # 필요시 추가
    ]
    feed_id = models.AutoField(primary_key=True)
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='feeds')
    title = models.CharField(max_length=200)
    description = models.TextField()
    feed_type = models.CharField(max_length=20, choices=FEED_TYPE_CHOICES)
    content_url = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class FeedResult(models.Model):
    STATUS_CHOICES = [
        ('not_started', 'Not Started'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
    ]
    feed_result_id = models.AutoField(primary_key=True)
    feed = models.ForeignKey(Feed, on_delete=models.CASCADE, related_name='results')
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='feed_results')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    score = models.IntegerField(blank=True, null=True)
    submitted_at = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return f"{self.feed.title} - {self.student.name} ({self.status})"
