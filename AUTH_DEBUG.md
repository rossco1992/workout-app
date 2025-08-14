# Authentication Debug Guide

## Common Issues and Solutions

### 1. Supabase URL Issue
- **Problem**: Space in URL causing connection failures
- **Solution**: Fixed URL from `"https:// ugrbcpzljaaiinynewtu.supabase.co"` to `"https://ugrbcpzljaaiinynewtu.supabase.co"`

### 2. Email Confirmation Required
- **Problem**: Users can't sign in because email confirmation is required
- **Solution**: 
  1. Go to Supabase Dashboard → Authentication → Settings
  2. Disable "Enable email confirmations" for testing
  3. Or check your email for confirmation link

### 3. Database Schema Issues
- **Problem**: RLS policies blocking access
- **Solution**: Check if RLS policies are properly configured

### 4. CORS Issues
- **Problem**: Browser blocking requests
- **Solution**: Check Supabase project settings for allowed origins

## Testing Steps

1. **Test Database Connection**: Use the AuthTest component
2. **Check Browser Console**: Look for error messages
3. **Verify Supabase Settings**: Ensure auth is properly configured
4. **Test with Simple Credentials**: Try signing up with a simple email/password

## Debug Commands

```bash
# Check if dev server is running
npm run dev

# Check browser console for errors
# Look for authentication-related errors
```

## Next Steps

1. Test the connection using AuthTest component
2. Check browser console for specific error messages
3. Verify Supabase project settings
4. Try signing up with a new account
