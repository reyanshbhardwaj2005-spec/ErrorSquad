import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Lightbulb } from "lucide-react"
import type { Recipe } from "@/lib/dummy-data"

interface RecipeCardProps {
  recipe: Recipe
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Card className="shadow-lg overflow-hidden">
      <CardHeader className="bg-muted/50 pb-4">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <Badge variant="secondary" className="text-xs">
            {recipe.baseCuisine} × {recipe.targetCuisine}
          </Badge>
        </div>
        <CardTitle className="text-2xl md:text-3xl text-foreground">
          {recipe.name}
        </CardTitle>
        <div className="flex flex-wrap gap-2 mt-3">
          {recipe.badges.map((badge) => (
            <Badge 
              key={badge} 
              variant="outline" 
              className="gap-1 text-xs bg-card"
            >
              <Check className="h-3 w-3 text-primary" />
              {badge}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* Ingredients */}
        <div>
          <h4 className="font-semibold text-foreground mb-3">Hello</h4>
          <ul className="grid gap-2 sm:grid-cols-2">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="text-primary mt-1">•</span>
                {ingredient}
              </li>
            ))}
          </ul>
        </div>

        {/* Nutrition Summary */}
        {recipe.nutrition && (
          <div>
            <h4 className="font-semibold text-foreground mb-3">Nutrition Information (Per Serving)</h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="rounded-lg bg-card p-3 text-center">
                <div className="text-xs text-muted-foreground">Calories</div>
                <div className="text-xl font-bold text-foreground">{Math.round(recipe.nutrition.calories || 0)}</div>
                <div className="text-xs text-muted-foreground">kcal</div>
              </div>
              <div className="rounded-lg bg-card p-3 text-center">
                <div className="text-xs text-muted-foreground">Protein</div>
                <div className="text-xl font-bold text-foreground">{Math.round(recipe.nutrition.protein || 0)}</div>
                <div className="text-xs text-muted-foreground">g</div>
              </div>
              <div className="rounded-lg bg-card p-3 text-center">
                <div className="text-xs text-muted-foreground">Carbs</div>
                <div className="text-xl font-bold text-foreground">{Math.round(recipe.nutrition.carbs || 0)}</div>
                <div className="text-xs text-muted-foreground">g</div>
              </div>
              <div className="rounded-lg bg-card p-3 text-center">
                <div className="text-xs text-muted-foreground">Fat</div>
                <div className="text-xl font-bold text-foreground">{Math.round(recipe.nutrition.fat || 0)}</div>
                <div className="text-xs text-muted-foreground">g</div>
              </div>
              <div className="rounded-lg bg-card p-3 text-center">
                <div className="text-xs text-muted-foreground">Fiber</div>
                <div className="text-xl font-bold text-foreground">{Math.round(recipe.nutrition.fiber || 0)}</div>
                <div className="text-xs text-muted-foreground">g</div>
              </div>
            </div>
            <div className="text-xs text-muted-foreground mt-2">Nutrition values are per serving</div>
          </div>
        )}

        {/* Cooking Steps */}
        <div>
          <h4 className="font-semibold text-foreground mb-3">Cooking Steps</h4>
          <ol className="space-y-3">
            {recipe.steps.map((step, index) => (
              <li key={index} className="flex gap-3 text-sm">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                  {index + 1}
                </span>
                <span className="text-muted-foreground pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Flavor Logic */}
        <div className="rounded-lg bg-muted/50 p-4">
          <div className="flex items-start gap-3">
            <Lightbulb className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-foreground mb-1">Flavor Logic</h4>
              <p className="text-sm text-muted-foreground">{recipe.flavorLogic}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
