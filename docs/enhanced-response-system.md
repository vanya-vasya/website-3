# Enhanced Master Nutritionist Response System

## 📋 Table of Contents
- [Overview](#overview)
- [New JSON Schema V2](#new-json-schema-v2)
- [Dialogue Tone Configuration](#dialogue-tone-configuration)
- [Migration Guide](#migration-guide)
- [Examples](#examples)
- [Changelog](#changelog)
- [API Reference](#api-reference)

## Overview

The Enhanced Master Nutritionist Response System transforms API responses into human-friendly, aesthetically pleasing formats with configurable dialogue tones. This system provides backward compatibility while introducing rich, personalized user experiences.

### 🎯 Key Features

- **Human-friendly JSON schema** with clear field names and consistent casing
- **Configurable dialogue tones** (professional, friendly, playful, enthusiastic)
- **Backward compatibility** with legacy recipe responses
- **Enhanced user experience** with personalized insights and tips
- **Comprehensive metadata** including confidence scores and processing times
- **Graceful fallback handling** for non-structured responses

## New JSON Schema V2

### Enhanced Response Structure

```typescript
interface NutritionistResponseV2 {
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
    // Enhanced meal information
    mealPlan: {
      name: string;
      description: string;
      servingSize: number;
      preparationTimeMinutes: number;
      difficultyLevel: "beginner" | "intermediate" | "advanced";
      mealType: ("breakfast" | "lunch" | "dinner" | "snack")[];
      cuisineStyle?: string;
      dietaryTags: string[];
    };
    
    // Detailed nutrition data
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
    
    // Enhanced instructions
    instructions: {
      fullRecipe: string;
      quickSummary: string;
      ingredientsList: string[];
      cookingTips?: string[];
      nutritionBenefits?: string[];
      storageInstructions?: string;
    };
  };
  
  // Personalized dialogue
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
```

## Dialogue Tone Configuration

### Available Tone Presets

#### 1. Professional
```typescript
{
  personality: "professional",
  useEmojis: false,
  humorLevel: "none",
  encouragementStyle: "supportive",
  technicalDepth: "advanced"
}
```

#### 2. Friendly (Default)
```typescript
{
  personality: "friendly",
  useEmojis: true,
  humorLevel: "subtle",
  encouragementStyle: "supportive", 
  technicalDepth: "intermediate"
}
```

#### 3. Playful
```typescript
{
  personality: "playful",
  useEmojis: true,
  humorLevel: "moderate",
  encouragementStyle: "celebratory",
  technicalDepth: "basic",
  customPhrases: {
    greetings: [
      "🎉 Wonderful! I've crafted something special just for you!",
      "✨ Ta-da! Your personalized nutrition plan is ready!"
    ],
    encouragements: [
      "You're going to absolutely love this!",
      "This is going to be deliciously good for you!"
    ]
  }
}
```

#### 4. Enthusiastic
```typescript
{
  personality: "enthusiastic",
  useEmojis: true,
  humorLevel: "high",
  encouragementStyle: "motivational",
  technicalDepth: "intermediate",
  customPhrases: {
    greetings: [
      "🚀 BOOM! Your amazing nutrition plan has landed!",
      "⚡ ZAP! Fresh nutrition wisdom, coming right up!"
    ]
  }
}
```

### Custom Tone Configuration

```typescript
const customTone: DialogueToneConfig = {
  personality: "friendly",
  useEmojis: false,
  humorLevel: "subtle",
  encouragementStyle: "supportive",
  technicalDepth: "intermediate",
  customPhrases: {
    greetings: ["Your personalized plan is ready!"],
    encouragements: ["This will support your wellness goals perfectly!"],
    closings: ["Wishing you success on your nutrition journey!"]
  }
};
```

## Migration Guide

### From Legacy System (V1) to Enhanced System (V2)

#### Step 1: Update Imports

**Before:**
```typescript
// No enhanced response handling
const parseRecipeResponse = (response: string): { text: string; recipe?: Recipe } => {
  // Basic JSON parsing
};
```

**After:**
```typescript
import { responseFormatter, TONE_PRESETS } from '@/lib/response-formatter';
import { ParsedResponse, NutritionistResponseV2 } from '@/types/response-schemas';
```

#### Step 2: Replace Response Processing

**Before:**
```typescript
const parsedResponse = parseRecipeResponse(webhookResponse.data.response);
const assistantMessage = {
  role: "assistant",
  content: parsedResponse.text,
  recipeData: parsedResponse.recipe
};
```

**After:**
```typescript
const parsedResponse = responseFormatter.parseResponse(
  webhookResponse.data.response, 
  webhookResponse.data.processingTime
);

const assistantMessage = {
  role: "assistant",
  content: parsedResponse.dialogue.displayText,
  enhancedData: parsedResponse.data?.enhanced,
  parsedResponse: parsedResponse,
  recipeData: parsedResponse.data?.legacy // Backward compatibility
};
```

#### Step 3: Update UI Components

**Before:**
```jsx
{message.recipeData && (
  <RecipeCard data={message.recipeData} gradient={gradient} />
)}
```

**After:**
```jsx
{(message.enhancedData || message.recipeData) && (
  <div className="w-full">
    {message.enhancedData ? (
      <>
        <RecipeCard data={transformedData} gradient={gradient} />
        <EnhancedInsights data={message.enhancedData} />
      </>
    ) : (
      <RecipeCard data={message.recipeData} gradient={gradient} />
    )}
  </div>
)}
```

#### Step 4: Configure Tone

```typescript
// Set tone based on user preference or tool context
useEffect(() => {
  const toneConfig = TONE_PRESETS[userPreference] || TONE_PRESETS.friendly;
  responseFormatter.updateTone(toneConfig);
}, [userPreference]);
```

## Examples

### Legacy Response (V1)

**Input:**
```json
{
  "dish": "Mediterranean Quinoa Bowl",
  "kcal": 420,
  "prot": 15,
  "fat": 18,
  "carb": 52,
  "recipe": "# Mediterranean Quinoa Bowl\n\n## Ingredients\n- 1 cup quinoa\n- 2 cups vegetable broth\n\n## Instructions\n1. Cook quinoa\n2. Add vegetables\n3. Serve"
}
```

**Enhanced Output (V2):**
```json
{
  "metadata": {
    "responseId": "legacy-1234567890-abc123",
    "version": "2.0", 
    "generatedAt": "2025-09-19T14:30:00.000Z",
    "processingTimeMs": 1500,
    "confidence": "medium",
    "source": "master-nutritionist"
  },
  "content": {
    "mealPlan": {
      "name": "Mediterranean Quinoa Bowl",
      "description": "A delicious mediterranean quinoa bowl crafted just for you!",
      "servingSize": 1,
      "preparationTimeMinutes": 30,
      "difficultyLevel": "beginner",
      "mealType": ["lunch", "dinner"],
      "dietaryTags": ["vegetarian", "gluten-free"]
    },
    "nutrition": {
      "calories": {
        "total": 420,
        "perServing": 420,
        "dailyValuePercent": 21
      },
      "macronutrients": {
        "protein": {
          "grams": 15,
          "calories": 60,
          "dailyValuePercent": 30
        },
        "carbohydrates": {
          "grams": 52,
          "calories": 208,
          "dailyValuePercent": 17
        },
        "fat": {
          "grams": 18,
          "calories": 162,
          "dailyValuePercent": 28
        }
      },
      "healthScore": 85
    },
    "instructions": {
      "fullRecipe": "# Mediterranean Quinoa Bowl\n\n## Ingredients...",
      "quickSummary": "Cook quinoa → Add vegetables → Serve immediately",
      "ingredientsList": ["1 cup quinoa", "2 cups vegetable broth"],
      "cookingTips": [
        "Mise en place - prep all ingredients before you start cooking",
        "Taste as you go and adjust seasoning to your preference"
      ],
      "nutritionBenefits": [
        "High in protein for muscle maintenance and satiety",
        "Balanced healthy fats for nutrient absorption"
      ]
    }
  },
  "dialogue": {
    "greeting": "😊 Great! I've created a wonderful meal plan just for you!",
    "encouragement": "💪 You're going to love how this makes you feel!",
    "nutritionalInsights": [
      "⚖️ Beautifully balanced calories that fuel your day while keeping you satisfied!",
      "🏋️ Great protein balance to keep you strong and steady throughout the day!"
    ],
    "personalizedTips": [
      "⏰ Perfect timing! Just enough prep time to enjoy the cooking process without rushing.",
      "🌱 Perfect for building confidence in the kitchen - you've got this!"
    ],
    "closingMessage": "Happy cooking, nutrition superstar! 🌟"
  },
  "userExperience": {
    "estimatedEnjoymentRating": 8,
    "suggestedPairings": [
      "Fresh seasonal vegetables",
      "Herbal tea or sparkling water",
      "Mixed green salad with vinaigrette"
    ],
    "alternativeOptions": [
      "Make it lighter by reducing oil and adding more vegetables",
      "Boost protein by adding beans, lentils, or tofu"
    ]
  }
}
```

### Dialogue Examples by Tone

#### Professional Tone
```
Greeting: "Your personalized nutrition plan has been prepared."
Encouragement: "This plan is optimized for your nutritional needs."
Success: "Premium nutrition plan generated in 2.1s!"
```

#### Friendly Tone  
```
Greeting: "😊 Great! I've created a wonderful meal plan just for you!"
Encouragement: "💪 You're going to love how this makes you feel!"
Success: "⭐ Personalized meal plan created in 2.1s!"
```

#### Playful Tone
```
Greeting: "🎉 Ta-da! Your delicious nutrition adventure awaits!"
Encouragement: "✨ This is going to be absolutely delicious!"
Success: "🏆 Premium nutrition plan generated in 2.1s!"
```

#### Enthusiastic Tone
```
Greeting: "🚀 BOOM! Your amazing nutrition plan has landed!"
Encouragement: "🔥 This plan is going to TRANSFORM your wellness game!"
Success: "🏆 Premium nutrition plan generated in 2.1s!"
```

## Changelog

### Version 2.0.0 (September 2025)
- ✨ **NEW:** Enhanced JSON schema with human-friendly field names
- ✨ **NEW:** Configurable dialogue tone system with 4 presets
- ✨ **NEW:** Comprehensive metadata including confidence scores
- ✨ **NEW:** Personalized insights, tips, and fun facts
- ✨ **NEW:** Daily value percentages for nutrition data
- ✨ **NEW:** Meal type classification and dietary tags
- ✨ **NEW:** Enhanced user experience with pairing suggestions
- 🔄 **IMPROVED:** Backward compatibility with legacy recipe format
- 🔄 **IMPROVED:** Graceful fallback handling for text responses
- 🔄 **IMPROVED:** Rich UI components with enhanced insights
- 🛠️ **FIXED:** Consistent error handling and response parsing

### Version 1.0.0 (Legacy)
- Basic recipe JSON parsing
- Simple success/failure toast messages
- RecipeCard component for structured recipes
- Basic nutritional information display

## API Reference

### ResponseFormatter Class

#### Constructor
```typescript
const formatter = new NutritionistResponseFormatter(toneConfig?: DialogueToneConfig)
```

#### Methods

##### parseResponse(rawResponse: string, processingTime?: number): ParsedResponse
Parses any response format and returns enhanced data with dialogue.

```typescript
const result = formatter.parseResponse(apiResponse, 1500);
console.log(result.dialogue.toastMessage); // "⭐ Personalized meal plan created in 1.5s!"
```

##### updateTone(newTone: DialogueToneConfig): void
Updates the formatter's tone configuration.

```typescript
formatter.updateTone(TONE_PRESETS.enthusiastic);
```

##### getCurrentTone(): DialogueToneConfig  
Returns the current tone configuration.

```typescript
const currentTone = formatter.getCurrentTone();
console.log(currentTone.personality); // "friendly"
```

### Type Guards

#### isLegacyRecipe(obj: any): obj is LegacyRecipe
Checks if an object matches the legacy recipe format.

#### isEnhancedResponse(obj: any): obj is NutritionistResponseV2
Checks if an object matches the enhanced response format.

### Singleton Instance

A pre-configured formatter instance is available:

```typescript
import { responseFormatter } from '@/lib/response-formatter';

// Use immediately with default friendly tone
const result = responseFormatter.parseResponse(apiResponse);
```

## Best Practices

### 1. Tone Selection
- **Professional**: Medical, clinical, or corporate environments
- **Friendly**: General consumer applications (default recommended)
- **Playful**: Casual apps targeting younger demographics
- **Enthusiastic**: Fitness and wellness motivation apps

### 2. Error Handling
Always check the response success status and confidence levels:

```typescript
const result = formatter.parseResponse(apiResponse);

if (result.success) {
  if (result.metadata.confidence > 0.7) {
    // High confidence - show enhanced UI
  } else {
    // Lower confidence - show with caveats
  }
} else {
  // Handle parsing failure
}
```

### 3. Performance Considerations
- The formatter processes responses synchronously
- Parsing time is typically < 10ms for most responses
- Consider caching parsed responses for repeated access

### 4. Accessibility
- All dialogue text supports screen readers
- Emoji usage is configurable for accessibility needs
- Clear semantic structure in enhanced UI components

---

*For technical support or feature requests, please refer to the project repository.*
