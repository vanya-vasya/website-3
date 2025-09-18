# N8N Webhook Improvements

## 🚀 Implemented Changes

### 1. Updated API Route (`app/api/generate/route.ts`)
- **Environment Variables**: Now uses `N8N_WEBHOOK_URL` or `WEBHOOK_URL` instead of `NEXT_PUBLIC_N8N_WEBHOOK_URL`
- **MultiPart Support**: Handles both JSON and `multipart/form-data` (file uploads)
- **FormData Proxy**: Correctly forwards FormData with boundary preservation
- **Better Error Handling**: Proper HTTP status codes (500, 502, 504)
- **Timeout Protection**: 30-second timeout with AbortController
- **Improved Logging**: Added processing time, file details, and better error details
- **Transparent Proxy**: Returns same status and content-type as N8N response

### 2. Updated Environment Configuration (`n8n-env-example.txt`)
- Changed from `NEXT_PUBLIC_N8N_WEBHOOK_URL` to `N8N_WEBHOOK_URL`
- Added explanation about server-side vs client-side variables
- Updated webhook URL to current workspace domain

### 3. Client Changes (`lib/n8n-webhook.ts`)
- Modified to use `/api/generate` proxy instead of direct N8N calls
- Removed custom headers that trigger CORS preflight requests
- Simplified constructor (no environment variable checks on client)

## 🎯 Benefits

### CORS Issues Resolved
- ✅ No more preflight requests from browser
- ✅ Server-to-server communication eliminates CORS
- ✅ Cleaner headers (only `Content-Type: application/json`)

### Better Error Handling
- ✅ Proper HTTP status codes
- ✅ Timeout handling (504 status)
- ✅ Network error handling (502 status)
- ✅ Configuration error handling (500 status)

### Security & Performance
- ✅ Webhook URL hidden from client (server-side only)
- ✅ Request timeout prevents hanging requests
- ✅ Better logging for debugging

## 🔧 Configuration Required

Add to your `.env.local`:
```bash
# Primary webhook URL
N8N_WEBHOOK_URL=https://vanya-vasya.app.n8n.cloud/webhook/4c6c4649-99ef-4598-b77b-6cb12ab6a102

# Fallback (optional)
WEBHOOK_URL=https://vanya-vasya.app.n8n.cloud/webhook/4c6c4649-99ef-4598-b77b-6cb12ab6a102
```

## 🧪 Testing

### Manual Testing
1. Set environment variable in `.env.local`
2. Make POST request to `/api/generate` with JSON payload
3. Verify response is forwarded correctly from N8N

### Example Test Requests

#### JSON Request
```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"message":{"content":"test"},"tool":{"id":"master-chef"}}'
```

#### File Upload (FormData)
```bash
curl -X POST http://localhost:3000/api/generate \
  -F "file=@/path/to/your/file.jpg" \
  -F "meta={\"toolId\":\"master-chef\",\"message\":\"Analyze this image\"};type=application/json"
```

## 📋 Future Improvements

### Testing
- [ ] Add proper Next.js API route testing with supertest
- [ ] Add integration tests with actual N8N webhook
- [ ] Add E2E tests for full user flow

### Monitoring
- [ ] Add Vercel cron for health checks
- [ ] Add error alerting in N8N workflows
- [ ] Add detailed logging for production debugging

### Features
- [ ] Add request/response caching for repeated queries
- [ ] Add rate limiting per user/session
- [ ] Add request compression for large payloads

## 📁 FormData File Uploads

### ✅ Correct Frontend Implementation
```typescript
// ❌ WRONG - Don't set Content-Type for FormData
const formData = new FormData();
formData.append('file', file);
fetch('/api/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'multipart/form-data' }, // ❌ BAD - Wrong boundary!
  body: formData
});

// ✅ CORRECT - Let browser set Content-Type with boundary
const formData = new FormData();
formData.append('file', file); // Field name 'file' matches N8N binaryPropertyName
formData.append('meta', new Blob([JSON.stringify(metadata)], { 
  type: 'application/json' 
}), 'meta.json');

const response = await fetch('/api/generate', {
  method: 'POST',
  body: formData // Browser automatically sets multipart/form-data with boundary
});

// ✅ CORRECT - Handle potentially empty responses
const text = await response.text();
const data = text ? JSON.parse(text) : null;
```

### 🛠️ API Route Handling
The API route now automatically detects Content-Type and handles both:
- **`application/json`**: Standard JSON requests (default)
- **`multipart/form-data`**: File uploads with FormData proxy

### 🎯 Key Benefits
- ✅ **Safari Compatible**: Proper FormData boundary handling
- ✅ **File Uploads**: Support for images, documents, and other files  
- ✅ **Dual Support**: Both JSON and multipart in same endpoint
- ✅ **N8N Integration**: File field name matches N8N webhook expectations

## 🔗 Related Files
- `app/api/generate/route.ts` - Main API proxy (JSON + FormData)
- `components/file-upload-example.tsx` - React FormData upload example
- `lib/n8n-webhook.ts` - Client webhook utility
- `n8n-env-example.txt` - Environment configuration
- `__tests__/lib/n8n-webhook.test.ts` - Client tests (updated)
