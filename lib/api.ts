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

// --- Nutrition API Functions with Internet Data ---
interface NutritionData {
  calories?: number
  protein?: number
  carbs?: number
  fat?: number
  fiber?: number
  sodium?: number
  sugars?: number
}

// USDA FoodData Central API - Free API for nutrition lookup
const USDA_API_BASE = "https://fdc.nal.usda.gov/api/foods"
const USDA_API_KEY = process.env.NEXT_PUBLIC_USDA_API_KEY || "DEMO_KEY" // Get free key from https://fdc.nal.usda.gov/api-key-signup

// Spoonacular API as fallback
const SPOONACULAR_BASE = "https://api.spoonacular.com/food/ingredients"
const SPOONACULAR_KEY = process.env.NEXT_PUBLIC_SPOONACULAR_KEY || ""

// Fetch nutrition data from USDA FoodData Central API
async function fetchFromUSDA(ingredient: string): Promise<NutritionData | null> {
  try {
    const query = ingredient.split(/\d+\s*(g|kg|ml|tbsp|tsp|cup|oz|lb|piece)/i)[0].trim()
    const response = await fetch(
      `${USDA_API_BASE}/search?query=${encodeURIComponent(query)}&pageSize=1&api_key=${USDA_API_KEY}`
    )
    
    if (!response.ok) return null
    
    const data = await response.json()
    if (!data.foods || data.foods.length === 0) return null
    
    const food = data.foods[0]
    const nutrients: Record<string, any> = {}
    
    food.foodNutrients?.forEach((nutrient: any) => {
      const name = nutrient.nutrientName?.toLowerCase() || ""
      
      if (name.includes("energy") && name.includes("kcal")) {
        nutrients.calories = nutrient.value
      }
      if (name.includes("protein")) {
        nutrients.protein = nutrient.value
      }
      if (name.includes("carbohydrate") && !name.includes("fiber")) {
        nutrients.carbs = nutrient.value
      }
      if (name.includes("fat") && !name.includes("saturated") && !name.includes("trans")) {
        nutrients.fat = nutrient.value
      }
      if (name.includes("fiber")) {
        nutrients.fiber = nutrient.value
      }
      if (name.includes("sodium")) {
        nutrients.sodium = nutrient.value
      }
    })
    
    // Extract quantity multiplier
    const quantityMatch = ingredient.match(/(\d+(?:\.\d+)?)\s*(g|kg|ml|tbsp|tsp|cup|oz|lb|piece)/)
    if (quantityMatch) {
      const quantity = parseFloat(quantityMatch[1])
      const unit = quantityMatch[2]
      
      let multiplier = 1
      switch (unit) {
        case "kg": multiplier = quantity * 1000 / 100; break
        case "g": multiplier = quantity / 100; break
        case "ml": multiplier = quantity / 100; break
        case "tbsp": multiplier = quantity * 15 / 100; break
        case "tsp": multiplier = quantity * 5 / 100; break
        case "cup": multiplier = quantity * 240 / 100; break
        case "oz": multiplier = quantity * 28.35 / 100; break
        case "lb": multiplier = quantity * 454 / 100; break
        case "piece": multiplier = quantity; break
      }
      
      return {
        calories: nutrients.calories ? nutrients.calories * multiplier : undefined,
        protein: nutrients.protein ? nutrients.protein * multiplier : undefined,
        carbs: nutrients.carbs ? nutrients.carbs * multiplier : undefined,
        fat: nutrients.fat ? nutrients.fat * multiplier : undefined,
        fiber: nutrients.fiber ? nutrients.fiber * multiplier : undefined,
        sodium: nutrients.sodium ? nutrients.sodium * multiplier : undefined,
      }
    }
    
    return nutrients
  } catch (e) {
    return null
  }
}

// Fetch nutrition from Spoonacular API as fallback
async function fetchFromSpoonacular(ingredient: string): Promise<NutritionData | null> {
  if (!SPOONACULAR_KEY) return null
  
  try {
    const query = ingredient.split(/\d+\s*(g|kg|ml|tbsp|tsp|cup|oz|lb|piece)/i)[0].trim()
    const response = await fetch(
      `${SPOONACULAR_BASE}/search?query=${encodeURIComponent(query)}&number=1&apiKey=${SPOONACULAR_KEY}`
    )
    
    if (!response.ok) return null
    
    const data = await response.json()
    if (!Array.isArray(data) || data.length === 0) return null
    
    const food = data[0]
    
    // Get detailed nutrition
    const nutritionResponse = await fetch(
      `${SPOONACULAR_BASE}/${food.id}/information?apiKey=${SPOONACULAR_KEY}`
    )
    
    if (!nutritionResponse.ok) return null
    
    const nutrition = await nutritionResponse.json()
    
    // Extract quantity multiplier
    const quantityMatch = ingredient.match(/(\d+(?:\.\d+)?)\s*(g|kg|ml|tbsp|tsp|cup|oz|lb|piece)/)
    let multiplier = 1
    
    if (quantityMatch) {
      const quantity = parseFloat(quantityMatch[1])
      const unit = quantityMatch[2]
      
      switch (unit) {
        case "kg": multiplier = quantity * 1000 / 100; break
        case "g": multiplier = quantity / 100; break
        case "ml": multiplier = quantity / 100; break
        case "tbsp": multiplier = quantity * 15 / 100; break
        case "tsp": multiplier = quantity * 5 / 100; break
        case "cup": multiplier = quantity * 240 / 100; break
        case "oz": multiplier = quantity * 28.35 / 100; break
        case "lb": multiplier = quantity * 454 / 100; break
        case "piece": multiplier = quantity; break
      }
    }
    
    return {
      calories: nutrition.nutrition?.calories ? nutrition.nutrition.calories * multiplier : undefined,
      protein: nutrition.nutrition?.protein ? parseFloat(nutrition.nutrition.protein) * multiplier : undefined,
      carbs: nutrition.nutrition?.carbohydrates ? parseFloat(nutrition.nutrition.carbohydrates) * multiplier : undefined,
      fat: nutrition.nutrition?.fat ? parseFloat(nutrition.nutrition.fat) * multiplier : undefined,
      fiber: nutrition.nutrition?.fiber ? parseFloat(nutrition.nutrition.fiber) * multiplier : undefined,
      sodium: nutrition.nutrition?.sodium ? parseFloat(nutrition.nutrition.sodium) * multiplier : undefined,
    }
  } catch (e) {
    return null
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
    let successCount = 0

    for (const ingredient of ingredients) {
      let nutrition = null
      
      // Try USDA first
      nutrition = await fetchFromUSDA(ingredient)
      
      // Fallback to Spoonacular if USDA fails
      if (!nutrition && SPOONACULAR_KEY) {
        nutrition = await fetchFromSpoonacular(ingredient)
      }
      
      // If both fail, use estimate
      if (!nutrition) {
        nutrition = {
          calories: 50,
          protein: 2,
          carbs: 8,
          fat: 1,
          fiber: 1,
          sodium: 20,
        }
      }
      
      if (nutrition) {
        totalCalories += nutrition.calories || 0
        totalProtein += nutrition.protein || 0
        totalCarbs += nutrition.carbs || 0
        totalFat += nutrition.fat || 0
        totalFiber += nutrition.fiber || 0
        totalSodium += nutrition.sodium || 0
        successCount++
      }
    }

    if (successCount === 0) return null

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
    console.error("Error fetching nutrition:", e)
    return null
  }
}
