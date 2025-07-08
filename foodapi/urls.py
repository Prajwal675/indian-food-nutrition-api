"""
URL configuration for foodapi project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def root_view(request):
    return JsonResponse({
        'message': 'Indian Food Nutrition API is running!',
        'endpoints': {
            'welcome': '/api/',
            'foods_list': '/api/foods/',
            'search_food': '/api/search/?dish=DISH_NAME',
            'get_food': '/api/food/DISH_NAME/'
        },
        'example': '/api/search/?dish=Naan'
    })

urlpatterns = [
    path('', root_view, name='root'),
    path('admin/', admin.site.urls),
    path('api/', include('nutrition.urls')),
]
