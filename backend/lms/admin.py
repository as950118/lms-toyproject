from django.contrib import admin
from .models import User, Group, GroupStudent, Feed, FeedResult

# Register your models here.
admin.site.register(User)
admin.site.register(Group)
admin.site.register(GroupStudent)
admin.site.register(Feed)
admin.site.register(FeedResult)