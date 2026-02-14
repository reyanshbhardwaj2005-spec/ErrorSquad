# Technical Documentation - Nutrition System Architecture

## 🏗️ System Architecture

### Component Hierarchy
```
RecipeGenerator
├── Card (Input Form)
│   ├── Cuisine Selectors
│   ├── Dietary Preferences Checkboxes
│   ├── Health Focus Checkboxes
│   └── Generate Button
├── RecipeCard
│   ├── NutritionPanel
│   ├── Ingredients List
│   ├── Cooking Steps
│   └── Flavor Logic
└── Download Section
    ├── JSON Download
    ├── Markdown Download
    └── CSV Download
```

---

## 📦 Data Flow

### 1. Recipe Generation Flow
```
User selects cuisines
         ↓
[generateRecipe()]
         ↓
Returns Recipe object with initial nutrition
         ↓
Display in RecipeCard
```

### 2. Preference Adaptation Flow
```
User changes dietary preference
         ↓
useEffect triggers
         ↓
[adaptRecipeForPreferences()]
         ↓
[fetchNutritionForIngredients()]
         ↓
[fetchFlavorPairingsForIngredient()]
         ↓
Update UI with adapted recipe + nutrition
```

### 3. Recipe Export Flow
```
User clicks download button
         ↓
Select format (JSON/Markdown/CSV)
         ↓
[downloadRecipe()] with format parameter
         ↓
[generateRecipeJSON/Markdown/CSV()]
         ↓
Create Blob with content
         ↓
Generate download link
         ↓
Trigger browser download
```

---

## 🔧 API Reference

### Recipe Interface
```typescript
interface Recipe {
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
```

### NutritionInfo Interface
```typescript
interface NutritionInfo {
  calories?: number          // Total calories in recipe
  protein?: number           // Grams of protein
  carbs?: number            // Grams of carbohydrates
  fat?: number              // Grams of fat
  fiber?: number            // Grams of fiber
  sodium?: number           // Milligrams of sodium
  sugars?: number           // Grams of sugars
  servingSize?: string      // e.g., "1 bowl"
  per?: string              // e.g., "serving" or "recipe"
}
```

### IngredientNutrition Interface
```typescript
interface IngredientNutrition {
  name: string
  quantity?: string         // e.g., "500g"
  calories?: number
  protein?: number
  carbs?: number
  fat?: number
}
```

---

## 🎯 Core Functions

### 1. generateRecipe()
**Location:** `lib/dummy-data.ts`

```typescript
function generateRecipe(
  baseCuisine: string,
  targetCuisine: string,
  dietary: string[],
  health: string[]
): Recipe
```

**Purpose:** Create recipe matching cuisine combination and preferences

**Returns:** Recipe object with all fields populated

**Behavior:**
- Searches pre-defined templates first
- Falls back to dynamic recipe generation
- Adds dietary badges
- Does NOT adapt ingredients

---

### 2. adaptRecipeForPreferences()
**Location:** `lib/dummy-data.ts`

```typescript
function adaptRecipeForPreferences(
  recipe: Recipe,
  dietary: string[],
  health: string[]
): Recipe
```

**Purpose:** Adapt existing recipe for dietary/health preferences

**Returns:** Modified Recipe with adapted ingredients and nutrition

**Features:**
- Ingredient substitution based on dietary restrictions
- Nutrition adjustment for health goals
- Badge updates
- Non-destructive (creates new object)

**Substitutions Implemented:**
```
Vegetarian → Removes meat
Vegan → Replaces butter (vegan butter), milk (plant milk), 
        cheese (vegan cheese), eggs (flax eggs)
Gluten-Free → Replaces pasta (GF pasta), flour (GF flour)
Dairy-Free → Replaces butter (coconut oil), milk (almond milk),
            cheese (nutritional yeast), cream (coconut cream)
Low-Calorie → Reduces oil amount
High-Protein → Increases protein multiplier by 1.25x
```

---

### 3. fetchNutritionForIngredients()
**Location:** `lib/api.ts`

```typescript
async function fetchNutritionForIngredients(
  ingredients: string[]
): Promise<NutritionData | null>
```

**Purpose:** Calculate total nutrition for ingredient list

**Returns:** Aggregated NutritionData object or null on error

**Process:**
1. Loop through each ingredient
2. Call `estimateNutritionForIngredient()` for each
3. Sum totals
4. Return combined nutrition

