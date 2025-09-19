/**
 * Cal-Tracker Response Formatter
 * Transforms nutrition analysis responses into positive, imaginative, user-friendly format
 */

export interface CalTrackerResponse {
  greeting: string;
  nutritionSummary: string;
  calorieBreakdown: {
    totalCalories: string;
    macros: Array<{
      name: string;
      value: string;
      percentage: string;
      emoji: string;
    }>;
  };
  healthInsights: string[];
  recommendations: string[];
  encouragement: string;
  nextSteps: string;
  emoji: string;
  foodName: string;
}

export interface CalTrackerToneConfig {
  warmth: 'professional' | 'friendly' | 'enthusiastic';
  useEmojis: boolean;
  positivityLevel: 'moderate' | 'high' | 'maximum';
}

const DEFAULT_CAL_TRACKER_TONE: CalTrackerToneConfig = {
  warmth: 'enthusiastic',
  useEmojis: true,
  positivityLevel: 'high'
};

export class CalTrackerResponseFormatter {
  private toneConfig: CalTrackerToneConfig;

  constructor(config: CalTrackerToneConfig = DEFAULT_CAL_TRACKER_TONE) {
    this.toneConfig = config;
  }

  /**
   * Transform raw API response into positive, structured format
   */
  formatResponse(rawResponse: string): CalTrackerResponse {
    try {
      // Try to parse as JSON first
      const parsed = JSON.parse(rawResponse);
      
      // Check if it's structured nutrition data
      if (this.isNutritionData(parsed)) {
        return this.transformNutritionData(parsed);
      }
      
      // Handle other JSON formats
      const output = parsed.output || rawResponse;
      return this.transformTextResponse(output);
    } catch (error) {
      // Handle plain text responses
      return this.transformTextResponse(rawResponse);
    }
  }

  /**
   * Check if the parsed data contains nutrition information
   */
  private isNutritionData(data: any): boolean {
    return data && (
      data.calories !== undefined || 
      data.kcal !== undefined || 
      data.protein !== undefined ||
      data.carbs !== undefined ||
      data.fat !== undefined ||
      (typeof data === 'object' && 
       (data.dish || data.food_item || data.nutrition))
    );
  }

  /**
   * Transform structured nutrition data into friendly response
   */
  private transformNutritionData(data: any): CalTrackerResponse {
    const { useEmojis } = this.toneConfig;
    
    // Extract food name
    const foodName = data.dish || data.food_item || data.name || 'Your Food';
    
    // Extract nutritional values
    const calories = data.calories || data.kcal || 0;
    const protein = data.protein || data.prot || 0;
    const fat = data.fat || 0;
    const carbs = data.carbs || data.carb || 0;
    
    // Calculate percentages for macros
    const totalMacroCalories = (protein * 4) + (fat * 9) + (carbs * 4);
    const proteinPerc = totalMacroCalories > 0 ? Math.round((protein * 4) / totalMacroCalories * 100) : 0;
    const fatPerc = totalMacroCalories > 0 ? Math.round((fat * 9) / totalMacroCalories * 100) : 0;
    const carbPerc = totalMacroCalories > 0 ? Math.round((carbs * 4) / totalMacroCalories * 100) : 0;

    return {
      greeting: this.generateNutritionGreeting(foodName, calories, useEmojis),
      nutritionSummary: this.generateNutritionSummary(foodName, calories, protein, fat, carbs, useEmojis),
      calorieBreakdown: {
        totalCalories: `${calories} calories`,
        macros: [
          {
            name: 'Protein',
            value: `${protein}g`,
            percentage: `${proteinPerc}%`,
            emoji: '💪'
          },
          {
            name: 'Fat',
            value: `${fat}g`,
            percentage: `${fatPerc}%`,
            emoji: '🥑'
          },
          {
            name: 'Carbs',
            value: `${carbs}g`,
            percentage: `${carbPerc}%`,
            emoji: '🌾'
          }
        ]
      },
      healthInsights: this.generateHealthInsights(calories, protein, fat, carbs, useEmojis),
      recommendations: this.generateNutritionRecommendations(foodName, calories, protein, fat, carbs, useEmojis),
      encouragement: this.generateCalTrackerEncouragement(useEmojis),
      nextSteps: this.generateNutritionNextSteps(foodName, useEmojis),
      emoji: this.selectNutritionEmoji(calories, protein),
      foodName
    };
  }

