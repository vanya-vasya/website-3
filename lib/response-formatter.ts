/**
 * Enhanced Response Formatter for Master Nutritionist
 * Handles legacy responses and transforms them into human-friendly format
 */

import { 
  NutritionistResponseV2, 
  LegacyRecipe, 
  DialogueToneConfig, 
  ParsedResponse,
  isLegacyRecipe,
  isEnhancedResponse
} from '@/types/response-schemas';

// ===== DIALOGUE TONE PRESETS =====

export const TONE_PRESETS: Record<string, DialogueToneConfig> = {
  professional: {
    personality: "professional",
    useEmojis: false,
    humorLevel: "none",
    encouragementStyle: "supportive",
    technicalDepth: "advanced",
  },
  friendly: {
    personality: "friendly",
    useEmojis: true,
    humorLevel: "subtle",
    encouragementStyle: "supportive",
    technicalDepth: "intermediate",
  },
  playful: {
    personality: "playful",
    useEmojis: true,
    humorLevel: "moderate",
    encouragementStyle: "celebratory",
    technicalDepth: "basic",
    customPhrases: {
      greetings: [
        "🎉 Wonderful! I've crafted something special just for you!",
        "✨ Ta-da! Your personalized nutrition plan is ready!",
        "🌟 Look what we've cooked up together!",
        "🎪 Step right up to see your amazing meal plan!"
      ],
      encouragements: [
        "You're going to absolutely love this!",
        "This is going to be deliciously good for you!",
        "Your taste buds AND your body will thank you!",
        "Get ready for some serious yumminess!"
      ],
      closings: [
        "Happy cooking, nutrition superstar! 🌟",
        "Go forth and create delicious magic! ✨",
        "Your wellness journey just got a whole lot tastier! 🚀",
        "Time to turn your kitchen into a nutrition playground! 🎨"
      ]
    }
  },
  enthusiastic: {
    personality: "enthusiastic",
    useEmojis: true,
    humorLevel: "high",
    encouragementStyle: "motivational",
    technicalDepth: "intermediate",
    customPhrases: {
      greetings: [
        "🚀 BOOM! Your amazing nutrition plan has landed!",
        "🎯 NAILED IT! Here's your perfect meal solution!",
        "⚡ ZAP! Fresh nutrition wisdom, coming right up!",
        "🔥 HOT OFF THE PRESS! Your custom wellness recipe!"
      ],
      encouragements: [
        "This is going to ROCK your wellness world!",
        "You're about to become a nutrition LEGEND!",
        "Your future self will high-five you for this!",
        "Prepare for some serious health GAINS!"
      ],
      closings: [
        "Now GO make it happen, wellness warrior! 💪",
        "Your journey to awesome starts NOW! 🌟",
        "Time to show the world your nutrition prowess! 🎉",
        "Let's turn this plan into PURE GOLD! ✨"
      ]
    }
  }
};

// ===== NUTRITION INSIGHT GENERATORS =====

const generateNutritionalInsights = (nutrition: any, tone: DialogueToneConfig): string[] => {
  const insights: string[] = [];
  const emoji = tone.useEmojis;
  
  // Calorie insights
  if (nutrition.calories || nutrition.kcal) {
    const calories = nutrition.calories?.total || nutrition.kcal || 0;
    if (calories < 400) {
      insights.push(`${emoji ? '🪶 ' : ''}Light and energizing - perfect for maintaining your vitality without feeling heavy!`);
    } else if (calories < 600) {
      insights.push(`${emoji ? '⚖️ ' : ''}Beautifully balanced calories that fuel your day while keeping you satisfied!`);
    } else {
      insights.push(`${emoji ? '🔋 ' : ''}Power-packed with energy to fuel your most ambitious days!`);
    }
  }
  
  // Protein insights
  if (nutrition.protein || nutrition.prot) {
    const protein = nutrition.protein?.grams || nutrition.prot || 0;
    if (protein > 20) {
      insights.push(`${emoji ? '💪 ' : ''}Fantastic protein content for muscle support and lasting satisfaction!`);
    } else if (protein > 10) {
      insights.push(`${emoji ? '🏋️ ' : ''}Great protein balance to keep you strong and steady throughout the day!`);
    }
  }
  
  // Fiber insights (if available)
  if (nutrition.carbohydrates?.fiber && nutrition.carbohydrates.fiber > 5) {
    insights.push(`${emoji ? '🌾 ' : ''}Rich in fiber - your digestive system will absolutely love this!`);
  }
  
  // Health score insights
  if (nutrition.healthScore) {
    if (nutrition.healthScore > 80) {
      insights.push(`${emoji ? '🏆 ' : ''}Outstanding health score! This meal is a nutritional champion!`);
    } else if (nutrition.healthScore > 60) {
      insights.push(`${emoji ? '⭐ ' : ''}Excellent nutritional profile - you're making smart choices!`);
    }
  }
  
  return insights.slice(0, 3); // Limit to 3 insights
};