**Error Handling:** Returns null if any step fails, continues gracefully

---

### 4. estimateNutritionForIngredient()
**Location:** `lib/api.ts`

```typescript
function estimateNutritionForIngredient(ingredient: string): NutritionData
```

**Purpose:** Estimate nutrition for single ingredient string

**Process:**
1. ✨ Parse ingredient format: "500g chicken breast"
2. 🔍 Find ingredient name in database
3. 📏 Extract quantity and unit
4. 🔄 Convert unit to consistent baseline
5. 📊 Multiply base nutrition by multiplier
6. ✅ Return calculated nutrition

**Example Calculation:**
```
Input: "500g chicken breast"
1. Parse: quantity=500, unit="g", name="chicken"
2. Lookup: chicken base nutrition = 165 cal per 100g
3. Convert: unit=g, so multiplier = 500/100 = 5
4. Calculate: 165 * 5 = 825 calories
5. Return: { calories: 825, protein: 155, ... }
```

**Supported Units:**
| Unit | Conversion |
|------|-----------|
| g | 1 (base) |
| kg | × 1000 |
| ml | ÷ 100 |
| tbsp | × 15 |
| tsp | × 5 |
| cup | × 240 ÷ 100 |
| oz | × 28.35 ÷ 100 |
| lb | × 454 ÷ 100 |
| piece | × 1 (count) |

---

### 5. downloadRecipe()
**Location:** `lib/recipe-export.ts`

```typescript
function downloadRecipe(
  data: RecipeExportData,
  format: "json" | "markdown" | "csv" = "json"
): void
```

**Purpose:** Trigger browser download of recipe in specified format

**Parameters:**
- `data`: Recipe data object with metadata
- `format`: Export format selection

**Process:**
1. Call appropriate generator (JSON/Markdown/CSV)
2. Create Blob with generated content
3. Create downloadable URL
4. Create temporary link element
5. Trigger click
6. Clean up temporary elements

**RecipeExportData Structure:**
```typescript
interface RecipeExportData {
  recipe: Recipe
  pairings: string[]
  dietaryPreferences: string[]
  healthFocus: string[]
  generatedAt: string (ISO 8601)
}
```

---

### 6. Export Format Generators
**Location:** `lib/recipe-export.ts`

#### generateRecipeJSON()
- Returns stringified JSON object
- Preserves all data exactly
- Suitable for re-import

#### generateRecipeMarkdown()
- Returns formatted markdown
- Human-readable document
- Includes tables for nutrition
- Organized sections

#### generateRecipeCSV()
- Returns key-value pairs format
- One per line for easy parsing
- Spreadsheet compatible

---

## 🪝 React Hooks Implementation

### useEffect for Health Focus Changes
**Location:** `components/recipe-generator.tsx`

```typescript
useEffect(() => {
  if (!generatedRecipe) return
  
  // Skip first dual-selection
  if (!prefsInitializedRef.current && 
      dietaryPreferences.length > 0 && 
      healthFocus.length > 0) {
    prefsInitializedRef.current = true
    return
  }

  // Async update logic
  let cancelled = false
  ;(async () => {
    // Adapt recipe
    // Fetch nutrition
    // Update state only if not cancelled
  })()
  
  return () => { cancelled = true }
}, [healthFocus])
```

**Purpose:** Update recipe when health focus changes

**Dependencies:** `[healthFocus]`

**Cancellation Pattern:** Prevents state updates after unmount

---

### useEffect for Dietary Preference Changes
**Location:** `components/recipe-generator.tsx`

Same structure as health focus hook but:
- Triggers on `[dietaryPreferences]`
- Creates preview recipe if none exists
- Re-fetches ingredient pairings

---

## 📊 Nutrition Database

### Current Ingredients (20+)
```
Proteins:
- chicken: 165 cal, 31g protein per 100g
- beef: 250 cal, 26g protein per 100g
- tofu: 76 cal, 8g protein per 100g
- salmon: 208 cal, 20g protein per 100g
- eggs: 155 cal, 13g protein per 100g

Grains:
- pasta: 131 cal, 5g protein per 100g
- rice: 130 cal, 2.7g protein per 100g
- quinoa: 120 cal, 4.4g protein per 100g

Vegetables:
- broccoli: 34 cal, 2.8g protein per 100g
- tomato: 18 cal, 0.9g protein per 100g
- carrot: 41 cal, 0.9g protein per 100g

... (and more)
```

