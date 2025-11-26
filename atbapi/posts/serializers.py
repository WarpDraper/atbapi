from rest_framework import serializers
from .models import Post


class PostSerializer(serializers.ModelSerializer):
    user_id = serializers.PrimaryKeyRelatedField(
        source='user',
        queryset=Post._meta.get_field('user').remote_field.model.objects.all()
    )
    topic_id = serializers.PrimaryKeyRelatedField(
        source='topic',
        queryset=Post._meta.get_field('topic').remote_field.model.objects.all()
    )

    user_name = serializers.StringRelatedField(source='user.first_name', read_only=True)
    topic_name = serializers.StringRelatedField(source='topic.name', read_only=True)

    image = serializers.ImageField(required=False, allow_null=True)
    video = serializers.FileField(required=False, allow_null=True)

    class Meta:
        model = Post
        fields = [
            'id',
            'title',
            'body',
            'image',
            'video',
            'video_url',
            'created_at',
            'user_id',
            'user_name',
            'topic_id',
            'topic_name',
        ]