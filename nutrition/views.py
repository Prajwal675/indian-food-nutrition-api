import pandas as pd
import os
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

# Load CSV once at module level
csv_path = os.path.join(settings.BASE_DIR, "nutrition", "static", "Indian_Food_Nutrition_Processed.csv")
df = pd.read_csv(csv_path)
data_dict = df.set_index("Dish Name").T.to_dict()

@api_view(["GET"])
def home(request):
    return Response({
        "message": "Welcome to Indian Food Nutrition API",
        "status": "running",
        "total_foods": len(data_dict),
        "endpoints": {
            "foods_list": "/api/foods/",
            "search_food": "/api/search/?dish=DISH_NAME",
            "get_food": "/api/food/DISH_NAME/"
        },
        "example_searches": [
            "/api/search/?dish=Naan",
            "/api/search/?dish=Chapati/Roti",
            "/api/search/?dish=Masala dosa"
        ]
    })

@api_view(["GET"])
def list_foods(request):
    return Response({"foods": list(data_dict.keys())})

@api_view(["GET"])
def get_nutrition(request, name):
    name_lower = name.lower()
    matched = [dish for dish in data_dict if dish.lower() == name_lower]
    if not matched:
        return Response({"error": "Dish not found"}, status=status.HTTP_404_NOT_FOUND)
    return Response({matched[0]: data_dict[matched[0]]})

@api_view(["GET"])
def search_nutrition(request):
    """
    Search for nutrition data using query parameter.
    Usage: /api/search/?dish=Chapati/Roti
    """
    dish_name = request.GET.get('dish', '')
    if not dish_name:
        return Response({"error": "Please provide 'dish' parameter"}, status=status.HTTP_400_BAD_REQUEST)

    dish_name_lower = dish_name.lower()
    matched = [dish for dish in data_dict if dish.lower() == dish_name_lower]
    if not matched:
        return Response({"error": "Dish not found"}, status=status.HTTP_404_NOT_FOUND)
    return Response({matched[0]: data_dict[matched[0]]})
