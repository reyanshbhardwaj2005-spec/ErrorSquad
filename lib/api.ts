export interface ApiRecipe {
  _id?: string
  Recipe_id?: string
  Recipe_title?: string
  Region?: string
  Sub_region?: string
  Processes?: string
  Ingredients?: Array<{ name: string }> | string[]
  vegan?: string | number
  lacto_vegetarian?: string | number
  ovo_vegetarian?: string | number
}

import type { Recipe } from "./dummy-data"

const DEFAULT_BASE = "http://cosylab.iiitd.edu.in:6969"

function getBaseUrl() {
  return (process?.env?.NEXT_PUBLIC_RECIPEDB_BASE as string) || DEFAULT_BASE
}

function getApiKey() {
  return (process?.env?.NEXT_PUBLIC_RECIPEDB_KEY as string) || ""
}

function mapApiToRecipe(item: ApiRecipe): Recipe {
  const name = item.Recipe_title || "Untitled Recipe"
  const baseCuisine = item.Region || "Global"
  const targetCuisine = item.Sub_region || item.Region || "Fusion"

  // Ingredients may come as array of objects or strings; normalize
  let ingredients: string[] = []
  if (Array.isArray(item.Ingredients)) {
    ingredients = item.Ingredients.map((i: any) => (typeof i === "string" ? i : i.name || String(i)))
  }

  const steps: string[] = item.Processes ? String(item.Processes).split("||").filter(Boolean) : []

  const flavorLogic = `Source: ${item.Region || "unknown"}.` // minimal mapping

  const badges: string[] = []
  try {
    if (Number(item.vegan) === 1) badges.push("Vegan")
    if (Number(item.lacto_vegetarian) === 1) badges.push("Lacto-Vegetarian")
    if (Number(item.ovo_vegetarian) === 1) badges.push("Ovo-Vegetarian")
  } catch (e) {}

  if (badges.length === 0) badges.push("From RecipeDB")

  return {
    name,
    baseCuisine,
    targetCuisine,
    ingredients,
    steps,
    flavorLogic,
    badges,
  }
}

export async function fetchRecipes(page = 1, limit = 6): Promise<Recipe[]> {
  const base = getBaseUrl()
  const key = getApiKey()
  const url = `${base}/recipe2-api/recipe/recipesinfo?page=${page}&limit=${limit}`

  const headers: Record<string, string> = { "Content-Type": "application/json" }
  if (key) headers["Authorization"] = `Bearer ${key}`

  const res = await fetch(url, { headers })
  if (!res.ok) {
    throw new Error(`Failed to fetch recipes: ${res.status} ${res.statusText}`)
  }

  const body = await res.json()
  const items: any[] = body?.payload?.data || []
  return items.map(mapApiToRecipe)
}

export async function fetchRecipeOfDay(): Promise<Recipe | null> {
  const base = getBaseUrl()
  const key = getApiKey()
  const url = `${base}/recipe2-api/recipe/recipeofday`

  const headers: Record<string, string> = { "Content-Type": "application/json" }
  if (key) headers["Authorization"] = `Bearer ${key}`

  const res = await fetch(url, { headers })
  if (!res.ok) return null
  const body = await res.json()
  const item: ApiRecipe = body?.payload?.data
  if (!item) return null
  return mapApiToRecipe(item)
}

// --- FlavorDB client (best-effort endpoints; will fail gracefully) ---
const DEFAULT_FLAVOR_BASE = "http://cosylab.iiitd.edu.in:6969/flavordb"

function getFlavorBase() {
  return (process?.env?.NEXT_PUBLIC_FLAVORDb_BASE as string) || DEFAULT_FLAVOR_BASE
}

export async function fetchFlavorEntitiesByName(name: string, page = 1, limit = 6): Promise<any[]> {
  const base = getFlavorBase()
  const url = `${base}/entities/by-name?name=${encodeURIComponent(name)}&page=${page}&limit=${limit}`

  try {
    const res = await fetch(url, { headers: { "Content-Type": "application/json" } })
    if (!res.ok) return []
    const body = await res.json()
    return body?.data || []
  } catch (e) {
    return []
  }
}

export async function fetchFlavorPairingsForIngredient(ingredient: string): Promise<string[]> {
  const base = getFlavorBase()
  // best-effort endpoint guess; collection varies — handle failures gracefully
  const url = `${base}/foodpairing/get_pairings?ingredient=${encodeURIComponent(ingredient)}`
  try {
    const res = await fetch(url, { headers: { "Content-Type": "application/json" } })
    if (!res.ok) return []
    const body = await res.json()
    // try common shapes
    if (Array.isArray(body?.data)) return body.data.map((d: any) => d.name || d.ingredient || String(d))
    if (Array.isArray(body)) return body.map((d: any) => d.name || String(d))
    return []
  } catch (e) {
    return []
  }
}
