/**
 * Integration tests for Master Nutritionist conversation page
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import ConversationPage from '@/app/(dashboard)/dashboard/conversation/page';

// Mock dependencies
jest.mock('next/navigation');
jest.mock('@clerk/nextjs');
jest.mock('@/hooks/use-pro-modal');
jest.mock('react-hot-toast');
jest.mock('@/lib/n8n-webhook');

const mockPush = jest.fn();
const mockRefresh = jest.fn();
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockUseSearchParams = useSearchParams as jest.MockedFunction<typeof useSearchParams>;
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

// Mock N8N Webhook Client
const mockSendDescriptionToWebhookWithRetry = jest.fn();
jest.mock('@/lib/n8n-webhook', () => ({
  N8nWebhookClient: jest.fn().mockImplementation(() => ({
    sendDescriptionToWebhookWithRetry: mockSendDescriptionToWebhookWithRetry,
    sendFileToWebhookWithRetry: jest.fn(),
  })),
}));

// Mock useProModal hook
const mockOnOpen = jest.fn();
jest.mock('@/hooks/use-pro-modal', () => ({
  useProModal: () => ({
    onOpen: mockOnOpen,
  }),
}));

// Mock toast
jest.mock('react-hot-toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

import { toast } from 'react-hot-toast';
const mockToastSuccess = toast.success as jest.MockedFunction<typeof toast.success>;
const mockToastError = toast.error as jest.MockedFunction<typeof toast.error>;

// Mock fetch for credit balance
global.fetch = jest.fn();

describe('Master Nutritionist Conversation Page', () => {
  beforeEach(() => {
    // Setup router mock
    mockUseRouter.mockReturnValue({
      push: mockPush,
      refresh: mockRefresh,
      back: jest.fn(),
      forward: jest.fn(),
      prefetch: jest.fn(),
      replace: jest.fn(),
    } as any);

    // Setup auth mock
    mockUseAuth.mockReturnValue({
      userId: 'test-user-123',
    } as any);

    // Setup search params for Master Nutritionist
    const mockSearchParams = new Map();
    mockSearchParams.set('toolId', 'master-nutritionist');
    mockUseSearchParams.mockReturnValue({
      get: (key: string) => mockSearchParams.get(key),
    } as any);

    // Mock fetch for credit balance
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        available: 100,
        used: 20,
        remaining: 80,
      }),
    });

    // Clear all mocks
    jest.clearAllMocks();
  });

  describe('Master Nutritionist UI', () => {
    it('should render Master Nutritionist title and description', async () => {
      render(<ConversationPage />);

      await waitFor(() => {
        expect(screen.getByText('Master Nutritionist')).toBeInTheDocument();
        expect(screen.getByText(/Advanced nutritional analysis/)).toBeInTheDocument();
        expect(screen.getByText(/Price: Free/)).toBeInTheDocument();
      });
    });

    it('should show description input field instead of image upload', async () => {
      render(<ConversationPage />);

      await waitFor(() => {
        expect(screen.getByText('Enter Analysis Description')).toBeInTheDocument();
        expect(screen.getByRole('textbox')).toBeInTheDocument();
        expect(screen.queryByText('Upload Food Image')).not.toBeInTheDocument();
      });
    });

    it('should show correct placeholder text for Master Nutritionist', async () => {
      render(<ConversationPage />);

      await waitFor(() => {
        const textarea = screen.getByRole('textbox');
        expect(textarea).toHaveAttribute(
          'placeholder',
          expect.stringContaining('N8N webhook URL')
        );
      });
    });

    it('should display free pricing information', async () => {
      render(<ConversationPage />);

      await waitFor(() => {
        expect(screen.getByText(/Credits:.*Free/)).toBeInTheDocument();
      });
    });
  });

  describe('Form Validation', () => {
    it('should disable Generate button when description is empty', async () => {
      render(<ConversationPage />);

      await waitFor(() => {
        const generateButton = screen.getByRole('button', { name: /Generate/ });
        expect(generateButton).toBeDisabled();
      });
    });

    it('should enable Generate button when valid description is provided', async () => {
      render(<ConversationPage />);

      const validDescription = 'Analyze nutrition data: https://vanya-vasya.app.n8n.cloud/webhook/4c6c4649-99ef-4598-b77b-6cb12ab6a102';

      await waitFor(() => {
        const textarea = screen.getByRole('textbox');
        fireEvent.change(textarea, { target: { value: validDescription } });
      });

      await waitFor(() => {
        const generateButton = screen.getByRole('button', { name: /Generate/ });
        expect(generateButton).toBeEnabled();
      });
    });

    it('should show character count for description', async () => {
      render(<ConversationPage />);

      const description = 'Test description';

      await waitFor(() => {
        const textarea = screen.getByRole('textbox');
        fireEvent.change(textarea, { target: { value: description } });
      });

      await waitFor(() => {
        expect(screen.getByText(`${description.length}/1000 characters`)).toBeInTheDocument();
      });
    });

    it('should show helper text about N8N URL requirement', async () => {
      render(<ConversationPage />);

      await waitFor(() => {
        expect(screen.getByText('Must include the N8N webhook URL')).toBeInTheDocument();
      });
    });
  });

  describe('Free Tool Behavior', () => {
    it('should always enable Generate button regardless of credit balance', async () => {
      // Mock low credit balance
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({
          available: 0, // No credits available
          used: 100,
          remaining: 0,
        }),
      });

      render(<ConversationPage />);

      const validDescription = 'Analyze: https://vanya-vasya.app.n8n.cloud/webhook/4c6c4649-99ef-4598-b77b-6cb12ab6a102';

      await waitFor(() => {
        const textarea = screen.getByRole('textbox');
        fireEvent.change(textarea, { target: { value: validDescription } });
      });

      await waitFor(() => {
        const generateButton = screen.getByRole('button', { name: /Generate/ });
        expect(generateButton).toBeEnabled(); // Should be enabled despite 0 credits
      });
    });

    it('should show Free tool tooltip', async () => {
      render(<ConversationPage />);

      const validDescription = 'Analyze: https://vanya-vasya.app.n8n.cloud/webhook/4c6c4649-99ef-4598-b77b-6cb12ab6a102';

      await waitFor(() => {
        const textarea = screen.getByRole('textbox');
        fireEvent.change(textarea, { target: { value: validDescription } });
      });

      // Hover over the Generate button to see tooltip
      const generateButton = screen.getByRole('button', { name: /Generate/ });
      fireEvent.mouseEnter(generateButton);

      await waitFor(() => {
        expect(screen.getByText(/Free tool/)).toBeInTheDocument();
      });
    });
  });

  describe('Form Submission', () => {
    it('should call sendDescriptionToWebhookWithRetry with correct parameters', async () => {
      const mockResponse = {
        success: true,
        data: {
          response: 'Nutritional analysis complete',
          processingTime: 1500,
          tokens: 150,
        },
      };
      mockSendDescriptionToWebhookWithRetry.mockResolvedValue(mockResponse);

      render(<ConversationPage />);

      const validDescription = 'Analyze nutrition: https://vanya-vasya.app.n8n.cloud/webhook/4c6c4649-99ef-4598-b77b-6cb12ab6a102';

      await waitFor(() => {
        const textarea = screen.getByRole('textbox');
        fireEvent.change(textarea, { target: { value: validDescription } });
      });

      const generateButton = screen.getByRole('button', { name: /Generate/ });
      fireEvent.click(generateButton);

      await waitFor(() => {
        expect(mockSendDescriptionToWebhookWithRetry).toHaveBeenCalledWith(
          validDescription,
          'master-nutritionist',
          'test-user-123',
          2, // maxRetries
          45000 // timeoutMs
        );
      });
    });

    it('should display success message after successful submission', async () => {
      const mockResponse = {
        success: true,
        data: {
          response: 'Nutritional analysis complete',
          processingTime: 1500,
        },
      };
      mockSendDescriptionToWebhookWithRetry.mockResolvedValue(mockResponse);

      render(<ConversationPage />);

      const validDescription = 'Analyze: https://vanya-vasya.app.n8n.cloud/webhook/4c6c4649-99ef-4598-b77b-6cb12ab6a102';

      await waitFor(() => {
        const textarea = screen.getByRole('textbox');
        fireEvent.change(textarea, { target: { value: validDescription } });
      });

      const generateButton = screen.getByRole('button', { name: /Generate/ });
      fireEvent.click(generateButton);

      await waitFor(() => {
        expect(mockToastSuccess).toHaveBeenCalledWith(
          expect.stringContaining('1.5s')
        );
      });
    });

    it('should handle webhook errors gracefully', async () => {
      const mockResponse = {
        success: false,
        error: {
          code: 'HTTP_400',
          message: 'Bad Request',
        },
      };
      mockSendDescriptionToWebhookWithRetry.mockResolvedValue(mockResponse);

      render(<ConversationPage />);

      const validDescription = 'Analyze: https://vanya-vasya.app.n8n.cloud/webhook/4c6c4649-99ef-4598-b77b-6cb12ab6a102';

      await waitFor(() => {
        const textarea = screen.getByRole('textbox');
        fireEvent.change(textarea, { target: { value: validDescription } });
      });

      const generateButton = screen.getByRole('button', { name: /Generate/ });
      fireEvent.click(generateButton);

      await waitFor(() => {
        expect(mockToastError).toHaveBeenCalledWith(
          expect.stringContaining('Bad Request')
        );
      });
    });

    it('should clear form after successful submission', async () => {
      const mockResponse = {
        success: true,
        data: {
          response: 'Success',
          processingTime: 1000,
        },
      };
      mockSendDescriptionToWebhookWithRetry.mockResolvedValue(mockResponse);

      render(<ConversationPage />);

      const validDescription = 'Analyze: https://vanya-vasya.app.n8n.cloud/webhook/4c6c4649-99ef-4598-b77b-6cb12ab6a102';

      await waitFor(() => {
        const textarea = screen.getByRole('textbox');
        fireEvent.change(textarea, { target: { value: validDescription } });
      });

      const generateButton = screen.getByRole('button', { name: /Generate/ });
      fireEvent.click(generateButton);

      await waitFor(() => {
        const textarea = screen.getByRole('textbox');
        expect(textarea).toHaveValue(''); // Should be cleared
      });
    });
  });

  describe('Loading States', () => {
    it('should show loading state during form submission', async () => {
      // Mock a delayed response
      mockSendDescriptionToWebhookWithRetry.mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({ success: true, data: {} }), 1000))
      );

      render(<ConversationPage />);

      const validDescription = 'Analyze: https://vanya-vasya.app.n8n.cloud/webhook/4c6c4649-99ef-4598-b77b-6cb12ab6a102';

      await waitFor(() => {
        const textarea = screen.getByRole('textbox');
        fireEvent.change(textarea, { target: { value: validDescription } });
      });

      const generateButton = screen.getByRole('button', { name: /Generate/ });
      fireEvent.click(generateButton);

      // Check for loading state
      expect(screen.getByText('Analyzing...')).toBeInTheDocument();
      expect(generateButton).toBeDisabled();
    });
  });

  describe('Comparison with Other Tools', () => {
    it('should show image upload for master-chef tool', async () => {
      // Change tool to master-chef
      const mockSearchParams = new Map();
      mockSearchParams.set('toolId', 'master-chef');
      mockUseSearchParams.mockReturnValue({
        get: (key: string) => mockSearchParams.get(key),
      } as any);

      render(<ConversationPage />);

      await waitFor(() => {
        expect(screen.getByText('Upload Food Image')).toBeInTheDocument();
        expect(screen.queryByText('Enter Analysis Description')).not.toBeInTheDocument();
      });
    });
  });
});