const generatePersonalizedTips = (mealPlan: any, tone: DialogueToneConfig): string[] => {
  const tips: string[] = [];
  const emoji = tone.useEmojis;
  
  // Preparation tips
  if (mealPlan.preparationTimeMinutes) {
    if (mealPlan.preparationTimeMinutes <= 15) {
      tips.push(`${emoji ? '⚡ ' : ''}Quick wins! This recipe is perfect for busy days when you need nutrition fast!`);
    } else if (mealPlan.preparationTimeMinutes <= 30) {
      tips.push(`${emoji ? '⏰ ' : ''}Perfect timing! Just enough prep time to enjoy the cooking process without rushing.`);
    } else {
      tips.push(`${emoji ? '🧘 ' : ''}Turn this into mindful cooking time - great for unwinding while creating something amazing!`);
    }
  }
  
  // Difficulty tips
  if (mealPlan.difficultyLevel === 'beginner') {
    tips.push(`${emoji ? '🌱 ' : ''}Perfect for building confidence in the kitchen - you've got this!`);
  } else if (mealPlan.difficultyLevel === 'advanced') {
    tips.push(`${emoji ? '🎯 ' : ''}Challenge accepted! This recipe will level up your culinary skills beautifully.`);
  }
  
  // Meal type tips
  if (mealPlan.mealType?.includes('breakfast')) {
    tips.push(`${emoji ? '🌅 ' : ''}Start your day like a champion - this breakfast sets the perfect tone!`);
  } else if (mealPlan.mealType?.includes('dinner')) {
    tips.push(`${emoji ? '🌙 ' : ''}End your day on a high note with this nourishing dinner choice!`);
  }
  
  return tips.slice(0, 2); // Limit to 2 tips
};

// ===== MAIN FORMATTER CLASS =====

export class NutritionistResponseFormatter {
  private toneConfig: DialogueToneConfig;
  
  constructor(toneConfig: DialogueToneConfig = TONE_PRESETS.friendly) {
    this.toneConfig = toneConfig;
  }
  
  /**
   * Parse and enhance any response format into the new schema
   */
  public parseResponse(rawResponse: string, processingTime: number = 0): ParsedResponse {
    const startTime = performance.now();
    
    try {
      // Try to parse as JSON
      const parsed = JSON.parse(rawResponse);
      
      // Check if it's already enhanced format
      if (isEnhancedResponse(parsed)) {
        return this.formatEnhancedResponse(parsed, startTime, processingTime);
      }
      
      // Check if it's legacy format
      if (isLegacyRecipe(parsed)) {
        return this.upgradeLegacyResponse(parsed, startTime, processingTime);
      }
      
      // Generic JSON - try to extract useful info
      return this.handleGenericJson(parsed, rawResponse, startTime, processingTime);
      
    } catch (error) {
      // Plain text response
      return this.handleTextResponse(rawResponse, startTime, processingTime);
    }
  }
  
  /**
   * Handle already enhanced responses
   */
  private formatEnhancedResponse(
    response: NutritionistResponseV2, 
    startTime: number, 
    processingTime: number
  ): ParsedResponse {
    const dialogue = this.generateDialogue(response.content, response.metadata.confidence);
    
    return {
      version: "2.0",
      success: true,
      data: {
        enhanced: response
      },
      dialogue,
      metadata: {
        parseTime: performance.now() - startTime,
        confidence: response.metadata.confidence === 'high' ? 0.9 : 
                    response.metadata.confidence === 'medium' ? 0.7 : 0.5,
        fallbackUsed: false
      }
    };
  }
  
