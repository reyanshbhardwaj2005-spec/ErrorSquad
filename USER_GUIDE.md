# User Guide - Detailed Nutrition and Recipe Features

## 🎯 Quick Start

### Step 1: Select Your Base and Target Cuisines
Choose two different cuisines to create a fusion recipe:
- **Base Cuisine:** The primary culinary tradition
- **Target Cuisine:** The cuisine to blend with

Example: Indian × Italian = Italian-Indian fusion

### Step 2: Choose Dietary Preferences ⭐ REQUIRED
Select at least ONE dietary preference:

| Option | What It Does |
|--------|-------------|
| **Vegetarian** | Removes meat, keeps dairy |
| **Vegan** | Removes all animal products |
| **Gluten-Free** | Substitutes wheat products |
| **Dairy-Free** | Removes milk, cheese, butter |
| **Nut-Free** | Removes all tree nuts |

### Step 3: Choose Health Focus ⭐ REQUIRED
Select at least ONE health focus:

| Option | What It Does |
|--------|-------------|
| **Low Calorie** | Reduces oil/fat, lighter preparation |
| **High Protein** | Increases protein content by 25% |
| **Diabetic Friendly** | Focuses on balanced macronutrients |

### Step 4: Watch Real-Time Updates! 👀
As you select preferences, the recipe **automatically adapts**:
- Ingredients replace with alternatives
- Nutrition information recalculates
- Ingredient pairings update
- No need to click "Generate" after preferences change!

---

## 📊 Understanding Nutrition Information

### Main Nutrition Panel
Shows **per serving** nutritional data:

```
┌─────────────────────────────────────┐
│ Nutrition Information (Per Serving) │
├─────────────────────────────────────┤
│ Calories: 450 (23% of daily value)  │
│ ━━━━━━━━━━━━━━━━━━━ (progress bar) │
│                                     │
│ Protein: 16g          Carbs: 62g    │
│ Fat: 14g              Fiber: 4g    │
└─────────────────────────────────────┘
```

### Health Badge
Automatically shows your recipe type:
- 🟢 **Low Calorie:** < 300 cal/serving
- 🟡 **Moderate:** 300-600 cal/serving  
- 🔴 **High Calorie:** > 600 cal/serving

### Macronutrients Breakdown
Three key macros displayed with their % of daily value:
- **Protein (g)** - Building muscle and strength
- **Carbs (g)** - Energy for your body
- **Fat (g)** - Essential nutrients and absorption

### Other Nutrients
When available:
- **Fiber:** Digestive health
- **Sodium:** Blood pressure consideration
- **Sugars:** For diabetic-friendly tracking

---

## 🥘 How Preferences Adapt Your Recipe

### Example: Vegetarian Selection
**Before:**
- 500g chicken breast
- 2 tbsp butter
- Regular pasta

**After (Auto-Adapted):**
- 500g tofu or plant-based protein
- 2 tbsp coconut oil
- Regular pasta ✓ (already vegetarian)

---

### Example: High Protein Focus
- Protein calculation increases by 25%
- Nutrition display updates automatically
- Recipe suggestions emphasize protein-rich meals

---

### Example: Low Calorie Choice
- Cooking fat reduced to minimum
- "Oil spray" recommended instead of poured oil
- Lighter cooking methods suggested
- Calories reduced to ~20% less

---

## 💾 Downloading Your Recipe

### Three Export Formats Available

#### 📄 JSON Format
**Best for:** App backups, data preservation, importing into apps

Contains:
- Complete recipe structure
- All nutrition information
- Ingredient pairings
- Your selected preferences
- Exact timestamp

**File Example:** `masala_arrabbiata_pasta_1708961403456.json`

#### 📝 Markdown Format
**Best for:** Notion, OneNote, Obsidian, or any note-taking app

Contains:
- Formatted headings
- Ingredient list with checkboxes
- Numbered cooking steps
- Nutrition table
- Flavor profile explanation

**File Example:** `masala_arrabbiata_pasta_1708961403456.md`

#### 📊 CSV Format
**Best for:** Excel, Google Sheets, MyFitnessPal, nutrition tracking apps

Contains:
- Key-value pairs for import
- Nutrition per serving
- Ingredients listed per row
- Compatible with spreadsheet tools

**File Example:** `masala_arrabbiata_pasta_1708961403456.csv`

---

## 🔍 Understanding Ingredient Pairings

### What Are Ingredient Pairings?
Suggested ingredients that pair well with the first ingredient in your recipe.

**Example:**
If recipe starts with "400g penne pasta":
- Suggested pairings: garlic, basil, tomato, olive oil, etc.

These come from FlavorDB's food pairing science!

### How to Use
- Review suggested pairings
- Add complementary flavors
- Enhance your fusion dish
- Experiment with combinations

---

## 🎨 Recipe Card Layout

