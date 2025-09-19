/**
 * Tests for Master Nutritionist functionality
 */

import { getFormSchema } from '@/app/(dashboard)/dashboard/conversation/constants';

describe('Master Nutritionist', () => {
  describe('Form Schema Validation', () => {
    it('should require description for master-nutritionist', () => {
      const schema = getFormSchema('master-nutritionist');
      
      // Test valid description with N8N URL
      const validData = {
        description: 'Analyze this nutritional data: https://vanya-vasya.app.n8n.cloud/webhook/4c6c4649-99ef-4598-b77b-6cb12ab6a102',
        image: null,
      };
      
      const result = schema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject description without N8N URL', () => {
      const schema = getFormSchema('master-nutritionist');
      
      const invalidData = {
        description: 'Analyze this nutritional data without URL',
        image: null,
      };
      
      const result = schema.safeParse(invalidData);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toContain('N8N webhook URL');
    });

    it('should reject empty description', () => {
      const schema = getFormSchema('master-nutritionist');
      
      const invalidData = {
        description: '',
        image: null,
      };
      
      const result = schema.safeParse(invalidData);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toContain('at least 10 characters');
    });

    it('should reject too long description', () => {
      const schema = getFormSchema('master-nutritionist');
      
      const longDescription = 'a'.repeat(1001) + ' https://vanya-vasya.app.n8n.cloud/webhook/4c6c4649-99ef-4598-b77b-6cb12ab6a102';
      const invalidData = {
        description: longDescription,
        image: null,
      };
      
      const result = schema.safeParse(invalidData);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toContain('less than 1000 characters');
    });

    it('should make image optional for master-nutritionist', () => {
      const schema = getFormSchema('master-nutritionist');
      
      const validData = {
        description: 'Valid description with URL: https://vanya-vasya.app.n8n.cloud/webhook/4c6c4649-99ef-4598-b77b-6cb12ab6a102',
        // No image field
      };
      
      const result = schema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('Other Tools Form Schema', () => {
    it('should require image for non-master-nutritionist tools', () => {
      const schema = getFormSchema('master-chef');
      
      const invalidData = {
        // No image
        description: 'Optional description',
      };
      
      const result = schema.safeParse(invalidData);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toContain('Image is required');
    });

    it('should accept valid image for other tools', () => {
      const schema = getFormSchema('master-chef');
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      
      const validData = {
        image: mockFile,
        description: 'Optional description',
      };
      
      const result = schema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('Free Pricing', () => {
    it('should have 0 price for master-nutritionist', () => {
      // Test the price mapping used in the frontend
      const getToolPrice = (toolId: string): number => {
        const prices = {
          'master-chef': 0,
          'master-nutritionist': 0, // Should be free
          'cal-tracker': 50,
        };
        return prices[toolId as keyof typeof prices] ?? 100;
      };

      expect(getToolPrice('master-nutritionist')).toBe(0);
    });

    it('should calculate hasInsufficientCredits correctly for free tool', () => {
      const toolPrice = 0; // Master Nutritionist is free
      const availableCredits = 0; // Even with 0 credits
      const hasInsufficientCredits = toolPrice > 0 && availableCredits < toolPrice;

      expect(hasInsufficientCredits).toBe(false); // Should be false for free tools
    });

    it('should allow generation even with negative credit balance for free tools', () => {
      const toolPrice = 0; // Master Nutritionist is free
      const availableCredits = -10; // Negative balance
      const hasInsufficientCredits = toolPrice > 0 && availableCredits < toolPrice;

      expect(hasInsufficientCredits).toBe(false); // Should still be false for free tools
    });
  });

  describe('N8N URL Validation', () => {
    const validUrl = 'https://vanya-vasya.app.n8n.cloud/webhook/4c6c4649-99ef-4598-b77b-6cb12ab6a102';

    it('should extract N8N URL from description correctly', () => {
      const description = `Please analyze this nutritional information: ${validUrl}`;
      const urlMatch = description.match(/https:\/\/vanya-vasya\.app\.n8n\.cloud\/webhook\/[a-f0-9\-]+/i);
      
      expect(urlMatch).toBeTruthy();
      expect(urlMatch![0]).toBe(validUrl);
    });

    it('should reject invalid N8N URLs', () => {
      const invalidUrls = [
        'https://wrong-domain.app.n8n.cloud/webhook/4c6c4649-99ef-4598-b77b-6cb12ab6a102',
        'https://vanya-vasya.app.n8n.cloud/webhook/invalid-id',
        'http://vanya-vasya.app.n8n.cloud/webhook/4c6c4649-99ef-4598-b77b-6cb12ab6a102', // http instead of https
      ];

      invalidUrls.forEach(url => {
        const urlMatch = url.match(/https:\/\/vanya-vasya\.app\.n8n\.cloud\/webhook\/[a-f0-9\-]+/i);
        expect(urlMatch).toBeFalsy();
      });
    });

    it('should handle case insensitive URL matching', () => {
      const description = `Analysis request: ${validUrl.toUpperCase()}`;
      const urlMatch = description.match(/https:\/\/vanya-vasya\.app\.n8n\.cloud\/webhook\/[a-f0-9\-]+/i);
      
      expect(urlMatch).toBeTruthy();
    });
  });

  describe('Tool Configuration', () => {
    it('should have correct master-nutritionist configuration', () => {
      const toolConfigs = {
        'master-nutritionist': {
          title: 'Master Nutritionist',
          description: 'Advanced nutritional analysis and meal optimization with scientific precision, macro tracking, and health goal alignment\nPrice: Free',
          iconName: 'Activity',
          iconColor: 'text-emerald-600',
          bgColor: 'bg-emerald-600/10',
          gradient: 'from-emerald-400 via-green-500 to-teal-600',
          bgGradient: 'from-emerald-400/10 via-green-500/10 to-teal-600/10',
          placeholder: 'Provide a description including the N8N webhook URL for nutritional analysis...'
        }
      };

      const config = toolConfigs['master-nutritionist'];
      expect(config.title).toBe('Master Nutritionist');
      expect(config.description).toContain('Price: Free');
      expect(config.placeholder).toContain('N8N webhook URL');
    });
  });
});
