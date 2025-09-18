/**
 * Tests for direct file upload to N8N webhook using multipart/form-data
 */

import { N8nWebhookClient } from '@/lib/n8n-webhook';

// Mock fetch globally
global.fetch = jest.fn();

// Mock console methods
const consoleSpy = {
  log: jest.spyOn(console, 'log').mockImplementation(),
  error: jest.spyOn(console, 'error').mockImplementation(),
  warn: jest.spyOn(console, 'warn').mockImplementation(),
};

describe('N8N File Upload - Direct Webhook', () => {
  let webhookClient: N8nWebhookClient;
  const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    jest.clearAllMocks();
    webhookClient = new N8nWebhookClient();
  });

  afterAll(() => {
    Object.values(consoleSpy).forEach(spy => spy.mockRestore());
  });

  describe('Direct File Upload with multipart/form-data', () => {
    it('should send file directly to N8N webhook', async () => {
      // Create a mock File object
      const mockFile = new File(['test content'], 'test-image.jpg', { 
        type: 'image/jpeg' 
      });

      // Mock successful response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: {
          get: (key: string) => key === 'content-type' ? 'application/json' : null,
        },
        json: () => Promise.resolve({
          response: 'This is a delicious chicken and broccoli stir-fry recipe!',
          tokens: 150,
          processingTime: 2800
        }),
      } as any);

      const result = await webhookClient.sendFileToWebhook(
        mockFile,
        'master-chef',
        'Analyze this food image'
      );

      expect(result.success).toBe(true);
      expect(result.data?.response).toContain('chicken and broccoli');
      
      // Verify fetch was called with correct parameters
      expect(mockFetch).toHaveBeenCalledWith(
        'https://vanya-vasya.app.n8n.cloud/webhook/4c6c4649-99ef-4598-b77b-6cb12ab6a102',
        expect.objectContaining({
          method: 'POST',
          body: expect.any(FormData),
          signal: expect.any(AbortSignal),
          mode: 'cors',
        })
      );

      // Verify FormData was constructed correctly
      const callArgs = mockFetch.mock.calls[0];
      const formData = callArgs[1]?.body as FormData;
      expect(formData).toBeInstanceOf(FormData);

      // Verify logging
      expect(consoleSpy.log).toHaveBeenCalledWith(
        '[N8N] Sending file directly to webhook: https://vanya-vasya.app.n8n.cloud/webhook/4c6c4649-99ef-4598-b77b-6cb12ab6a102',
        expect.objectContaining({
          fileName: 'test-image.jpg',
          fileSize: 12, // 'test content'.length
          fileType: 'image/jpeg',
          toolId: 'master-chef',
        })
      );
    });

    it('should handle text response from N8N webhook', async () => {
      const mockFile = new File(['test'], 'image.png', { type: 'image/png' });

      // Mock text response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: {
          get: (key: string) => key === 'content-type' ? 'text/plain' : null,
        },
        text: () => Promise.resolve('Here is your recipe analysis!'),
      } as any);

      const result = await webhookClient.sendFileToWebhook(
        mockFile,
        'master-chef',
        'What can I make with this?'
      );

      expect(result.success).toBe(true);
      expect(result.data?.response).toBe('Here is your recipe analysis!');
    });

    it('should handle file upload timeout', async () => {
      const mockFile = new File(['large file content'], 'large-image.jpg', { 
        type: 'image/jpeg' 
      });

      const timeoutError = new Error('AbortError');
      timeoutError.name = 'AbortError';
      
      mockFetch.mockRejectedValueOnce(timeoutError);

      const result = await webhookClient.sendFileToWebhook(
        mockFile,
        'master-chef',
        'Analyze this image',
        'user123',
        5000 // 5 second timeout
      );

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('TIMEOUT_ERROR');
      expect(result.error?.message).toContain('timed out');
    });

    it('should handle upload failure with proper error codes', async () => {
      const mockFile = new File(['test'], 'image.jpg', { type: 'image/jpeg' });

      // Mock 413 Payload Too Large error
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 413,
        statusText: 'Payload Too Large',
        text: () => Promise.resolve('File too large'),
      } as any);

      const result = await webhookClient.sendFileToWebhook(
        mockFile,
        'master-chef'
      );

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('HTTP_413');
      expect(result.error?.message).toContain('Payload Too Large');
    });

    it('should retry file upload on failure', async () => {
      const mockFile = new File(['test'], 'retry-test.jpg', { type: 'image/jpeg' });

      // First attempt fails
      mockFetch.mockRejectedValueOnce(new Error('Network error'));
      
      // Second attempt succeeds
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => 'application/json' },
        json: () => Promise.resolve({ response: 'Success after retry!' }),
      } as any);

      const result = await webhookClient.sendFileToWebhookWithRetry(
        mockFile,
        'master-chef',
        'Analyze this',
        'user123',
        1 // maxRetries
      );

      expect(result.success).toBe(true);
      expect(result.data?.response).toBe('Success after retry!');
      expect(mockFetch).toHaveBeenCalledTimes(2);

      // Verify retry logging
      expect(consoleSpy.log).toHaveBeenCalledWith(
        '[N8N] File upload retry attempt 1/1 after 1000ms delay'
      );
    });

    it('should properly construct FormData with metadata', async () => {
      const mockFile = new File(['image data'], 'food.jpg', { type: 'image/jpeg' });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: { get: () => 'text/plain' },
        text: () => Promise.resolve('Analysis complete'),
      } as any);

      await webhookClient.sendFileToWebhook(
        mockFile,
        'cal-tracker',
        'Count calories in this meal',
        'user456'
      );

      const callArgs = mockFetch.mock.calls[0];
      const requestOptions = callArgs[1] as RequestInit;
      const formData = requestOptions?.body as FormData;

      expect(formData).toBeInstanceOf(FormData);
      
      // Note: We can't easily test FormData contents in Jest, but we can verify
      // that the request was made with FormData and proper headers
      expect(requestOptions.method).toBe('POST');
      expect(requestOptions.mode).toBe('cors');
      expect(requestOptions.signal).toBeInstanceOf(AbortSignal);
      
      // Content-Type header should NOT be set manually for FormData
      // Browser automatically sets it with proper boundary
      expect(requestOptions.headers).toBeUndefined();
    });

    it('should handle different file types', async () => {
      const imageTypes = [
        { file: new File([''], 'image.jpg', { type: 'image/jpeg' }), name: 'JPEG' },
        { file: new File([''], 'image.png', { type: 'image/png' }), name: 'PNG' },
        { file: new File([''], 'image.webp', { type: 'image/webp' }), name: 'WebP' },
      ];

      for (const { file, name } of imageTypes) {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          headers: { get: () => 'application/json' },
          json: () => Promise.resolve({ response: `Analyzed ${name} image` }),
        } as any);

        const result = await webhookClient.sendFileToWebhook(file, 'master-chef');
        
        expect(result.success).toBe(true);
        expect(result.data?.response).toContain(name);
      }
    });
  });
});
