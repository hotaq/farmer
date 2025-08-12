# Demo Login Instructions

This application now includes demo users for easy testing of the login functionality.

## Demo Accounts

### Producer Account
- **Email**: `producer@demo.com`
- **Password**: `demo`
- **User Type**: Producer
- **Full Name**: Demo Producer
- **Location**: California, USA

### Partner Account
- **Email**: `partner@demo.com`
- **Password**: `demo`
- **User Type**: Partner
- **Full Name**: Demo Partner
- **Location**: New York, USA

## How to Test

1. **Navigate to Sign In**: Go to `/auth/signin`
2. **Use Demo Credentials**: Enter one of the demo email addresses and use `demo` as the password
3. **Access Dashboard**: After successful login, you'll be redirected to the dashboard
4. **View User Info**: The dashboard will display the logged-in user's information

## Features Available

- ✅ User registration (creates new accounts)
- ✅ User login with demo accounts
- ✅ Dashboard access for authenticated users
- ✅ User session persistence (stays logged in after page refresh)
- ✅ Sign out functionality
- ✅ Route protection (redirects to login if not authenticated)

## Creating New Accounts

You can still create new accounts through the signup form at `/auth/signup`. New accounts will be stored alongside the demo accounts.

## Technical Notes

- All user data is stored in browser localStorage
- Demo users are automatically created on first app load
- Password for demo accounts is always `demo`
- Custom accounts can use any password
- Data persists until localStorage is cleared

## Quick Test Steps

1. Open the application
2. Go to Sign In page
3. Enter: `producer@demo.com` / `demo`
4. Click Sign In
5. Verify you're redirected to dashboard
6. Check that user info displays correctly
7. Test Sign Out functionality
8. Verify you're redirected to home page