  /**
   * Transform plain text response into structured format
   */
  private transformTextResponse(content: string): CalTrackerResponse {
    const { useEmojis } = this.toneConfig;
    
    // Extract key information from text
    const analysis = this.parseTextContent(content);
    
    return {
      greeting: this.generateTextGreeting(content, useEmojis),
      nutritionSummary: this.enhanceTextContent(analysis.main, useEmojis),
      calorieBreakdown: {
        totalCalories: analysis.calories || 'Analysis in progress',
        macros: this.extractMacrosFromText(content)
      },
      healthInsights: this.extractInsightsFromText(content, useEmojis),
      recommendations: this.extractRecommendationsFromText(content, useEmojis),
      encouragement: this.generateCalTrackerEncouragement(useEmojis),
      nextSteps: this.generateTextNextSteps(content, useEmojis),
      emoji: this.selectTextEmoji(content),
      foodName: this.extractFoodNameFromText(content) || 'Your Food'
    };
  }

  /**
   * Generate enthusiastic greeting for nutrition data
   */
  private generateNutritionGreeting(foodName: string, calories: number, useEmojis: boolean): string {
    const calorieLevel = calories > 500 ? 'energy-rich' : calories > 200 ? 'balanced' : 'light';
    
    if (useEmojis) {
      if (calorieLevel === 'energy-rich') {
        return `🔥 Fantastic choice! ${foodName} is an energy-rich food that can fuel your active lifestyle with ${calories} calories of pure nutrition power!`;
      } else if (calorieLevel === 'balanced') {
        return `✨ Perfect selection! ${foodName} offers a beautiful balance of nutrition with ${calories} calories to support your wellness goals!`;
      } else {
        return `🌿 Wonderful pick! ${foodName} is a light yet nourishing choice with ${calories} calories that fits beautifully into any healthy eating plan!`;
      }
    }
    
    return `Excellent choice! ${foodName} provides ${calories} calories with a great nutritional profile to support your health goals.`;
  }

  /**
   * Generate engaging nutrition summary
   */
  private generateNutritionSummary(foodName: string, calories: number, protein: number, fat: number, carbs: number, useEmojis: boolean): string {
    let summary = '';
    
    if (useEmojis) {
      summary += `🎯 Your ${foodName} analysis reveals incredible nutritional value! This powerhouse combination delivers:\n\n`;
      summary += `⚡ Energy Source: ${calories} calories to fuel your day\n`;
      summary += `💪 Muscle Building: ${protein}g of high-quality protein\n`;
      summary += `🧠 Brain Fuel: ${fat}g of essential healthy fats\n`;
      summary += `🌾 Quick Energy: ${carbs}g of energizing carbohydrates\n\n`;
      summary += `This amazing balance makes ${foodName} a smart choice for maintaining steady energy levels while supporting your body's essential functions!`;
    } else {
      summary = `Your ${foodName} provides an excellent nutritional foundation with ${calories} calories, ${protein}g protein, ${fat}g fat, and ${carbs}g carbohydrates. This combination supports sustained energy and overall wellness.`;
    }
    
    return summary;
  }

  /**
   * Generate health insights based on nutrition data
   */
  private generateHealthInsights(calories: number, protein: number, fat: number, carbs: number, useEmojis: boolean): string[] {
    const insights: string[] = [];
    
    // Protein insights
    if (protein >= 20) {
      insights.push(useEmojis ? 
        '💪 Excellent protein content! This amount supports muscle maintenance, recovery, and helps keep you feeling satisfied longer.' :
        'Excellent protein content! This amount supports muscle maintenance, recovery, and helps keep you feeling satisfied longer.'
      );
    } else if (protein >= 10) {
      insights.push(useEmojis ?
        '👍 Good protein source! Consider pairing with additional protein-rich foods for optimal muscle support.' :
        'Good protein source! Consider pairing with additional protein-rich foods for optimal muscle support.'
      );
    }

    // Calorie insights
    if (calories >= 400) {
      insights.push(useEmojis ?
        '🔥 This is a substantial energy source perfect for active individuals or as a complete meal component!' :
        'This is a substantial energy source perfect for active individuals or as a complete meal component!'
      );
    } else if (calories >= 150) {
      insights.push(useEmojis ?
        '⚖️ Great calorie balance! Perfect for mindful eating while still providing meaningful nutrition.' :
        'Great calorie balance! Perfect for mindful eating while still providing meaningful nutrition.'
      );
    }

    // Carb insights
    if (carbs >= 30) {
      insights.push(useEmojis ?
        '⚡ Rich in energizing carbohydrates! Ideal for pre-workout fuel or sustaining mental focus.' :
        'Rich in energizing carbohydrates! Ideal for pre-workout fuel or sustaining mental focus.'
      );
    }

    return insights;
  }

