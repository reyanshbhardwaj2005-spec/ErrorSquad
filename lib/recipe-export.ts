import type { Recipe } from "@/lib/dummy-data"

interface RecipeExportData {
  recipe: Recipe
  pairings: string[]
  dietaryPreferences: string[]
  healthFocus: string[]
  generatedAt: string
}

// Convert dietary preference IDs to display labels
function getDietaryLabel(id: string): string {
  const labels: Record<string, string> = {
    vegetarian: "Vegetarian",
    vegan: "Vegan",
    "gluten-free": "Gluten-Free",
    "dairy-free": "Dairy-Free",
    "nut-free": "Nut-Free",
  }
  return labels[id] || id
}

function getHealthLabel(id: string): string {
  const labels: Record<string, string> = {
    "low-calorie": "Low Calorie",
    "high-protein": "High Protein",
    "diabetic-friendly": "Diabetic Friendly",
  }
  return labels[id] || id
}

export function generateRecipeJSON(data: RecipeExportData): string {
  return JSON.stringify(data, null, 2)
}

export function generateRecipeMarkdown(data: RecipeExportData): string {
  const { recipe, pairings, dietaryPreferences, healthFocus, generatedAt } = data
  const servings = recipe.servings || 1

  let markdown = `# ${recipe.name}\n\n`

  markdown += `**Fusion:** ${recipe.baseCuisine} × ${recipe.targetCuisine}\n`
  markdown += `**Generated:** ${new Date(generatedAt).toLocaleDateString()} at ${new Date(generatedAt).toLocaleTimeString()}\n\n`

  // Dietary & Health Info
  markdown += `## Recipe Preferences\n\n`
  if (dietaryPreferences.length > 0) {
    markdown += `**Dietary Preferences:** ${dietaryPreferences.map(getDietaryLabel).join(", ")}\n`
  }
  if (healthFocus.length > 0) {
    markdown += `**Health Focus:** ${healthFocus.map(getHealthLabel).join(", ")}\n`
  }
  markdown += `\n`

  // Quick Info
  markdown += `## Quick Info\n\n`
  markdown += `- **Servings:** ${servings}\n`
  if (recipe.prepTime) markdown += `- **Prep Time:** ${recipe.prepTime} minutes\n`
  if (recipe.cookTime) markdown += `- **Cook Time:** ${recipe.cookTime} minutes\n`
  if (recipe.difficulty) markdown += `- **Difficulty Level:** ${recipe.difficulty}\n`
  markdown += `\n`

  // Nutrition Information
  if (recipe.nutrition) {
    markdown += `## Nutrition Information (Per Serving)\n\n`
    const nutrition = recipe.nutrition
    const divide = (val: number | undefined) => val ? (val / servings).toFixed(1) : "N/A"

    markdown += `| Nutrient | Amount |\n`
    markdown += `|----------|--------|\n`
    markdown += `| Calories | ${divide(nutrition.calories)} |\n`
    markdown += `| Protein | ${divide(nutrition.protein)}g |\n`
    markdown += `| Carbohydrates | ${divide(nutrition.carbs)}g |\n`
    markdown += `| Fat | ${divide(nutrition.fat)}g |\n`
    if (nutrition.fiber) markdown += `| Fiber | ${divide(nutrition.fiber)}g |\n`
    if (nutrition.sodium) markdown += `| Sodium | ${divide(nutrition.sodium)}mg |\n`
    if (nutrition.sugars) markdown += `| Sugars | ${divide(nutrition.sugars)}g |\n`
    markdown += `\n`
  }

  // Ingredients
  markdown += `## Ingredients (${servings} Servings)\n\n`
  recipe.ingredients.forEach((ingredient) => {
    markdown += `- ${ingredient}\n`
  })
  markdown += `\n`

  // Cooking Steps
  markdown += `## Cooking Instructions\n\n`
  recipe.steps.forEach((step, index) => {
    markdown += `${index + 1}. ${step}\n`
  })
  markdown += `\n`

  // Flavor Logic
  markdown += `## Flavor Profile\n\n`
  markdown += `${recipe.flavorLogic}\n\n`

  // Pairings
  if (pairings && pairings.length > 0) {
    markdown += `## Suggested Ingredient Pairings\n\n`
    markdown += pairings.slice(0, 10).map((p) => `- ${p}`).join("\n")
    markdown += `\n\n`
  }

  // Badges
  if (recipe.badges && recipe.badges.length > 0) {
    markdown += `## Tags\n\n`
    markdown += recipe.badges.map((b) => `- ${b}`).join("\n")
    markdown += `\n`
  }

  return markdown
}

