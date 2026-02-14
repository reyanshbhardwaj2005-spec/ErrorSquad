"use client"

import type { NutritionInfo, Recipe } from "@/lib/dummy-data"

interface NutritionPanelProps {
  nutrition?: NutritionInfo
  recipe?: Recipe
}

export function NutritionPanel({ nutrition, recipe }: NutritionPanelProps) {
  if (!nutrition) {
    return null
  }

  const servings = recipe?.servings || 1
  const caloriesPerServing = nutrition.calories ? Math.round(nutrition.calories / servings) : 0
  const proteinPerServing = nutrition.protein ? parseFloat((nutrition.protein / servings).toFixed(0)) : 0
  const carbsPerServing = nutrition.carbs ? parseFloat((nutrition.carbs / servings).toFixed(0)) : 0
  const fatPerServing = nutrition.fat ? parseFloat((nutrition.fat / servings).toFixed(0)) : 0
  const fiberPerServing = nutrition.fiber ? parseFloat((nutrition.fiber / servings).toFixed(0)) : 0

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-orange-500">👉</span>
        <h3 className="font-semibold text-foreground text-sm">Nutrition Information (Per Serving)</h3>
      </div>

      {/* Nutrition Cards Grid - Exactly as shown in figure */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {/* Calories Card */}
        <div className="flex-shrink-0 rounded-lg bg-yellow-50 p-4 text-center border border-yellow-100 min-w-max">
          <p className="text-xs text-muted-foreground font-medium mb-2">Calories</p>
          <p className="text-3xl font-bold text-foreground">{caloriesPerServing}</p>
          <p className="text-xs text-muted-foreground mt-1">kcal</p>
        </div>

        {/* Protein Card */}
        <div className="flex-shrink-0 rounded-lg bg-blue-50 p-4 text-center border border-blue-100 min-w-max">
          <p className="text-xs text-muted-foreground font-medium mb-2">Protein</p>
          <p className="text-3xl font-bold text-foreground">{proteinPerServing}</p>
          <p className="text-xs text-muted-foreground mt-1">g</p>
        </div>

        {/* Carbs Card */}
        <div className="flex-shrink-0 rounded-lg bg-green-50 p-4 text-center border border-green-100 min-w-max">
          <p className="text-xs text-muted-foreground font-medium mb-2">Carbs</p>
          <p className="text-3xl font-bold text-foreground">{carbsPerServing}</p>
          <p className="text-xs text-muted-foreground mt-1">g</p>
        </div>

        {/* Fat Card */}
        <div className="flex-shrink-0 rounded-lg bg-red-50 p-4 text-center border border-red-100 min-w-max">
          <p className="text-xs text-muted-foreground font-medium mb-2">Fat</p>
          <p className="text-3xl font-bold text-foreground">{fatPerServing}</p>
          <p className="text-xs text-muted-foreground mt-1">g</p>
        </div>

        {/* Fiber Card */}
        <div className="flex-shrink-0 rounded-lg bg-purple-50 p-4 text-center border border-purple-100 min-w-max">
          <p className="text-xs text-muted-foreground font-medium mb-2">Fiber</p>
          <p className="text-3xl font-bold text-foreground">{fiberPerServing}</p>
          <p className="text-xs text-muted-foreground mt-1">g</p>
        </div>
      </div>

      {/* Small text below */}
      <p className="text-xs text-muted-foreground mt-2">*Nutrition values are per serving</p>
    </div>
  )
}
