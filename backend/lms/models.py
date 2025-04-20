from django.db import models

class Level(models.Model):
    level_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

class Grade(models.Model):
    grade_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=20, unique=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

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
    level = models.ForeignKey(Level, on_delete=models.PROTECT, related_name='groups')
    grade = models.ForeignKey(Grade, on_delete=models.PROTECT, related_name='groups')
    teacher = models.ForeignKey(User, on_delete=models.CASCADE, related_name='groups')

    def __str__(self):
        return self.name

class GroupStudent(models.Model):
    group_student_id = models.AutoField(primary_key=True)
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='group_students')
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='student_groups')
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('group', 'student')

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
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class VideoFeed(models.Model):
    feed = models.OneToOneField(Feed, on_delete=models.CASCADE, primary_key=True, related_name='video_detail')
    video_url = models.URLField()
    duration_seconds = models.PositiveIntegerField()

    def __str__(self):
        return f"VideoFeed for {self.feed.title}"

class QuizFeed(models.Model):
    QUESTION_TYPE_CHOICES = [
        ('multiple_choice', 'Multiple Choice'),
        ('grammar', 'Grammar'),
        # 필요시 추가
    ]
    feed = models.OneToOneField(Feed, on_delete=models.CASCADE, primary_key=True, related_name='quiz_detail')
    question = models.TextField()
    question_type = models.CharField(max_length=30, choices=QUESTION_TYPE_CHOICES)
    options = models.JSONField()  # 예: ["A", "B", "C", "D"]
    answer = models.CharField(max_length=200)

    def __str__(self):
        return f"QuizFeed for {self.feed.title}"

class FeedSchedule(models.Model):
    schedule_id = models.AutoField(primary_key=True)
    feed = models.ForeignKey(Feed, on_delete=models.CASCADE, related_name='schedules')
    scheduled_time = models.DateTimeField()
    duration_minutes = models.PositiveIntegerField()

    def __str__(self):
        return f"Schedule for {self.feed.title} at {self.scheduled_time}"

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

    class Meta:
        unique_together = ('feed', 'student')

    def __str__(self):
        return f"{self.feed.title} - {self.student.name} ({self.status})"

class VideoResult(models.Model):
    feed_result = models.OneToOneField(FeedResult, on_delete=models.CASCADE, primary_key=True, related_name='video_result')
    watch_time_seconds = models.PositiveIntegerField()

    def __str__(self):
        return f"VideoResult for {self.feed_result}"

class QuizResult(models.Model):
    feed_result = models.OneToOneField(FeedResult, on_delete=models.CASCADE, primary_key=True, related_name='quiz_result')
    selected_answer = models.CharField(max_length=200)
    is_correct = models.BooleanField()

    def __str__(self):
        return f"QuizResult for {self.feed_result}"