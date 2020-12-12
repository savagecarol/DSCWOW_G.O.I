from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from guardians.serializers import IndexSerializer
from services.status import check
from services.summarizer import generate_summary


def index(request):
    return render(request, 'index.html')


class IndexApi(APIView):
    def post(self, request, *args, **kwargs):
        serializer = IndexSerializer(data=request.data)
        if serializer.is_valid():
            file1 = open("text.txt", "w")
            file1.write(request.data)
            summary = generate_summary("text.txt")
            imp = check(request.data)
            ans = {}
            ans["status"] = imp
            ans["summary"] = summary
            return Response(ans, status=status.HTTP_200_OK)
        return Response(serializer.errors, status.HTTP_400_BAD_REQUEST)