  /**
   * Transform legacy recipe into enhanced format
   */
  private upgradeLegacyResponse(
    legacy: LegacyRecipe, 
    startTime: number, 
    processingTime: number
  ): ParsedResponse {
    const enhanced: NutritionistResponseV2 = {
      metadata: {
        responseId: `legacy-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        version: "2.0",
        generatedAt: new Date().toISOString(),
        processingTimeMs: processingTime,
        confidence: "medium",
        source: "master-nutritionist"
      },
      content: {
        mealPlan: {
          name: legacy.dish,
          description: `A delicious ${legacy.dish.toLowerCase()} crafted just for you!`,
          servingSize: 1,
          preparationTimeMinutes: this.estimatePreparationTime(legacy.recipe),
          difficultyLevel: this.estimateDifficulty(legacy.recipe),
          mealType: this.determineMealType(legacy.dish),
          dietaryTags: this.extractDietaryTags(legacy.recipe)
        },
        nutrition: {
          calories: {
            total: legacy.kcal,
            perServing: legacy.kcal,
            dailyValuePercent: Math.round((legacy.kcal / 2000) * 100)
          },
          macronutrients: {
            protein: {
              grams: legacy.prot,
              calories: legacy.prot * 4,
              dailyValuePercent: Math.round((legacy.prot / 50) * 100)
            },
            carbohydrates: {
              grams: legacy.carb,
              calories: legacy.carb * 4,
              dailyValuePercent: Math.round((legacy.carb / 300) * 100)
            },
            fat: {
              grams: legacy.fat,
              calories: legacy.fat * 9,
              dailyValuePercent: Math.round((legacy.fat / 65) * 100)
            }
          },
          healthScore: this.calculateHealthScore(legacy)
        },
        instructions: {
          fullRecipe: this.enhanceRecipeMarkdown(legacy.recipe),
          quickSummary: this.generateQuickSummary(legacy.recipe),
          ingredientsList: this.extractIngredients(legacy.recipe),
          cookingTips: this.generateCookingTips(legacy.recipe),
          nutritionBenefits: this.generateNutritionBenefits(legacy)
        }
      },
      dialogue: this.generateDialogue({
        mealPlan: {
          name: legacy.dish,
          preparationTimeMinutes: this.estimatePreparationTime(legacy.recipe),
          difficultyLevel: this.estimateDifficulty(legacy.recipe)
        } as any,
        nutrition: {
          calories: { total: legacy.kcal },
          healthScore: this.calculateHealthScore(legacy)
        } as any
      }, "medium"),
      userExperience: {
        estimatedEnjoymentRating: Math.min(10, Math.max(6, this.calculateHealthScore(legacy) / 10)),
        suggestedPairings: this.generatePairingSuggestions(legacy.dish),
        alternativeOptions: this.generateAlternatives(legacy.dish)
      }
    };
    
    const dialogue = this.generateDialogue(enhanced.content, "medium");
    
    return {
      version: "2.0",
      success: true,
      data: {
        legacy,
        enhanced,
      },
      dialogue,
      metadata: {
        parseTime: performance.now() - startTime,
        confidence: 0.7,
        fallbackUsed: false
      }
    };
  }
  
  /**
   * Handle generic JSON responses
   */
  private handleGenericJson(
    parsed: any, 
    rawResponse: string, 
    startTime: number, 
    processingTime: number
  ): ParsedResponse {
    const dialogue = this.generateFallbackDialogue(parsed);
    
    return {
      version: "1.0",
      success: true,
      data: {
        rawText: typeof parsed === 'string' ? parsed : JSON.stringify(parsed, null, 2)
      },
      dialogue,
      metadata: {
        parseTime: performance.now() - startTime,
        confidence: 0.3,
        fallbackUsed: true
      }
    };
  }
  
  /**
   * Handle plain text responses
   */
  private handleTextResponse(
    text: string, 
    startTime: number, 
    processingTime: number
  ): ParsedResponse {
    const dialogue = this.generateTextFallbackDialogue(text);
    
    return {
      version: "1.0",
      success: true,
      data: {
        rawText: text
      },
      dialogue,
      metadata: {
        parseTime: performance.now() - startTime,
        confidence: 0.2,
        fallbackUsed: true
      }
    };
  }
  
  /**
   * Generate contextual dialogue based on content and confidence
   */
  private generateDialogue(content: any, confidence: string): {
    successMessage: string;
    displayText: string;
    toastMessage: string;
  } {
    const tone = this.toneConfig;
    const emoji = tone.useEmojis;
    
    // Generate greeting
    let greeting: string;
    if (tone.customPhrases?.greetings?.length) {
      greeting = tone.customPhrases.greetings[Math.floor(Math.random() * tone.customPhrases.greetings.length)];
    } else {
      const greetings = {
        professional: "Your personalized nutrition plan has been prepared.",
        friendly: `${emoji ? '😊 ' : ''}Great! I've created a wonderful meal plan just for you!`,
        playful: `${emoji ? '🎉 ' : ''}Ta-da! Your delicious nutrition adventure awaits!`,
        enthusiastic: `${emoji ? '🚀 ' : ''}AMAZING! Your perfect meal plan is ready to rock!`
      };
      greeting = greetings[tone.personality];
    }
    
    // Generate encouragement
    let encouragement: string;
    if (tone.customPhrases?.encouragements?.length) {
      encouragement = tone.customPhrases.encouragements[Math.floor(Math.random() * tone.customPhrases.encouragements.length)];
    } else {
      const encouragements = {
        professional: "This plan is optimized for your nutritional needs.",
        friendly: `${emoji ? '💪 ' : ''}You're going to love how this makes you feel!`,
        playful: `${emoji ? '✨ ' : ''}This is going to be absolutely delicious!`,
        enthusiastic: `${emoji ? '🔥 ' : ''}This plan is going to TRANSFORM your wellness game!`
      };
      encouragement = encouragements[tone.personality];
    }
    
    // Generate success message based on processing time and confidence
    const processingTime = content.metadata?.processingTimeMs || 0;
    const timeStr = processingTime > 0 ? ` in ${(processingTime / 1000).toFixed(1)}s` : '';
    
    const successMessages = {
      high: `${emoji ? '🏆 ' : ''}Premium nutrition plan generated${timeStr}!`,
      medium: `${emoji ? '⭐ ' : ''}Personalized meal plan created${timeStr}!`,
      low: `${emoji ? '📋 ' : ''}Nutrition guidance prepared${timeStr}!`
    };
    
    const successMessage = successMessages[confidence as keyof typeof successMessages] || successMessages.medium;
    
    return {
      successMessage,
      displayText: `${greeting} ${encouragement}`,
      toastMessage: successMessage
    };
  }
  
