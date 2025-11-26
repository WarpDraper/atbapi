from rest_framework.viewsets import ModelViewSet

from .serializers import PostSerializer
from .models import Post
from rest_framework.parsers import MultiPartParser, FormParser

class PostViewSet(ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    parser_classes = [MultiPartParser, FormParser]