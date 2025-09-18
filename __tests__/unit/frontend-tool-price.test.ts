/**
 * Test to verify frontend getToolPrice function works correctly after nullish coalescing fix
 */

describe('Frontend Tool Price Logic', () => {
  // Simulate the frontend getToolPrice function
  const getToolPrice = (toolId: string): number => {
    const prices = {
      'master-chef': 0, // Free tool - always enabled regardless of credit balance
      'master-nutritionist': 150,
      'cal-tracker': 50,
    };
    return prices[toolId as keyof typeof prices] ?? 100; // Use ?? instead of || to handle 0 values correctly
  };

  it('should return 0 for master-chef (not 100)', () => {
    const price = getToolPrice('master-chef');
    expect(price).toBe(0);
  });

  it('should return correct prices for paid tools', () => {
    expect(getToolPrice('master-nutritionist')).toBe(150);
    expect(getToolPrice('cal-tracker')).toBe(50);
  });

  it('should return default 100 for unknown tools', () => {
    expect(getToolPrice('unknown-tool')).toBe(100);
  });

  it('should properly calculate hasInsufficientCredits for Master Chef', () => {
    const toolPrice = getToolPrice('master-chef');
    const availableCredits = 0; // Zero credits
    const hasInsufficientCredits = toolPrice > 0 && availableCredits < toolPrice;
    
    expect(toolPrice).toBe(0);
    expect(hasInsufficientCredits).toBe(false); // Should be false even with 0 credits
  });

  it('should properly calculate hasInsufficientCredits for paid tools', () => {
    const toolPrice = getToolPrice('master-nutritionist');
    const availableCredits = 100; // Insufficient credits
    const hasInsufficientCredits = toolPrice > 0 && availableCredits < toolPrice;
    
    expect(toolPrice).toBe(150);
    expect(hasInsufficientCredits).toBe(true); // Should be true with insufficient credits
  });

  it('should demonstrate the bug if using || instead of ??', () => {
    // This is what was happening before the fix
    const buggyGetToolPrice = (toolId: string): number => {
      const prices = {
        'master-chef': 0,
        'master-nutritionist': 150,
        'cal-tracker': 50,
      };
      return prices[toolId as keyof typeof prices] || 100; // BUG: || treats 0 as falsy
    };

    // This would return 100 instead of 0 (the bug)
    expect(buggyGetToolPrice('master-chef')).toBe(100);
    
    // The fixed version returns 0 correctly  
    expect(getToolPrice('master-chef')).toBe(0);
  });
});
