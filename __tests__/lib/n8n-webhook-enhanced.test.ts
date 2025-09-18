/**
 * Enhanced tests for N8nWebhookClient with improved error handling and retry logic
 */

import { N8nWebhookClient } from '@/lib/n8n-webhook';

// Mock fetch globally
global.fetch = jest.fn();

// Mock console methods to avoid noise in tests
const consoleSpy = {
  log: jest.spyOn(console, 'log').mockImplementation(),
  error: jest.spyOn(console, 'error').mockImplementation(),
  warn: jest.spyOn(console, 'warn').mockImplementation(),
};

describe('N8nWebhookClient Enhanced Error Handling', () => {
  let webhookClient: N8nWebhookClient;
  const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    jest.clearAllMocks();
    webhookClient = new N8nWebhookClient();
  });

  afterAll(() => {
    Object.values(consoleSpy).forEach(spy => spy.mockRestore());
  });

  describe('Response Format Handling', () => {
    const mockPayload = {
      message: {
        content: 'Test message',
        role: 'user' as const,
        timestamp: '2024-01-01T00:00:00.000Z',
        sessionId: 'test-session',
      },
      tool: {
        id: 'master-chef',
        name: 'Master Chef',
        price: 100,
        gradient: 'test-gradient',
      },
      user: {
        id: 'test-user',
        sessionId: 'test-session',
      },
      metadata: {
        source: 'yum-mi-web-app',
        version: '1.0',
        timestamp: '2024-01-01T00:00:00.000Z',
        userAgent: 'test-agent',
        locale: 'en-US',
      },
    };

    it('should handle JSON response correctly', async () => {
      const mockResponseData = {
        response: 'Test AI response',
        tokens: 150,
        processingTime: 2500
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: {
          get: (key: string) => key === 'content-type' ? 'application/json' : null,
        },
        json: () => Promise.resolve(mockResponseData),
      } as any);

      const result = await webhookClient.sendWebhookRequest(mockPayload);

      expect(result.success).toBe(true);
      expect(result.data?.response).toBe('Test AI response');
      expect(result.data?.tokens).toBe(150);
      expect(consoleSpy.log).toHaveBeenCalledWith(
        '[N8N] API request successful (JSON):',
        expect.objectContaining({
          processingTime: expect.any(Number),
          responseSize: expect.any(Number),
          contentType: 'application/json',
        })
      );
    });

    it('should handle plain text response correctly', async () => {
      const mockTextResponse = 'This is a plain text AI response';

      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: {
          get: (key: string) => key === 'content-type' ? 'text/plain' : null,
        },
        text: () => Promise.resolve(mockTextResponse),
      } as any);

      const result = await webhookClient.sendWebhookRequest(mockPayload);

      expect(result.success).toBe(true);
      expect(result.data?.response).toBe(mockTextResponse);
      expect(consoleSpy.log).toHaveBeenCalledWith(
        '[N8N] API request successful (text):',
        expect.objectContaining({
          processingTime: expect.any(Number),
          responseSize: mockTextResponse.length,
          contentType: 'text/plain',
        })
      );
    });

    it('should handle invalid JSON by falling back to text', async () => {
      const mockTextResponse = 'Invalid JSON response that will be parsed as text';

      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: {
          get: (key: string) => key === 'content-type' ? 'application/json' : null,
        },
        json: () => Promise.reject(new Error('The string did not match the expected pattern.')),
        text: () => Promise.resolve(mockTextResponse),
      } as any);

      const result = await webhookClient.sendWebhookRequest(mockPayload);

      expect(result.success).toBe(true);
      expect(result.data?.response).toBe(mockTextResponse);
      expect(consoleSpy.warn).toHaveBeenCalledWith(
        '[N8N] JSON parsing failed, falling back to text:',
        expect.objectContaining({
          error: 'The string did not match the expected pattern.',
          contentType: 'application/json',
        })
      );
    });
  });

  describe('Enhanced Error Handling', () => {
    const mockPayload = {
      message: {
        content: 'Test message',
        role: 'user' as const,
        timestamp: '2024-01-01T00:00:00.000Z',
        sessionId: 'test-session',
      },
      tool: {
        id: 'master-chef',
        name: 'Master Chef',
        price: 100,
        gradient: 'test-gradient',
      },
      user: {
        id: 'test-user',
        sessionId: 'test-session',
      },
      metadata: {
        source: 'yum-mi-web-app',
        version: '1.0',
        timestamp: '2024-01-01T00:00:00.000Z',
        userAgent: 'test-agent',
        locale: 'en-US',
      },
    };

    it('should categorize connection errors correctly', async () => {
      const connectionError = new TypeError('fetch failed');

      mockFetch.mockRejectedValueOnce(connectionError);

      const result = await webhookClient.sendWebhookRequest(mockPayload);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('CONNECTION_ERROR');
      expect(result.error?.message).toBe('Unable to connect to the server. Please check your internet connection.');
      expect(consoleSpy.error).toHaveBeenCalledWith(
        '[N8N] Webhook request error:',
        expect.objectContaining({
          error: 'fetch failed',
          errorName: 'TypeError',
          processingTime: expect.any(Number),
          requestUrl: '/api/generate',
        })
      );
    });

    it('should handle timeout errors correctly', async () => {
      const timeoutError = new Error('AbortError');
      timeoutError.name = 'AbortError';

      mockFetch.mockRejectedValueOnce(timeoutError);

      const result = await webhookClient.sendWebhookRequest(mockPayload);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('TIMEOUT_ERROR');
      expect(result.error?.message).toBe('Request timed out. The server may be busy, please try again.');
    });

    it('should handle JSON parsing errors correctly', async () => {
      const jsonError = new Error('Unexpected token in JSON');
      jsonError.name = 'SyntaxError';

      mockFetch.mockRejectedValueOnce(jsonError);

      const result = await webhookClient.sendWebhookRequest(mockPayload);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('RESPONSE_FORMAT_ERROR');
      expect(result.error?.message).toBe('Server returned an unexpected response format.');
    });
  });

  describe('Retry Logic', () => {
    const mockPayload = {
      message: {
        content: 'Test message',
        role: 'user' as const,
        timestamp: '2024-01-01T00:00:00.000Z',
        sessionId: 'test-session',
      },
      tool: {
        id: 'master-chef',
        name: 'Master Chef',
        price: 100,
        gradient: 'test-gradient',
      },
      user: {
        id: 'test-user',
        sessionId: 'test-session',
      },
      metadata: {
        source: 'yum-mi-web-app',
        version: '1.0',
        timestamp: '2024-01-01T00:00:00.000Z',
        userAgent: 'test-agent',
        locale: 'en-US',
      },
    };

    it('should succeed on first attempt when request is successful', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => 'application/json' },
        json: () => Promise.resolve({ response: 'Success' }),
      } as any);

      const result = await webhookClient.sendWebhookRequestWithRetry(mockPayload, 2, 30000);

      expect(result.success).toBe(true);
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(consoleSpy.log).not.toHaveBeenCalledWith(
        expect.stringMatching(/Retry attempt/)
      );
    });

    it('should retry on failure and succeed on second attempt', async () => {
      // First attempt fails
      mockFetch.mockRejectedValueOnce(new Error('Network error'));
      
      // Second attempt succeeds
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => 'application/json' },
        json: () => Promise.resolve({ response: 'Success after retry' }),
      } as any);

      const result = await webhookClient.sendWebhookRequestWithRetry(mockPayload, 2, 30000);

      expect(result.success).toBe(true);
      expect(result.data?.response).toBe('Success after retry');
      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(consoleSpy.log).toHaveBeenCalledWith(
        '[N8N] Retry attempt 1/2 after 1000ms delay'
      );
    });

    it('should fail after max retries exceeded', async () => {
      // All attempts fail
      mockFetch.mockRejectedValue(new Error('Persistent network error'));

      const result = await webhookClient.sendWebhookRequestWithRetry(mockPayload, 2, 30000);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('NETWORK_ERROR');
      expect(mockFetch).toHaveBeenCalledTimes(3); // Initial + 2 retries
      expect(consoleSpy.error).toHaveBeenCalledWith(
        '[N8N] All retry attempts failed:',
        expect.objectContaining({
          attempts: 3,
          finalError: 'Persistent network error',
        })
      );
    });

    it('should implement exponential backoff between retries', async () => {
      const startTime = Date.now();
      
      // All attempts fail
      mockFetch.mockRejectedValue(new Error('Network error'));

      await webhookClient.sendWebhookRequestWithRetry(mockPayload, 2, 30000);

      const endTime = Date.now();
      const totalTime = endTime - startTime;

      // Should have waited at least 1000ms (first retry) + 2000ms (second retry) = 3000ms
      // Adding some tolerance for test execution time
      expect(totalTime).toBeGreaterThanOrEqual(2900); // 100ms tolerance
      expect(consoleSpy.log).toHaveBeenCalledWith('[N8N] Retry attempt 1/2 after 1000ms delay');
      expect(consoleSpy.log).toHaveBeenCalledWith('[N8N] Retry attempt 2/2 after 2000ms delay');
    });
  });

  describe('Timeout Handling', () => {
    it('should apply custom timeout to requests', async () => {
      const mockPayload = {
        message: {
          content: 'Test message',
          role: 'user' as const,
          timestamp: '2024-01-01T00:00:00.000Z',
          sessionId: 'test-session',
        },
        tool: {
          id: 'master-chef',
          name: 'Master Chef',
          price: 100,
          gradient: 'test-gradient',
        },
        user: {
          id: 'test-user',
          sessionId: 'test-session',
        },
        metadata: {
          source: 'yum-mi-web-app',
          version: '1.0',
          timestamp: '2024-01-01T00:00:00.000Z',
          userAgent: 'test-agent',
          locale: 'en-US',
        },
      };

      mockFetch.mockImplementationOnce(async (url, options) => {
        // Verify that AbortController signal is passed
        expect(options?.signal).toBeInstanceOf(AbortSignal);
        
        return {
          ok: true,
          headers: { get: () => 'application/json' },
          json: () => Promise.resolve({ response: 'Success' }),
        } as any;
      });

      await webhookClient.sendWebhookRequest(mockPayload, 10000);

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/generate',
        expect.objectContaining({
          signal: expect.any(AbortSignal),
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'X-Request-ID': expect.stringMatching(/^req_\d+_[a-z0-9]+$/),
          }),
        })
      );
      
      expect(consoleSpy.log).toHaveBeenCalledWith(
        '[N8N] Sending request to API proxy: /api/generate',
        expect.objectContaining({
          timeout: 10000,
          timestamp: expect.any(String),
        })
      );
    });
  });
});
