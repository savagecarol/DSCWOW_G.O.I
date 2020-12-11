from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView


def index(request):
    return render(request, 'index.html')


class IndexApi(APIView):
    def get(request, *args, **kwargs):
        return Response()

    def post(request, *args, **kwargs):
        return Response()

# @api_view(('GET', 'POST',))
# @csrf_exempt
# def index_api(request):
#     if request.method == 'GET':
#         return Response()
    
#     if request.method == 'POST':
#         return Response()
