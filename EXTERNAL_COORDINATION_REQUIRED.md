# ⚠️ EXTERNAL COORDINATION REQUIRED

## Changes Applied: "neuvisia" → "zinvero"

All 6 occurrences of "neuvisia" have been replaced with "zinvero" in the following files:

### 📁 Files Modified
1. `components/shared/MediaUploader.tsx` - Line 69
2. `package.json` - Line 2  
3. `package-lock.json` - Lines 2, 8
4. `.github/workflows/deploy.yml` - Lines 35, 36

---

## 🚨 CRITICAL: External Services Must Be Updated

### 1. **Cloudinary Integration** 
**File**: `components/shared/MediaUploader.tsx`
**Change**: `uploadPreset="neuvisia"` → `uploadPreset="zinvero"`

**⚠️ REQUIRED ACTION**:
- Create new upload preset named "zinvero" in your Cloudinary account
- Configure it with the same settings as the "neuvisia" preset
- **Without this**: Image uploads will fail immediately

### 2. **CI/CD Deployment**
**File**: `.github/workflows/deploy.yml`
**Changes**: 
- `TARGET_DIR: /var/www/neuvisia` → `TARGET_DIR: /var/www/zinvero`
- `APP_NAME: neuvisia` → `APP_NAME: zinvero`

**⚠️ REQUIRED ACTION**:
- Update server configuration to expect "zinvero" app name
- Create/update directory `/var/www/zinvero` on deployment server
- Update nginx/apache server blocks to match new app name
- **Without this**: Deployments will fail

### 3. **NPM Package Name**
**Files**: `package.json`, `package-lock.json`
**Change**: `"name": "neuvisia"` → `"name": "zinvero"`

**⚠️ REQUIRED ACTION**:
- If published to npm: Reserve "zinvero" package name
- Update any internal references to the package name
- **Impact**: Build system, dependency resolution

---

## 🔧 Immediate Next Steps

1. **Test locally first**:
   ```bash
   npm install  # Regenerate package-lock.json
   npm run build  # Verify build works
   ```

2. **Update Cloudinary**: Create "zinvero" upload preset

3. **Update deployment infrastructure**: Server paths and app names

4. **Test image uploads**: Verify Cloudinary integration works

5. **Test deployment**: Ensure CI/CD pipeline works

---

## 🎯 Verification Commands

```bash
# Check if build works
npm run build

# Check if image upload works
# (Manual test in browser - upload an image)

# Check if deployment config is ready
# (Coordinate with DevOps/infrastructure team)
```

---

**⚠️ Important**: Do not deploy to production until all external services are coordinated.
