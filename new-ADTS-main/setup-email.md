# 🚨 URGENT: Email Setup Required

The contact form is getting an `EAUTH` error because Gmail authentication isn't set up yet.

## Quick Fix (5 minutes):

### Step 1: Create `.env.local` file
Create a new file called `.env.local` in the root directory (same level as package.json) with this content:

```
EMAIL_USER=kwihpatric69@gmail.com
EMAIL_PASS=your_app_password_here
```

### Step 2: Get Gmail App Password
1. Go to https://myaccount.google.com/security
2. Enable **2-Step Verification** if not already enabled
3. Go to **App passwords** section
4. Generate a new app password for "Mail"
5. Copy the 16-character password (like: `abcd efgh ijkl mnop`)
6. Replace `your_app_password_here` in `.env.local` with this password

### Step 3: Restart Development Server
```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

## Example `.env.local` file:
```
```

⚠️ **Important**: 
- Use the 16-character App Password, NOT your regular Gmail password
- The `.env.local` file should be in the root directory
- Restart the dev server after creating the file

## Alternative: Test Without Email
If you want to test the form without setting up email, I can temporarily add a fallback mode that logs messages instead of sending emails.
