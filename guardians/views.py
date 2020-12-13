from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from guardians.serializers import IndexSerializer
from services.status import check
from services.summarizer import generate_summary


def index(request):
    return render(request, 'index.html')

def team(request):
    return render(request, 'kartik.html')

def inpute(request):
    return render(request, 'input.html')



class IndexApi(APIView):
    def post(self, request, *args, **kwargs):
        serializer = IndexSerializer(data=request.data)
        if serializer.is_valid():
            summary = generate_summary(request.data['content'])
            imp = check(request.data['content'])
            ans = {}
            ans["status"] = imp[0]
            ans["summary"] = summary
            return Response(ans, status=status.HTTP_200_OK)
        return Response(serializer.errors, status.HTTP_400_BAD_REQUEST)