export function generateRecipeCSV(data: RecipeExportData): string {
  const { recipe, pairings, dietaryPreferences, healthFocus, generatedAt } = data
  let csv = `"Recipe Name","${recipe.name}"\n`
  csv += `"Base Cuisine","${recipe.baseCuisine}"\n`
  csv += `"Target Cuisine","${recipe.targetCuisine}"\n`
  csv += `"Generated At","${generatedAt}"\n`
  csv += `"Servings","${recipe.servings || 1}"\n`
  csv += `"Prep Time (min)","${recipe.prepTime || "N/A"}"\n`
  csv += `"Cook Time (min)","${recipe.cookTime || "N/A"}"\n`
  csv += `"Difficulty","${recipe.difficulty || "N/A"}"\n\n`

  csv += `"Dietary Preferences","${dietaryPreferences.map(getDietaryLabel).join(", ")}"\n`
  csv += `"Health Focus","${healthFocus.map(getHealthLabel).join(", ")}"\n\n`

  if (recipe.nutrition) {
    csv += `"Calories (per serving)","${(recipe.nutrition.calories || 0) / (recipe.servings || 1)}"\n`
    csv += `"Protein (g)","${(recipe.nutrition.protein || 0) / (recipe.servings || 1)}"\n`
    csv += `"Carbs (g)","${(recipe.nutrition.carbs || 0) / (recipe.servings || 1)}"\n`
    csv += `"Fat (g)","${(recipe.nutrition.fat || 0) / (recipe.servings || 1)}"\n`
    if (recipe.nutrition.fiber) csv += `"Fiber (g)","${(recipe.nutrition.fiber || 0) / (recipe.servings || 1)}"\n`
    if (recipe.nutrition.sodium) csv += `"Sodium (mg)","${(recipe.nutrition.sodium || 0) / (recipe.servings || 1)}"\n`
    csv += `\n`
  }

  csv += `"Ingredients"\n`
  recipe.ingredients.forEach((ing) => {
    csv += `"${ing}"\n`
  })
  csv += `\n`

  csv += `"Cooking Steps"\n`
  recipe.steps.forEach((step, index) => {
    csv += `"${index + 1}. ${step}"\n`
  })
  csv += `\n`

  csv += `"Flavor Logic","${recipe.flavorLogic}"\n`

  if (pairings && pairings.length > 0) {
    csv += `"Suggested Pairings","${pairings.slice(0, 5).join(", ")}"\n`
  }

  return csv
}

