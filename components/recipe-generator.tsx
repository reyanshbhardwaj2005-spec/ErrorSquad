"use client"

import { useState, forwardRef, useImperativeHandle, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sparkles, Loader2, Download, FileText, Sheet, Code } from "lucide-react"
import { RecipeCard } from "./recipe-card"
import type { Recipe } from "@/lib/dummy-data"
import { generateRecipe, adaptRecipeForPreferences } from "@/lib/dummy-data"
import { fetchRecipes, fetchFlavorPairingsForIngredient, fetchNutritionForIngredients } from "@/lib/api"
import { downloadRecipe } from "@/lib/recipe-export"

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
  const [isUpdatingPrefs, setIsUpdatingPrefs] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

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

  // Track preferences initialization
  const prefsInitializedRef = useRef(false)

  // Update recipe nutrition and ingredients when health focus changes
  useEffect(() => {
    if (!generatedRecipe) return
    
    if (!prefsInitializedRef.current && dietaryPreferences.length > 0 && healthFocus.length > 0) {
      prefsInitializedRef.current = true
      return
    }

    let cancelled = false
    ;(async () => {
      setIsUpdatingPrefs(true)
      try {
        const adapted = adaptRecipeForPreferences(generatedRecipe, dietaryPreferences, healthFocus)
        // fetch nutrition best-effort
        const nutrition = await fetchNutritionForIngredients(adapted.ingredients || [])
        if (!cancelled) {
          if (nutrition) adapted.nutrition = nutrition
          setGeneratedRecipe(adapted)
          // also refresh pairings for first ingredient
          const first = adapted.ingredients?.[0]
          if (first) {
            const name = String(first)
            const p = await fetchFlavorPairingsForIngredient(name)
            if (!cancelled) setPairings(p)
          }
        }
      } catch (e) {
        // ignore
      } finally {
        if (!cancelled) setIsUpdatingPrefs(false)
      }
    })()
    return () => { cancelled = true }
  }, [healthFocus])

  // Update recipe nutrition when dietary preferences change
  useEffect(() => {
    if (!prefsInitializedRef.current && dietaryPreferences.length > 0 && healthFocus.length > 0) {
      prefsInitializedRef.current = true
      return
    }

    let cancelled = false
    ;(async () => {
      setIsUpdatingPrefs(true)
      try {
        if (generatedRecipe) {
          const adapted = adaptRecipeForPreferences(generatedRecipe, dietaryPreferences, healthFocus)
          const nutrition = await fetchNutritionForIngredients(adapted.ingredients || [])
          if (!cancelled) {
            if (nutrition) adapted.nutrition = nutrition
            setGeneratedRecipe(adapted)
            const first = adapted.ingredients?.[0]
            if (first) {
              const p = await fetchFlavorPairingsForIngredient(String(first))
              if (!cancelled) setPairings(p)
            }
          }
        } else if (baseCuisine && targetCuisine && dietaryPreferences.length > 0 && healthFocus.length > 0) {
          // create a lightweight preview
          const preview = generateRecipe(baseCuisine, targetCuisine, dietaryPreferences, healthFocus)
          const adapted = adaptRecipeForPreferences(preview, dietaryPreferences, healthFocus)
          const nutrition = await fetchNutritionForIngredients(adapted.ingredients || [])
          if (!cancelled) {
            if (nutrition) adapted.nutrition = nutrition
            setGeneratedRecipe(adapted)
            const first = adapted.ingredients?.[0]
            if (first) {
              const p = await fetchFlavorPairingsForIngredient(String(first))
              if (!cancelled) setPairings(p)
            }
          }
        }
      } catch (e) {
        // ignore
      } finally {
        if (!cancelled) setIsUpdatingPrefs(false)
      }
    })()
    return () => { cancelled = true }
  }, [dietaryPreferences])

  const canGenerate = Boolean(baseCuisine && targetCuisine && baseCuisine !== targetCuisine && dietaryPreferences.length > 0 && healthFocus.length > 0)

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

              {!canGenerate && (
                <div className="space-y-2">
                  {baseCuisine && targetCuisine && baseCuisine === targetCuisine && (
                    <p className="text-center text-sm text-destructive">
                      Please select two different cuisines
                    </p>
                  )}
                  {baseCuisine && targetCuisine && dietaryPreferences.length === 0 && (
                    <p className="text-center text-sm text-muted">
                      Please select at least one <strong>Dietary Preference</strong> to generate recipes
                    </p>
                  )}
                  {baseCuisine && targetCuisine && healthFocus.length === 0 && (
                    <p className="text-center text-sm text-muted">
                      Please select at least one <strong>Health Focus</strong> to generate recipes
                    </p>
                  )}
                </div>
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
              
              {/* Download Options */}
              <div className="mt-6 space-y-4">
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                  <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Download className="h-5 w-5" />
                    Download Recipe
                  </h4>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <Button
                      onClick={async () => {
                        setIsDownloading(true)
                        try {
                          downloadRecipe(
                            {
                              recipe: generatedRecipe,
                              pairings,
                              dietaryPreferences,
                              healthFocus,
                              generatedAt: new Date().toISOString(),
                            },
                            "json"
                          )
                        } finally {
                          setIsDownloading(false)
                        }
                      }}
                      disabled={isDownloading || isUpdatingPrefs}
                      variant="outline"
                      className="gap-2"
                    >
                      <Code className="h-4 w-4" />
                      JSON
                    </Button>

                    <Button
                      onClick={async () => {
                        setIsDownloading(true)
                        try {
                          downloadRecipe(
                            {
                              recipe: generatedRecipe,
                              pairings,
                              dietaryPreferences,
                              healthFocus,
                              generatedAt: new Date().toISOString(),
                            },
                            "markdown"
                          )
                        } finally {
                          setIsDownloading(false)
                        }
                      }}
                      disabled={isDownloading || isUpdatingPrefs}
                      variant="outline"
                      className="gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      Markdown
                    </Button>

                    <Button
                      onClick={async () => {
                        setIsDownloading(true)
                        try {
                          downloadRecipe(
                            {
                              recipe: generatedRecipe,
                              pairings,
                              dietaryPreferences,
                              healthFocus,
                              generatedAt: new Date().toISOString(),
                            },
                            "csv"
                          )
                        } finally {
                          setIsDownloading(false)
                        }
                      }}
                      disabled={isDownloading || isUpdatingPrefs}
                      variant="outline"
                      className="gap-2"
                    >
                      <Sheet className="h-4 w-4" />
                      CSV
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    Download includes recipe details, ingredients, cooking steps, nutrition information, and your preferences
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
})

RecipeGenerator.displayName = "RecipeGenerator"
