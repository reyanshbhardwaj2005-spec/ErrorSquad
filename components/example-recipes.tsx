import { RecipeCard } from "./recipe-card"
import { exampleRecipes } from "@/lib/dummy-data"

export function ExampleRecipes() {
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
          {exampleRecipes.map((recipe, index) => (
            <RecipeCard key={index} recipe={recipe} />
          ))}
        </div>
      </div>
    </section>
  )
}