  /**
   * Generate fallback dialogue for generic responses
   */
  private generateFallbackDialogue(data: any): {
    successMessage: string;
    displayText: string;
    toastMessage: string;
  } {
    const emoji = this.toneConfig.useEmojis;
    
    return {
      successMessage: `${emoji ? '📝 ' : ''}Response received!`,
      displayText: `${emoji ? '🤖 ' : ''}I've prepared some information for you. While it's not in my usual format, it might still be helpful!`,
      toastMessage: `${emoji ? '💬 ' : ''}Information received`
    };
  }
  
  /**
   * Generate fallback dialogue for text responses
   */
  private generateTextFallbackDialogue(text: string): {
    successMessage: string;
    displayText: string;
    toastMessage: string;
  } {
    const emoji = this.toneConfig.useEmojis;
    
    return {
      successMessage: `${emoji ? '📄 ' : ''}Text response received!`,
      displayText: `${emoji ? '💭 ' : ''}Here's what I found for you. It might not be in my usual structured format, but there could be some valuable insights!`,
      toastMessage: `${emoji ? '📄 ' : ''}Text response received!`
    };
  }
  
  // ===== HELPER METHODS =====
  
  private estimatePreparationTime(recipe: string): number {
    const timePatterns = [
      /(\d+)\s*(?:minutes?|mins?)/gi,
      /(\d+)\s*(?:hours?|hrs?)/gi,
    ];
    
    let maxTime = 30; // default
    
    for (const pattern of timePatterns) {
      const matches = recipe.match(pattern);
      if (matches) {
        matches.forEach(match => {
          const num = parseInt(match.match(/\d+/)?.[0] || '0');
          if (match.toLowerCase().includes('hour')) {
            maxTime = Math.max(maxTime, num * 60);
          } else {
            maxTime = Math.max(maxTime, num);
          }
        });
      }
    }
    
    return Math.min(maxTime, 120); // Cap at 2 hours
  }
  
