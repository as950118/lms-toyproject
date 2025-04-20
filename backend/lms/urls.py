from rest_framework import routers
from django.urls import path, include
from .views import UserViewSet, GroupViewSet, GroupStudentViewSet, FeedViewSet, FeedResultViewSet

router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'groups', GroupViewSet)
router.register(r'groupstudents', GroupStudentViewSet)
router.register(r'feeds', FeedViewSet)
router.register(r'feedresults', FeedResultViewSet)

urlpatterns = [
    path('', include(router.urls)),
]