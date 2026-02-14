export interface NutritionInfo {
  calories?: number
  protein?: number
  carbs?: number
  fat?: number
  fiber?: number
  sodium?: number
  sugars?: number
  servingSize?: string
  per?: string
}

export interface IngredientNutrition {
  name: string
  quantity?: string
  calories?: number
  protein?: number
  carbs?: number
  fat?: number
}

export interface Recipe {
  name: string
  baseCuisine: string
  targetCuisine: string
  ingredients: string[]
  steps: string[]
  flavorLogic: string
  badges: string[]
  nutrition?: NutritionInfo
  ingredientNutrition?: IngredientNutrition[]
  servings?: number
  prepTime?: number
  cookTime?: number
  difficulty?: "Easy" | "Medium" | "Hard"
}

const recipeTemplates: Record<string, Recipe[]> = {
  "Indian-Italian": [
    {
      name: "Masala Arrabbiata Pasta",
      baseCuisine: "Indian",
      targetCuisine: "Italian",
      ingredients: [
        "400g penne pasta",
        "2 cups tomato puree",
        "1 tbsp garam masala",
        "1 tsp cumin seeds",
        "4 cloves garlic, minced",
        "1 green chili, sliced",
        "Fresh basil leaves",
        "Olive oil",
        "Salt and pepper to taste",
        "Fresh parmesan (optional)"
      ],
      steps: [
        "Cook pasta according to package directions until al dente. Reserve 1 cup pasta water.",
        "Heat olive oil in a large pan. Add cumin seeds and let them splutter.",
        "Add minced garlic and green chili, sauté until fragrant.",
        "Pour in tomato puree, add garam masala, salt, and pepper. Simmer for 10 minutes.",
        "Toss cooked pasta with the sauce, adding pasta water as needed for consistency.",
        "Garnish with fresh basil and serve hot."
      ],
      flavorLogic: "Indian spices like garam masala and cumin enhance the Italian tomato base, creating a warming, aromatic pasta dish with familiar comfort food appeal.",
      badges: ["Vegetarian", "Dairy-Free Option", "30 Minutes"],
      servings: 4,
      prepTime: 15,
      cookTime: 20,
      difficulty: "Easy",
      nutrition: {
        calories: 450,
        protein: 16,
        carbs: 62,
        fat: 14,
        fiber: 4,
        sodium: 480,
        sugars: 8,
        servingSize: "1 plate",
        per: "serving"
      },
      ingredientNutrition: [
        { name: "400g penne pasta", calories: 1320, protein: 48, carbs: 248, fat: 8 },
        { name: "2 cups tomato puree", calories: 100, protein: 4, carbs: 20, fat: 0 },
        { name: "Olive oil", calories: 200, protein: 0, carbs: 0, fat: 22 },
        { name: "Fresh basil", calories: 5, protein: 0, carbs: 1, fat: 0 }
      ]
    }
  ],
  "Mexican-Japanese": [
    {
      name: "Teriyaki Tacos with Wasabi Crema",
      baseCuisine: "Mexican",
      targetCuisine: "Japanese",
      ingredients: [
        "8 small corn tortillas",
        "500g firm tofu or chicken",
        "1/4 cup teriyaki sauce",
        "1/2 cup vegan mayo",
        "1 tbsp wasabi paste",
        "2 cups shredded cabbage",
        "1 avocado, sliced",
        "Pickled ginger",
        "Sesame seeds",
        "Green onions, sliced"
      ],
      steps: [
        "Press and cube tofu (or slice chicken). Marinate in teriyaki sauce for 15 minutes.",
        "Mix mayo with wasabi paste to create the wasabi crema. Adjust spice to taste.",
        "Pan-fry or grill the protein until caramelized and cooked through.",
        "Warm tortillas on a dry skillet until pliable.",
        "Assemble tacos with protein, cabbage, avocado, and pickled ginger.",
        "Drizzle with wasabi crema, sprinkle sesame seeds and green onions."
      ],
      flavorLogic: "The umami-rich teriyaki glaze meets Mexican tortilla tradition, while wasabi crema adds a Japanese kick that replaces traditional jalapeño heat.",
      badges: ["High Protein", "Gluten-Free Option", "Healthy"]
    }
  ],
  "Chinese-French": [
    {
      name: "Five-Spice Duck Confit Spring Rolls",
      baseCuisine: "Chinese",
      targetCuisine: "French",
      ingredients: [
        "2 duck legs",
        "2 tbsp five-spice powder",
        "Duck fat for confit",
        "12 spring roll wrappers",
        "1 cup julienned vegetables",
        "Hoisin sauce",
        "Orange zest",
        "Fresh herbs (thyme, chives)"
      ],
      steps: [
        "Rub duck legs with five-spice and salt. Refrigerate overnight.",
        "Slow-cook duck in its fat at 250°F for 3 hours until tender.",
        "Shred the duck meat, mix with orange zest and fresh herbs.",
        "Place duck mixture and vegetables in spring roll wrappers.",
        "Roll tightly and deep fry until golden and crispy.",
        "Serve with hoisin sauce for dipping."
      ],
      flavorLogic: "French confit technique creates impossibly tender duck, while Chinese five-spice and spring roll presentation honor both culinary traditions.",
      badges: ["High Protein", "Special Occasion"]
    }
  ],
  "Thai-Mexican": [
    {
      name: "Green Curry Quesadillas",
      baseCuisine: "Thai",
      targetCuisine: "Mexican",
      ingredients: [
        "4 large flour tortillas",
        "2 cups cooked chicken, shredded",
        "1/2 cup green curry paste",
        "1 cup coconut cream",
        "2 cups shredded mozzarella",
        "Fresh Thai basil",
        "Lime wedges",
        "Bean sprouts"
      ],
      steps: [
        "Simmer green curry paste with coconut cream until fragrant.",
        "Toss shredded chicken in the curry mixture.",
        "Lay tortilla flat, add cheese, curry chicken, and Thai basil on half.",
        "Fold and cook on a skillet until golden on both sides.",
        "Cut into wedges and serve with lime and bean sprouts."
      ],
      flavorLogic: "Creamy Thai green curry filling transforms the humble quesadilla, with coconut and basil adding aromatic depth to the melted cheese.",
      badges: ["High Protein", "Quick Meal"]
    }
  ],
  "Japanese-Italian": [
    {
      name: "Miso Carbonara",
      baseCuisine: "Japanese",
      targetCuisine: "Italian",
      ingredients: [
        "400g spaghetti",
        "4 egg yolks",
        "2 tbsp white miso paste",
        "1 cup pecorino, grated",
        "150g pancetta or shiitake bacon",
        "Black pepper",
        "Nori strips for garnish"
      ],
      steps: [
        "Cook spaghetti in well-salted water until al dente.",
        "Whisk egg yolks with miso paste and half the cheese.",
        "Crisp pancetta in a large pan, remove from heat.",
        "Add hot pasta to the pan, then quickly toss with egg mixture.",
        "Add pasta water as needed for silky sauce. Never scramble!",
        "Serve with remaining cheese, pepper, and nori strips."
      ],
      flavorLogic: "Umami-rich miso amplifies the savory depth of traditional carbonara, creating an impossibly rich and silky sauce.",
      badges: ["Vegetarian Option", "Comfort Food"]
    }
  ],
  "Korean-Mexican": [
    {
      name: "Gochujang BBQ Burrito Bowl",
      baseCuisine: "Korean",
      targetCuisine: "Mexican",
      ingredients: [
        "2 cups cooked rice",
        "500g bulgogi beef or tofu",
        "3 tbsp gochujang",
        "1 tbsp sesame oil",
        "Kimchi",
        "Black beans",
        "Corn",
        "Avocado",
        "Cilantro-lime crema"
      ],
      steps: [
        "Marinate protein in gochujang, sesame oil, and garlic for 30 minutes.",
        "Cook protein on high heat until caramelized.",
        "Prepare rice, black beans, corn, and slice avocado.",
        "Assemble bowls with rice base, add protein, kimchi, beans, corn.",
        "Top with avocado and drizzle with cilantro-lime crema.",
        "Garnish with sesame seeds and green onions."
      ],
      flavorLogic: "Korean gochujang heat meets Mexican bowl format, while kimchi adds fermented tang that echoes pickled vegetables in traditional burritos.",
      badges: ["High Protein", "Gluten-Free", "Healthy"]
    }
  ]
}

