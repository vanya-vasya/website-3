/**
 * Unit Tests for N8n Webhook Integration
 * Tests payload construction, validation, API communication, and error handling
 */

import { N8nWebhookClient } from '@/lib/n8n-webhook';

// Mock fetch globally
global.fetch = jest.fn();

// Mock environment variables
const mockEnv = {
  NEXT_PUBLIC_N8N_WEBHOOK_URL: 'https://na10.app.n8n.cloud/webhook/4c6c4649-99ef-4598-b77b-6cb12ab6a102',
};

Object.defineProperty(process, 'env', {
  value: { ...process.env, ...mockEnv },
  writable: true,
});

// Mock window object for browser-specific code
Object.defineProperty(window, 'navigator', {
  value: {
    userAgent: 'Mozilla/5.0 (Test Browser)',
    language: 'en-US',
  },
  writable: true,
});

describe('N8nWebhookClient', () => {
  let client: N8nWebhookClient;
  
  beforeEach(() => {
    client = new N8nWebhookClient();
    jest.clearAllMocks();
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Constructor', () => {
    it('should initialize with correct webhook URL', () => {
      expect(client).toBeInstanceOf(N8nWebhookClient);
    });

    it('should throw error when N8N_WEBHOOK_URL is missing', () => {
      delete (process.env as any).NEXT_PUBLIC_N8N_WEBHOOK_URL;
      expect(() => new N8nWebhookClient()).toThrow('N8N_WEBHOOK_URL environment variable is required');
      
      // Restore env var
      process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL = mockEnv.NEXT_PUBLIC_N8N_WEBHOOK_URL;
    });
  });

  describe('buildWebhookPayload', () => {
    const mockToolConfig = {
      title: 'Master Chef',
      gradient: 'from-amber-400 via-orange-500 to-red-600',
    };

    it('should build correct payload without image', () => {
      const payload = client.buildWebhookPayload(
        'What can I cook with chicken?',
        'master-chef',
        mockToolConfig,
        undefined,
        'user123'
      );

      expect(payload).toMatchObject({
        message: {
          content: 'What can I cook with chicken?',
          role: 'user',
        },
        tool: {
          id: 'master-chef',
          name: 'Master Chef',
          price: 100,
          gradient: 'from-amber-400 via-orange-500 to-red-600',
        },
        user: {
          id: 'user123',
        },
        metadata: {
          source: 'yum-mi-web-app',
          version: '1.0',
          userAgent: 'Mozilla/5.0 (Test Browser)',
          locale: 'en-US',
        },
      });

      expect(payload.message.timestamp).toBeDefined();
      expect(payload.message.sessionId).toBeDefined();
      expect(payload.user.sessionId).toBeDefined();
      expect(payload.image).toBeUndefined();
    });

    it('should build correct payload with image', () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      Object.defineProperty(mockFile, 'size', { value: 1024 });

      const payload = client.buildWebhookPayload(
        'Analyze this image',
        'cal-tracker',
        mockToolConfig,
        mockFile,
        'user123'
      );

      expect(payload.image).toMatchObject({
        fileName: 'test.jpg',
        fileSize: 1024,
        fileType: 'image/jpeg',
      });

      expect(payload.tool.price).toBe(50); // cal-tracker price
    });

    it('should handle different tool IDs correctly', () => {
      const masterNutritionistPayload = client.buildWebhookPayload(
        'Track my macros',
        'master-nutritionist',
        mockToolConfig
      );

      expect(masterNutritionistPayload.tool.price).toBe(150);
    });
  });

  describe('validatePayload', () => {
    const validPayload = {
      message: {
        content: 'Test message',
        role: 'user' as const,
        timestamp: '2024-01-01T00:00:00.000Z',
        sessionId: 'session_123',
      },
      tool: {
        id: 'master-chef',
        name: 'Master Chef',
        price: 100,
        gradient: 'test-gradient',
      },
      user: {
        sessionId: 'session_123',
      },
      metadata: {
        source: 'yum-mi-web-app',
        version: '1.0',
        timestamp: '2024-01-01T00:00:00.000Z',
        userAgent: 'test',
      },
    };

    it('should validate correct payload', () => {
      const result = client.validatePayload(validPayload);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject payload with empty message content', () => {
      const invalidPayload = { ...validPayload, message: { ...validPayload.message, content: '' } };
      const result = client.validatePayload(invalidPayload);
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Message content is required');
    });

    it('should reject payload with missing tool ID', () => {
      const invalidPayload = { ...validPayload, tool: { ...validPayload.tool, id: '' } };
      const result = client.validatePayload(invalidPayload);
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Tool ID is required');
    });

    it('should reject payload with missing session ID', () => {
      const invalidPayload = { ...validPayload, user: { sessionId: '' } };
      const result = client.validatePayload(invalidPayload);
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Session ID is required');
    });

    it('should reject payload with oversized image', () => {
      const payloadWithLargeImage = {
        ...validPayload,
        image: {
          fileName: 'large.jpg',
          fileSize: 11 * 1024 * 1024, // 11MB
          fileType: 'image/jpeg',
        },
      };
      const result = client.validatePayload(payloadWithLargeImage);
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Image size must be less than 10MB');
    });

    it('should reject payload with non-image file', () => {
      const payloadWithNonImage = {
        ...validPayload,
        image: {
          fileName: 'document.pdf',
          fileSize: 1024,
          fileType: 'application/pdf',
        },
      };
      const result = client.validatePayload(payloadWithNonImage);
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('File must be an image');
    });
  });

  describe('sendWebhookRequest', () => {
    const mockPayload = {
      message: {
        content: 'Test message',
        role: 'user' as const,
        timestamp: '2024-01-01T00:00:00.000Z',
        sessionId: 'session_123',
      },
      tool: {
        id: 'master-chef',
        name: 'Master Chef',
        price: 100,
        gradient: 'test-gradient',
      },
      user: {
        sessionId: 'session_123',
      },
      metadata: {
        source: 'yum-mi-web-app',
        version: '1.0',
        timestamp: '2024-01-01T00:00:00.000Z',
        userAgent: 'test',
      },
    };

    it('should handle successful webhook response', async () => {
      const mockResponse = {
        response: 'Here is a great recipe for chicken...',
        tokens: 150,
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await client.sendWebhookRequest(mockPayload);

      expect(result.success).toBe(true);
      expect(result.data?.response).toBe(mockResponse.response);
      expect(result.data?.tokens).toBe(mockResponse.tokens);
      expect(result.data?.processingTime).toBeGreaterThan(0);
    });

    it('should handle HTTP error responses', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        text: async () => 'Webhook not found',
      });

      const result = await client.sendWebhookRequest(mockPayload);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('HTTP_404');
      expect(result.error?.message).toBe('Webhook request failed: Not Found');
      expect(result.error?.details?.status).toBe(404);
    });

    it('should handle network errors', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network timeout'));

      const result = await client.sendWebhookRequest(mockPayload);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('NETWORK_ERROR');
      expect(result.error?.message).toBe('Network timeout');
    });

    it('should send correct headers and payload', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ response: 'test' }),
      });

      await client.sendWebhookRequest(mockPayload);

      expect(fetch).toHaveBeenCalledWith(
        mockEnv.NEXT_PUBLIC_N8N_WEBHOOK_URL,
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'YumMi-WebApp/1.0',
            'X-Request-Source': 'yum-mi-frontend',
          },
          body: JSON.stringify(mockPayload),
        })
      );
    });

    it('should log requests and responses appropriately', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ response: 'test response' }),
      });

      await client.sendWebhookRequest(mockPayload);

      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('[N8N] Sending request to webhook'),
        expect.objectContaining({
          toolId: 'master-chef',
          messageLength: 12,
          hasImage: false,
        })
      );

      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('[N8N] Webhook request successful'),
        expect.objectContaining({
          processingTime: expect.any(Number),
          responseSize: expect.any(Number),
        })
      );
    });
  });

  describe('Integration Tests', () => {
    it('should handle complete workflow: build -> validate -> send', async () => {
      const mockToolConfig = {
        title: 'Master Chef',
        gradient: 'from-amber-400 via-orange-500 to-red-600',
      };

      // Build payload
      const payload = client.buildWebhookPayload(
        'What can I cook with chicken and rice?',
        'master-chef',
        mockToolConfig,
        undefined,
        'user123'
      );

      // Validate payload
      const validation = client.validatePayload(payload);
      expect(validation.valid).toBe(true);

      // Mock successful response
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          response: 'Here are some delicious chicken and rice recipes...',
          tokens: 200,
        }),
      });

      // Send request
      const result = await client.sendWebhookRequest(payload);

      expect(result.success).toBe(true);
      expect(result.data?.response).toContain('chicken and rice recipes');
      expect(result.data?.tokens).toBe(200);
    });

    it('should handle workflow with image upload', async () => {
      const mockFile = new File(['image data'], 'chicken.jpg', { type: 'image/jpeg' });
      Object.defineProperty(mockFile, 'size', { value: 2048 });

      const mockToolConfig = { title: 'Cal Tracker', gradient: 'test' };

      const payload = client.buildWebhookPayload(
        'How many calories are in this meal?',
        'cal-tracker',
        mockToolConfig,
        mockFile,
        'user123'
      );

      const validation = client.validatePayload(payload);
      expect(validation.valid).toBe(true);
      expect(payload.image?.fileName).toBe('chicken.jpg');
      expect(payload.image?.fileType).toBe('image/jpeg');
    });
  });

  describe('NA10 Endpoint Tests', () => {
    const mockPayload = {
      message: {
        content: 'Analyze this food image and provide recipe suggestions.',
        role: 'user' as const,
        timestamp: '2024-01-01T00:00:00.000Z',
        sessionId: 'session_123',
      },
      tool: {
        id: 'master-chef',
        name: 'Master Chef',
        price: 100,
        gradient: 'test-gradient',
      },
      user: {
        sessionId: 'session_123',
      },
      image: {
        fileName: 'food.jpg',
        fileSize: 2048,
        fileType: 'image/jpeg',
      },
      metadata: {
        source: 'yum-mi-web-app',
        version: '1.0',
        timestamp: '2024-01-01T00:00:00.000Z',
        userAgent: 'test',
      },
    };

    it('should successfully POST to NA10 endpoint', async () => {
      const mockResponse = {
        response: 'Based on your image, I can see delicious ingredients! Here are some recipe suggestions: 1. Grilled Chicken with vegetables...',
        tokens: 200,
        processingTime: 1500,
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await client.sendWebhookRequest(mockPayload);

      expect(result.success).toBe(true);
      expect(result.data?.response).toBe(mockResponse.response);
      expect(result.data?.tokens).toBe(mockResponse.tokens);
      expect(result.data?.processingTime).toBeGreaterThan(0);
      
      // Verify the correct NA10 URL is called
      expect(fetch).toHaveBeenCalledWith(
        'https://na10.app.n8n.cloud/webhook/4c6c4649-99ef-4598-b77b-6cb12ab6a102',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'YumMi-WebApp/1.0',
            'X-Request-Source': 'yum-mi-frontend',
          },
          body: JSON.stringify(mockPayload),
        })
      );
    });

    it('should handle NA10 endpoint error responses', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        text: async () => 'NA10 service temporarily unavailable',
      });

      const result = await client.sendWebhookRequest(mockPayload);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('HTTP_500');
      expect(result.error?.message).toBe('Webhook request failed: Internal Server Error');
      expect(result.error?.details?.status).toBe(500);
      expect(result.error?.details?.response).toBe('NA10 service temporarily unavailable');
    });

    it('should handle NA10 endpoint network timeouts', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Request timeout'));

      const result = await client.sendWebhookRequest(mockPayload);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('NETWORK_ERROR');
      expect(result.error?.message).toBe('Request timeout');
      expect(result.error?.details?.processingTime).toBeGreaterThan(0);
    });

    it('should handle NA10 endpoint rate limiting', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 429,
        statusText: 'Too Many Requests',
        text: async () => 'Rate limit exceeded for NA10 endpoint',
      });

      const result = await client.sendWebhookRequest(mockPayload);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('HTTP_429');
      expect(result.error?.message).toBe('Webhook request failed: Too Many Requests');
      expect(result.error?.details?.status).toBe(429);
    });
  });
});
