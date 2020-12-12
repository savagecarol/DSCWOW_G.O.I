from rest_framework import serializers


class IndexSerializer(serializers.Serializer):
    content = serializers.StringRelatedField()
    class Meta:
        fields = ['content']
