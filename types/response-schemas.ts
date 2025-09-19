/**
 * Enhanced Response Schema for Master Nutritionist
 * Version 2.0 - Human-friendly, aesthetically pleasing format
 */

// ===== NEW ENHANCED SCHEMA (V2) =====

export interface NutritionistResponseV2 {
  // Response metadata
  metadata: {
    responseId: string;
    version: "2.0";
    generatedAt: string;
    processingTimeMs: number;
    confidence: "high" | "medium" | "low";
    source: "master-nutritionist";
  };
  
  // Main content
  content: {
    // Recipe/meal information
    mealPlan: {
      name: string;
      description: string;
      servingSize: number;
      preparationTimeMinutes: number;
      difficultyLevel: "beginner" | "intermediate" | "advanced";
      mealType: ("breakfast" | "lunch" | "dinner" | "snack")[];
      cuisineStyle?: string;
      dietaryTags: string[]; // ["vegetarian", "gluten-free", "low-carb", etc.]
    };
    
    // Enhanced nutrition information
    nutrition: {
      calories: {
        total: number;
        perServing: number;
        dailyValuePercent?: number;
      };
      macronutrients: {
        protein: {
          grams: number;
          calories: number;
          dailyValuePercent?: number;
        };
        carbohydrates: {
          grams: number;
          calories: number;
          fiber?: number;
          sugar?: number;
          dailyValuePercent?: number;
        };
        fat: {
          grams: number;
          calories: number;
          saturated?: number;
          unsaturated?: number;
          dailyValuePercent?: number;
        };
      };
      micronutrients?: {
        vitamins?: Record<string, { amount: number; unit: string; dailyValuePercent?: number }>;
        minerals?: Record<string, { amount: number; unit: string; dailyValuePercent?: number }>;
      };
      healthScore: number; // 1-100
    };
    
    // Recipe instructions in markdown
    instructions: {
      fullRecipe: string; // Enhanced markdown with better formatting
      quickSummary: string;
      ingredientsList: string[];
      cookingTips?: string[];
      nutritionBenefits?: string[];
      storageInstructions?: string;
    };
  };
  
  // Personalized AI dialogue
  dialogue: {
    greeting: string;
    encouragement: string;
    nutritionalInsights: string[];
    personalizedTips: string[];
    closingMessage: string;
    funFacts?: string[];
  };
  
  // User experience enhancements
  userExperience: {
    estimatedEnjoymentRating: number; // 1-10
    suggestedPairings?: string[];
    alternativeOptions?: string[];
    seasonalRecommendations?: string;
  };
}

// ===== LEGACY SCHEMA (V1) =====

export interface LegacyRecipe {
  dish: string;
  kcal: number;
  prot: number;
  fat: number;
  carb: number;
  recipe: string;
}

// ===== TONE CONFIGURATION =====

export interface DialogueToneConfig {
  personality: "professional" | "friendly" | "playful" | "enthusiastic";
  useEmojis: boolean;
  humorLevel: "none" | "subtle" | "moderate" | "high";
  encouragementStyle: "supportive" | "motivational" | "celebratory";
  technicalDepth: "basic" | "intermediate" | "advanced";
  customPhrases?: {
    greetings?: string[];
    encouragements?: string[];
    closings?: string[];
  };
}

// ===== PARSING RESULTS =====

export interface ParsedResponse {
  version: "1.0" | "2.0";
  success: boolean;
  data?: {
    legacy?: LegacyRecipe;
    enhanced?: NutritionistResponseV2;
    rawText?: string;
  };
  dialogue: {
    successMessage: string;
    displayText: string;
    toastMessage: string;
  };
  metadata: {
    parseTime: number;
    confidence: number;
    fallbackUsed: boolean;
  };
}

// ===== TYPE GUARDS =====

export function isLegacyRecipe(obj: any): obj is LegacyRecipe {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.dish === 'string' &&
    typeof obj.kcal === 'number' &&
    typeof obj.prot === 'number' &&
    typeof obj.fat === 'number' &&
    typeof obj.carb === 'number' &&
    typeof obj.recipe === 'string'
  );
}

export function isEnhancedResponse(obj: any): obj is NutritionistResponseV2 {
  return (
    obj &&
    typeof obj === 'object' &&
    obj.metadata?.version === '2.0' &&
    obj.content?.mealPlan &&
    obj.content?.nutrition &&
    obj.content?.instructions &&
    obj.dialogue &&
    typeof obj.dialogue === 'object'
  );
}