### Adding New Ingredients
**Location:** `lib/api.ts` - `ingredientNutritionDatabase`

```typescript
const ingredientNutritionDatabase: Record<string, NutritionData> = {
  "new-ingredient": {
    calories: 100,
    protein: 5,
    carbs: 20,
    fat: 2,
    fiber: 3,
    sodium: 50,
  },
  // ... existing ingredients
}
```

---

## 🧪 Testing Recommendations

### Unit Tests

#### Test: `estimateNutritionForIngredient()`
```typescript
test('Calculate nutrition for 500g chicken', () => {
  const result = estimateNutritionForIngredient('500g chicken')
  expect(result.calories).toBe(825)
  expect(result.protein).toBeCloseTo(155, 0)
})

test('Unknown ingredient fallback', () => {
  const result = estimateNutritionForIngredient('999g mystery food')
  expect(result.calories).toBe(50) // default fallback
})
```

#### Test: `adaptRecipeForPreferences()`
```typescript
test('Substitute chicken with tofu for vegetarian', () => {
  const adapted = adaptRecipeForPreferences(recipe, ['vegetarian'], [])
  expect(adapted.ingredients[0]).toContain('tofu')
})

test('Reduce calories for low-calorie preference', () => {
  const adapted = adaptRecipeForPreferences(recipe, [], ['low-calorie'])
  expect(adapted.nutrition.calories).toBeLessThan(recipe.nutrition.calories)
})
```

### Integration Tests

#### Test: Real-time update flow
```typescript
test('Change dietary preference updates nutrition', async () => {
  render(<RecipeGenerator />)
  
  // Generate initial recipe
  fireEvent.click(screen.getByText('Generate'))
  await waitFor(() => expect(screen.getByText(/Calories:/)).toBeInTheDocument())
  
  const initialCalories = screen.getByText(/Calories: (\d+)/)[1]
  
  // Change preference
  fireEvent.click(screen.getByLabelText('Vegetarian'))
  await waitFor(() => {
    // Nutrition should update
    expect(screen.getByText(/Calories:/)).not.toHaveTextContent(initialCalories)
  })
})
```

### Manual Testing Checklist

- [ ] Select cuisines, then change to different cuisines
- [ ] Select dietary preferences and verify auto-adaptation
- [ ] Select health focus and verify nutrition updates
- [ ] Download as JSON and verify structure
- [ ] Download as Markdown and open in editor
- [ ] Download as CSV and import to spreadsheet
- [ ] Test with slow network (verify graceful degradation)
- [ ] Test error states (disable APIs temporarily)
- [ ] Verify responsive design on mobile
- [ ] Test with 0 dietary preferences (should show error)
- [ ] Test with 0 health focus (should show error)

---

## 🔍 Performance Considerations

### Optimization Strategies

1. **Memoization**
   - Use `useMemo` for expensive calculations
   - Cache nutrition estimates
   - Avoid re-rendering NutritionPanel unnecessarily

2. **Lazy Loading**
   - Load ingredient database on demand
   - Fetch pairings asynchronously
   - Don't block render on API calls

3. **Debouncing**
   - Consider debouncing preference changes
   - Prevent excessive API calls
   - Smooth UX during rapid selections

### Potential Bottlenecks

| Issue | Solution |
|-------|----------|
| Large ingredient lists | Batch API calls |
| Many API requests | Implement request caching |
| Heavy re-renders | Memoize components |
| Slow calculations | Move to Web Worker |

---

## 🚀 Deployment Checklist

- [ ] Verify all imports resolve correctly
- [ ] Test build without errors: `npm run build`
- [ ] Verify TypeScript types compile: `npx tsc --noEmit`
- [ ] Test all download formats work
- [ ] Verify API fallbacks work
- [ ] Check mobile responsiveness
- [ ] Test with production API endpoints
- [ ] Verify environment variables set correctly
- [ ] Monitor API response times
- [ ] Set up error logging/monitoring

---

## 📚 Related Documentation

- [USER_GUIDE.md](USER_GUIDE.md) - End-user guide
- [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) - Feature summary

---

**Last Updated:** February 2026
**Version:** 1.0.0
**Status:** Production Ready
