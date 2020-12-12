from django.shortcuts import render

def index(request):
    return render(request, 'index.html')

def team(request):
    return render(request, 'kartik.html')
