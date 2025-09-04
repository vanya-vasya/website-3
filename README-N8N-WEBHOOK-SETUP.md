# n8n Webhook Integration Setup

## Environment Configuration

Add the following environment variable to your `.env.local` file:

```bash
# n8n Webhook Configuration
NEXT_PUBLIC_N8N_WEBHOOK_URL=https://vanya-vasya.app.n8n.cloud/webhook/4c6c4649-99ef-4598-b77b-6cb12ab6a102
```

**Note**: Replace the webhook ID `4c6c4649-99ef-4598-b77b-6cb12ab6a102` with your actual n8n webhook ID from your workflow configuration.

## Webhook Payload Structure

The Generate button now sends the following JSON payload to your n8n webhook:

```json
{
  "message": {
    "content": "What can I cook with chicken and rice?",
    "role": "user",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "sessionId": "session_1705316200000_abc123def"
  },
  "tool": {
    "id": "master-chef",
    "name": "Master Chef", 
    "price": 100,
    "gradient": "from-amber-400 via-orange-500 to-red-600"
  },
  "user": {
    "id": "user_123",
    "sessionId": "session_1705316200000_abc123def"
  },
  "image": {
    "fileName": "ingredients.jpg",
    "fileSize": 245760,
    "fileType": "image/jpeg"
  },
  "metadata": {
    "source": "yum-mi-web-app",
    "version": "1.0",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "userAgent": "Mozilla/5.0...",
    "locale": "en-US"
  }
}
```

## Expected Response Format

Your n8n workflow should return a response in this format:

```json
{
  "success": true,
  "response": "Here's a delicious recipe for Chicken and Rice Stir-fry: [detailed recipe follows...]",
  "tokens": 150,
  "processingTime": 2500
}
```

Or for errors:
```json
{
  "success": false,
  "error": {
    "code": "PROCESSING_ERROR",
    "message": "Unable to process the request"
  }
}
```

## Testing the Integration

### 1. Install Test Dependencies

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @types/jest ts-jest next/jest
```

### 2. Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### 3. Manual Testing

1. Start your development server: `npm run dev`
2. Navigate to `/dashboard/conversation?toolId=master-chef`
3. Enter a message like "What can I cook with chicken?"
4. Click the "Generate" button
5. Check your n8n workflow logs to verify the payload was received

## Error Handling

The integration includes comprehensive error handling:

- **Validation Errors**: Shows specific validation messages
- **Network Errors**: Displays connection-related error messages  
- **HTTP 403**: Opens the pro upgrade modal for generation limits
- **Unexpected Errors**: Shows generic error message with console logging

## Features

- ✅ Complete payload validation before sending
- ✅ Image upload support (files under 10MB)
- ✅ Loading states and user feedback
- ✅ Proper error handling and logging
- ✅ Prevention of double submissions
- ✅ Session management
- ✅ Tool-specific configurations
- ✅ Comprehensive unit tests

## File Changes Summary

### New Files
- `lib/n8n-webhook.ts` - Webhook client utility
- `__tests__/lib/n8n-webhook.test.ts` - Unit tests for webhook client
- `__tests__/app/(dashboard)/dashboard/conversation/page.test.tsx` - Component tests
- `jest.config.js` - Jest configuration
- `jest.setup.js` - Test setup and mocks

### Modified Files
- `app/(dashboard)/dashboard/conversation/page.tsx` - Updated Generate button handler
- `package.json` - Added test scripts

The Generate button now integrates fully with n8n webhooks instead of the previous OpenAI API direct call.
