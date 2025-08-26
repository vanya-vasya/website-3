# Brand Token Rebrand Verification Plan

## Pre-Change Verification
Before making any changes, ensure:
```bash
# Check current build status
npm run build
npm run lint

# Check TypeScript compilation
npx tsc --noEmit

# Test current functionality
npm run dev
# Verify key features: image upload, payment flow, authentication
```

## Post-Change Verification (If Changes Applied)
After applying any approved changes:

### 1. Build System Check
```bash
# Clean build
rm -rf .next
npm run build

# Check for build errors
npm run lint
npx tsc --noEmit
```

### 2. Critical Service Tests
```bash
# Start development server
npm run dev

# Manual verification required for:
# - Image upload (Cloudinary integration)
# - Payment processing (Networx/Stripe)
# - Email functionality
# - Authentication flows
# - API endpoints functionality
```

### 3. External Service Dependencies
- **Cloudinary**: If uploadPreset is changed, ensure matching preset exists in Cloudinary account
- **Domain References**: Update DNS/hosting if domain references are changed
- **Email Templates**: Test email delivery with new branding
- **Payment Webhooks**: Verify webhook URLs are updated in payment provider

### 4. Deployment Verification
```bash
# If deploy config changed, test deployment
# Check .github/workflows/deploy.yml references
# Verify server block name matches APP_NAME in production
```

## Risk Mitigation
- Create git branch before any changes
- Test in staging environment first  
- Have rollback plan ready
- Coordinate with external service providers (Cloudinary, payment processors)

## Current Status
❌ **NO SAFE CHANGES IDENTIFIED** - All matches require manual review and external service coordination.
