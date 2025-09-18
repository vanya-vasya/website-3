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
  private readonly directWebhookUrl: string;
  
  constructor() {
    // Use the webhook path from the n8n workflow configuration provided by user
    this.webhookPath = '4c6c4649-99ef-4598-b77b-6cb12ab6a102';
    
    // Use local API proxy to avoid CORS issues for JSON requests
    this.baseUrl = '/api/generate';
    
    // Direct webhook URL for multipart/form-data uploads
    this.directWebhookUrl = 'https://vanya-vasya.app.n8n.cloud/webhook/4c6c4649-99ef-4598-b77b-6cb12ab6a102';
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
   * Send POST request to n8n webhook with timeout and retry logic
   */
  async sendWebhookRequest(payload: N8nWebhookPayload, timeoutMs: number = 45000): Promise<N8nWebhookResponse> {
    const startTime = Date.now();
    
    try {
      console.log(`[N8N] Sending request to API proxy: ${this.baseUrl}`, {
        toolId: payload.tool.id,
        messageLength: payload.message.content.length,
        hasImage: !!payload.image,
        timeout: timeoutMs,
        timestamp: new Date().toISOString(),
      });

      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
        console.warn(`[N8N] Request timeout after ${timeoutMs}ms`);
      }, timeoutMs);

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Request-ID': `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

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
            message: `API request failed: ${response.statusText}`,
            details: {
              status: response.status,
              response: errorText,
              processingTime,
            },
          },
        };
      }

      // Handle both JSON and text responses
      const contentType = response.headers.get('content-type') || '';
      let responseData: any;
      let parsedResponse: string;

      if (contentType.includes('application/json')) {
        try {
          responseData = await response.json();
          parsedResponse = responseData.response || responseData.content || responseData.message || JSON.stringify(responseData);
          
          console.log(`[N8N] API request successful (JSON):`, {
            processingTime,
            responseSize: JSON.stringify(responseData).length,
            contentType,
          });
        } catch (jsonError: any) {
          console.warn(`[N8N] JSON parsing failed, falling back to text:`, {
            error: jsonError.message,
            contentType,
          });
          
          // Fall back to text parsing
          const text = await response.text();
          parsedResponse = text || 'Response received';
          responseData = { response: parsedResponse };
        }
      } else {
        // Handle plain text response
        const text = await response.text();
        parsedResponse = text || 'Response received';
        responseData = { response: parsedResponse };
        
        console.log(`[N8N] API request successful (text):`, {
          processingTime,
          responseSize: text.length,
          contentType,
        });
      }

      return {
        success: true,
        data: {
          response: parsedResponse,
          processingTime,
          tokens: responseData.tokens || undefined,
        },
      };

    } catch (error: any) {
      const processingTime = Date.now() - startTime;
      
      // Enhanced error logging with more context
      console.error(`[N8N] Webhook request error:`, {
        error: error.message,
        errorName: error.name,
        stack: error.stack,
        processingTime,
        requestUrl: this.baseUrl,
        payload: {
          toolId: payload.tool.id,
          messageLength: payload.message.content.length,
          hasImage: !!payload.image,
          timestamp: payload.metadata.timestamp,
        },
        networkDetails: {
          userAgent: payload.metadata.userAgent,
          locale: payload.metadata.locale,
        }
      });

      // Determine error type for better user feedback
      let errorCode = 'NETWORK_ERROR';
      let userMessage = error.message || 'Network request failed';
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorCode = 'CONNECTION_ERROR';
        userMessage = 'Unable to connect to the server. Please check your internet connection.';
      } else if (error.name === 'AbortError') {
        errorCode = 'TIMEOUT_ERROR';
        userMessage = 'Request timed out. The server may be busy, please try again.';
      } else if (error.message.includes('JSON')) {
        errorCode = 'RESPONSE_FORMAT_ERROR';
        userMessage = 'Server returned an unexpected response format.';
      }

      return {
        success: false,
        error: {
          code: errorCode,
          message: userMessage,
          details: {
            processingTime,
            originalError: error.message,
            timestamp: new Date().toISOString(),
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
   * Send file directly to N8N webhook using multipart/form-data
   * This bypasses the API proxy and sends binary data directly
   */
  async sendFileToWebhook(
    file: File,
    toolId: string,
    prompt: string = 'Analyze this food image',
    userId?: string,
    timeoutMs: number = 45000
  ): Promise<N8nWebhookResponse> {
    const startTime = Date.now();
    
    try {
      console.log(`[N8N] Sending file directly to webhook: ${this.directWebhookUrl}`, {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        toolId,
        timeout: timeoutMs,
        timestamp: new Date().toISOString(),
      });

      // Create FormData for multipart/form-data
      const formData = new FormData();
      formData.append('file', file); // Binary field name must match n8n webhook configuration
      
      // Add metadata as JSON string
      formData.append('message', JSON.stringify({
        toolId,
        content: prompt,
        userId,
        timestamp: new Date().toISOString(),
        sessionId: this.generateSessionId(),
      }));

      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
        console.warn(`[N8N] File upload timeout after ${timeoutMs}ms`);
      }, timeoutMs);

      const response = await fetch(this.directWebhookUrl, {
        method: 'POST',
        body: formData, // No Content-Type header - browser sets it with boundary
        signal: controller.signal,
        mode: 'cors', // Enable CORS for direct webhook calls
      });

      clearTimeout(timeoutId);
      const processingTime = Date.now() - startTime;

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[N8N] File upload failed:`, {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
          processingTime,
        });

        return {
          success: false,
          error: {
            code: `HTTP_${response.status}`,
            message: `File upload failed: ${response.statusText}`,
            details: {
              status: response.status,
              response: errorText,
              processingTime,
            },
          },
        };
      }

      // Handle both JSON and text responses
      const contentType = response.headers.get('content-type') || '';
      let responseData: any;
      let parsedResponse: string;

      if (contentType.includes('application/json')) {
        try {
          responseData = await response.json();
          parsedResponse = responseData.response || responseData.content || responseData.message || JSON.stringify(responseData);
          
          console.log(`[N8N] File upload successful (JSON):`, {
            processingTime,
            responseSize: JSON.stringify(responseData).length,
            contentType,
          });
        } catch (jsonError: any) {
          console.warn(`[N8N] JSON parsing failed, falling back to text:`, {
            error: jsonError.message,
            contentType,
          });
          
          const text = await response.text();
          parsedResponse = text || 'File processed successfully';
          responseData = { response: parsedResponse };
        }
      } else {
        const text = await response.text();
        parsedResponse = text || 'File processed successfully';
        responseData = { response: parsedResponse };
        
        console.log(`[N8N] File upload successful (text):`, {
          processingTime,
          responseSize: text.length,
          contentType,
        });
      }

      return {
        success: true,
        data: {
          response: parsedResponse,
          processingTime,
          tokens: responseData.tokens || undefined,
        },
      };

    } catch (error: any) {
      const processingTime = Date.now() - startTime;
      
      console.error(`[N8N] File upload error:`, {
        error: error.message,
        errorName: error.name,
        stack: error.stack,
        processingTime,
        fileName: file.name,
        fileSize: file.size,
      });

      // Determine error type for better user feedback
      let errorCode = 'NETWORK_ERROR';
      let userMessage = error.message || 'File upload failed';
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorCode = 'CONNECTION_ERROR';
        userMessage = 'Unable to connect to the server. Please check your internet connection.';
      } else if (error.name === 'AbortError') {
        errorCode = 'TIMEOUT_ERROR';
        userMessage = 'File upload timed out. The file may be too large or the server is busy.';
      }

      return {
        success: false,
        error: {
          code: errorCode,
          message: userMessage,
          details: {
            processingTime,
            originalError: error.message,
            timestamp: new Date().toISOString(),
          },
        },
      };
    }
  }

  /**
   * Send request with retry logic for better reliability
   */
  async sendWebhookRequestWithRetry(
    payload: N8nWebhookPayload, 
    maxRetries: number = 2, 
    timeoutMs: number = 45000
  ): Promise<N8nWebhookResponse> {
    let lastError: any;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      if (attempt > 0) {
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000); // Exponential backoff with max 5s
        console.log(`[N8N] Retry attempt ${attempt}/${maxRetries} after ${delay}ms delay`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
      
      try {
        const response = await this.sendWebhookRequest(payload, timeoutMs);
        if (response.success || attempt === maxRetries) {
          return response;
        }
        lastError = response.error;
      } catch (error: any) {
        lastError = error;
        if (attempt === maxRetries) {
          console.error(`[N8N] All retry attempts failed:`, {
            attempts: maxRetries + 1,
            finalError: error.message,
          });
        }
      }
    }
    
    // Return the last error if all retries failed
    return {
      success: false,
      error: lastError || {
        code: 'MAX_RETRIES_EXCEEDED',
        message: 'Request failed after maximum retry attempts',
      },
    };
  }

  /**
   * Send file with retry logic for better reliability
   */
  async sendFileToWebhookWithRetry(
    file: File,
    toolId: string,
    prompt: string = 'Analyze this food image',
    userId?: string,
    maxRetries: number = 2,
    timeoutMs: number = 45000
  ): Promise<N8nWebhookResponse> {
    let lastError: any;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      if (attempt > 0) {
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
        console.log(`[N8N] File upload retry attempt ${attempt}/${maxRetries} after ${delay}ms delay`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
      
      try {
        const response = await this.sendFileToWebhook(file, toolId, prompt, userId, timeoutMs);
        if (response.success || attempt === maxRetries) {
          return response;
        }
        lastError = response.error;
      } catch (error: any) {
        lastError = error;
        if (attempt === maxRetries) {
          console.error(`[N8N] All file upload retry attempts failed:`, {
            attempts: maxRetries + 1,
            finalError: error.message,
          });
        }
      }
    }
    
    return {
      success: false,
      error: lastError || {
        code: 'MAX_RETRIES_EXCEEDED',
        message: 'File upload failed after maximum retry attempts',
      },
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
      'master-chef': 0, // Free tool - always enabled regardless of credit balance
      'master-nutritionist': 150,
      'cal-tracker': 50,
    };
    
    // Use nullish coalescing to allow 0 values (|| would treat 0 as falsy)
    return prices[toolId as keyof typeof prices] ?? 100;
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
