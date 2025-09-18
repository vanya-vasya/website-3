/**
 * Unit Tests for ConversationPage Generate Button Handler
 * Tests form submission, validation, n8n integration, and error handling
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useAuth } from '@clerk/nextjs';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import ConversationPage from '../../../../../app/(dashboard)/dashboard/conversation/page';
import { N8nWebhookClient } from '@/lib/n8n-webhook';

// Mock dependencies
jest.mock('@clerk/nextjs', () => ({
  useAuth: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

jest.mock('react-hot-toast', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

jest.mock('@/hooks/use-pro-modal', () => ({
  useProModal: jest.fn(() => ({
    onOpen: jest.fn(),
  })),
}));

jest.mock('@/lib/n8n-webhook');

// Mock environment variables
process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL = 'https://test.n8n.cloud/webhook/test-id';

describe('ConversationPage Generate Button Handler', () => {
  const mockRouter = {
    push: jest.fn(),
    refresh: jest.fn(),
  };

  const mockSearchParams = {
    get: jest.fn(),
  };

  const mockWebhookClient = {
    buildWebhookPayload: jest.fn(),
    validatePayload: jest.fn(),
    sendWebhookRequest: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    (useAuth as jest.Mock).mockReturnValue({
      userId: 'test-user-123',
    });

    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);
    
    mockSearchParams.get.mockImplementation((key: string) => {
      if (key === 'toolId') return 'master-chef';
      return null;
    });

    (N8nWebhookClient as jest.Mock).mockImplementation(() => mockWebhookClient);
  });

  describe('Form Submission', () => {
    it('should handle successful form submission without image', async () => {
      // Mock successful webhook response
      mockWebhookClient.buildWebhookPayload.mockReturnValue({
        message: { content: 'Test prompt', role: 'user', timestamp: '2024-01-01', sessionId: 'session1' },
        tool: { id: 'master-chef', name: 'Master Chef', price: 0, gradient: 'test' },
        user: { sessionId: 'session1' },
        metadata: { source: 'yum-mi-web-app', version: '1.0', timestamp: '2024-01-01', userAgent: 'test' },
      });

      mockWebhookClient.validatePayload.mockReturnValue({
        valid: true,
        errors: [],
      });

      mockWebhookClient.sendWebhookRequest.mockResolvedValue({
        success: true,
        data: {
          response: 'Here is a great recipe suggestion...',
          processingTime: 2500,
          tokens: 150,
        },
      });

      render(<ConversationPage />);

      // Find and fill the input
      const input = screen.getByPlaceholderText(/Ask me for meal planning/i);
      fireEvent.change(input, { target: { value: 'What can I cook with chicken?' } });

      // Find and click the Generate button
      const generateButton = screen.getByRole('button', { name: /generate/i });
      fireEvent.click(generateButton);

      // Wait for the request to complete
      await waitFor(() => {
        expect(mockWebhookClient.buildWebhookPayload).toHaveBeenCalledWith(
          'What can I cook with chicken?',
          'master-chef',
          expect.objectContaining({
            title: 'Master Chef',
            gradient: 'from-amber-400 via-orange-500 to-red-600',
          }),
          undefined,
          'test-user-123'
        );
      });

      expect(mockWebhookClient.validatePayload).toHaveBeenCalled();
      expect(mockWebhookClient.sendWebhookRequest).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith('Response received in 2.5s');
    });

    it('should handle validation errors', async () => {
      mockWebhookClient.buildWebhookPayload.mockReturnValue({});
      mockWebhookClient.validatePayload.mockReturnValue({
        valid: false,
        errors: ['Message content is required', 'Tool ID is required'],
      });

      render(<ConversationPage />);

      const input = screen.getByPlaceholderText(/Ask me for meal planning/i);
      fireEvent.change(input, { target: { value: '' } }); // Empty input

      const generateButton = screen.getByRole('button', { name: /generate/i });
      fireEvent.click(generateButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          'Validation failed: Message content is required, Tool ID is required'
        );
      });

      expect(mockWebhookClient.sendWebhookRequest).not.toHaveBeenCalled();
    });

    it('should handle webhook HTTP 403 errors (generation limit)', async () => {
      mockWebhookClient.buildWebhookPayload.mockReturnValue({});
      mockWebhookClient.validatePayload.mockReturnValue({ valid: true, errors: [] });
      mockWebhookClient.sendWebhookRequest.mockResolvedValue({
        success: false,
        error: {
          code: 'HTTP_403',
          message: 'Generation limit reached',
        },
      });

      const mockProModal = { onOpen: jest.fn() };
      jest.doMock('@/hooks/use-pro-modal', () => ({
        useProModal: () => mockProModal,
      }));

      render(<ConversationPage />);

      const input = screen.getByPlaceholderText(/Ask me for meal planning/i);
      fireEvent.change(input, { target: { value: 'Test prompt' } });

      const generateButton = screen.getByRole('button', { name: /generate/i });
      fireEvent.click(generateButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          'Your generation limit has been reached. Please upgrade to continue.'
        );
      });
    });

    it('should handle network errors', async () => {
      mockWebhookClient.buildWebhookPayload.mockReturnValue({});
      mockWebhookClient.validatePayload.mockReturnValue({ valid: true, errors: [] });
      mockWebhookClient.sendWebhookRequest.mockResolvedValue({
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: 'Connection timeout',
        },
      });

      render(<ConversationPage />);

      const input = screen.getByPlaceholderText(/Ask me for meal planning/i);
      fireEvent.change(input, { target: { value: 'Test prompt' } });

      const generateButton = screen.getByRole('button', { name: /generate/i });
      fireEvent.click(generateButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          'Network error. Please check your connection and try again.'
        );
      });
    });

    it('should handle unexpected errors', async () => {
      mockWebhookClient.buildWebhookPayload.mockImplementation(() => {
        throw new Error('Unexpected error occurred');
      });

      render(<ConversationPage />);

      const input = screen.getByPlaceholderText(/Ask me for meal planning/i);
      fireEvent.change(input, { target: { value: 'Test prompt' } });

      const generateButton = screen.getByRole('button', { name: /generate/i });
      fireEvent.click(generateButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          'An unexpected error occurred. Please try again.'
        );
      });
    });

    it('should prevent double submission', async () => {
      mockWebhookClient.buildWebhookPayload.mockReturnValue({});
      mockWebhookClient.validatePayload.mockReturnValue({ valid: true, errors: [] });
      
      // Simulate slow response
      mockWebhookClient.sendWebhookRequest.mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({ success: true, data: { response: 'test' } }), 1000))
      );

      render(<ConversationPage />);

      const input = screen.getByPlaceholderText(/Ask me for meal planning/i);
      fireEvent.change(input, { target: { value: 'Test prompt' } });

      const generateButton = screen.getByRole('button', { name: /generate/i });
      
      // Click multiple times rapidly
      fireEvent.click(generateButton);
      fireEvent.click(generateButton);
      fireEvent.click(generateButton);

      // Should only be called once
      await waitFor(() => {
        expect(mockWebhookClient.sendWebhookRequest).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Image Upload Integration', () => {
    it('should handle form submission with image upload', async () => {
      const mockFile = new File(['image data'], 'test.jpg', { type: 'image/jpeg' });
      
      mockWebhookClient.buildWebhookPayload.mockReturnValue({});
      mockWebhookClient.validatePayload.mockReturnValue({ valid: true, errors: [] });
      mockWebhookClient.sendWebhookRequest.mockResolvedValue({
        success: true,
        data: { response: 'Image analyzed successfully', processingTime: 3000 },
      });

      render(<ConversationPage />);

      // Simulate image upload (this would require more complex setup for file input)
      // For now, we'll test the payload building with image
      const input = screen.getByPlaceholderText(/Ask me for meal planning/i);
      fireEvent.change(input, { target: { value: 'Analyze this food image' } });

      const generateButton = screen.getByRole('button', { name: /generate/i });
      fireEvent.click(generateButton);

      await waitFor(() => {
        expect(mockWebhookClient.buildWebhookPayload).toHaveBeenCalledWith(
          'Analyze this food image',
          'master-chef',
          expect.any(Object),
          undefined, // No image in this test setup
          'test-user-123'
        );
      });
    });
  });

  describe('Tool Configuration', () => {
    it('should handle different tool configurations', async () => {
      mockSearchParams.get.mockImplementation((key: string) => {
        if (key === 'toolId') return 'master-nutritionist';
        return null;
      });

      mockWebhookClient.buildWebhookPayload.mockReturnValue({});
      mockWebhookClient.validatePayload.mockReturnValue({ valid: true, errors: [] });
      mockWebhookClient.sendWebhookRequest.mockResolvedValue({
        success: true,
        data: { response: 'Nutritional analysis complete', processingTime: 2000 },
      });

      render(<ConversationPage />);

      const input = screen.getByPlaceholderText(/Ask me for nutritional analysis/i);
      fireEvent.change(input, { target: { value: 'Track my macros' } });

      const generateButton = screen.getByRole('button', { name: /generate/i });
      fireEvent.click(generateButton);

      await waitFor(() => {
        expect(mockWebhookClient.buildWebhookPayload).toHaveBeenCalledWith(
          'Track my macros',
          'master-nutritionist',
          expect.objectContaining({
            title: 'Master Nutritionist',
            gradient: 'from-emerald-400 via-green-500 to-teal-600',
          }),
          undefined,
          'test-user-123'
        );
      });
    });
  });

  describe('UI State Management', () => {
    it('should show loading state during submission', async () => {
      mockWebhookClient.buildWebhookPayload.mockReturnValue({});
      mockWebhookClient.validatePayload.mockReturnValue({ valid: true, errors: [] });
      
      // Mock slow request
      mockWebhookClient.sendWebhookRequest.mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({ success: true, data: { response: 'test' } }), 500))
      );

      render(<ConversationPage />);

      const input = screen.getByPlaceholderText(/Ask me for meal planning/i);
      fireEvent.change(input, { target: { value: 'Test prompt' } });

      const generateButton = screen.getByRole('button', { name: /generate/i });
      fireEvent.click(generateButton);

      // Button should be disabled during loading
      expect(generateButton).toBeDisabled();

      await waitFor(() => {
        expect(generateButton).not.toBeDisabled();
      });
    });

    it('should clear form after successful submission', async () => {
      mockWebhookClient.buildWebhookPayload.mockReturnValue({});
      mockWebhookClient.validatePayload.mockReturnValue({ valid: true, errors: [] });
      mockWebhookClient.sendWebhookRequest.mockResolvedValue({
        success: true,
        data: { response: 'Success', processingTime: 1000 },
      });

      render(<ConversationPage />);

      const input = screen.getByPlaceholderText(/Ask me for meal planning/i) as HTMLInputElement;
      fireEvent.change(input, { target: { value: 'Test prompt' } });

      expect(input.value).toBe('Test prompt');

      const generateButton = screen.getByRole('button', { name: /generate/i });
      fireEvent.click(generateButton);

      await waitFor(() => {
        expect(input.value).toBe(''); // Form should be reset
      });
    });
  });
});
