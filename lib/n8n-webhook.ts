/**
 * n8n Webhook Integration Utility
 * Handles payload construction and API communication with n8n workflows
 */

interface N8nWebhookPayload {
  // Core message data
  message: {
    content: string;
    role: 'user';
    timestamp: string;
    sessionId: string;
  };
  
  // Tool configuration
  tool: {
    id: string;
    name: string;
    price: number;
    gradient: string;
  };
  
  // User context
  user: {
    id?: string;
    sessionId: string;
  };
  
  // Image data (if present)
  image?: {
    fileName: string;
    fileSize: number;
    fileType: string;
    base64Data?: string;
  };
  
  // Request metadata
  metadata: {
    source: 'yum-mi-web-app';
    version: '1.0';
    timestamp: string;
    userAgent: string;
    locale?: string;
  };
}

interface N8nWebhookResponse {
  success: boolean;
  data?: {
    response: string;
    processingTime: number;
    tokens?: number;
  };
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

class N8nWebhookClient {
  private readonly baseUrl: string;
  private readonly webhookPath: string;
  
  constructor() {
    // Use the webhook path from the n8n workflow configuration provided by user
    this.webhookPath = '4c6c4649-99ef-4598-b77b-6cb12ab6a102';
    this.baseUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || 
                   `https://na10.app.n8n.cloud/webhook/${this.webhookPath}`;
    
    if (!this.baseUrl) {
      throw new Error('N8N_WEBHOOK_URL environment variable is required');
    }
  }

  /**
   * Build the complete JSON payload for n8n webhook
   */
  buildWebhookPayload(
    prompt: string,
    toolId: string,
    toolConfig: any,
    uploadedImage?: File,
    userId?: string
  ): N8nWebhookPayload {
    const sessionId = this.generateSessionId();
    const timestamp = new Date().toISOString();

    return {
      message: {
        content: prompt,
        role: 'user',
        timestamp,
        sessionId,
      },
      tool: {
        id: toolId,
        name: toolConfig.title,
        price: this.getToolPrice(toolId),
        gradient: toolConfig.gradient,
      },
      user: {
        id: userId,
        sessionId,
      },
      ...(uploadedImage && {
        image: {
          fileName: uploadedImage.name,
          fileSize: uploadedImage.size,
          fileType: uploadedImage.type,
          // Note: For production, consider uploading to cloud storage first
          // and passing URL instead of base64 for large images
        }
      }),
      metadata: {
        source: 'yum-mi-web-app',
        version: '1.0',
        timestamp,
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
        locale: typeof window !== 'undefined' ? window.navigator.language : 'en-US',
      },
    };
  }

  /**
   * Send POST request to n8n webhook
   */
  async sendWebhookRequest(payload: N8nWebhookPayload): Promise<N8nWebhookResponse> {
    const startTime = Date.now();
    
    try {
      console.log(`[N8N] Sending request to webhook: ${this.baseUrl}`, {
        toolId: payload.tool.id,
        messageLength: payload.message.content.length,
        hasImage: !!payload.image,
      });

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'YumMi-WebApp/1.0',
          'X-Request-Source': 'yum-mi-frontend',
        },
        body: JSON.stringify(payload),
      });

      const processingTime = Date.now() - startTime;

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[N8N] Webhook request failed:`, {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
          processingTime,
        });

        return {
          success: false,
          error: {
            code: `HTTP_${response.status}`,
            message: `Webhook request failed: ${response.statusText}`,
            details: {
              status: response.status,
              response: errorText,
              processingTime,
            },
          },
        };
      }

      const responseData = await response.json();
      
      console.log(`[N8N] Webhook request successful:`, {
        processingTime,
        responseSize: JSON.stringify(responseData).length,
      });

      return {
        success: true,
        data: {
          response: responseData.response || responseData.content || 'Response received',
          processingTime,
          tokens: responseData.tokens,
        },
      };

    } catch (error: any) {
      const processingTime = Date.now() - startTime;
      
      console.error(`[N8N] Webhook request error:`, {
        error: error.message,
        stack: error.stack,
        processingTime,
        payload: {
          toolId: payload.tool.id,
          messageLength: payload.message.content.length,
        }
      });

      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: error.message || 'Network request failed',
          details: {
            processingTime,
            originalError: error,
          },
        },
      };
    }
  }

  /**
   * Validate payload before sending
   */
  validatePayload(payload: N8nWebhookPayload): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!payload.message.content?.trim()) {
      errors.push('Message content is required');
    }

    if (!payload.tool.id) {
      errors.push('Tool ID is required');
    }

    if (!payload.user.sessionId) {
      errors.push('Session ID is required');
    }

    if (payload.image) {
      if (payload.image.fileSize > 10 * 1024 * 1024) {
        errors.push('Image size must be less than 10MB');
      }

      if (!payload.image.fileType.startsWith('image/')) {
        errors.push('File must be an image');
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Convert File to base64 (if needed for small images)
   */
  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove data:image/...;base64, prefix
        resolve(result.split(',')[1]);
      };
      reader.onerror = error => reject(error);
    });
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getToolPrice(toolId: string): number {
    const prices = {
      'master-chef': 100,
      'master-nutritionist': 150,
      'cal-tracker': 50,
    };
    return prices[toolId as keyof typeof prices] || 100;
  }
}

export { N8nWebhookClient, type N8nWebhookPayload, type N8nWebhookResponse };

/**
 * Example Request Payload:
 * {
 *   "message": {
 *     "content": "I have chicken, broccoli, and rice. What can I make?",
 *     "role": "user",
 *     "timestamp": "2024-01-15T10:30:00.000Z",
 *     "sessionId": "session_1705316200000_abc123def"
 *   },
 *   "tool": {
 *     "id": "master-chef",
 *     "name": "Master Chef",
 *     "price": 100,
 *     "gradient": "from-amber-400 via-orange-500 to-red-600"
 *   },
 *   "user": {
 *     "id": "user_123",
 *     "sessionId": "session_1705316200000_abc123def"
 *   },
 *   "image": {
 *     "fileName": "ingredients.jpg",
 *     "fileSize": 245760,
 *     "fileType": "image/jpeg"
 *   },
 *   "metadata": {
 *     "source": "yum-mi-web-app",
 *     "version": "1.0",
 *     "timestamp": "2024-01-15T10:30:00.000Z",
 *     "userAgent": "Mozilla/5.0...",
 *     "locale": "en-US"
 *   }
 * }
 * 
 * Example Response:
 * {
 *   "success": true,
 *   "data": {
 *     "response": "Great ingredients! Here's a delicious recipe for Chicken and Broccoli Stir-fry with Rice: [detailed recipe follows...]",
 *     "processingTime": 2500,
 *     "tokens": 150
 *   }
 * }
 */