  private estimateDifficulty(recipe: string): "beginner" | "intermediate" | "advanced" {
    const advanced = ['tempering', 'reduction', 'emulsification', 'confit', 'sous vide'];
    const intermediate = ['sauté', 'braise', 'roast', 'grill', 'marinate'];
    
    const recipeText = recipe.toLowerCase();
    
    if (advanced.some(term => recipeText.includes(term))) {
      return 'advanced';
    } else if (intermediate.some(term => recipeText.includes(term))) {
      return 'intermediate';
    } else {
      return 'beginner';
    }
  }
  
  private determineMealType(dishName: string): ("breakfast" | "lunch" | "dinner" | "snack")[] {
    const breakfast = ['pancake', 'waffle', 'oatmeal', 'cereal', 'toast', 'smoothie', 'egg'];
    const lunch = ['sandwich', 'salad', 'wrap', 'soup'];
    const dinner = ['steak', 'pasta', 'curry', 'stir fry', 'roast'];
    const snack = ['bar', 'chip', 'cookie', 'fruit', 'nut'];
    
    const name = dishName.toLowerCase();
    const types: ("breakfast" | "lunch" | "dinner" | "snack")[] = [];
    
    if (breakfast.some(term => name.includes(term))) types.push('breakfast');
    if (lunch.some(term => name.includes(term))) types.push('lunch');
    if (dinner.some(term => name.includes(term))) types.push('dinner');
    if (snack.some(term => name.includes(term))) types.push('snack');
    
    return types.length > 0 ? types : ['lunch', 'dinner'];
  }
  
  private extractDietaryTags(recipe: string): string[] {
    const tags: string[] = [];
    const recipeText = recipe.toLowerCase();
    
    if (recipeText.includes('vegetarian') || (!recipeText.includes('meat') && !recipeText.includes('chicken') && !recipeText.includes('beef') && !recipeText.includes('fish'))) {
      tags.push('vegetarian');
    }
    if (recipeText.includes('gluten-free') || (!recipeText.includes('flour') && !recipeText.includes('wheat'))) {
      tags.push('gluten-free');
    }
    if (recipeText.includes('low-carb') || recipeText.includes('keto')) {
      tags.push('low-carb');
    }
    if (recipeText.includes('dairy-free') || recipeText.includes('vegan')) {
      tags.push('dairy-free');
    }
    
    return tags;
  }
  
  private calculateHealthScore(recipe: LegacyRecipe): number {
    let score = 50; // Base score
    
    // Protein bonus
    if (recipe.prot > 15) score += 15;
    else if (recipe.prot > 10) score += 10;
    
    // Calorie adjustment
    if (recipe.kcal < 500 && recipe.kcal > 200) score += 10;
    else if (recipe.kcal > 800) score -= 10;
    
    // Fat balance
    if (recipe.fat > 0 && recipe.fat < 25) score += 10;
    
    // Carb balance
    if (recipe.carb > 0 && recipe.carb < 60) score += 5;
    
    return Math.min(100, Math.max(0, score));
  }
  
  private enhanceRecipeMarkdown(recipe: string): string {
    // Add better formatting and structure
    let enhanced = recipe;
    
    // Add cooking tips section if not present
    if (!enhanced.includes('## Tips') && !enhanced.includes('## Cooking Tips')) {
      enhanced += '\n\n## 👨‍🍳 Pro Tips\n- Taste and adjust seasonings as you go\n- Prep all ingredients before starting to cook\n- Don\'t be afraid to make it your own!';
    }
    
    return enhanced;
  }
  
