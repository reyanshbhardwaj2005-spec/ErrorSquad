# Nutrition API Setup Guide

## Overview
The recipe generator now fetches real nutrition data from the internet using free APIs.

## Free API Options

### 1. USDA FoodData Central API (Recommended)
**Best for:** Comprehensive, accurate USDA nutrition data

**Setup:**
1. Visit: https://fdc.nal.usda.gov/api-key-signup
2. Sign up for a free API key
3. Add to your `.env.local` file:
   ```
   NEXT_PUBLIC_USDA_API_KEY=your_api_key_here
   ```

**Features:**
- Free access to USDA food database
- Highly accurate nutrition information
- No rate limits for basic usage
- Covers 1.1 million foods

---

### 2. Spoonacular API (Fallback)
**Best for:** Comprehensive ingredient information with images

**Setup:**
1. Visit: https://spoonacular.com/food-api
2. Sign up for free tier (150 requests/day)
3. Add to your `.env.local` file:
   ```
   NEXT_PUBLIC_SPOONACULAR_KEY=your_api_key_here
   ```

**Features:**
- Detailed nutrition for 500k+ foods
- Tasty recipes integration
- Meal planning endpoints

---

## How It Works

### Priority Order:
1. **USDA API** - Primary source (if API key configured)
2. **Spoonacular API** - Fallback (if API key configured)
3. **Local Database** - Default estimates (50 cal per ingredient)

### Nutrition Data Fetched:
- Calories (kcal)
- Protein (g)
- Carbohydrates (g)
- Fat (g)
- Fiber (g)
- Sodium (mg)
- Sugars (g)

### Quantity Parsing:
The system automatically extracts quantities from ingredient strings:
- "500g chicken" → 500g
- "2 cups rice" → 2 cups (converts to grams)
- "1 tbsp olive oil" → 1 tablespoon

Supported units: g, kg, ml, tbsp, tsp, cup, oz, lb, piece

---

## Installation Steps

### Step 1: Get USDA API Key (Recommended)
```bash
# Visit: https://fdc.nal.usda.gov/api-key-signup
# Register with your email
# Copy the API key provided
```

### Step 2: Create `.env.local` File
In your project root (`ErrorSquad/`), create `.env.local`:

```
# USDA FoodData Central API (Recommended)
NEXT_PUBLIC_USDA_API_KEY=your_usda_key_here

# Spoonacular API (Optional fallback)
NEXT_PUBLIC_SPOONACULAR_KEY=your_spoonacular_key_here
```

### Step 3: Restart Development Server
```bash
# Stop the current server (Ctrl+C)
# Restart:
npm run dev
```

---

## Testing the Integration

### Test Nutrition Fetching:
1. Open the app
2. Select Base Cuisine: "Indian"
3. Select Target Cuisine: "Italian"
4. Select Dietary Preference: "Vegetarian"
5. Select Health Focus: "High Protein"
6. Click "Create Fusion Recipe"
7. Should display nutrition info with real data from internet

### Check Network Requests:
- Open Browser DevTools → Network tab
- Generate a recipe
- Look for requests to:
  - `fdc.nal.usda.gov` (USDA API)
  - `api.spoonacular.com` (Spoonacular API)

---

## Troubleshooting

### No Nutrition Data Showing?
1. Check `.env.local` is created in project root
2. Verify API keys are correct
3. Check browser console for errors (F12)
4. Fallback to local database is working (estimated values)

### API Rate Limits?
- **USDA Free:** No limits for basic queries
- **Spoonacular Free:** 150 requests/day (resets daily)

If hitting limits, upgrade to paid tier or rely on local database estimates.

### Forgot API Key?
- USDA: Login to dashboard again or request new key
- Spoonacular: Check email or regenerate in dashboard

---

## API Response Format

### USDA API Response Example:
```json
{
  "foods": [{
    "foodNutrients": [
      {
        "nutrientName": "Energy (kcal)",
        "value": 165
      },
      {
        "nutrientName": "Protein",
        "value": 31
      }
    ]
  }]
}
```

### Spoonacular API Response Example:
```json
{
  "nutrition": {
    "calories": 165,
    "protein": 31,
    "carbohydrates": 0,
    "fat": 3.6,
    "fiber": 0,
    "sodium": 74
  }
}
```

---

## Data Privacy

### What Data Is Sent?
- Only ingredient names and quantities
- No personal information
- No recipe storage on APIs

### API Privacy Policies:
- **USDA:** https://fdc.nal.usda.gov/privacy-policy
- **Spoonacular:** https://spoonacular.com/food-api-privacy

---

## Free Tier Limitations

| API | Free Limit | Rate Limit |
|-----|-----------|-----------|
| USDA | Unlimited queries | No limits |
| Spoonacular | 150/day | 1 request/second |
| Local Database | Unlimited | Instant |

---

## Upgrading to Paid Tiers

### USDA:
- Free tier sufficient for most uses
- No paid tier needed

### Spoonacular:
- **Pro:** $29/month for 10,000 requests/day
- Visit: https://spoonacular.com/food-api-pricing

---

## Fallback Behavior

If all APIs fail or no keys provided:
- System falls back to **local nutrition database**
- Default estimates: 50 cal per ingredient
- Still shows nutritional breakdown
- Not as accurate as online data

---

## Support

### API Support:
- **USDA:** https://fdc.nal.usda.gov/help
- **Spoonacular:** https://spoonacular.com/food-api#support

### Common Issues:
1. **Invalid API key** → Regenerate from dashboard
2. **Rate limit exceeded** → Wait and retry later
3. **Network error** → Check internet connection
4. **CORS error** → Should not occur (handled server-side)

---

## Environment Variables Reference

```bash
# .env.local
NEXT_PUBLIC_USDA_API_KEY=your_key_here
NEXT_PUBLIC_SPOONACULAR_KEY=your_key_here

# Optional (usually auto-detected)
NEXT_PUBLIC_RECIPEDB_BASE=http://cosylab.iiitd.edu.in:6969
NEXT_PUBLIC_FLAVORDb_BASE=http://cosylab.iiitd.edu.in:6969/flavordb
```

---

**Last Updated:** February 2026
**Version:** 1.1.0
**Status:** Production Ready
