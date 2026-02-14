"use client"

import { useState, forwardRef, useImperativeHandle } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sparkles, Loader2 } from "lucide-react"
import { RecipeCard } from "./recipe-card"
import type { Recipe } from "@/lib/dummy-data"
import { generateRecipe } from "@/lib/dummy-data"
import { fetchRecipes, fetchFlavorPairingsForIngredient } from "@/lib/api"

const cuisines = [
  "Indian",
  "Italian", 
  "Mexican",
  "Chinese",
  "Japanese",
  "Thai",
  "French",
  "Korean",
]

const dietaryOptions = [
  { id: "vegetarian", label: "Vegetarian" },
  { id: "vegan", label: "Vegan" },
  { id: "gluten-free", label: "Gluten-Free" },
  { id: "dairy-free", label: "Dairy-Free" },
  { id: "nut-free", label: "Nut-Free" },
]

const healthOptions = [
  { id: "low-calorie", label: "Low Calorie" },
  { id: "high-protein", label: "High Protein" },
  { id: "diabetic-friendly", label: "Diabetic Friendly" },
]

export interface RecipeGeneratorRef {
  scrollToGenerator: () => void
}

export const RecipeGenerator = forwardRef<RecipeGeneratorRef>((_, ref) => {
  const [baseCuisine, setBaseCuisine] = useState<string>("")
  const [targetCuisine, setTargetCuisine] = useState<string>("")
  const [dietaryPreferences, setDietaryPreferences] = useState<string[]>([])
  const [healthFocus, setHealthFocus] = useState<string[]>([])
  const [generatedRecipe, setGeneratedRecipe] = useState<Recipe | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [pairings, setPairings] = useState<string[]>([])

  useImperativeHandle(ref, () => ({
    scrollToGenerator: () => {
      const element = document.getElementById("generator")
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
    }
  }))

  const handleDietaryChange = (optionId: string, checked: boolean) => {
    if (checked) {
      setDietaryPreferences([...dietaryPreferences, optionId])
    } else {
      setDietaryPreferences(dietaryPreferences.filter(id => id !== optionId))
    }
  }

  const handleHealthChange = (optionId: string, checked: boolean) => {
    if (checked) {
      setHealthFocus([...healthFocus, optionId])
    } else {
      setHealthFocus(healthFocus.filter(id => id !== optionId))
    }
  }

  const handleGenerate = async () => {
    if (!baseCuisine || !targetCuisine) return

    setIsGenerating(true)
    // Try to fetch matching recipes from RecipeDB
    try {
      const items = await fetchRecipes(1, 30)
      // Prefer recipes matching either region or sub_region
      const matches = items.filter((r) => {
        const region = (r.baseCuisine || "").toLowerCase()
        const sub = (r.targetCuisine || "").toLowerCase()
        const b = baseCuisine.toLowerCase()
        const t = targetCuisine.toLowerCase()
        return region.includes(b) || sub.includes(t) || region.includes(t) || sub.includes(b)
      })

      let recipe = null
      if (matches && matches.length > 0) {
        recipe = matches[Math.floor(Math.random() * matches.length)]
      } else {
        // fallback to local generator
        recipe = generateRecipe(baseCuisine, targetCuisine, dietaryPreferences, healthFocus)
      }

      setGeneratedRecipe(recipe)

      // Fetch flavor pairings for the first ingredient (best-effort)
      const firstIngredient = recipe.ingredients?.[0]
      if (firstIngredient) {
        const name = typeof firstIngredient === "string" ? firstIngredient : (firstIngredient as any).name || String(firstIngredient)
        const pairings = await fetchFlavorPairingsForIngredient(name)
        setPairings(pairings)
      } else {
        setPairings([])
      }
    } catch (e) {
      const recipe = generateRecipe(baseCuisine, targetCuisine, dietaryPreferences, healthFocus)
      setGeneratedRecipe(recipe)
      setPairings([])
    } finally {
      setIsGenerating(false)
    }
  }

  const canGenerate = baseCuisine && targetCuisine && baseCuisine !== targetCuisine

  return (
    <section id="generator" className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Create Your Fusion Recipe
          </h2>
          <p className="mb-12 text-muted-foreground">
            Select your cuisines and dietary preferences to generate a unique fusion dish
          </p>
        </div>

        <div className="mx-auto max-w-2xl">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Recipe Generator
              </CardTitle>
              <CardDescription>
                Combine two cuisines to create something extraordinary
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Cuisine Selection */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="base-cuisine">Base Cuisine</Label>
                  <Select value={baseCuisine} onValueChange={setBaseCuisine}>
                    <SelectTrigger id="base-cuisine">
                      <SelectValue placeholder="Select base cuisine" />
                    </SelectTrigger>
                    <SelectContent>
                      {cuisines.map(cuisine => (
                        <SelectItem 
                          key={cuisine} 
                          value={cuisine}
                          disabled={cuisine === targetCuisine}
                        >
                          {cuisine}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="target-cuisine">Target Cuisine</Label>
                  <Select value={targetCuisine} onValueChange={setTargetCuisine}>
                    <SelectTrigger id="target-cuisine">
                      <SelectValue placeholder="Select target cuisine" />
                    </SelectTrigger>
                    <SelectContent>
                      {cuisines.map(cuisine => (
                        <SelectItem 
                          key={cuisine} 
                          value={cuisine}
                          disabled={cuisine === baseCuisine}
                        >
                          {cuisine}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Dietary Preferences */}
              <div className="space-y-3">
                <Label>Dietary Preferences</Label>
                <div className="flex flex-wrap gap-4">
                  {dietaryOptions.map(option => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={option.id}
                        checked={dietaryPreferences.includes(option.id)}
                        onCheckedChange={(checked) => handleDietaryChange(option.id, checked as boolean)}
                      />
                      <Label 
                        htmlFor={option.id} 
                        className="text-sm font-normal cursor-pointer"
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Health Focus */}
              <div className="space-y-3">
                <Label>Health Focus (Optional)</Label>
                <div className="flex flex-wrap gap-4">
                  {healthOptions.map(option => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={option.id}
                        checked={healthFocus.includes(option.id)}
                        onCheckedChange={(checked) => handleHealthChange(option.id, checked as boolean)}
                      />
                      <Label 
                        htmlFor={option.id} 
                        className="text-sm font-normal cursor-pointer"
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <Button
                onClick={handleGenerate}
                disabled={!canGenerate || isGenerating}
                className="w-full gap-2"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Creating Your Recipe...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    Create Fusion Recipe
                  </>
                )}
              </Button>

              {!canGenerate && baseCuisine && targetCuisine && (
                <p className="text-center text-sm text-destructive">
                  Please select two different cuisines
                </p>
              )}
            </CardContent>
          </Card>

          {/* Generated Recipe Output */}
          {generatedRecipe && (
            <div className="mt-8">
              <RecipeCard recipe={generatedRecipe} />
              {pairings && pairings.length > 0 && (
                <div className="mt-4 rounded-lg bg-muted/50 p-4">
                  <h4 className="font-semibold text-foreground mb-2">Ingredient Pairings</h4>
                  <div className="flex flex-wrap gap-2">
                    {pairings.slice(0, 8).map((p) => (
                      <span key={p} className="inline-block rounded-full bg-card px-3 py-1 text-sm">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
})

RecipeGenerator.displayName = "RecipeGenerator"
