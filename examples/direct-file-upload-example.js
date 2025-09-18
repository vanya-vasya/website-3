/**
 * Example: Direct File Upload to N8N Webhook using multipart/form-data
 * This example demonstrates how to send files directly to the N8N webhook
 * bypassing the API proxy for better performance and proper binary handling.
 */

// 1. VANILLA JAVASCRIPT EXAMPLE
const WEBHOOK_URL = 'https://vanya-vasya.app.n8n.cloud/webhook/4c6c4649-99ef-4598-b77b-6cb12ab6a102';

async function sendFileDirectly(file) {
  try {
    // Create FormData for multipart/form-data
    const formData = new FormData();
    
    // Add the binary file (field name must match n8n binaryPropertyName = "file")
    formData.append('file', file);
    
    // Add metadata as JSON string
    formData.append('message', JSON.stringify({
      toolId: 'master-chef',
      content: 'Analyze this food image and provide recipe suggestions',
      userId: 'user123', // optional
      timestamp: new Date().toISOString(),
      sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    }));

    console.log('Sending file to N8N webhook:', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
    });

    // Send multipart/form-data directly to N8N webhook
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      body: formData, // Browser automatically sets Content-Type with boundary
      mode: 'cors', // Enable CORS for cross-origin requests
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    // Handle both JSON and text responses
    const contentType = response.headers.get('content-type') || '';
    let result;
    
    if (contentType.includes('application/json')) {
      result = await response.json();
      console.log('N8N JSON response:', result);
    } else {
      result = await response.text();
      console.log('N8N text response:', result);
    }

    return result;

  } catch (error) {
    console.error('File upload failed:', error);
    throw error;
  }
}

// 2. NEXT.JS REACT EXAMPLE
function FileUploadComponent() {
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState('');

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const response = await sendFileDirectly(file);
      setResult(typeof response === 'string' ? response : response.response || JSON.stringify(response));
    } catch (error) {
      setResult(`Error: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleFileUpload}
        disabled={uploading}
      />
      {uploading && <p>Uploading and analyzing...</p>}
      {result && (
        <div>
          <h3>Analysis Result:</h3>
          <pre>{result}</pre>
        </div>
      )}
    </div>
  );
}

// 3. USING THE N8N WEBHOOK CLIENT (RECOMMENDED)
import { N8nWebhookClient } from '@/lib/n8n-webhook';

async function uploadWithWebhookClient(file) {
  const client = new N8nWebhookClient();
  
  // Direct file upload with retry logic
  const result = await client.sendFileToWebhookWithRetry(
    file,
    'master-chef', // toolId
    'Analyze this food image', // prompt
    'user123', // userId (optional)
    2, // maxRetries
    45000 // timeoutMs
  );

  if (result.success) {
    console.log('Upload successful:', result.data?.response);
    return result.data;
  } else {
    console.error('Upload failed:', result.error);
    throw new Error(result.error?.message || 'Upload failed');
  }
}

// 4. COMPARISON: JSON vs FormData

// OLD WAY (JSON with metadata only - no binary data):
const jsonPayload = {
  message: { content: "Analyze image", role: "user" },
  tool: { id: "master-chef", name: "Master Chef", price: 0 },
  user: { id: "user123" },
  image: {
    fileName: "food.jpg",
    fileSize: 245760,
    fileType: "image/jpeg"
    // NO ACTUAL IMAGE DATA!
  }
};

// NEW WAY (FormData with binary data):
const formData = new FormData();
formData.append('file', actualFileObject); // Real binary data
formData.append('message', JSON.stringify(metadata)); // Metadata

/**
 * KEY BENEFITS OF DIRECT UPLOAD:
 * 
 * ✅ PERFORMANCE:
 * - Direct to N8N (no API proxy overhead)
 * - Binary data transmitted efficiently
 * - Faster processing and response times
 * 
 * ✅ COMPATIBILITY:
 * - N8N receives actual file binary data
 * - Proper multipart/form-data handling
 * - Works with N8N binary property configuration
 * 
 * ✅ RELIABILITY:
 * - Built-in retry logic with exponential backoff
 * - Timeout handling for large files
 * - Comprehensive error categorization
 * 
 * ✅ FLEXIBILITY:
 * - Supports all image formats (JPEG, PNG, WebP, etc.)
 * - Handles both JSON and text responses from N8N
 * - CORS enabled for cross-origin requests
 */

export { sendFileDirectly, uploadWithWebhookClient };
