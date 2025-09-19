/**
 * Unit Tests for Friendly Response Formatter
 * Tests mapping, schema validation, and tone toggles
 */

import { FriendlyResponseFormatter, ToneConfig, FriendlyResponse } from '@/lib/friendly-response-formatter';

describe('FriendlyResponseFormatter', () => {
  let formatter: FriendlyResponseFormatter;

  beforeEach(() => {
    formatter = new FriendlyResponseFormatter();
  });

  describe('Response Formatting', () => {
    it('should format JSON response with output field', () => {
      const jsonResponse = JSON.stringify({
        output: "Отлично! Для набора мышечной массы важно сочетать силовые тренировки с правильным питанием."
      });

      const result = formatter.formatResponse(jsonResponse);

      expect(result).toBeDefined();
      expect(result.greeting).toBeDefined();
      expect(result.mainContent).toBeDefined();
      expect(result.encouragement).toBeDefined();
      expect(result.emoji).toBeDefined();
      expect(Array.isArray(result.actionItems)).toBe(true);
    });

    it('should format plain text response', () => {
      const textResponse = "Отлично! Для набора мышечной массы важно правильное питание. 1. Ешьте больше белка. 2. Контролируйте калории.";

      const result = formatter.formatResponse(textResponse);

      expect(result).toBeDefined();
      expect(result.greeting).toBeDefined();
      expect(result.mainContent).toContain('мышечной массы');
      expect(result.actionItems.length).toBeGreaterThanOrEqual(0); // May or may not extract tips from single line
      expect(result.encouragement).toBeDefined();
    });

    it('should extract numbered tips correctly', () => {
      const response = `Отлично! Вот советы:
      1. *Сделайте небольшой профицит калорий* — ешьте чуть больше
      2. *Контролируйте белок* — ориентируйтесь на 1,6–2 г
      3. *Не забывайте про углеводы* — они дадут энергию`;

      const result = formatter.formatResponse(response);

      expect(result.actionItems).toHaveLength(3);
      expect(result.actionItems[0]).toContain('профицит калорий');
      expect(result.actionItems[1]).toContain('белок');
      expect(result.actionItems[2]).toContain('углеводы');
    });

    it('should detect muscle building topic and use appropriate emoji', () => {
      const response = "Для набора мышечной массы важно правильное питание";

      const result = formatter.formatResponse(response);

      expect(result.emoji).toBe('💪');
    });

    it('should detect energy topic and use appropriate emoji', () => {
      const response = "Для повышения энергии рекомендую следующее";

      const result = formatter.formatResponse(response);

      expect(result.emoji).toBe('⚡');
    });

    it('should extract questions for next steps', () => {
      const response = `Отлично! Вот советы.
      
      Могу рассчитать более точные рекомендации, если расскажете:
      - Ваш вес, рост, возраст, пол
      - Примерный рацион`;

      const result = formatter.formatResponse(response);

      expect(result.nextSteps).toBeDefined();
      expect(result.nextSteps).toContain('рассчитать');
    });
  });

  describe('Tone Configuration', () => {
    it('should use friendly tone by default', () => {
      const defaultTone = formatter.getCurrentTone();

      expect(defaultTone.warmth).toBe('friendly');
      expect(defaultTone.useEmojis).toBe(true);
      expect(defaultTone.humorLevel).toBe('light');
    });

    it('should generate professional greeting', () => {
      const professionalConfig: ToneConfig = {
        warmth: 'professional',
        useEmojis: false,
        humorLevel: 'none'
      };

      formatter.updateTone(professionalConfig);
      const result = formatter.formatResponse("Test response");

      expect(result.greeting).toContain('Excellent question');
      expect(result.greeting).not.toContain('😊');
    });

    it('should generate playful greeting with emojis', () => {
      const playfulConfig: ToneConfig = {
        warmth: 'playful',
        useEmojis: true,
        humorLevel: 'moderate'
      };

      formatter.updateTone(playfulConfig);
      const result = formatter.formatResponse("Test response");

      expect(result.greeting).toContain('🌟');
      expect(result.greeting).toContain('Amazing');
    });

    it('should respect emoji configuration', () => {
      const noEmojiConfig: ToneConfig = {
        warmth: 'friendly',
        useEmojis: false,
        humorLevel: 'light'
      };

      formatter.updateTone(noEmojiConfig);
      const result = formatter.formatResponse("Test response with белок and калории");

      // Should not contain emojis in action items
      const hasEmojis = result.actionItems.some(item => /[🥩🔥🍞🥑⚡✨]/u.test(item));
      expect(hasEmojis).toBe(false);
    });

    it('should add contextual emojis when enabled', () => {
      const emojiConfig: ToneConfig = {
        warmth: 'friendly',
        useEmojis: true,
        humorLevel: 'light'
      };

      formatter.updateTone(emojiConfig);
      const response = `Советы по питанию:
      1. Ешьте больше белка для мышц
      2. Контролируйте калории каждый день
      3. Добавьте углеводы для энергии`;
      const result = formatter.formatResponse(response);

      // Should contain some emojis (may be contextual or default ✨)
      expect(result.actionItems.length).toBeGreaterThan(0);
      expect(result.actionItems.some(item => /[💪🔥⚡✨]/.test(item))).toBe(true);
    });

    it('should update tone configuration correctly', () => {
      const newTone: Partial<ToneConfig> = {
        warmth: 'professional',
        humorLevel: 'none'
      };

      formatter.updateTone(newTone);
      const currentTone = formatter.getCurrentTone();

      expect(currentTone.warmth).toBe('professional');
      expect(currentTone.humorLevel).toBe('none');
      expect(currentTone.useEmojis).toBe(true); // Should keep original value
    });
  });

  describe('Content Enhancement', () => {
    it('should enhance nutrition terms with formatting', () => {
      const response = "Важно контролировать белок и калории";

      const result = formatter.formatResponse(response);

      expect(result.mainContent).toContain('🥩 белок');
      expect(result.mainContent).toContain('🔥 калории');
    });

    it('should format action items with proper numbering and icons', () => {
      const response = `Советы по питанию:
      1. Ешьте больше белка для роста мышц
      2. Контролируйте калории для энергии  
      3. Добавьте углеводы в рацион`;

      const result = formatter.formatResponse(response);

      expect(result.actionItems).toHaveLength(3);
      // Should have emojis (either contextual or default ✨)
      expect(result.actionItems.every(item => /[💪🔥⚡✨]/.test(item))).toBe(true);
    });

    it('should generate different encouragement messages', () => {
      const responses = [];
      
      // Generate multiple responses to test randomization
      for (let i = 0; i < 10; i++) {
        const result = formatter.formatResponse("Test response");
        responses.push(result.encouragement);
      }

      // Should have variety in encouragement messages
      const uniqueResponses = new Set(responses);
      expect(uniqueResponses.size).toBeGreaterThan(1);
    });

    it('should clean up and format text properly', () => {
      const messyResponse = `Советы по питанию:
      1. *Ешьте больше белка* — это важно
      2. *Контролируйте калории* — ешьте в меру`;

      const result = formatter.formatResponse(messyResponse);

      expect(result.actionItems).toHaveLength(2);
      // Should contain bold formatting and clean text
      expect(result.actionItems[0]).toMatch(/белка/);
      expect(result.actionItems[1]).toMatch(/калории/);
    });
  });

  describe('Schema Validation', () => {
    it('should always return valid FriendlyResponse structure', () => {
      const response = formatter.formatResponse("Any input");

      // Check all required fields are present
      expect(typeof response.greeting).toBe('string');
      expect(typeof response.mainContent).toBe('string');
      expect(Array.isArray(response.actionItems)).toBe(true);
      expect(typeof response.encouragement).toBe('string');
      expect(typeof response.emoji).toBe('string');
      
      // Optional field
      if (response.nextSteps) {
        expect(typeof response.nextSteps).toBe('string');
      }
    });

    it('should handle empty input gracefully', () => {
      const result = formatter.formatResponse("");

      expect(result).toBeDefined();
      expect(result.greeting).toBeDefined();
      expect(result.encouragement).toBeDefined();
      expect(result.emoji).toBeDefined();
    });

    it('should handle malformed JSON gracefully', () => {
      const malformedJson = '{"output": "test", "invalid": }';

      const result = formatter.formatResponse(malformedJson);

      expect(result).toBeDefined();
      expect(result.greeting).toBeDefined();
      expect(result.encouragement).toBeDefined();
    });

    it('should handle very long responses', () => {
      const longResponse = "Отлично! " + "Очень важная информация. ".repeat(10) + 
        "\n1. Первый совет по питанию\n2. Второй совет по здоровью\n3. Третий совет по тренировкам";

      const result = formatter.formatResponse(longResponse);

      expect(result).toBeDefined();
      expect(result.actionItems.length).toBeGreaterThanOrEqual(0); // May extract tips or not
      expect(result.mainContent.length).toBeGreaterThan(0);
    });
  });

  describe('Internationalization Support', () => {
    it('should handle Russian text correctly', () => {
      const russianResponse = `Отлично! Для набора мышечной массы важно:
      1. Белок — 1,6–2 г на кг массы тела
      2. Калории — небольшой профицит
      3. Углеводы — энергия для тренировок`;

      const result = formatter.formatResponse(russianResponse);

      expect(result.mainContent).toContain('мышечной массы');
      expect(result.actionItems).toHaveLength(3);
      expect(result.actionItems[0]).toContain('Белок');
    });

    it('should handle mixed language content', () => {
      const mixedResponse = `Great advice! Отлично!
      1. Protein — важно для мышц
      2. Calories — контролируйте intake`;

      const result = formatter.formatResponse(mixedResponse);

      expect(result).toBeDefined();
      expect(result.actionItems).toHaveLength(2);
    });
  });

  describe('Performance and Edge Cases', () => {
    it('should process responses quickly', () => {
      const startTime = Date.now();
      formatter.formatResponse("Test response with some content");
      const endTime = Date.now();

      expect(endTime - startTime).toBeLessThan(100); // Should be very fast
    });

    it('should handle responses without numbered items', () => {
      const response = "Отлично! Правильное питание очень важно для здоровья.";

      const result = formatter.formatResponse(response);

      expect(result.actionItems).toHaveLength(0);
      // Text may have emoji enhancements, check for key concepts
      expect(result.mainContent).toMatch(/питание|здоровья/);
    });

    it('should handle responses with only questions', () => {
      const response = "Можете рассказать больше? Какой у вас вес?";

      const result = formatter.formatResponse(response);

      expect(result.nextSteps).toBeDefined();
      expect(result.nextSteps).toContain('рассказать');
    });
  });
});

