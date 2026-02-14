"use client"

import { useEffect, useState } from "react"
import { RecipeCard } from "./recipe-card"
import { exampleRecipes } from "@/lib/dummy-data"
import { fetchRecipes } from "@/lib/api"
import type { Recipe } from "@/lib/dummy-data"

export function ExampleRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>(exampleRecipes)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    fetchRecipes(1, 6)
      .then((res) => {
        if (mounted && res && res.length > 0) setRecipes(res)
      })
      .catch(() => {
        // keep fallback exampleRecipes
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [])

  return (
    <section id="examples" className="bg-muted/30 py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Example Fusion Recipes
          </h2>
          <p className="mb-12 text-muted-foreground">
            Get inspired by these cross-cultural fusion dishes created by our AI
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
          {loading && recipes.length === 0 ? (
            <p className="col-span-2 text-center">Loading recipes…</p>
          ) : (
            recipes.map((recipe, index) => (
              <RecipeCard key={index} recipe={recipe} />
            ))
          )}
        </div>
      </div>
    </section>
  )
}
