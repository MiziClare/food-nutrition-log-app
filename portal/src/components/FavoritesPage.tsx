import React, { useState } from "react";
import { Heart, Plus, Grid3X3, List } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { BottomNavigation } from "./BottomNavigation";

interface FavoritesPageProps {
  onNavigate: (screen: string) => void;
}

interface FavoriteMeal {
  id: string;
  name: string;
  calories: number;
  image: string;
  ingredients: string[];
  savedDate: string;
}

export function FavoritesPage({ onNavigate }: FavoritesPageProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Mock favorites data - in real app this would come from user's saved items
  const favoriteMeals: FavoriteMeal[] = [
    {
      id: "1",
      name: "Morning Oatmeal Bowl",
      calories: 320,
      image: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400",
      ingredients: ["Oats", "Banana", "Berries", "Honey"],
      savedDate: "2025-01-02",
    },
    {
      id: "2",
      name: "Protein Power Lunch",
      calories: 485,
      image:
        "https://images.unsplash.com/photo-1744116432654-574391dbe3ea?w=400",
      ingredients: ["Grilled Chicken", "Quinoa", "Mixed Vegetables"],
      savedDate: "2025-01-01",
    },
    {
      id: "3",
      name: "Avocado Toast Special",
      calories: 290,
      image:
        "https://images.unsplash.com/photo-1676471970358-1cff04452e7b?w=400",
      ingredients: ["Sourdough Bread", "Avocado", "Cherry Tomatoes", "Feta"],
      savedDate: "2024-12-30",
    },
    {
      id: "4",
      name: "Salmon Dinner Delight",
      calories: 520,
      image: "https://images.unsplash.com/photo-1562436261-3d97e9e237c6?w=400",
      ingredients: ["Grilled Salmon", "Sweet Potato", "Asparagus"],
      savedDate: "2024-12-28",
    },
  ];

  const handleAddToLog = (meal: FavoriteMeal) => {
    // Simulate adding to today's log
    console.log("Adding favorite meal to log:", meal.name);
    // In real app, this would add the meal to today's entries
  };

  const handleRemoveFromFavorites = (mealId: string) => {
    // Simulate removing from favorites
    console.log("Removing from favorites:", mealId);
    // In real app, this would update the favorites list
  };

  const EmptyState = () => (
    <div className="flex-1 flex items-center justify-center p-8">
      <Card className="p-8 bg-white border border-border text-center max-w-sm">
        <div className="text-muted-foreground mb-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-[#F5F5F7] rounded-full flex items-center justify-center">
            <Heart className="w-8 h-8 opacity-50" />
            <Plus className="w-4 h-4 opacity-50 -ml-2 -mt-2" />
          </div>
          <p className="mb-2">Your saved meals will appear here</p>
          <p className="text-sm">
            Tap the heart on a meal's result page to save it!
          </p>
        </div>

        <Button
          onClick={() => onNavigate("scan")}
          className="bg-[#FF9800] hover:bg-[#F57C00]"
        >
          Scan Your First Meal
        </Button>
      </Card>
    </div>
  );

  if (favoriteMeals.length === 0) {
    return (
      <div className="flex flex-col h-full bg-[#F5F5F7]">
        {/* Header */}
        <div className="bg-white border-b border-border p-4">
          <h2 className="text-center">My Favorites</h2>
        </div>

        <EmptyState />
        <BottomNavigation currentScreen="favorites" onNavigate={onNavigate} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#F5F5F7]">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">My Favorites</h2>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg ${
                viewMode === "grid"
                  ? "text-[#4CAF50] bg-green-50"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Grid3X3 className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg ${
                viewMode === "list"
                  ? "text-[#4CAF50] bg-green-50"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <List className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-20 p-4">
        {/* Stats */}
        <Card className="p-6 bg-white border-0 rounded-2xl shadow-sm mb-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#4CAF50]">
                {favoriteMeals.length}
              </div>
              <div className="text-xs text-gray-500 font-medium">
                Saved Meals
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#4CAF50]">
                {Math.round(
                  favoriteMeals.reduce((sum, meal) => sum + meal.calories, 0) /
                    favoriteMeals.length
                )}
              </div>
              <div className="text-xs text-gray-500 font-medium">
                Avg Calories
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#4CAF50]">12</div>
              <div className="text-xs text-gray-500 font-medium">
                Times Used
              </div>
            </div>
          </div>
        </Card>

        {/* Favorites Grid/List */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-2 gap-4">
            {favoriteMeals.map((meal) => (
              <Card
                key={meal.id}
                className="bg-white border-0 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="aspect-[4/3] bg-gray-100">
                  <ImageWithFallback
                    src={meal.image}
                    alt={meal.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h4 className="text-sm font-medium mb-2 truncate text-gray-800">
                    {meal.name}
                  </h4>
                  <div className="flex items-center justify-between mb-3">
                    <Badge className="bg-[#4CAF50] text-white text-xs px-2 py-1 rounded-full">
                      {meal.calories} kcal
                    </Badge>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleAddToLog(meal)}
                    className="w-full h-8 bg-[#4CAF50] hover:bg-[#45A049] text-xs rounded-full font-medium"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {favoriteMeals.map((meal) => (
              <Card
                key={meal.id}
                className="p-4 bg-white border-0 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                    <ImageWithFallback
                      src={meal.image}
                      alt={meal.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="mb-1 text-lg font-medium text-gray-800">
                          {meal.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          Saved on{" "}
                          {new Date(meal.savedDate).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge className="bg-[#4CAF50] text-white ml-2 px-2 py-1 rounded-full text-xs">
                        {meal.calories} kcal
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {meal.ingredients.slice(0, 3).map((ingredient, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs bg-gray-50 border-gray-200 text-gray-600 px-2 py-1 rounded-full"
                        >
                          {ingredient}
                        </Badge>
                      ))}
                      {meal.ingredients.length > 3 && (
                        <Badge
                          variant="outline"
                          className="text-xs bg-gray-50 border-gray-200 text-gray-600 px-2 py-1 rounded-full"
                        >
                          +{meal.ingredients.length - 3} more
                        </Badge>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleAddToLog(meal)}
                        className="flex-1 bg-[#4CAF50] hover:bg-[#45A049] rounded-full font-medium"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add to Log
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveFromFavorites(meal.id)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200 rounded-full"
                      >
                        <Heart className="w-4 h-4" fill="currentColor" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <BottomNavigation currentScreen="favorites" onNavigate={onNavigate} />
    </div>
  );
}
