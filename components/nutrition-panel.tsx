"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { NutritionInfo, Recipe } from "@/lib/dummy-data"
import { Apple, Flame, Droplets, Zap, AlertCircle } from "lucide-react"

interface NutritionPanelProps {
  nutrition?: NutritionInfo
  recipe?: Recipe
}

const DAILY_VALUES = {
  calories: 2000,
  protein: 50,
  carbs: 300,
  fat: 78,
  fiber: 25,
  sodium: 2300,
  sugars: 50,
}

export function NutritionPanel({ nutrition, recipe }: NutritionPanelProps) {
  if (!nutrition) {
    return (
      <Card className="shadow-lg">
        <CardHeader className="bg-muted/50 pb-4">
          <CardTitle className="flex items-center gap-2">
            <Apple className="h-5 w-5 text-primary" />
            Nutrition Information
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <AlertCircle className="h-4 w-4" />
            <p>Nutrition data not available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const servings = recipe?.servings || 1
  const caloriesPerServing = nutrition.calories ? Math.round(nutrition.calories / servings) : 0
  const proteinPerServing = nutrition.protein ? parseFloat((nutrition.protein / servings).toFixed(1)) : 0
  const carbsPerServing = nutrition.carbs ? parseFloat((nutrition.carbs / servings).toFixed(1)) : 0
  const fatPerServing = nutrition.fat ? parseFloat((nutrition.fat / servings).toFixed(1)) : 0

  const getNutrientPercentage = (value: number, dailyValue: number) => {
    return Math.min(100, Math.round((value / dailyValue) * 100))
  }

  const caloriePercentage = getNutrientPercentage(caloriesPerServing, DAILY_VALUES.calories)
  const proteinPercentage = getNutrientPercentage(proteinPerServing, DAILY_VALUES.protein)
  const carbsPercentage = getNutrientPercentage(carbsPerServing, DAILY_VALUES.carbs)
  const fatPercentage = getNutrientPercentage(fatPerServing, DAILY_VALUES.fat)

  const getHealthBadge = (calories: number) => {
    if (calories < 300) return { label: "Low Calorie", variant: "outline" as const }
    if (calories < 600) return { label: "Moderate", variant: "secondary" as const }
    return { label: "High Calorie", variant: "default" as const }
  }

  const healthBadge = getHealthBadge(caloriesPerServing)

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-muted/50 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Apple className="h-5 w-5 text-primary" />
            Nutrition Information
          </CardTitle>
          <Badge variant={healthBadge.variant as any}>{healthBadge.label}</Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-2">Per serving ({servings > 1 ? `${servings} servings total` : "1 serving"})</p>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* Main Calorie Card */}
        <div className="rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 p-4 border border-primary/20">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              <span className="font-semibold text-foreground">Calories</span>
            </div>
            <span className="text-2xl font-bold text-primary">{caloriesPerServing}</span>
          </div>
          <Progress value={Math.min(caloriePercentage, 100)} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">{caloriePercentage}% of daily value</p>
        </div>

        {/* Macronutrients */}
        <div className="grid gap-4 sm:grid-cols-3">
          {/* Protein */}
          <div className="rounded-lg border p-4 hover:border-primary/50 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium text-muted-foreground">Protein</span>
            </div>
            <p className="text-lg font-bold text-foreground mb-2">{proteinPerServing}g</p>
            <Progress value={Math.min(proteinPercentage, 100)} className="h-1.5 mb-1" />
            <p className="text-xs text-muted-foreground">{proteinPercentage}% DV</p>
          </div>

          {/* Carbohydrates */}
          <div className="rounded-lg border p-4 hover:border-primary/50 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <Apple className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium text-muted-foreground">Carbs</span>
            </div>
            <p className="text-lg font-bold text-foreground mb-2">{carbsPerServing}g</p>
            <Progress value={Math.min(carbsPercentage, 100)} className="h-1.5 mb-1" />
            <p className="text-xs text-muted-foreground">{carbsPercentage}% DV</p>
          </div>

          {/* Fat */}
          <div className="rounded-lg border p-4 hover:border-primary/50 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <Droplets className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium text-muted-foreground">Fat</span>
            </div>
            <p className="text-lg font-bold text-foreground mb-2">{fatPerServing}g</p>
            <Progress value={Math.min(fatPercentage, 100)} className="h-1.5 mb-1" />
            <p className="text-xs text-muted-foreground">{fatPercentage}% DV</p>
          </div>
        </div>

        {/* Micronutrients */}
        {(nutrition.fiber || nutrition.sodium || nutrition.sugars) && (
          <div className="space-y-3 pt-4 border-t">
            <h4 className="font-semibold text-sm text-foreground">Other Nutrients</h4>
            <div className="grid gap-3 sm:grid-cols-3 text-sm">
              {nutrition.fiber !== undefined && (
                <div>
                  <p className="text-muted-foreground mb-1">Fiber</p>
                  <p className="font-semibold text-foreground">{(nutrition.fiber / servings).toFixed(1)}g</p>
                </div>
              )}
              {nutrition.sodium !== undefined && (
                <div>
                  <p className="text-muted-foreground mb-1">Sodium</p>
                  <p className="font-semibold text-foreground">{Math.round(nutrition.sodium / servings)}mg</p>
                </div>
              )}
              {nutrition.sugars !== undefined && (
                <div>
                  <p className="text-muted-foreground mb-1">Sugars</p>
                  <p className="font-semibold text-foreground">{(nutrition.sugars / servings).toFixed(1)}g</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Recipe Info */}
        {(recipe?.prepTime || recipe?.cookTime || recipe?.difficulty) && (
          <div className="space-y-3 pt-4 border-t">
            <h4 className="font-semibold text-sm text-foreground">Recipe Details</h4>
            <div className="grid gap-3 sm:grid-cols-3 text-sm">
              {recipe.prepTime && (
                <div>
                  <p className="text-muted-foreground mb-1">Prep Time</p>
                  <p className="font-semibold text-foreground">{recipe.prepTime} min</p>
                </div>
              )}
              {recipe.cookTime && (
                <div>
                  <p className="text-muted-foreground mb-1">Cook Time</p>
                  <p className="font-semibold text-foreground">{recipe.cookTime} min</p>
                </div>
              )}
              {recipe.difficulty && (
                <div>
                  <p className="text-muted-foreground mb-1">Difficulty</p>
                  <p className="font-semibold text-foreground">{recipe.difficulty}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Daily Value Disclaimer */}
        <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground border border-muted-foreground/20">
          <p>* Daily values are based on a 2,000 calorie diet. Your daily values may be higher or lower depending on your calorie needs.</p>
        </div>
      </CardContent>
    </Card>
  )
}