### Complete Recipe Information
```
┌────────────────────────────────────────────┐
│ Recipe Name (e.g., Masala Arrabbiata)      │
│ Indian × Italian | Vegetarian | High Protein│
├────────────────────────────────────────────┤
│                                            │
│ [Nutrition Information Panel]              │
│ Calories: 450 | Prep: 15m | Cook: 20m    │
│                                            │
│ INGREDIENTS (serves 4)                     │
│ ✓ 400g penne pasta                         │
│ ✓ 2 cups tomato puree                      │
│ ✓ 1 tbsp garam masala                      │
│ ... (full list)                            │
│                                            │
│ COOKING STEPS                              │
│ 1️⃣ Cook pasta until al dente...           │
│ 2️⃣ Heat olive oil, add cumin seeds...     │
│ ... (all steps)                            │
│                                            │
│ 💡 FLAVOR LOGIC                            │
│ Indian spices enhance Italian tomato base...│
│                                            │
│ INGREDIENT PAIRINGS                        │
│ garlic | basil | tomato | olive oil | ...  │
│                                            │
│ [Download as JSON] [Markdown] [CSV]       │
└────────────────────────────────────────────┘
```

---

## ⚙️ Real-Time Update Mechanism

### When Recipe Updates Happen

1. **Select Base Cuisine + Target Cuisine**
   - Basic recipe structure loads
   
2. **Select Dietary Preference**
   - Recipe adapts ingredients for dietary needs
   - Nutrition recalculates
   - New pairings fetched
   
3. **Select Health Focus**
   - Recipe further adapts for health goals
   - Nutrition updates again
   - Final pairings displayed

4. **Change Any Preference**
   - Updates trigger automatically
   - NO need to re-click "Generate"
   - Smooth transitions with loading indicators

---

## 🧬 Nutrition Calculation Logic

### How Nutrition Is Calculated

1. **Ingredient Parsing**
   - Extract quantity: "500g chicken" → 500
   - Extract unit: "500g chicken" → grams
   - Extract ingredient name: "500g chicken" → chicken

2. **Database Lookup**
   - Find "chicken" in nutrition database
   - Get base nutrition per 100g: 165cal, 31g protein, etc.

3. **Unit Conversion**
   - Convert quantity to standard grams
   - 1 cup = 240g, 1 tbsp = 15ml, etc.

4. **Calculation**
   - Multiply nutrition × quantity multiplier
   - Sum all ingredients for total recipe nutrition
   - Divide by servings for per-serving nutrition

5. **Display**
   - Show per-serving values
   - Calculate % of daily values
   - Highlight key nutrients

### Supported Units
- **Weight:** g, kg, oz, lb
- **Volume:** ml, cup, tbsp, tsp
- **Count:** piece(s)

### Known Ingredients (Database)
20+ common ingredients including:
- Proteins: chicken, beef, tofu, salmon, eggs
- Grains: pasta, rice, quinoa, bread
- Vegetables: broccoli, tomato, carrot, onion
- Oils: olive oil, butter, coconut oil
- Dairy: milk, cheese

**Unknown ingredients?** → Automatic fallback estimate (50 cal per ingredient)

---

## 🔗 API Integrations

### FlavorDB (Ingredient Pairings)
- Provides food pairing suggestions
- Updates as you change recipes
- Shows complementary ingredients

### RecipeDB (Recipe Matching)
- Fetches recipes from database
- Matches based on cuisines
- Falls back to local generation if needed

### Nutrition API (Your Device)
- All nutrition calculated locally
- Works offline
- Instant calculations

---

## 💡 Pro Tips

### Tip 1: Browse Pairings for Ideas
The ingredient pairings can inspire new combinations:
- Try pairing suggestions
- Create your own fusion variations
- Experiment!

### Tip 2: Compare Downloads
- **Download as JSON** for backup
- **Download as Markdown** for sharing notes
- **Download as CSV** for nutrition tracking apps

### Tip 3: Stack Preferences
Mix multiple dietary preferences:
- Vegan + Low Calorie = Very light meals
- High Protein + Dairy-Free = Alternative proteins featured
- Gluten-Free + Diabetic-Friendly = Balanced macros without wheat

### Tip 4: Use for Meal Planning
1. Download all recipes as Markdown
2. Paste into Notion/OneNote
3. Create meal plan with full nutrition info
4. Track calories and macros easily

### Tip 5: Nutrition Tracking
1. Generate recipes with your constraints
2. Download as CSV
3. Import into MyFitnessPal or similar app
4. Track meals with accurate nutrition data

---

## ❓ FAQ

**Q: Why do I need to select both Dietary Preference AND Health Focus?**
A: To create personalized recipes that match YOUR specific needs and goals.

**Q: Can I change preferences after generating a recipe?**
A: Yes! Recipe automatically adapts in real-time without clicking generate.

**Q: Are the nutrition values accurate?**
A: They're based on USDA data and best estimates. For exact values, validate with your app.

**Q: Can I download a recipe later?**
A: Generate it again with the same preferences to download.

**Q: What if API is down?**
A: App still works! Uses local data and fallback values.

**Q: Can I share downloaded recipes?**
A: Yes! Markdown and CSV formats are perfectly shareable.

---

## 🚀 Coming Soon Features (Suggestions)

- Print-to-PDF functionality
- Recipe scaling calculator
- Ingredient substitution wizard
- Shopping list generator
- Dietary restriction pre-sets
- Meal plan templates

---

**Enjoy your personalized fusion recipes with complete nutrition tracking! 🍽️**