  private generateQuickSummary(recipe: string): string {
    const lines = recipe.split('\n').filter(line => line.trim());
    const instructions = lines.filter(line => 
      /^\d+\./.test(line.trim()) || 
      line.toLowerCase().includes('cook') || 
      line.toLowerCase().includes('mix') ||
      line.toLowerCase().includes('add')
    );
    
    return instructions.slice(0, 3).join(' → ') || 'Follow the detailed instructions below for best results.';
  }
  
  private extractIngredients(recipe: string): string[] {
    const lines = recipe.split('\n').filter(line => line.trim());
    const ingredients = lines.filter(line => 
      line.trim().startsWith('-') || 
      line.trim().startsWith('•') ||
      /^\d+/.test(line.trim()) && (line.includes('cup') || line.includes('tsp') || line.includes('tbsp'))
    );
    
    return ingredients.slice(0, 10); // Limit to 10 ingredients
  }
  
  private generateCookingTips(recipe: string): string[] {
    const tips = [
      'Mise en place - prep all ingredients before you start cooking',
      'Taste as you go and adjust seasoning to your preference',
      'Use fresh ingredients when possible for the best flavor'
    ];
    
    const recipeText = recipe.toLowerCase();
    const conditionalTips = [];
    
    if (recipeText.includes('oil')) {
      conditionalTips.push('Heat your pan properly before adding oil to prevent sticking');
    }
    
    if (recipeText.includes('spice') || recipeText.includes('garlic') || recipeText.includes('spicy')) {
      conditionalTips.push('Toast spices briefly to enhance their flavors');
    }
    
    if (recipeText.includes('stir fry') || recipeText.includes('pan')) {
      conditionalTips.push('Keep ingredients moving in the pan for even cooking');
    }
    
    // Combine default tips with conditional tips, then limit to 3
    const allTips = [...tips];
    conditionalTips.forEach(tip => {
      if (allTips.length < 3) {
        allTips.push(tip);
      }
    });
    
    // If we have conditional tips, replace some default tips to make room
    if (conditionalTips.length > 0 && allTips.length > 3) {
      return [allTips[0], ...conditionalTips.slice(0, 2)]; // Keep first default + up to 2 conditional
    }
    
    return allTips.slice(0, 3);
  }
  
  private generateNutritionBenefits(recipe: LegacyRecipe): string[] {
    const benefits = [];
    
    if (recipe.prot > 15) {
      benefits.push('High in protein for muscle maintenance and satiety');
    }
    
    if (recipe.kcal < 400) {
      benefits.push('Light and energizing, perfect for maintaining energy levels');
    }
    
    if (recipe.fat > 5 && recipe.fat < 20) {
      benefits.push('Balanced healthy fats for nutrient absorption');
    }
    
    return benefits;
  }
  
  private generatePairingSuggestions(dishName: string): string[] {
    const suggestions = [
      'Fresh seasonal vegetables',
      'Herbal tea or sparkling water',
      'Mixed green salad with vinaigrette'
    ];
    
    if (dishName.toLowerCase().includes('pasta')) {
      suggestions.push('Crusty bread and olive oil for dipping');
    } else if (dishName.toLowerCase().includes('rice')) {
      suggestions.push('Steamed broccoli or snap peas');
    }
    
    return suggestions.slice(0, 3);
  }
  
  private generateAlternatives(dishName: string): string[] {
    return [
      'Make it lighter by reducing oil and adding more vegetables',
      'Boost protein by adding beans, lentils, or tofu',
      'Make it heartier by serving over quinoa or brown rice'
    ];
  }
  
  /**
   * Update tone configuration
   */
  public updateTone(newTone: DialogueToneConfig): void {
    this.toneConfig = newTone;
  }
  
  /**
   * Get current tone configuration
   */
  public getCurrentTone(): DialogueToneConfig {
    return { ...this.toneConfig };
  }
}

// ===== SINGLETON INSTANCE =====

export const responseFormatter = new NutritionistResponseFormatter();