export function downloadRecipe(
  data: RecipeExportData,
  format: "json" | "markdown" | "csv" = "json"
): void {
  let content: string
  let filename: string
  let mimeType: string

  const safeRecipeName = data.recipe.name.replace(/[^a-z0-9-_\.]/gi, "_").toLowerCase()
  const timestamp = Date.now()

  switch (format) {
    case "markdown":
      content = generateRecipeMarkdown(data)
      filename = `${safeRecipeName}_${timestamp}.md`
      mimeType = "text/markdown"
      break
    case "csv":
      content = generateRecipeCSV(data)
      filename = `${safeRecipeName}_${timestamp}.csv`
      mimeType = "text/csv"
      break
    case "json":
    default:
      content = generateRecipeJSON(data)
      filename = `${safeRecipeName}_${timestamp}.json`
      mimeType = "application/json"
      break
  }

  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function generateRecipePrintView(data: RecipeExportData): string {
  const { recipe, dietaryPreferences, healthFocus, generatedAt } = data
  const servings = recipe.servings || 1

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${recipe.name}</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 900px;
            margin: 0 auto;
            padding: 40px;
            color: #333;
            line-height: 1.6;
          }
          h1 { color: #2c3e50; border-bottom: 3px solid #3498db; padding-bottom: 10px; }
          h2 { color: #34495e; margin-top: 30px; }
          .header-info { background: #ecf0f1; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
          .nutrition-table { width: 100%; border-collapse: collapse; margin: 15px 0; }
          .nutrition-table td, .nutrition-table th { padding: 10px; border: 1px solid #bdc3c7; text-align: left; }
          .nutrition-table th { background: #3498db; color: white; }
          .ingredients { background: #f9f9f9; padding: 15px; border-left: 4px solid #27ae60; }
          .steps { background: #f9f9f9; padding: 15px; border-left: 4px solid #e74c3c; }
          .step { margin-bottom: 12px; }
          .tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
          .tag { background: #3498db; color: white; padding: 5px 12px; border-radius: 20px; font-size: 12px; }
          @media print {
            body { padding: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <h1>${recipe.name}</h1>
        
        <div class="header-info">
          <strong>Fusion:</strong> ${recipe.baseCuisine} × ${recipe.targetCuisine}<br>
          <strong>Generated:</strong> ${new Date(generatedAt).toLocaleString()}<br>
          ${dietaryPreferences.length > 0 ? `<strong>Dietary:</strong> ${dietaryPreferences.map(getDietaryLabel).join(", ")}<br>` : ""}
          ${healthFocus.length > 0 ? `<strong>Health Focus:</strong> ${healthFocus.map(getHealthLabel).join(", ")}<br>` : ""}
          <strong>Servings:</strong> ${servings}
        </div>

        ${recipe.nutrition ? `
          <h2>Nutrition Information (Per Serving)</h2>
          <table class="nutrition-table">
            <tr>
              <th>Nutrient</th>
              <th>Amount</th>
            </tr>
            <tr><td>Calories</td><td>${(recipe.nutrition.calories || 0) / servings}</td></tr>
            <tr><td>Protein</td><td>${((recipe.nutrition.protein || 0) / servings).toFixed(1)}g</td></tr>
            <tr><td>Carbohydrates</td><td>${((recipe.nutrition.carbs || 0) / servings).toFixed(1)}g</td></tr>
            <tr><td>Fat</td><td>${((recipe.nutrition.fat || 0) / servings).toFixed(1)}g</td></tr>
            ${recipe.nutrition.fiber ? `<tr><td>Fiber</td><td>${((recipe.nutrition.fiber || 0) / servings).toFixed(1)}g</td></tr>` : ""}
            ${recipe.nutrition.sodium ? `<tr><td>Sodium</td><td>${Math.round((recipe.nutrition.sodium || 0) / servings)}mg</td></tr>` : ""}
          </table>
        ` : ""}

        <h2>Ingredients</h2>
        <div class="ingredients">
          <ul>
            ${recipe.ingredients.map((ing) => `<li>${ing}</li>`).join("")}
          </ul>
        </div>

        <h2>Cooking Instructions</h2>
        <div class="steps">
          ${recipe.steps.map((step, i) => `<div class="step"><strong>${i + 1}.</strong> ${step}</div>`).join("")}
        </div>

        <h2>Flavor Profile</h2>
        <p>${recipe.flavorLogic}</p>

        ${recipe.badges && recipe.badges.length > 0 ? `
          <div class="tags">
            ${recipe.badges.map((badge) => `<span class="tag">${badge}</span>`).join("")}
          </div>
        ` : ""}
      </body>
    </html>
  `
}