// Default fallback recipe generator
function createFallbackRecipe(baseCuisine: string, targetCuisine: string, dietary: string[], health: string[]): Recipe {
  const badges: string[] = []
  
  if (dietary.includes("vegetarian")) badges.push("Vegetarian")
  if (dietary.includes("vegan")) badges.push("Vegan")
  if (dietary.includes("gluten-free")) badges.push("Gluten-Free")
  if (dietary.includes("dairy-free")) badges.push("Dairy-Free")
  if (dietary.includes("nut-free")) badges.push("Nut-Free")
  if (health.includes("low-calorie")) badges.push("Low Calorie")
  if (health.includes("high-protein")) badges.push("High Protein")
  if (health.includes("diabetic-friendly")) badges.push("Diabetic Friendly")
  
  if (badges.length === 0) badges.push("Fusion Delight")

  return {
    name: `${baseCuisine}-Style ${targetCuisine} Fusion Bowl`,
    baseCuisine,
    targetCuisine,
    ingredients: [
      "2 cups jasmine rice or grain of choice",
      `Traditional ${baseCuisine} spice blend`,
      `${targetCuisine}-style vegetables`,
      "1 lb protein of choice",
      "Fresh herbs from both cuisines",
      "House-made fusion sauce",
      "Pickled vegetables",
      "Toasted sesame seeds"
    ],
    steps: [
      `Prepare base using traditional ${baseCuisine} cooking methods.`,
      `Season protein with ${targetCuisine} spices and aromatics.`,
      "Cook protein to perfection using appropriate technique.",
      "Prepare vegetables with fusion seasoning blend.",
      "Assemble bowl with all components artfully arranged.",
      "Drizzle with fusion sauce and garnish with fresh herbs."
    ],
    flavorLogic: `This fusion dish combines the bold flavors of ${baseCuisine} cuisine with the refined techniques of ${targetCuisine} cooking, creating a harmonious blend that respects both culinary traditions.`,
    badges
  }
}

