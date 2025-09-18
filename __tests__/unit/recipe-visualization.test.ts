/**
 * Tests for Recipe JSON visualization and parsing
 */

// Helper function to parse JSON response and extract recipe data (copied from conversation page)
const parseRecipeResponse = (response: string): { text: string; recipe?: any } => {
  try {
    // Try to parse as JSON first
    const parsed = JSON.parse(response);
    
    // Check if it's a recipe object with required fields
    if (parsed && typeof parsed === 'object' && 
        parsed.dish && 
        typeof parsed.kcal === 'number' && 
        typeof parsed.prot === 'number' && 
        typeof parsed.fat === 'number' && 
        typeof parsed.carb === 'number' && 
        parsed.recipe) {
      return {
        text: response, // Keep original JSON as text fallback
        recipe: parsed
      };
    }
    
    // If it's JSON but not a recipe format, return as text
    return { text: typeof parsed === 'string' ? parsed : JSON.stringify(parsed, null, 2) };
  } catch (error) {
    // Not valid JSON, return as plain text
    return { text: response };
  }
};

describe('Recipe JSON Visualization', () => {
  describe('parseRecipeResponse', () => {
    it('should parse valid recipe JSON correctly', () => {
      const validRecipeJson = JSON.stringify({
        dish: "Chicken Stir-Fry",
        kcal: 350,
        prot: 25,
        fat: 12,
        carb: 30,
        recipe: "## Ingredients\n- 200g chicken breast\n- 1 bell pepper\n\n## Instructions\n1. Heat oil in pan\n2. Cook chicken until done\n3. Add vegetables"
      });

      const result = parseRecipeResponse(validRecipeJson);

      expect(result.recipe).toBeDefined();
      expect(result.recipe?.dish).toBe("Chicken Stir-Fry");
      expect(result.recipe?.kcal).toBe(350);
      expect(result.recipe?.prot).toBe(25);
      expect(result.recipe?.fat).toBe(12);
      expect(result.recipe?.carb).toBe(30);
      expect(result.recipe?.recipe).toContain("Ingredients");
      expect(result.text).toBe(validRecipeJson);
    });

    it('should handle plain text responses', () => {
      const plainTextResponse = "Here's a simple recipe for you: Cook chicken with vegetables.";

      const result = parseRecipeResponse(plainTextResponse);

      expect(result.recipe).toBeUndefined();
      expect(result.text).toBe(plainTextResponse);
    });

    it('should handle JSON that is not a recipe format', () => {
      const nonRecipeJson = JSON.stringify({
        message: "I can help you with cooking!",
        status: "success"
      });

      const result = parseRecipeResponse(nonRecipeJson);

      expect(result.recipe).toBeUndefined();
      expect(result.text).toBe('{\n  "message": "I can help you with cooking!",\n  "status": "success"\n}');
    });

    it('should handle incomplete recipe JSON', () => {
      const incompleteRecipeJson = JSON.stringify({
        dish: "Pasta",
        kcal: 400,
        // Missing prot, fat, carb, recipe fields
      });

      const result = parseRecipeResponse(incompleteRecipeJson);

      expect(result.recipe).toBeUndefined();
      expect(result.text).toContain("Pasta");
    });

    it('should handle malformed JSON', () => {
      const malformedJson = '{"dish": "Pasta", "kcal": 400'; // Missing closing brace

      const result = parseRecipeResponse(malformedJson);

      expect(result.recipe).toBeUndefined();
      expect(result.text).toBe(malformedJson);
    });

    it('should handle recipe with markdown formatting', () => {
      const recipeWithMarkdown = JSON.stringify({
        dish: "Spaghetti Carbonara",
        kcal: 520,
        prot: 18,
        fat: 22,
        carb: 65,
        recipe: `# Spaghetti Carbonara

## Ingredients
- 400g spaghetti
- 200g guanciale or pancetta
- 4 large eggs
- 100g Pecorino Romano cheese, grated
- Black pepper

## Instructions

1. **Cook the pasta**: Bring a large pot of salted water to boil. Add spaghetti and cook until al dente.

2. **Prepare the sauce**: In a bowl, whisk together eggs, cheese, and plenty of black pepper.

3. **Cook the guanciale**: In a large pan, cook guanciale until crispy.

4. **Combine**: Add hot pasta to the pan with guanciale, then quickly stir in the egg mixture.

> **Tip**: The key is to work quickly so the eggs don't scramble!

**Buon Appetito!**`
      });

      const result = parseRecipeResponse(recipeWithMarkdown);

      expect(result.recipe).toBeDefined();
      expect(result.recipe?.dish).toBe("Spaghetti Carbonara");
      expect(result.recipe?.recipe).toContain("## Ingredients");
      expect(result.recipe?.recipe).toContain("## Instructions");
      expect(result.recipe?.recipe).toContain("**Buon Appetito!**");
    });

    it('should handle recipe with zero values', () => {
      const recipeWithZeros = JSON.stringify({
        dish: "Water",
        kcal: 0,
        prot: 0,
        fat: 0,
        carb: 0,
        recipe: "Just water. Nothing else to it."
      });

      const result = parseRecipeResponse(recipeWithZeros);

      expect(result.recipe).toBeDefined();
      expect(result.recipe?.kcal).toBe(0);
      expect(result.recipe?.prot).toBe(0);
      expect(result.recipe?.fat).toBe(0);
      expect(result.recipe?.carb).toBe(0);
    });
  });

  describe('Recipe Data Validation', () => {
    it('should validate required recipe fields', () => {
      const requiredFields = ['dish', 'kcal', 'prot', 'fat', 'carb', 'recipe'];
      
      const completeRecipe = {
        dish: "Test Dish",
        kcal: 300,
        prot: 20,
        fat: 10,
        carb: 35,
        recipe: "Test recipe instructions"
      };

      // Test that all fields are present
      requiredFields.forEach(field => {
        expect(completeRecipe).toHaveProperty(field);
      });

      // Test that numeric fields are numbers
      expect(typeof completeRecipe.kcal).toBe('number');
      expect(typeof completeRecipe.prot).toBe('number');
      expect(typeof completeRecipe.fat).toBe('number');
      expect(typeof completeRecipe.carb).toBe('number');

      // Test that text fields are strings
      expect(typeof completeRecipe.dish).toBe('string');
      expect(typeof completeRecipe.recipe).toBe('string');
    });

    it('should handle recipes with decimal values', () => {
      const recipeWithDecimals = JSON.stringify({
        dish: "Precise Recipe",
        kcal: 325.7,
        prot: 18.5,
        fat: 12.3,
        carb: 42.1,
        recipe: "Very precise measurements"
      });

      const result = parseRecipeResponse(recipeWithDecimals);

      expect(result.recipe).toBeDefined();
      expect(result.recipe?.kcal).toBe(325.7);
      expect(result.recipe?.prot).toBe(18.5);
      expect(result.recipe?.fat).toBe(12.3);
      expect(result.recipe?.carb).toBe(42.1);
    });
  });

  describe('N8N Webhook Response Examples', () => {
    it('should handle typical N8N Master Chef response', () => {
      const n8nResponse = JSON.stringify({
        dish: "Mediterranean Quinoa Bowl",
        kcal: 420,
        prot: 15,
        fat: 18,
        carb: 52,
        recipe: `# Mediterranean Quinoa Bowl

## Ingredients
- 1 cup quinoa
- 2 cups vegetable broth
- 1/2 cup cherry tomatoes, halved
- 1/2 cucumber, diced
- 1/4 red onion, thinly sliced
- 1/2 cup kalamata olives
- 1/2 cup feta cheese, crumbled
- 2 tablespoons olive oil
- 1 lemon, juiced
- 2 tablespoons fresh parsley, chopped
- Salt and pepper to taste

## Instructions

1. **Cook the quinoa**: Rinse quinoa and cook in vegetable broth according to package instructions. Let cool.

2. **Prepare vegetables**: While quinoa cools, dice cucumber, halve tomatoes, and slice onion.

3. **Make dressing**: In a small bowl, whisk together olive oil, lemon juice, salt, and pepper.

4. **Assemble**: In a large bowl, combine cooled quinoa with vegetables, olives, and feta.

5. **Finish**: Drizzle with dressing and sprinkle with fresh parsley.

## Nutritional Benefits
- **Quinoa**: Complete protein source
- **Olive oil**: Healthy monounsaturated fats
- **Vegetables**: Rich in vitamins and antioxidants

*Perfect for meal prep - keeps well for 3-4 days in the refrigerator!*`
      });

      const result = parseRecipeResponse(n8nResponse);

      expect(result.recipe).toBeDefined();
      expect(result.recipe?.dish).toBe("Mediterranean Quinoa Bowl");
      expect(result.recipe?.kcal).toBe(420);
      expect(result.recipe?.recipe).toContain("## Ingredients");
      expect(result.recipe?.recipe).toContain("## Instructions");
      expect(result.recipe?.recipe).toContain("## Nutritional Benefits");
    });
  });
});
