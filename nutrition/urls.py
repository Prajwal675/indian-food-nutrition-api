from django.urls import path
from . import views

urlpatterns = [
    path('', views.home),
    path('foods/', views.list_foods),
    path('food/<str:name>/', views.get_nutrition),
    path('search/', views.search_nutrition),
]
