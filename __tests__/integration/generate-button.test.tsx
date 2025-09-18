/**
 * Integration tests for Generate button functionality
 * Tests both success and failure scenarios with credit balance checking
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useAuth } from '@clerk/nextjs';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

import ConversationPage from '@/app/(dashboard)/dashboard/conversation/page';
import { N8nWebhookClient } from '@/lib/n8n-webhook';

// Mock dependencies
jest.mock('@clerk/nextjs');
jest.mock('react-hot-toast');
jest.mock('next/navigation');
jest.mock('@/lib/n8n-webhook');
jest.mock('@/hooks/use-pro-modal');

// Mock fetch for API calls
global.fetch = jest.fn();

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockToast = toast as jest.MockedFunction<typeof toast>;
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const MockedN8nWebhookClient = N8nWebhookClient as jest.MockedClass<typeof N8nWebhookClient>;

describe('Generate Button Integration Tests', () => {
  const mockPush = jest.fn();
  const mockRefresh = jest.fn();
  const mockProModalOnOpen = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockUseAuth.mockReturnValue({
      userId: 'test-user-123',
      isLoaded: true,
    } as any);
    
    mockUseRouter.mockReturnValue({
      push: mockPush,
      refresh: mockRefresh,
    } as any);

    // Mock pro modal
    jest.doMock('@/hooks/use-pro-modal', () => ({
      useProModal: () => ({
        onOpen: mockProModalOnOpen,
      }),
    }));

    // Mock toast methods
    mockToast.success = jest.fn();
    mockToast.error = jest.fn();
  });

  describe('Credit Balance Scenarios', () => {
    it('should enable Generate button for Master Chef even with zero credits', async () => {
      // Mock API response with zero credits
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          available: 0,
          used: 0,
          remaining: 0
        })
      });

      render(<ConversationPage />);

      // Wait for credit balance to load
      await waitFor(() => {
        expect(screen.getByText(/Credits: 0 available.*Free/)).toBeInTheDocument();
      });

      // For Master Chef (0 credits required), button should be enabled even with zero credits
      const generateButton = screen.getByRole('button', { name: /Generate/ });
      
      // Upload a mock image file to fully enable the button
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const imageUpload = screen.getByTestId('image-upload-input') || screen.getByLabelText(/upload/i);
      
      if (imageUpload) {
        fireEvent.change(imageUpload, { target: { files: [file] } });
        
        await waitFor(() => {
          expect(generateButton).not.toBeDisabled();
        });
        
        // Verify tooltip shows free tool message
        fireEvent.mouseEnter(generateButton);
        await waitFor(() => {
          expect(screen.getByText(/Click to generate AI analysis/)).toBeInTheDocument();
        });
      }
    });

    it('should enable Generate button when credits are sufficient', async () => {
      // Mock API response with sufficient credits
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          available: 200,
          used: 50,
          remaining: 150
        })
      });

      render(<ConversationPage />);

      // Wait for credit balance to load
      await waitFor(() => {
        expect(screen.getByText(/Credits: 150 available/)).toBeInTheDocument();
      });

      // Upload a mock image file
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const imageUpload = screen.getByTestId('image-upload-input') || screen.getByLabelText(/upload/i);
      
      if (imageUpload) {
        fireEvent.change(imageUpload, { target: { files: [file] } });
      }

      // Check that button is enabled (when image is uploaded and credits are sufficient)
      await waitFor(() => {
        const generateButton = screen.getByRole('button', { name: /Generate/ });
        expect(generateButton).not.toBeDisabled();
      });
    });

    it('should enable Generate button for Master Chef with negative credits', async () => {
      // Mock API response with negative credit balance (edge case)
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          available: 50,
          used: 75,
          remaining: -25
        })
      });

      render(<ConversationPage />);

      await waitFor(() => {
        expect(screen.getByText(/Credits: -25 available.*Free/)).toBeInTheDocument();
      });

      // Master Chef should still be enabled with negative credits
      const generateButton = screen.getByRole('button', { name: /Generate/ });
      
      // Upload a mock image file
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const imageUpload = screen.getByTestId('image-upload-input') || screen.getByLabelText(/upload/i);
      
      if (imageUpload) {
        fireEvent.change(imageUpload, { target: { files: [file] } });
        
        await waitFor(() => {
          expect(generateButton).not.toBeDisabled();
        });
      }
    });
  });

  describe('Webhook Request Scenarios', () => {
    it('should handle successful webhook response', async () => {
      // Mock sufficient credits
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          available: 200,
          used: 50,
          remaining: 150
        })
      });

      // Mock successful webhook response
      const mockSendWebhookRequest = jest.fn().mockResolvedValue({
        success: true,
        data: {
          response: 'This is a delicious recipe suggestion!',
          processingTime: 2500,
          tokens: 150
        }
      });

      MockedN8nWebhookClient.mockImplementation(() => ({
        buildWebhookPayload: jest.fn(),
        validatePayload: jest.fn().mockReturnValue({ valid: true, errors: [] }),
        sendWebhookRequestWithRetry: mockSendWebhookRequest,
      }) as any);

      render(<ConversationPage />);

      await waitFor(() => {
        expect(screen.getByText(/Credits: 150 available/)).toBeInTheDocument();
      });

      // Upload image and submit
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const imageUpload = screen.getByTestId('image-upload-input') || screen.getByLabelText(/upload/i);
      
      if (imageUpload) {
        fireEvent.change(imageUpload, { target: { files: [file] } });
        
        await waitFor(() => {
          const generateButton = screen.getByRole('button', { name: /Generate/ });
          fireEvent.click(generateButton);
        });

        // Verify success feedback
        await waitFor(() => {
          expect(mockToast.success).toHaveBeenCalledWith(
            expect.stringContaining('Response received in 2.5s')
          );
        });

        // Verify assistant response is displayed
        expect(screen.getByText('This is a delicious recipe suggestion!')).toBeInTheDocument();
      }
    });

    it('should handle webhook timeout error', async () => {
      // Mock sufficient credits
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          available: 200,
          used: 50,
          remaining: 150
        })
      });

      // Mock timeout error
      const mockSendWebhookRequest = jest.fn().mockResolvedValue({
        success: false,
        error: {
          code: 'TIMEOUT_ERROR',
          message: 'Request timed out. The server may be busy, please try again.',
          details: { processingTime: 45000 }
        }
      });

      MockedN8nWebhookClient.mockImplementation(() => ({
        buildWebhookPayload: jest.fn(),
        validatePayload: jest.fn().mockReturnValue({ valid: true, errors: [] }),
        sendWebhookRequestWithRetry: mockSendWebhookRequest,
      }) as any);

      render(<ConversationPage />);

      await waitFor(() => {
        expect(screen.getByText(/Credits: 150 available/)).toBeInTheDocument();
      });

      // Upload image and submit
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const imageUpload = screen.getByTestId('image-upload-input') || screen.getByLabelText(/upload/i);
      
      if (imageUpload) {
        fireEvent.change(imageUpload, { target: { files: [file] } });
        
        const generateButton = screen.getByRole('button', { name: /Generate/ });
        fireEvent.click(generateButton);

        // Verify error feedback
        await waitFor(() => {
          expect(mockToast.error).toHaveBeenCalledWith(
            'Request timed out. The server may be busy, please try again.'
          );
        });
      }
    });

    it('should handle network connection error', async () => {
      // Mock sufficient credits
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          available: 200,
          used: 50,
          remaining: 150
        })
      });

      // Mock network error
      const mockSendWebhookRequest = jest.fn().mockResolvedValue({
        success: false,
        error: {
          code: 'CONNECTION_ERROR',
          message: 'Unable to connect to the server. Please check your internet connection.',
          details: { processingTime: 1000 }
        }
      });

      MockedN8nWebhookClient.mockImplementation(() => ({
        buildWebhookPayload: jest.fn(),
        validatePayload: jest.fn().mockReturnValue({ valid: true, errors: [] }),
        sendWebhookRequestWithRetry: mockSendWebhookRequest,
      }) as any);

      render(<ConversationPage />);

      await waitFor(() => {
        expect(screen.getByText(/Credits: 150 available/)).toBeInTheDocument();
      });

      // Upload image and submit
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const imageUpload = screen.getByTestId('image-upload-input') || screen.getByLabelText(/upload/i);
      
      if (imageUpload) {
        fireEvent.change(imageUpload, { target: { files: [file] } });
        
        const generateButton = screen.getByRole('button', { name: /Generate/ });
        fireEvent.click(generateButton);

        // Verify error feedback
        await waitFor(() => {
          expect(mockToast.error).toHaveBeenCalledWith(
            'Unable to connect to the server. Please check your internet connection.'
          );
        });
      }
    });

    it('should handle max retries exceeded error', async () => {
      // Mock sufficient credits
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          available: 200,
          used: 50,
          remaining: 150
        })
      });

      // Mock max retries error
      const mockSendWebhookRequest = jest.fn().mockResolvedValue({
        success: false,
        error: {
          code: 'MAX_RETRIES_EXCEEDED',
          message: 'Request failed after maximum retry attempts',
          details: { processingTime: 15000 }
        }
      });

      MockedN8nWebhookClient.mockImplementation(() => ({
        buildWebhookPayload: jest.fn(),
        validatePayload: jest.fn().mockReturnValue({ valid: true, errors: [] }),
        sendWebhookRequestWithRetry: mockSendWebhookRequest,
      }) as any);

      render(<ConversationPage />);

      await waitFor(() => {
        expect(screen.getByText(/Credits: 150 available/)).toBeInTheDocument();
      });

      // Upload image and submit
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const imageUpload = screen.getByTestId('image-upload-input') || screen.getByLabelText(/upload/i);
      
      if (imageUpload) {
        fireEvent.change(imageUpload, { target: { files: [file] } });
        
        const generateButton = screen.getByRole('button', { name: /Generate/ });
        fireEvent.click(generateButton);

        // Verify error feedback
        await waitFor(() => {
          expect(mockToast.error).toHaveBeenCalledWith(
            'Request failed after multiple attempts. Please try again later.'
          );
        });
      }
    });
  });

  describe('Environment Configuration', () => {
    it('should log request details for debugging', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      // Mock sufficient credits
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          available: 200,
          used: 50,
          remaining: 150
        })
      });

      render(<ConversationPage />);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(
          '[ConversationPage] Credit balance loaded:',
          expect.objectContaining({
            available: 200,
            used: 50,
            remaining: 150
          })
        );
      });

      consoleSpy.mockRestore();
    });
  });
});