  /**
   * Generate personalized nutrition recommendations
   */
  private generateNutritionRecommendations(foodName: string, calories: number, protein: number, fat: number, carbs: number, useEmojis: boolean): string[] {
    const recommendations: string[] = [];
    
    // Timing recommendations
    if (carbs >= 25) {
      recommendations.push(useEmojis ?
        '🌅 Perfect Morning Fuel: The carbohydrate content makes this ideal for breakfast or pre-workout energy!' :
        'Perfect Morning Fuel: The carbohydrate content makes this ideal for breakfast or pre-workout energy!'
      );
    }

    if (protein >= 15) {
      recommendations.push(useEmojis ?
        '🍽️ Post-Workout Champion: High protein content makes this excellent for muscle recovery within 2 hours of exercise!' :
        'Post-Workout Champion: High protein content makes this excellent for muscle recovery within 2 hours of exercise!'
      );
    }

    // Pairing suggestions
    if (fat < 5) {
      recommendations.push(useEmojis ?
        '🥑 Smart Pairing Tip: Add some healthy fats like avocado, nuts, or olive oil to enhance nutrient absorption!' :
        'Smart Pairing Tip: Add some healthy fats like avocado, nuts, or olive oil to enhance nutrient absorption!'
      );
    }

    // Portion guidance
    if (calories > 400) {
      recommendations.push(useEmojis ?
        '🍽️ Mindful Portions: This can serve as a complete meal component. Listen to your hunger cues for perfect satisfaction!' :
        'Mindful Portions: This can serve as a complete meal component. Listen to your hunger cues for perfect satisfaction!'
      );
    }

    return recommendations;
  }