export function generateRecipe(baseCuisine: string, targetCuisine: string, dietary: string[], health: string[]): Recipe {
  // Try to find a pre-defined recipe
  const key1 = `${baseCuisine}-${targetCuisine}`
  const key2 = `${targetCuisine}-${baseCuisine}`
  
  let recipes = recipeTemplates[key1] || recipeTemplates[key2]
  
  if (recipes && recipes.length > 0) {
    const recipe = { ...recipes[Math.floor(Math.random() * recipes.length)] }
    
    // Add dietary badges
    if (dietary.includes("vegetarian") && !recipe.badges.includes("Vegetarian")) {
      recipe.badges.push("Vegetarian")
    }
    if (dietary.includes("gluten-free") && !recipe.badges.includes("Gluten-Free")) {
      recipe.badges.push("Gluten-Free")
    }
    if (health.includes("high-protein") && !recipe.badges.includes("High Protein")) {
      recipe.badges.push("High Protein")
    }
    
    return recipe
  }
  
  // Generate fallback recipe
  return createFallbackRecipe(baseCuisine, targetCuisine, dietary, health)
}

export function adaptRecipeForPreferences(recipe: Recipe, dietary: string[], health: string[]): Recipe {
  const adapted = { ...recipe }
  
  // Update badges based on preferences
  adapted.badges = [...recipe.badges]
  
  if (dietary.includes("vegetarian") && !adapted.badges.includes("Vegetarian")) {
    adapted.badges.push("Vegetarian")
  }
  if (dietary.includes("vegan") && !adapted.badges.includes("Vegan")) {
    adapted.badges.push("Vegan")
  }
  if (dietary.includes("gluten-free") && !adapted.badges.includes("Gluten-Free")) {
    adapted.badges.push("Gluten-Free")
  }
  if (dietary.includes("dairy-free") && !adapted.badges.includes("Dairy-Free")) {
    adapted.badges.push("Dairy-Free")
  }
  if (dietary.includes("nut-free") && !adapted.badges.includes("Nut-Free")) {
    adapted.badges.push("Nut-Free")
  }
  if (health.includes("low-calorie") && !adapted.badges.includes("Low Calorie")) {
    adapted.badges.push("Low Calorie")
  }
  if (health.includes("high-protein") && !adapted.badges.includes("High Protein")) {
    adapted.badges.push("High Protein")
  }
  if (health.includes("diabetic-friendly") && !adapted.badges.includes("Diabetic Friendly")) {
    adapted.badges.push("Diabetic Friendly")
  }
  
  // Adapt ingredients based on preferences
  if (dietary.includes("vegan") || dietary.includes("vegetarian")) {
    adapted.ingredients = adapted.ingredients.map(ing => {
      const lower = ing.toLowerCase()
      // Replace meat with plant-based alternatives
      if (lower.includes("chicken") || lower.includes("beef") || lower.includes("pork")) {
        return ing.replace(/chicken|beef|pork/gi, "tofu or plant-based protein")
      }
      if (dietary.includes("vegan")) {
        if (lower.includes("butter")) return ing.replace(/butter/gi, "vegan butter")
        if (lower.includes("milk")) return ing.replace(/milk/gi, "plant-based milk")
        if (lower.includes("cheese")) return ing.replace(/cheese/gi, "vegan cheese")
        if (lower.includes("egg")) return ing.replace(/egg/gi, "flax egg (1 tbsp ground flax + 3 tbsp water)")
      }
      if (dietary.includes("dairy-free")) {
        if (lower.includes("butter")) return ing.replace(/butter/gi, "coconut oil")
        if (lower.includes("milk")) return ing.replace(/milk/gi, "almond milk")
        if (lower.includes("cheese")) return ing.replace(/cheese/gi, "nutritional yeast")
        if (lower.includes("cream")) return ing.replace(/cream/gi, "coconut cream")
      }
      return ing
    })
  }
  
  if (dietary.includes("gluten-free")) {
    adapted.ingredients = adapted.ingredients.map(ing => {
      const lower = ing.toLowerCase()
      if (lower.includes("pasta")) return ing.replace(/pasta/gi, "gluten-free pasta")
      if (lower.includes("flour")) return ing.replace(/flour/gi, "gluten-free flour")
      if (lower.includes("bread")) return ing.replace(/bread/gi, "gluten-free bread")
      return ing
    })
  }
  
  if (health.includes("low-calorie")) {
    // Reduce oil and fat
    adapted.ingredients = adapted.ingredients.map(ing => {
      const lower = ing.toLowerCase()
      if (lower.includes("oil")) {
        return ing.replace(/(\d+\s*)(?:tbsp|cup|ml)\s+oil/, "1 tbsp oil (or cooking spray)")
      }
      if (lower.includes("butter")) {
        return ing.replace(/(\d+\s*)(?:tbsp)\s+butter/, "1 tbsp butter (or oil spray)")
      }
      return ing
    })
  }
  
  // Adjust nutrition if present
  if (recipe.nutrition && health.length > 0) {
    const nutrition = { ...recipe.nutrition }
    
    if (health.includes("low-calorie")) {
      // Reduce calories by 20%
      nutrition.calories = nutrition.calories ? Math.round(nutrition.calories * 0.8) : nutrition.calories
      nutrition.fat = nutrition.fat ? parseFloat((nutrition.fat * 0.8).toFixed(1)) : nutrition.fat
    }
    
    if (health.includes("high-protein")) {
      // Increase protein by adding protein-rich ingredients effect
      nutrition.protein = nutrition.protein ? parseFloat((nutrition.protein * 1.25).toFixed(1)) : nutrition.protein
    }
    
    adapted.nutrition = nutrition
  }
  
  return adapted
}

