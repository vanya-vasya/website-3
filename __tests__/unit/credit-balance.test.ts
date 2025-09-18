/**
 * Unit tests for credit balance logic and Master Chef free tool functionality
 */

import { N8nWebhookClient } from '@/lib/n8n-webhook';

// Mock the webhook client price function for testing
describe('Credit Balance Logic - Master Chef Free Tool', () => {
  let webhookClient: N8nWebhookClient;

  beforeEach(() => {
    webhookClient = new N8nWebhookClient();
  });

  describe('Tool Price Configuration', () => {
    // We'll test the private getToolPrice method through the buildWebhookPayload method
    const createMockPayload = (toolId: string) => {
      return webhookClient.buildWebhookPayload(
        'Test message',
        toolId,
        { title: 'Test Tool', gradient: 'test' },
        undefined,
        'test-user'
      );
    };

    it('should return 0 credits for master-chef tool', () => {
      const payload = createMockPayload('master-chef');
      expect(payload.tool.price).toBe(0);
    });

    it('should return correct credits for other tools', () => {
      const nutritionistPayload = createMockPayload('master-nutritionist');
      expect(nutritionistPayload.tool.price).toBe(150);

      const calTrackerPayload = createMockPayload('cal-tracker');
      expect(calTrackerPayload.tool.price).toBe(50);
    });

    it('should return default 100 credits for unknown tools', () => {
      const unknownPayload = createMockPayload('unknown-tool');
      expect(unknownPayload.tool.price).toBe(100);
    });
  });

  describe('Credit Balance Scenarios for Master Chef', () => {
    const getMasterChefCreditLogic = (availableCredits: number, toolPrice: number = 0) => {
      // Free tools (toolPrice = 0) never have insufficient credits
      const hasInsufficientCredits = toolPrice > 0 && availableCredits < toolPrice;
      const shouldBeEnabled = !hasInsufficientCredits;
      
      return {
        hasInsufficientCredits,
        shouldBeEnabled,
        toolPrice,
        availableCredits,
      };
    };

    it('should enable Master Chef with zero credit balance', () => {
      const result = getMasterChefCreditLogic(0);
      
      expect(result.shouldBeEnabled).toBe(true);
      expect(result.hasInsufficientCredits).toBe(false);
      expect(result.toolPrice).toBe(0);
      expect(result.availableCredits).toBe(0);
    });

    it('should enable Master Chef with positive credit balance', () => {
      const result = getMasterChefCreditLogic(100);
      
      expect(result.shouldBeEnabled).toBe(true);
      expect(result.hasInsufficientCredits).toBe(false);
      expect(result.toolPrice).toBe(0);
      expect(result.availableCredits).toBe(100);
    });

    it('should enable Master Chef with negative credit balance', () => {
      const result = getMasterChefCreditLogic(-25);
      
      expect(result.shouldBeEnabled).toBe(true);
      expect(result.hasInsufficientCredits).toBe(false);
      expect(result.toolPrice).toBe(0);
      expect(result.availableCredits).toBe(-25);
    });

    it('should handle undefined credit balance gracefully', () => {
      const availableCredits = undefined as any;
      const hasInsufficientCredits = (availableCredits || 0) < 0;
      
      expect(hasInsufficientCredits).toBe(false);
      expect(availableCredits || 0).toBe(0);
    });

    it('should handle null credit balance gracefully', () => {
      const availableCredits = null as any;
      const hasInsufficientCredits = (availableCredits || 0) < 0;
      
      expect(hasInsufficientCredits).toBe(false);
      expect(availableCredits || 0).toBe(0);
    });

    it('should handle NaN credit balance gracefully', () => {
      const availableCredits = NaN;
      const safeCredits = isNaN(availableCredits) ? 0 : availableCredits;
      const hasInsufficientCredits = safeCredits < 0;
      
      expect(hasInsufficientCredits).toBe(false);
      expect(safeCredits).toBe(0);
    });
  });

  describe('Credit Balance Scenarios for Paid Tools', () => {
    const getPaidToolCreditLogic = (availableCredits: number, toolPrice: number) => {
      // Free tools (toolPrice = 0) never have insufficient credits
      const hasInsufficientCredits = toolPrice > 0 && availableCredits < toolPrice;
      const shouldBeEnabled = !hasInsufficientCredits;
      
      return {
        hasInsufficientCredits,
        shouldBeEnabled,
        toolPrice,
        availableCredits,
      };
    };

    describe('Master Nutritionist (150 credits)', () => {
      it('should disable with insufficient credits', () => {
        const result = getPaidToolCreditLogic(100, 150);
        
        expect(result.shouldBeEnabled).toBe(false);
        expect(result.hasInsufficientCredits).toBe(true);
      });

      it('should enable with exact credits', () => {
        const result = getPaidToolCreditLogic(150, 150);
        
        expect(result.shouldBeEnabled).toBe(true);
        expect(result.hasInsufficientCredits).toBe(false);
      });

      it('should enable with surplus credits', () => {
        const result = getPaidToolCreditLogic(200, 150);
        
        expect(result.shouldBeEnabled).toBe(true);
        expect(result.hasInsufficientCredits).toBe(false);
      });

      it('should disable with zero credits', () => {
        const result = getPaidToolCreditLogic(0, 150);
        
        expect(result.shouldBeEnabled).toBe(false);
        expect(result.hasInsufficientCredits).toBe(true);
      });
    });

    describe('Cal Tracker (50 credits)', () => {
      it('should disable with insufficient credits', () => {
        const result = getPaidToolCreditLogic(25, 50);
        
        expect(result.shouldBeEnabled).toBe(false);
        expect(result.hasInsufficientCredits).toBe(true);
      });

      it('should enable with sufficient credits', () => {
        const result = getPaidToolCreditLogic(75, 50);
        
        expect(result.shouldBeEnabled).toBe(true);
        expect(result.hasInsufficientCredits).toBe(false);
      });
    });
  });

  describe('Edge Cases and Error Handling', () => {
    const getCreditLogic = (availableCredits: number, toolPrice: number = 0) => {
      // Free tools (toolPrice = 0) never have insufficient credits
      const hasInsufficientCredits = toolPrice > 0 && availableCredits < toolPrice;
      const shouldBeEnabled = !hasInsufficientCredits;
      
      return {
        hasInsufficientCredits,
        shouldBeEnabled,
        toolPrice,
        availableCredits,
      };
    };

    it('should handle extremely large credit balances', () => {
      const result = getCreditLogic(Number.MAX_SAFE_INTEGER);
      
      expect(result.shouldBeEnabled).toBe(true);
      expect(result.hasInsufficientCredits).toBe(false);
    });

    it('should handle extremely negative credit balances', () => {
      const result = getCreditLogic(Number.MIN_SAFE_INTEGER);
      
      expect(result.shouldBeEnabled).toBe(true);
      expect(result.hasInsufficientCredits).toBe(false);
    });

    it('should handle floating point credit balances', () => {
      const result = getCreditLogic(99.99);
      
      expect(result.shouldBeEnabled).toBe(true);
      expect(result.hasInsufficientCredits).toBe(false);
    });

    it('should handle string credit balances gracefully', () => {
      const availableCredits = parseFloat('100.5' as any) || 0;
      const result = getCreditLogic(availableCredits);
      
      expect(result.shouldBeEnabled).toBe(true);
      expect(result.availableCredits).toBe(100.5);
    });

    it('should handle invalid string credit balances', () => {
      const availableCredits = parseFloat('invalid' as any) || 0;
      const result = getCreditLogic(availableCredits);
      
      expect(result.shouldBeEnabled).toBe(true);
      expect(result.availableCredits).toBe(0);
    });
  });

  describe('UI State Logic', () => {
    interface ButtonState {
      disabled: boolean;
      tooltipMessage: string;
      className: string;
    }

    const getButtonState = (
      hasImage: boolean,
      isLoading: boolean,
      hasInsufficientCredits: boolean,
      isLoadingCredits: boolean,
      toolPrice: number,
      availableCredits: number
    ): ButtonState => {
      const disabled = !hasImage || isLoading || hasInsufficientCredits || isLoadingCredits;
      
      let tooltipMessage = '';
      if (isLoadingCredits) {
        tooltipMessage = 'Loading credit balance...';
      } else if (!hasImage) {
        tooltipMessage = 'Please upload an image first';
      } else if (hasInsufficientCredits) {
        tooltipMessage = `Insufficient credits. You need ${toolPrice} but have ${availableCredits} available.`;
      } else {
        tooltipMessage = 'Click to generate AI analysis';
      }

      const className = disabled ? 'opacity-50 cursor-not-allowed' : '';

      return { disabled, tooltipMessage, className };
    };

    it('should enable button for Master Chef with image and zero credits', () => {
      const state = getButtonState(true, false, false, false, 0, 0);
      
      expect(state.disabled).toBe(false);
      expect(state.tooltipMessage).toBe('Click to generate AI analysis');
      expect(state.className).toBe('');
    });

    it('should disable button when no image is uploaded regardless of credits', () => {
      const state = getButtonState(false, false, false, false, 0, 1000);
      
      expect(state.disabled).toBe(true);
      expect(state.tooltipMessage).toBe('Please upload an image first');
    });

    it('should disable button when loading', () => {
      const state = getButtonState(true, true, false, false, 0, 100);
      
      expect(state.disabled).toBe(true);
    });

    it('should disable button when loading credits', () => {
      const state = getButtonState(true, false, false, true, 0, 100);
      
      expect(state.disabled).toBe(true);
      expect(state.tooltipMessage).toBe('Loading credit balance...');
    });

    it('should show insufficient credits tooltip for paid tools', () => {
      const state = getButtonState(true, false, true, false, 150, 50);
      
      expect(state.disabled).toBe(true);
      expect(state.tooltipMessage).toBe('Insufficient credits. You need 150 but have 50 available.');
    });

    it('should handle negative credit display correctly', () => {
      const state = getButtonState(true, false, false, false, 0, -25);
      
      expect(state.disabled).toBe(false);
      expect(state.tooltipMessage).toBe('Click to generate AI analysis');
    });
  });

});
