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

// --- Nutrition API Functions ---
interface NutritionData {
  calories?: number
  protein?: number
  carbs?: number
  fat?: number
  fiber?: number
  sodium?: number
  sugars?: number
}

// Mock nutrition database for common ingredients
const ingredientNutritionDatabase: Record<string, NutritionData> = {
  "pasta": { calories: 131, protein: 5, carbs: 25, fat: 1.1, fiber: 1.8, sodium: 3 },
  "rice": { calories: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4, sodium: 2 },
  "chicken": { calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, sodium: 74 },
  "beef": { calories: 250, protein: 26, carbs: 0, fat: 16, fiber: 0, sodium: 75 },
  "tofu": { calories: 76, protein: 8, carbs: 1.9, fat: 4.8, fiber: 1, sodium: 11 },
  "salmon": { calories: 208, protein: 20, carbs: 0, fat: 13, fiber: 0, sodium: 75 },
  "broccoli": { calories: 34, protein: 2.8, carbs: 7, fat: 0.4, fiber: 2.4, sodium: 64 },
  "tomato": { calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2, sodium: 5 },
  "olive oil": { calories: 119, protein: 0, carbs: 0, fat: 13.5, fiber: 0, sodium: 0 },
  "garlic": { calories: 149, protein: 6.4, carbs: 33, fat: 0.5, fiber: 2.1, sodium: 17 },
  "onion": { calories: 40, protein: 1.1, carbs: 9, fat: 0.1, fiber: 1.7, sodium: 4 },
  "egg": { calories: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0, sodium: 140 },
  "milk": { calories: 61, protein: 3.2, carbs: 4.8, fat: 3.3, fiber: 0, sodium: 44 },
  "cheese": { calories: 402, protein: 25, carbs: 1.3, fat: 33, fiber: 0, sodium: 714 },
  "butter": { calories: 717, protein: 0.9, carbs: 0, fat: 81, fiber: 0, sodium: 15 },
  "beans": { calories: 127, protein: 8.7, carbs: 23, fat: 0.4, fiber: 6.4, sodium: 2 },
  "lentils": { calories: 116, protein: 9.2, carbs: 20, fat: 0.4, fiber: 8, sodium: 2 },
  "quinoa": { calories: 120, protein: 4.4, carbs: 21, fat: 1.9, fiber: 2.8, sodium: 7 },
  "avocado": { calories: 160, protein: 2, carbs: 9, fat: 15, fiber: 7, sodium: 7 },
  "banana": { calories: 89, protein: 1.1, carbs: 23, fat: 0.3, fiber: 2.6, sodium: 1 },
  "carrot": { calories: 41, protein: 0.9, carbs: 10, fat: 0.2, fiber: 2.8, sodium: 69 },
  "potato": { calories: 77, protein: 2, carbs: 17, fat: 0.1, fiber: 2.1, sodium: 6 },
}

// Calculate nutrition for ingredient by extracting quantity from ingredient string
function estimateNutritionForIngredient(ingredient: string): NutritionData {
  const lowerIngredient = ingredient.toLowerCase()
  
  // Find matching ingredient in database
  let baseNutrition: NutritionData | undefined
  for (const [key, nutrition] of Object.entries(ingredientNutritionDatabase)) {
    if (lowerIngredient.includes(key)) {
      baseNutrition = nutrition
      break
    }
  }

  if (!baseNutrition) {
    // Default estimate for unknown ingredient
    return { calories: 50, protein: 2, carbs: 8, fat: 1, fiber: 1, sodium: 20 }
  }

  // Extract quantity multiplier from ingredient string
  let multiplier = 1
  const quantityMatch = ingredient.match(/(\d+(?:\.\d+)?)\s*(g|kg|ml|tbsp|tsp|cup|oz|lb|piece)/)
  if (quantityMatch) {
    const quantity = parseFloat(quantityMatch[1])
    const unit = quantityMatch[2]
    
    // Convert to grams for consistent calculation
    switch (unit) {
      case "kg": multiplier = quantity * 1000 / 100; break
      case "g": multiplier = quantity / 100; break
      case "ml": multiplier = quantity / 100; break
      case "tbsp": multiplier = quantity * 15; break
      case "tsp": multiplier = quantity * 5; break
      case "cup": multiplier = quantity * 240 / 100; break
      case "oz": multiplier = quantity * 28.35 / 100; break
      case "lb": multiplier = quantity * 454 / 100; break
      case "piece": multiplier = quantity; break
    }
  }

  return {
    calories: baseNutrition.calories ? Math.round(baseNutrition.calories * multiplier) : 0,
    protein: baseNutrition.protein ? parseFloat((baseNutrition.protein * multiplier).toFixed(1)) : 0,
    carbs: baseNutrition.carbs ? parseFloat((baseNutrition.carbs * multiplier).toFixed(1)) : 0,
    fat: baseNutrition.fat ? parseFloat((baseNutrition.fat * multiplier).toFixed(1)) : 0,
    fiber: baseNutrition.fiber ? parseFloat((baseNutrition.fiber * multiplier).toFixed(1)) : 0,
    sodium: baseNutrition.sodium ? Math.round(baseNutrition.sodium * multiplier) : 0,
  }
}

export async function fetchNutritionForIngredients(ingredients: string[]): Promise<NutritionData | null> {
  try {
    let totalCalories = 0
    let totalProtein = 0
    let totalCarbs = 0
    let totalFat = 0
    let totalFiber = 0
    let totalSodium = 0

    for (const ingredient of ingredients) {
      const nutrition = estimateNutritionForIngredient(ingredient)
      totalCalories += nutrition.calories || 0
      totalProtein += nutrition.protein || 0
      totalCarbs += nutrition.carbs || 0
      totalFat += nutrition.fat || 0
      totalFiber += nutrition.fiber || 0
      totalSodium += nutrition.sodium || 0
    }

    return {
      calories: totalCalories,
      protein: parseFloat(totalProtein.toFixed(1)),
      carbs: parseFloat(totalCarbs.toFixed(1)),
      fat: parseFloat(totalFat.toFixed(1)),
      fiber: parseFloat(totalFiber.toFixed(1)),
      sodium: totalSodium,
      per: "recipe",
    }
  } catch (e) {
    return null
  }
}
