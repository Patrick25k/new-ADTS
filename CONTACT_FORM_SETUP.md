# Contact Form Setup Guide

## Current Status
✅ Contact form is fully functional with nodemailer enabled  
✅ All UI components working (loading states, success/error messages)  
✅ Form validation implemented  
✅ Auto-reply functionality ready  
✅ Nodemailer package installed and configured

## To Enable Actual Email Sending

### Step 1: ✅ Dependencies Installed
Nodemailer is already installed and configured.

### Step 2: Set Up Gmail App Password
1. Go to your Gmail account settings
2. Enable 2-Factor Authentication
3. Generate an "App Password" for this application
4. Copy the 16-character app password

### Step 3: Create Environment File
Create a `.env.local` file in the root directory with:
```
EMAIL_USER=jeandamour013@gmail.com
EMAIL_PASS=your_gmail_app_password_here
```
Replace `your_gmail_app_password_here` with your actual Gmail app password.

### Step 4: ✅ Email Code Enabled
The nodemailer code is already enabled and ready to use.

## Testing the Contact Form

1. Navigate to `/contact` page
2. Fill out the form with valid information
3. Click "Send Message"
4. Watch for:
   - Button changes to "Sending..." with spinner
   - Success message appears after submission
   - Form clears automatically
   - Console logs show simulated email details (in development)

## Email Templates

The system sends two emails:
1. **Admin Notification**: Formatted email to jeandamour013@gmail.com with contact details
2. **Auto-Reply**: Professional confirmation email to the form submitter

Both emails include:
- ADTS Rwanda branding
- Responsive HTML design
- Contact information
- Timestamp in Rwanda timezone
