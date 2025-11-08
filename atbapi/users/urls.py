from rest_framework.routers import DefaultRouter
from .views import UserViewSet, LoginView, UserListView, generate_random_users, GenerateUsersView
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView

router = DefaultRouter()
router.register(r'users', UserViewSet)

urlpatterns = [
    path('users/login/', LoginView.as_view(), name='login'),
    path('', include(router.urls)),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('users/', UserListView.as_view(), name='user-list'),
    path('generate-users/', GenerateUsersView.as_view(), name='generate-users'),
]