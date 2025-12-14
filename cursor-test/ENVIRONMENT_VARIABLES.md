# Environment Variables

This document lists all environment variables required for the KoloHealth project.

## Required Environment Variables

### Supabase Configuration (Required)

These are the **minimum required** environment variables to run the app:

```bash
# Supabase Project URL
# Get this from your Supabase project settings: https://app.supabase.com/project/_/settings/api
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co

# Supabase Anonymous Key (Public Key)
# Get this from your Supabase project settings: https://app.supabase.com/project/_/settings/api
# This is safe to expose in client-side code
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

**Where to find these:**

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API**
3. Copy the **Project URL** and **anon/public key**

## Optional Environment Variables

### For Production/Advanced Features

These are optional and may be needed for specific features:

```bash
# Supabase Service Role Key (Server-side only - DO NOT expose in client)
# Only use this in server-side code or Edge Functions
# NEVER commit this to your repository or use in client-side code
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Push Notifications (if using Expo Notifications)
# Get from Expo dashboard: https://expo.dev/accounts/[account]/projects/[project]/credentials
EXPO_PUBLIC_PUSH_NOTIFICATION_KEY=your_push_notification_key

# Video Consultation Service (if using Agora, Twilio, etc.)
# Agora
EXPO_PUBLIC_AGORA_APP_ID=your_agora_app_id
EXPO_PUBLIC_AGORA_APP_CERTIFICATE=your_agora_certificate

# Twilio Video
EXPO_PUBLIC_TWILIO_ACCOUNT_SID=your_twilio_account_sid
EXPO_PUBLIC_TWILIO_API_KEY=your_twilio_api_key
EXPO_PUBLIC_TWILIO_API_SECRET=your_twilio_api_secret

# File Upload Limits (optional - can be set in code)
EXPO_PUBLIC_MAX_FILE_SIZE_MB=10
EXPO_PUBLIC_ALLOWED_FILE_TYPES=image/jpeg,image/png,application/pdf

# API Endpoints (if using custom backend)
EXPO_PUBLIC_API_URL=https://api.yourdomain.com
EXPO_PUBLIC_API_VERSION=v1
```

## Setup Instructions

### 1. Create Environment File

Create a `.env.local` file in the root of your project:

```bash
# Copy the example file (if it exists)
cp .env.example .env.local

# Or create manually
touch .env.local
```

### 2. Add Required Variables

Add the required Supabase variables to `.env.local`:

```bash
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 3. Load Environment Variables

Expo automatically loads environment variables prefixed with `EXPO_PUBLIC_` from `.env.local` files.

**Important Notes:**

- Variables must be prefixed with `EXPO_PUBLIC_` to be accessible in client-side code
- Never commit `.env.local` to version control (it's in `.gitignore`)
- Restart your Expo development server after changing environment variables

### 4. Verify Setup

Check that your environment variables are loaded:

```typescript
// In your code, you can check:
console.log("Supabase URL:", process.env.EXPO_PUBLIC_SUPABASE_URL);
console.log(
  "Supabase Key:",
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ? "Set" : "Missing"
);
```

## Environment File Structure

### `.env.local` (Local Development)

```bash
EXPO_PUBLIC_SUPABASE_URL=https://your-dev-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_dev_anon_key
```

### `.env.production` (Production - if using EAS Build)

```bash
EXPO_PUBLIC_SUPABASE_URL=https://your-prod-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_prod_anon_key
```

## Security Best Practices

1. **Never commit secrets:**

   - `.env.local` is in `.gitignore`
   - Never commit API keys or secrets to version control

2. **Use different keys for different environments:**

   - Development: Use a separate Supabase project or test keys
   - Production: Use production Supabase project keys

3. **Client-side vs Server-side:**

   - `EXPO_PUBLIC_*` variables are exposed to client-side code
   - Only use public/anonymous keys in client-side code
   - Never use service role keys in client-side code

4. **Rotate keys regularly:**
   - Rotate API keys periodically
   - Revoke old keys when rotating

## Troubleshooting

### Variables not loading?

1. **Check file name:** Must be `.env.local` (not `.env`)
2. **Check prefix:** Must start with `EXPO_PUBLIC_`
3. **Restart server:** Restart Expo dev server after changes
4. **Check location:** File must be in project root

### Getting "Supabase URL or Anon Key is missing" warning?

- Verify your `.env.local` file exists
- Check that variable names are exactly: `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- Restart your Expo development server
- Check for typos in variable names

## Example `.env.local` File

```bash
# ============================================
# KoloHealth Environment Variables
# ============================================

# Supabase Configuration (Required)
EXPO_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.example

# Optional: File Upload Configuration
EXPO_PUBLIC_MAX_FILE_SIZE_MB=10

# Optional: API Configuration (if using custom backend)
# EXPO_PUBLIC_API_URL=https://api.kolohealth.com
```

## Next Steps

1. Create your Supabase project at https://supabase.com
2. Get your project URL and anon key from the API settings
3. Create `.env.local` file with the required variables
4. Restart your Expo development server
5. Verify the app connects to Supabase successfully
