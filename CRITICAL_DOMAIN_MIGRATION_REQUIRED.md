# 🚨 CRITICAL: DOMAIN MIGRATION REQUIRED

## Changes Applied: "nerbixa" → "zinvero" (32 occurrences)

All 32 occurrences of "nerbixa" have been replaced with "zinvero" in the following files:

### 📁 Files Modified
1. `app/api/payment/networx/route.ts` - Payment URLs and webhooks
2. `app/api/webhooks/payment/route.ts` - Email templates and domains  
3. `app/(landing)/(policies)/privacy-policy/page.tsx` - Legal domain references
4. `NETWORX_ENV_SETUP.md` - Environment configuration URLs
5. `components/mobile-nav.tsx` - Dashboard navigation URLs
6. `constants.ts` - 17+ dashboard and tool URLs

---

## 🚨 BREAKING CHANGES: IMMEDIATE COORDINATION REQUIRED

### 1. **Domain Infrastructure** 
**Critical Impact**: All URLs now point to `zinvero.com` instead of `nerbixa.com`

**⚠️ REQUIRED ACTIONS**:
- **Purchase/Setup zinvero.com domain**
- **Configure DNS for zinvero.com** 
- **SSL certificates for zinvero.com**
- **Update hosting/CDN configurations**
- **Without this**: All external links will be broken immediately

### 2. **Payment System URLs**
**File**: `app/api/payment/networx/route.ts`
**Changes**:
- `NETWORX_RETURN_URL=https://nerbixa.com/payment/success` → `https://zinvero.com/payment/success`
- `NETWORX_WEBHOOK_URL=https://nerbixa.com/api/webhooks/networx` → `https://zinvero.com/api/webhooks/networx`

**⚠️ REQUIRED ACTIONS**:
- **Update payment provider (Networx) configuration**
- **Update webhook URLs in payment processor dashboard**
- **Test payment flows end-to-end**
- **Without this**: Payments will fail, webhooks won't work

### 3. **Email System**
**File**: `app/api/webhooks/payment/route.ts`
**Changes**:
- `support@nerbixa.com` → `support@zinvero.com`
- Email templates referencing `nerbixa.com` → `zinvero.com`

**⚠️ REQUIRED ACTIONS**:
- **Setup email infrastructure for zinvero.com**
- **Configure support@zinvero.com email address**
- **Update email DNS records (MX, SPF, DKIM)**
- **Test email delivery**
- **Without this**: Customer support emails will fail

### 4. **Dashboard URLs (17+ occurrences)**
**File**: `constants.ts`
**All dashboard tool URLs changed from**:
- `https://nerbixa.com/dashboard/*` → `https://zinvero.com/dashboard/*`

**⚠️ REQUIRED ACTIONS**:
- **Ensure all dashboard routes work on zinvero.com**
- **Update any external integrations pointing to these URLs**
- **Test all tool integrations**

### 5. **Legal/Privacy Policy**
**File**: `app/(landing)/(policies)/privacy-policy/page.tsx`
**Domain references updated**

**⚠️ REQUIRED ACTIONS**:
- **Legal review of domain name changes in policies**
- **Ensure compliance with data protection regulations**

---

## 🚦 DEPLOYMENT SEQUENCE (CRITICAL)

### Phase 1: Infrastructure Setup
1. Purchase and configure `zinvero.com` domain
2. Setup DNS, SSL certificates
3. Configure hosting/CDN for new domain
4. Setup email infrastructure (support@zinvero.com)

### Phase 2: External Services  
1. Update payment processor (Networx) webhook URLs
2. Update any external API integrations
3. Test payment flows in staging environment

### Phase 3: Testing
1. Full end-to-end testing on staging with zinvero.com
2. Test all payment flows
3. Test email delivery
4. Test all dashboard tools

### Phase 4: Go-Live
1. Deploy to production
2. Monitor for broken links/integrations
3. Update any remaining external references

---

## 🔧 Environment Variables That Need Updating

```bash
# Update these in production environment
NETWORX_RETURN_URL=https://zinvero.com/payment/success
NETWORX_CANCEL_URL=https://zinvero.com/payment/cancel  
NETWORX_WEBHOOK_URL=https://zinvero.com/api/webhooks/networx

# Email configuration
SUPPORT_EMAIL=support@zinvero.com
COMPANY_DOMAIN=zinvero.com
```

---

## ⚠️ ROLLBACK PLAN

If issues occur:
1. Keep nerbixa.com infrastructure running in parallel
2. Quick rollback: revert this commit and redeploy
3. DNS failover back to nerbixa.com if needed

---

## 🎯 Testing Checklist

- [ ] zinvero.com domain resolves correctly
- [ ] SSL certificate valid for zinvero.com
- [ ] Payment flows work end-to-end
- [ ] Webhook notifications received
- [ ] Email delivery from support@zinvero.com works
- [ ] All dashboard tools load and function
- [ ] Privacy policy displays correctly
- [ ] No broken links in application

---

**🚨 CRITICAL**: Do not deploy to production until ALL infrastructure and external services are properly configured for zinvero.com domain.
