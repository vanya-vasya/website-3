/**
 * Tests for /api/generate endpoint configuration and error handling
 */

import { POST } from '@/app/api/generate/route';
import { NextRequest } from 'next/server';

// Mock environment variables
const originalEnv = process.env;

describe('/api/generate endpoint', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.clearAllMocks();
  });

  describe('Environment Configuration', () => {
    it('should return error when N8N_WEBHOOK_URL is not configured', async () => {
      // Remove webhook URL from environment
      delete process.env.N8N_WEBHOOK_URL;
      delete process.env.WEBHOOK_URL;

      const req = new NextRequest('http://localhost:3000/api/generate', {
        method: 'POST',
        body: JSON.stringify({ test: 'data' }),
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Webhook URL not configured');
    });

    it('should use N8N_WEBHOOK_URL when available', async () => {
      process.env.N8N_WEBHOOK_URL = 'https://test-n8n.app.n8n.cloud/webhook/test-id';

      // Mock fetch to verify the correct URL is used
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: () => Promise.resolve('Success response'),
        headers: {
          get: (key: string) => key === 'content-type' ? 'text/plain' : null,
        },
      });

      const req = new NextRequest('http://localhost:3000/api/generate', {
        method: 'POST',
        body: JSON.stringify({ test: 'data' }),
      });

      const response = await POST(req);

      expect(global.fetch).toHaveBeenCalledWith(
        'https://test-n8n.app.n8n.cloud/webhook/test-id',
        expect.objectContaining({
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ test: 'data' }),
          signal: expect.any(AbortSignal),
        })
      );

      expect(response.status).toBe(200);
    });

    it('should fallback to WEBHOOK_URL when N8N_WEBHOOK_URL is not set', async () => {
      delete process.env.N8N_WEBHOOK_URL;
      process.env.WEBHOOK_URL = 'https://fallback-webhook.com/test';

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: () => Promise.resolve('Success response'),
        headers: {
          get: (key: string) => key === 'content-type' ? 'text/plain' : null,
        },
      });

      const req = new NextRequest('http://localhost:3000/api/generate', {
        method: 'POST',
        body: JSON.stringify({ test: 'data' }),
      });

      await POST(req);

      expect(global.fetch).toHaveBeenCalledWith(
        'https://fallback-webhook.com/test',
        expect.any(Object)
      );
    });
  });

  describe('Request Handling', () => {
    beforeEach(() => {
      process.env.N8N_WEBHOOK_URL = 'https://test-n8n.app.n8n.cloud/webhook/test-id';
    });

    it('should handle malformed JSON gracefully', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: () => Promise.resolve('Success response'),
        headers: {
          get: (key: string) => key === 'content-type' ? 'text/plain' : null,
        },
      });

      // Create request with malformed JSON
      const req = new NextRequest('http://localhost:3000/api/generate', {
        method: 'POST',
        body: '{ invalid json }',
      });

      const response = await POST(req);

      // Should still proceed with empty object as payload
      expect(global.fetch).toHaveBeenCalledWith(
        'https://test-n8n.app.n8n.cloud/webhook/test-id',
        expect.objectContaining({
          body: JSON.stringify({}),
        })
      );

      expect(response.status).toBe(200);
    });

    it('should apply 30-second timeout to upstream requests', async () => {
      let abortSignal: AbortSignal | undefined;

      global.fetch = jest.fn().mockImplementation((url, options) => {
        abortSignal = options?.signal as AbortSignal;
        return Promise.resolve({
          ok: true,
          status: 200,
          text: () => Promise.resolve('Success response'),
          headers: {
            get: (key: string) => key === 'content-type' ? 'text/plain' : null,
          },
        });
      });

      const req = new NextRequest('http://localhost:3000/api/generate', {
        method: 'POST',
        body: JSON.stringify({ test: 'data' }),
      });

      await POST(req);

      expect(abortSignal).toBeDefined();
      expect(abortSignal?.aborted).toBe(false);
    });

    it('should handle upstream timeout correctly', async () => {
      const abortError = new Error('AbortError');
      abortError.name = 'AbortError';

      global.fetch = jest.fn().mockRejectedValue(abortError);

      const req = new NextRequest('http://localhost:3000/api/generate', {
        method: 'POST',
        body: JSON.stringify({ test: 'data' }),
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(504);
      expect(data.error).toBe('Request timeout');
    });

    it('should handle upstream connection failure', async () => {
      const connectionError = new Error('ENOTFOUND');
      global.fetch = jest.fn().mockRejectedValue(connectionError);

      const req = new NextRequest('http://localhost:3000/api/generate', {
        method: 'POST',
        body: JSON.stringify({ test: 'data' }),
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(502);
      expect(data.error).toBe('Upstream n8n call failed');
    });
  });

  describe('Response Handling', () => {
    beforeEach(() => {
      process.env.N8N_WEBHOOK_URL = 'https://test-n8n.app.n8n.cloud/webhook/test-id';
    });

    it('should preserve upstream status codes', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 403,
        text: () => Promise.resolve('Forbidden'),
        headers: {
          get: (key: string) => key === 'content-type' ? 'text/plain' : null,
        },
      });

      const req = new NextRequest('http://localhost:3000/api/generate', {
        method: 'POST',
        body: JSON.stringify({ test: 'data' }),
      });

      const response = await POST(req);
      const responseText = await response.text();

      expect(response.status).toBe(403);
      expect(responseText).toBe('Forbidden');
    });

    it('should preserve upstream content-type headers', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: () => Promise.resolve('{"response": "json data"}'),
        headers: {
          get: (key: string) => key === 'content-type' ? 'application/json' : null,
        },
      });

      const req = new NextRequest('http://localhost:3000/api/generate', {
        method: 'POST',
        body: JSON.stringify({ test: 'data' }),
      });

      const response = await POST(req);

      expect(response.headers.get('content-type')).toBe('application/json');
    });

    it('should log detailed request and response information', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: () => Promise.resolve('Success response'),
        headers: {
          get: (key: string) => key === 'content-type' ? 'text/plain' : null,
        },
      });

      const req = new NextRequest('http://localhost:3000/api/generate', {
        method: 'POST',
        body: JSON.stringify({
          tool: { id: 'test-tool' },
          message: { content: 'test message' },
          image: 'base64-data'
        }),
      });

      await POST(req);

      expect(consoleSpy).toHaveBeenCalledWith(
        '[API] Proxying request to N8N webhook: https://test-n8n.app.n8n.cloud/webhook/test-id',
        expect.objectContaining({
          toolId: 'test-tool',
          messageLength: 12, // 'test message'.length
          hasImage: true,
        })
      );

      expect(consoleSpy).toHaveBeenCalledWith(
        '[API] N8N webhook response:',
        expect.objectContaining({
          status: 200,
          processingTime: expect.any(Number),
          responseSize: 16, // 'Success response'.length
        })
      );

      consoleSpy.mockRestore();
    });
  });
});
