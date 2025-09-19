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
    
    // Generate greeting based on tone
    const greeting = this.generateGreeting(warmth, useEmojis);
    
    // Transform main content to be more visually appealing
    const mainContent = this.enhanceMainContent(sections.main, useEmojis);
    
    // Extract and format action items/tips
    const actionItems = this.formatActionItems(sections.tips, useEmojis);
    
    // Generate encouraging closing
    const encouragement = this.generateEncouragement(warmth, useEmojis, humorLevel);
    
    // Add next steps if questions are asked
    const nextSteps = sections.questions ? this.formatNextSteps(sections.questions, useEmojis) : undefined;
    
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
   * Parse content into sections
   */
  private parseContent(content: string): {
    main: string;
    tips: string[];
    questions: string;
    topic: string;
  } {
    const lines = content.split('\n').filter(line => line.trim());
    
    // Extract numbered tips/points
    const tips: string[] = [];
    let mainText = '';
    let questionsText = '';
    let topic = 'nutrition'; // default
    
    // First pass - detect topic from entire content
    const fullText = content.toLowerCase();
    if (fullText.includes('мышц') || fullText.includes('muscle') || fullText.includes('массы')) {
      topic = 'muscle-building';
    } else if (fullText.includes('похуден') || fullText.includes('weight')) {
      topic = 'weight-loss';
    } else if (fullText.includes('энерг') || fullText.includes('energy')) {
      topic = 'energy';
    }
    
    for (const line of lines) {
      const trimmed = line.trim();
      
      // Extract numbered tips (more flexible matching)
      if (/^\d+\.\s*\*/.test(trimmed) || /^\d+\.\s/.test(trimmed) || /^\d+\.\s*[А-Яа-яA-Za-z]/.test(trimmed)) {
        const tipText = trimmed.replace(/^\d+\.\s*\*?/, '').replace(/\*?\s*$/, '');
        tips.push(tipText);
      }
      // Extract questions
      else if (trimmed.includes('?') || trimmed.includes('расскажете') || trimmed.includes('можете') || 
               trimmed.includes('Могу') || trimmed.toLowerCase().includes('рассчитать')) {
        questionsText += trimmed + ' ';
      }
      // Main content
      else if (!trimmed.match(/^\d+\./) && trimmed.length > 10) {
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
   * Generate warm greeting
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
   * Enhance main content with better formatting
   */
  private enhanceMainContent(mainContent: string, useEmojis: boolean): string {
    if (!mainContent) return '';
    
    let enhanced = mainContent;
    
    // Add visual breaks and emphasis
    enhanced = enhanced.replace(/Отлично!/g, useEmojis ? '✨ Отлично!' : 'Отлично!');
    enhanced = enhanced.replace(/важно/g, useEmojis ? '⚡ важно' : 'важно');
    
    // Format key nutrition terms
    enhanced = enhanced.replace(/белок/gi, useEmojis ? '🥩 белок' : '**белок**');
    enhanced = enhanced.replace(/углеводы/gi, useEmojis ? '🍞 углеводы' : '**углеводы**');
    enhanced = enhanced.replace(/калори/gi, useEmojis ? '🔥 калории' : '**калории**');
    
    return enhanced;
  }

  /**
   * Format action items as visually appealing list
   */
  private formatActionItems(tips: string[], useEmojis: boolean): string[] {
    return tips.map((tip, index) => {
      let formatted = tip;
      
      // Clean up formatting first
      formatted = formatted.replace(/\*([^*]+)\*/g, '**$1**'); // Bold formatting
      
      // Add appropriate icons based on content
      if (useEmojis) {
        const lowerTip = tip.toLowerCase();
        if (lowerTip.includes('калори') || lowerTip.includes('ккал')) {
          formatted = `🔥 ${formatted}`;
        } else if (lowerTip.includes('белок')) {
          formatted = `💪 ${formatted}`;
        } else if (lowerTip.includes('углевод')) {
          formatted = `⚡ ${formatted}`;
        } else if (lowerTip.includes('жир')) {
          formatted = `🥑 ${formatted}`;
        } else if (lowerTip.includes('питай') || lowerTip.includes('приём')) {
          formatted = `⏰ ${formatted}`;
        } else {
          formatted = `✨ ${formatted}`;
        }
      } else {
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
   * Format next steps section
   */
  private formatNextSteps(questions: string, useEmojis: boolean): string {
    let formatted = questions;
    
    if (useEmojis) {
      formatted = `🤔 ${formatted}`;
      formatted = formatted.replace(/расскажете/g, 'поделитесь со мной');
      formatted = formatted.replace(/Могу/g, '💡 Я могу');
    }
    
    return formatted;
  }

  /**
   * Select emoji based on topic
   */
  private selectEmoji(topic: string): string {
    const emojiMap = {
      'muscle-building': '💪',
      'weight-loss': '⚖️',
      'energy': '⚡',
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