export const exampleRecipes: Recipe[] = [
  {
    name: "Masala Arrabbiata Pasta",
    baseCuisine: "Indian",
    targetCuisine: "Italian",
    ingredients: [
      "400g penne pasta",
      "2 cups tomato puree",
      "1 tbsp garam masala",
      "1 tsp cumin seeds",
      "4 cloves garlic, minced",
      "1 green chili, sliced",
      "Fresh basil leaves",
      "Olive oil"
    ],
    steps: [
      "Cook pasta according to package directions until al dente.",
      "Heat olive oil, add cumin seeds and let them splutter.",
      "Add garlic and chili, sauté until fragrant.",
      "Add tomato puree and garam masala, simmer for 10 minutes.",
      "Toss pasta with sauce and garnish with fresh basil."
    ],
    flavorLogic: "Indian spices like garam masala and cumin enhance the Italian tomato base, creating a warming, aromatic pasta dish.",
    badges: ["Vegetarian", "Dairy-Free", "30 Minutes"]
  },
  {
    name: "Miso Butter Tacos",
    baseCuisine: "Japanese",
    targetCuisine: "Mexican",
    ingredients: [
      "8 corn tortillas",
      "500g ground pork",
      "3 tbsp white miso",
      "2 tbsp butter",
      "Shredded lettuce",
      "Pickled onions",
      "Lime wedges"
    ],
    steps: [
      "Brown ground pork in a skillet until cooked through.",
      "Mix miso with softened butter to create miso butter.",
      "Add miso butter to pork, stir until melted and combined.",
      "Warm tortillas and fill with miso pork mixture.",
      "Top with lettuce, pickled onions, and squeeze of lime."
    ],
    flavorLogic: "Umami-rich miso butter adds depth to savory pork, while Mexican taco format provides the perfect vessel for this fusion.",
    badges: ["High Protein", "Quick Meal", "Gluten-Free"]
  }
]
