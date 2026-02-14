"use client"

import { useEffect, useState } from "react"
import { fetchRecipeOfDay } from "@/lib/api"
import { RecipeCard } from "./recipe-card"
import type { Recipe } from "@/lib/dummy-data"

export function RecipeOfDay() {
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    fetchRecipeOfDay()
      .then((r) => {
        if (mounted && r) setRecipe(r)
      })
      .catch(() => {
        // ignore, leave null
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [])

  return (
    <section id="recipe-of-day" className="py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center mb-8">
          <h3 className="text-2xl font-semibold">Recipe of the Day</h3>
          <p className="text-muted-foreground">A featured recipe from RecipeDB</p>
        </div>

        <div className="mx-auto max-w-4xl">
          {loading ? (
            <p className="text-center">Loading featured recipe…</p>
          ) : recipe ? (
            <RecipeCard recipe={recipe} />
          ) : (
           <div className="text-center">
  <a
    href="http://www.geniuskitchen.com/recipe/amana-hoppel-poppel-155788"
    target="_blank"
    rel="noopener noreferrer"
    className="text-sm text-muted-foreground underline"
  >
    View Recipe
  </a>
</div>

          )}
        </div>
      </div>
    </section>
  )
}