  /**
   * Parse text content to extract key information
   */
  private parseTextContent(content: string): { main: string; calories: string | null } {
    const lines = content.split('\n').filter(line => line.trim());
    let mainText = '';
    let calories = null;
    
    // Extract calorie information
    const calorieMatch = content.match(/(\d+)\s*(kcal|calories?|калорий)/i);
    if (calorieMatch) {
      calories = `${calorieMatch[1]} calories`;
    }
    
    // Clean and enhance main text
    for (const line of lines) {
      const trimmed = line.trim()
        .replace(/\*\*/g, '') // Remove ** formatting
        .replace(/\*/g, '')   // Remove * characters
        .replace(/—/g, '-')   // Replace em dash with regular dash
        .replace(/#/g, '');   // Remove # characters
      
      if (trimmed.length > 20 && !trimmed.match(/^\d+\./)) {
        mainText += trimmed + ' ';
      }
    }
    
    return {
      main: mainText.trim(),
      calories
    };
  }

  /**
   * Extract macros from text content
   */
  private extractMacrosFromText(content: string): Array<{name: string; value: string; percentage: string; emoji: string}> {
    const macros = [];
    
    // Extract protein
    const proteinMatch = content.match(/protein[:\s]*(\d+\.?\d*)\s*g/i);
    if (proteinMatch) {
      macros.push({
        name: 'Protein',
        value: `${proteinMatch[1]}g`,
        percentage: 'Analysis',
        emoji: '💪'
      });
    }
    
    // Extract fat
    const fatMatch = content.match(/fat[:\s]*(\d+\.?\d*)\s*g/i);
    if (fatMatch) {
      macros.push({
        name: 'Fat',
        value: `${fatMatch[1]}g`,
        percentage: 'Complete',
        emoji: '🥑'
      });
    }
    
    // Extract carbs
    const carbMatch = content.match(/(carb|carbohydrate)[:\s]*(\d+\.?\d*)\s*g/i);
    if (carbMatch) {
      macros.push({
        name: 'Carbs',
        value: `${carbMatch[2]}g`,
        percentage: 'Ready',
        emoji: '🌾'
      });
    }
    
    return macros;
  }

  /**
   * Generate encouraging message for Cal-Tracker users
   */
  private generateCalTrackerEncouragement(useEmojis: boolean): string {
    const messages = [
      useEmojis ? '🌟 Amazing work tracking your nutrition! Every food choice is a step toward a healthier, more energized you!' : 'Amazing work tracking your nutrition! Every food choice is a step toward a healthier, more energized you!',
      useEmojis ? '🎯 You are building incredible awareness of your nutrition! This mindful approach will transform your health journey!' : 'You are building incredible awareness of your nutrition! This mindful approach will transform your health journey!',
      useEmojis ? '💪 Fantastic dedication to understanding your food! Knowledge like this empowers you to make choices that truly nourish your body!' : 'Fantastic dedication to understanding your food! Knowledge like this empowers you to make choices that truly nourish your body!'
    ];
    
    return messages[Math.floor(Math.random() * messages.length)];
  }

  /**
   * Generate engaging next steps
   */
  private generateNutritionNextSteps(foodName: string, useEmojis: boolean): string {
    const suggestions = [
      useEmojis ? 
        `🍽️ Want to explore perfect meal combinations with ${foodName}? I can suggest complementary foods that create nutritional harmony!` :
        `Want to explore perfect meal combinations with ${foodName}? I can suggest complementary foods that create nutritional harmony!`,
      useEmojis ?
        '📊 Ready to track another food item? Building a complete picture of your daily nutrition creates powerful insights for optimal health!' :
        'Ready to track another food item? Building a complete picture of your daily nutrition creates powerful insights for optimal health!',
      useEmojis ?
        '⚡ Curious about meal timing strategies? I can help you understand when to eat different nutrients for maximum energy and recovery!' :
        'Curious about meal timing strategies? I can help you understand when to eat different nutrients for maximum energy and recovery!'
    ];
    
    return suggestions[Math.floor(Math.random() * suggestions.length)];
  }

  /**
   * Extract food name from text content
   */
  private extractFoodNameFromText(content: string): string | null {
    // Look for common food name patterns
    const patterns = [
      /analyzing (.+?) nutrition/i,
      /(.+?) contains/i,
      /nutrition for (.+?)[\.\!]/i,
      /food item[:\s]*(.+?)[\.\!]/i
    ];
    
    for (const pattern of patterns) {
      const match = content.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
    
    return null;
  }

  /**
   * Helper methods for text-based responses
   */
  private generateTextGreeting(content: string, useEmojis: boolean): string {
    if (useEmojis) {
      return '🎯 Excellent choice! Let me break down the amazing nutritional value of your food selection!';
    }
    return 'Excellent choice! Let me break down the amazing nutritional value of your food selection!';
  }

  private enhanceTextContent(content: string, useEmojis: boolean): string {
    if (!content) return '';
    
    let enhanced = content;
    
    // Remove forbidden characters
    enhanced = enhanced.replace(/\*\*/g, '').replace(/\*/g, '').replace(/—/g, '-').replace(/#/g, '');
    
    // Add nutritional emphasis
    if (useEmojis) {
      enhanced = enhanced.replace(/protein/gi, '💪 protein');
      enhanced = enhanced.replace(/calories/gi, '🔥 calories');
      enhanced = enhanced.replace(/carb/gi, '🌾 carb');
      enhanced = enhanced.replace(/fat/gi, '🥑 fat');
    }
    
    return enhanced;
  }

  private extractInsightsFromText(content: string, useEmojis: boolean): string[] {
    const insights = [];
    
    if (content.toLowerCase().includes('protein')) {
      insights.push(useEmojis ?
        '💪 Great protein source detected! Perfect for muscle maintenance and satisfaction.' :
        'Great protein source detected! Perfect for muscle maintenance and satisfaction.'
      );
    }
    
    if (content.toLowerCase().includes('vitamin') || content.toLowerCase().includes('nutrient')) {
      insights.push(useEmojis ?
        '✨ Rich in essential nutrients! Your body will thank you for this nutritious choice.' :
        'Rich in essential nutrients! Your body will thank you for this nutritious choice.'
      );
    }
    
    return insights;
  }

  private extractRecommendationsFromText(content: string, useEmojis: boolean): string[] {
    return [
      useEmojis ?
        '🍽️ Perfect Addition: This food fits beautifully into a balanced eating pattern!' :
        'Perfect Addition: This food fits beautifully into a balanced eating pattern!',
      useEmojis ?
        '⏰ Timing Tip: Enjoy this as part of your regular meal routine for consistent energy!' :
        'Timing Tip: Enjoy this as part of your regular meal routine for consistent energy!'
    ];
  }

  private generateTextNextSteps(content: string, useEmojis: boolean): string {
    if (useEmojis) {
      return '🚀 Ready to analyze another food item? Building your nutrition knowledge one analysis at a time creates lasting healthy habits!';
    }
    return 'Ready to analyze another food item? Building your nutrition knowledge one analysis at a time creates lasting healthy habits!';
  }

  private selectNutritionEmoji(calories: number, protein: number): string {
    if (protein >= 20) return '💪';
    if (calories >= 400) return '🔥';
    return '🌟';
  }

  private selectTextEmoji(content: string): string {
    if (content.toLowerCase().includes('protein')) return '💪';
    if (content.toLowerCase().includes('energy')) return '⚡';
    return '🎯';
  }

  /**
   * Update tone configuration
   */
  updateTone(newTone: Partial<CalTrackerToneConfig>): void {
    this.toneConfig = { ...this.toneConfig, ...newTone };
  }
}

// Export singleton instance
export const calTrackerFormatter = new CalTrackerResponseFormatter();
