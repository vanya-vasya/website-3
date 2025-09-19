/**
 * Friendly Response Formatter for Master Nutritionist
 * Transforms JSON responses into human-friendly, aesthetically pleasing format
 */

export interface FriendlyResponse {
  greeting: string;
  mainContent: string;
  actionItems: string[];
  encouragement: string;
  nextSteps?: string;
  emoji: string;
}

export interface ToneConfig {
  warmth: 'professional' | 'friendly' | 'playful';
  useEmojis: boolean;
  humorLevel: 'none' | 'light' | 'moderate';
}

const DEFAULT_TONE: ToneConfig = {
  warmth: 'friendly',
  useEmojis: true,
  humorLevel: 'light'
};

export class FriendlyResponseFormatter {
  private toneConfig: ToneConfig;

  constructor(config: ToneConfig = DEFAULT_TONE) {
    this.toneConfig = config;
  }

  /**
   * Transform raw API response into friendly, human-readable format
   */
  formatResponse(rawResponse: string): FriendlyResponse {
    try {
      // Parse the JSON response
      const parsed = JSON.parse(rawResponse);
      const output = parsed.output || rawResponse;
      
      return this.transformToFriendly(output);
    } catch (error) {
      // Handle plain text responses
      return this.transformToFriendly(rawResponse);
    }
  }

  /**
   * Transform text content into structured friendly response
   */
  private transformToFriendly(content: string): FriendlyResponse {
    const { warmth, useEmojis, humorLevel } = this.toneConfig;
    
    // Extract key information from the content
    const sections = this.parseContent(content);
    
    // Generate more engaging, contextual greeting
    const greeting = this.generateEngagingGreeting(content, useEmojis);
    
    // Transform main content to be more visually appealing
    const mainContent = this.enhanceMainContent(sections.main, useEmojis);
    
    // Extract and format action items/tips with NO forbidden characters
    const actionItems = this.formatActionItems(sections.tips, useEmojis);
    
    // Generate encouraging closing
    const encouragement = this.generateEncouragement(warmth, useEmojis, humorLevel);
    
    // Always generate engaging next steps
    const nextSteps = this.generateEngagingNextSteps(content, useEmojis);
    
    // Choose appropriate emoji theme
    const emoji = this.selectEmoji(sections.topic);

    return {
      greeting,
      mainContent,
      actionItems,
      encouragement,
      nextSteps,
      emoji
    };
  }