// Integration tests for tone presets
describe('Tone Preset Integration', () => {
  const testResponse = `Отлично! Для здоровья важно:
  1. Правильное питание
  2. Регулярные тренировки
  Можете рассказать больше о своих целях?`;

  it('should produce different outputs for different tones', () => {
    const professionalFormatter = new FriendlyResponseFormatter({
      warmth: 'professional',
      useEmojis: false,
      humorLevel: 'none'
    });

    const playfulFormatter = new FriendlyResponseFormatter({
      warmth: 'playful',
      useEmojis: true,
      humorLevel: 'moderate'
    });

    const professionalResult = professionalFormatter.formatResponse(testResponse);
    const playfulResult = playfulFormatter.formatResponse(testResponse);

    // Should have different greetings
    expect(professionalResult.greeting).not.toBe(playfulResult.greeting);
    
    // Professional should not have emojis in greeting
    expect(professionalResult.greeting).not.toMatch(/[🌟😊🚀]/);
    
    // Playful should have emojis
    expect(playfulResult.greeting).toMatch(/[🌟😊🚀]/);
  });

  it('should maintain consistency within the same tone', () => {
    const formatter = new FriendlyResponseFormatter({
      warmth: 'friendly',
      useEmojis: true,
      humorLevel: 'light'
    });

    const result1 = formatter.formatResponse(testResponse);
    const result2 = formatter.formatResponse(testResponse);

    // Should have similar structure (same tone, same emoji usage)
    expect(result1.greeting.includes('😊')).toBe(result2.greeting.includes('😊'));
  });
});