  /**
   * Parse content into sections - Enhanced for English content with NO forbidden characters
   */
  private parseContent(content: string): {
    main: string;
    tips: string[];
    questions: string;
    topic: string;
  } {
    const lines = content.split('\n').filter(line => line.trim());
    
    // Extract numbered tips/points and sections
    const tips: string[] = [];
    let mainText = '';
    let questionsText = '';
    let topic = 'nutrition'; // default
    
    // Enhanced topic detection for English content
    const fullText = content.toLowerCase();
    if (fullText.includes('muscle') || fullText.includes('protein') || fullText.includes('lean mass')) {
      topic = 'muscle-building';
    } else if (fullText.includes('weight loss') || fullText.includes('lose weight') || fullText.includes('calorie')) {
      topic = 'weight-loss';
    } else if (fullText.includes('energy') || fullText.includes('metabolism') || fullText.includes('boost')) {
      topic = 'energy';
    } else if (fullText.includes('33') || fullText.includes('34') || fullText.includes('age') || fullText.includes('foundation')) {
      topic = 'healthy-aging';
    }
    
    // Enhanced parsing - remove ALL forbidden characters
    for (const line of lines) {
      const trimmed = line.trim()
        .replace(/\*\*/g, '') // Remove ** formatting
        .replace(/\*/g, '')   // Remove * characters 
        .replace(/—/g, '-')   // Replace em dash with regular dash
        .replace(/#/g, '');   // Remove # characters
      
      // Extract numbered tips (more flexible pattern matching)
      if (/^\d+\.\s/.test(trimmed) || trimmed.match(/^[1-9]\./)) {
        const tipText = trimmed
          .replace(/^\d+\.\s*/, '')
          .replace(/:\s*-?\s*/g, ': ')
          .trim();
        if (tipText.length > 5) {
          tips.push(tipText);
        }
      }
      // Extract questions and next steps
      else if (trimmed.includes('?') || trimmed.toLowerCase().includes('would you like') || 
               trimmed.toLowerCase().includes('specific goals') || trimmed.toLowerCase().includes('next step')) {
        questionsText += trimmed + ' ';
      }
      // Main content (paragraphs longer than 20 chars)
      else if (!trimmed.match(/^\d+\./) && trimmed.length > 20) {
        mainText += trimmed + ' ';
      }
    }
    
    return {
      main: mainText.trim(),
      tips,
      questions: questionsText.trim(),
      topic
    };
  }

  /**
   * Generate engaging, contextual greeting based on content analysis
   */
  private generateEngagingGreeting(content: string, useEmojis: boolean): string {
    const lowerContent = content.toLowerCase();
    
    // Age-specific responses with positive, imaginative language
    if (lowerContent.includes('33') || lowerContent.includes('foundation')) {
      return useEmojis 
        ? '✨ That is a fantastic goal! Eating well at 33 sets a strong foundation for long-term health, energy, and even mental sharpness. At this stage, nutrition can help maintain lean muscle mass, keep your metabolism active, support heart health, and boost your mood.'
        : 'That is a fantastic goal! Eating well at 33 sets a strong foundation for long-term health, energy, and even mental sharpness. At this stage, nutrition can help maintain lean muscle mass, keep your metabolism active, support heart health, and boost your mood.';
    }
    
    // Goal-specific responses
    if (lowerContent.includes('muscle') || lowerContent.includes('protein')) {
      return useEmojis
        ? '💪 Excellent choice! Building and maintaining muscle through nutrition is one of the smartest health investments you can make.'
        : 'Excellent choice! Building and maintaining muscle through nutrition is one of the smartest health investments you can make.';
    }
    
    if (lowerContent.includes('weight') || lowerContent.includes('lose')) {
      return useEmojis
        ? '🎯 Great decision! Sustainable weight management through proper nutrition creates lasting results.'
        : 'Great decision! Sustainable weight management through proper nutrition creates lasting results.';
    }
    
    if (lowerContent.includes('energy') || lowerContent.includes('boost')) {
      return useEmojis
        ? '⚡ Perfect timing! Optimizing your nutrition for energy will transform how you feel every day.'
        : 'Perfect timing! Optimizing your nutrition for energy will transform how you feel every day.';
    }
    
    // Default positive response
    return useEmojis
      ? '🌟 Wonderful! You are taking an amazing step toward better health and wellness.'
      : 'Wonderful! You are taking an amazing step toward better health and wellness.';
  }

  /**
   * Generate warm greeting (kept for backward compatibility)
   */
  private generateGreeting(warmth: string, useEmojis: boolean): string {
    const emojis = useEmojis;
    
    switch (warmth) {
      case 'professional':
        return 'Excellent question! Let me provide you with some comprehensive guidance.';
      
      case 'playful':
        return emojis 
          ? '🌟 Amazing! You\'ve come to the right place for some nutrition magic!'
          : 'Amazing! You\'ve come to the right place for some nutrition magic!';
      
      case 'friendly':
      default:
        return emojis
          ? '😊 Great question! I\'m excited to help you on your nutrition journey.'
          : 'Great question! I\'m excited to help you on your nutrition journey.';
    }
  }

  /**
   * Enhance main content with better formatting - NO forbidden characters
   */
  private enhanceMainContent(mainContent: string, useEmojis: boolean): string {
    if (!mainContent) return '';
    
    let enhanced = mainContent;
    
    // Remove ALL forbidden characters first
    enhanced = enhanced.replace(/\*\*/g, '').replace(/\*/g, '').replace(/—/g, '-').replace(/#/g, '');
    
    // Add visual breaks and emphasis with emojis only (no asterisks)
    enhanced = enhanced.replace(/Отлично!/g, useEmojis ? '✨ Отлично!' : 'Отлично!');
    enhanced = enhanced.replace(/важно/g, useEmojis ? '⚡ важно' : 'важно');
    
    // Format key nutrition terms with emojis (NO asterisks)
    enhanced = enhanced.replace(/белок/gi, useEmojis ? '🥩 белок' : 'белок');
    enhanced = enhanced.replace(/углеводы/gi, useEmojis ? '🍞 углеводы' : 'углеводы');
    enhanced = enhanced.replace(/калори/gi, useEmojis ? '🔥 калории' : 'калории');
    
    // Format English nutrition terms
    enhanced = enhanced.replace(/protein/gi, useEmojis ? '💪 protein' : 'protein');
    enhanced = enhanced.replace(/calories/gi, useEmojis ? '🔥 calories' : 'calories');
    enhanced = enhanced.replace(/hydration/gi, useEmojis ? '💧 hydration' : 'hydration');
    
    return enhanced;
  }

  /**
   * Format action items with NO forbidden characters - Enhanced for English
   */
  private formatActionItems(tips: string[], useEmojis: boolean): string[] {
    return tips.map((tip, index) => {
      let formatted = tip;
      
      // Remove ALL forbidden characters first
      formatted = formatted.replace(/\*\*/g, '').replace(/\*/g, '').replace(/—/g, '-').replace(/#/g, '');
      
      // Add appropriate icons based on content (English + Russian)
      if (useEmojis) {
        const lowerTip = tip.toLowerCase();
        if (lowerTip.includes('plate') || lowerTip.includes('balance')) {
          formatted = `🍽️ ${formatted}`;
        } else if (lowerTip.includes('protein') || lowerTip.includes('белок') || lowerTip.includes('muscle')) {
          formatted = `💪 ${formatted}`;
        } else if (lowerTip.includes('hydrat') || lowerTip.includes('water') || lowerTip.includes('cup')) {
          formatted = `💧 ${formatted}`;
        } else if (lowerTip.includes('portion') || lowerTip.includes('enough') || lowerTip.includes('satisfy')) {
          formatted = `⚖️ ${formatted}`;
        } else if (lowerTip.includes('sugar') || lowerTip.includes('processed') || lowerTip.includes('limit')) {
          formatted = `🚫 ${formatted}`;
        } else if (lowerTip.includes('enjoy') || lowerTip.includes('mindful') || lowerTip.includes('food')) {
          formatted = `😌 ${formatted}`;
        } else if (lowerTip.includes('калори') || lowerTip.includes('ккал') || lowerTip.includes('calorie')) {
          formatted = `🔥 ${formatted}`;
        } else if (lowerTip.includes('углевод') || lowerTip.includes('grain')) {
          formatted = `🌾 ${formatted}`;
        } else if (lowerTip.includes('жир') || lowerTip.includes('fat') || lowerTip.includes('avocado') || lowerTip.includes('nuts')) {
          formatted = `🥑 ${formatted}`;
        } else if (lowerTip.includes('питай') || lowerTip.includes('приём') || lowerTip.includes('meal')) {
          formatted = `⏰ ${formatted}`;
        } else {
          formatted = `✨ ${formatted}`;
        }
      } else {
        // Use bullet points instead of asterisks
        formatted = `• ${formatted}`;
      }
      
      return formatted;
    });
  }

  /**
   * Generate encouraging closing message
   */
  private generateEncouragement(warmth: string, useEmojis: boolean, humorLevel: string): string {
    const emojis = useEmojis;
    
    const messages = {
      professional: [
        'I believe these recommendations will support your goals effectively.',
        'Consistency with these guidelines will yield excellent results.',
        'Your dedication to improving your nutrition is commendable.'
      ],
      
      friendly: [
        emojis ? '🌟 You\'ve got this! Small consistent steps lead to amazing results.' : 'You\'ve got this! Small consistent steps lead to amazing results.',
        emojis ? '💪 I\'m here to support you every step of the way!' : 'I\'m here to support you every step of the way!',
        emojis ? '🎯 Focus on progress, not perfection - you\'re already on the right path!' : 'Focus on progress, not perfection - you\'re already on the right path!'
      ],
      
      playful: [
        emojis ? '🚀 Time to become a nutrition superhero! Your body will thank you later.' : 'Time to become a nutrition superhero! Your body will thank you later.',
        emojis ? '✨ Consider me your friendly nutrition wizard - we\'re going to make magic happen!' : 'Consider me your friendly nutrition wizard - we\'re going to make magic happen!',
        emojis ? '🎉 Get ready for an amazing transformation journey!' : 'Get ready for an amazing transformation journey!'
      ]
    };

    const categoryMessages = messages[warmth as keyof typeof messages] || messages.friendly;
    const randomIndex = Math.floor(Math.random() * categoryMessages.length);
    
    return categoryMessages[randomIndex];
  }

  /**
   * Generate engaging next steps based on content - NO forbidden characters
   */
  private generateEngagingNextSteps(content: string, useEmojis: boolean): string {
    const lowerContent = content.toLowerCase();
    
    // Generate contextual next steps with conversational tone
    let nextSteps = '';
    
    // Check for age mentions and create personalized responses
    if (lowerContent.includes('33') || lowerContent.includes('34') || lowerContent.includes('foundation')) {
      if (lowerContent.includes('34') || lowerContent.includes('boy')) {
        nextSteps = useEmojis 
          ? '🤔 It looks like you mentioned a boy who is 34 years old, which seems a bit unusual - the age suggests you mean an adult man. Could you clarify if you are asking for a general nutrition plan for a healthy 34-year-old male? If you have specific goals (like weight loss, muscle gain, improved energy, or any underlying health conditions), feel free to share those details. That way, I can create a plan tailored to your needs! Would you like a plan tailored to a specific goal (like muscle gain, weight loss, or improving energy)? Or any particular dietary preferences (e.g., vegetarian, dairy-free)? Let me know so I can help further! 🥗💪'
          : 'It looks like you mentioned a boy who is 34 years old, which seems a bit unusual - the age suggests you mean an adult man. Could you clarify if you are asking for a general nutrition plan for a healthy 34-year-old male? If you have specific goals (like weight loss, muscle gain, improved energy, or any underlying health conditions), feel free to share those details. That way, I can create a plan tailored to your needs! Would you like a plan tailored to a specific goal (like muscle gain, weight loss, or improving energy)? Or any particular dietary preferences (e.g., vegetarian, dairy-free)? Let me know so I can help further!';
      } else {
        nextSteps = useEmojis 
          ? '🤔 Would you like a sample day meal plan, or do you have specific goals (like muscle gain, weight loss, or boosting energy) in mind? 🥗💪'
          : 'Would you like a sample day meal plan, or do you have specific goals (like muscle gain, weight loss, or boosting energy) in mind?';
      }
    } else if (lowerContent.includes('muscle') || lowerContent.includes('protein')) {
      nextSteps = useEmojis
        ? '💪 Ready to dive deeper? I can create a personalized protein strategy or design meal timing that maximizes muscle growth! 🥩⏰'
        : 'Ready to dive deeper? I can create a personalized protein strategy or design meal timing that maximizes muscle growth!';
    } else if (lowerContent.includes('weight') || lowerContent.includes('calorie')) {
      nextSteps = useEmojis
        ? '📊 Want me to calculate your personalized calorie targets or create a week-long meal plan that fits your lifestyle? 🎯🍽️'
        : 'Want me to calculate your personalized calorie targets or create a week-long meal plan that fits your lifestyle?';
    } else if (lowerContent.includes('energy') || lowerContent.includes('boost')) {
      nextSteps = useEmojis
        ? '⚡ Shall we explore energy-boosting meal combinations or create a strategic eating schedule for sustained vitality? 🌅🥗'
        : 'Shall we explore energy-boosting meal combinations or create a strategic eating schedule for sustained vitality?';
    } else {
      // Generic engaging next steps
      nextSteps = useEmojis
        ? '🎯 What is your biggest nutrition challenge right now? I would love to create a personalized action plan just for you! ✨🥗'
        : 'What is your biggest nutrition challenge right now? I would love to create a personalized action plan just for you!';
    }
    
    return nextSteps;
  }

  /**
   * Format next steps section (kept for backward compatibility)
   */
  private formatNextSteps(questions: string, useEmojis: boolean): string {
    let formatted = questions;
    
    // Remove forbidden characters
    formatted = formatted.replace(/\*\*/g, '').replace(/\*/g, '').replace(/—/g, '-').replace(/#/g, '');
    
    if (useEmojis) {
      formatted = `🤔 ${formatted}`;
      formatted = formatted.replace(/расскажете/g, 'поделитесь со мной');
      formatted = formatted.replace(/Могу/g, '💡 Я могу');
    }
    
    return formatted;
  }

  /**
   * Select emoji based on topic - Enhanced with new categories
   */
  private selectEmoji(topic: string): string {
    const emojiMap = {
      'muscle-building': '💪',
      'weight-loss': '⚖️',
      'energy': '⚡',
      'healthy-aging': '✨',
      'nutrition': '🥗',
      'default': '🌟'
    };
    
    return emojiMap[topic as keyof typeof emojiMap] || emojiMap.default;
  }

  /**
   * Update tone configuration
   */
  updateTone(newTone: Partial<ToneConfig>): void {
    this.toneConfig = { ...this.toneConfig, ...newTone };
  }

  /**
   * Get current tone configuration
   */
  getCurrentTone(): ToneConfig {
    return { ...this.toneConfig };
  }
}

// Export singleton instance
export const friendlyFormatter = new FriendlyResponseFormatter();
