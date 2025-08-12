# Supabase Setup Guide for Agri-Connect

This guide will walk you through setting up Supabase as the backend for your Agri-Connect application.

## Prerequisites

- A Supabase account (sign up at [supabase.com](https://supabase.com))
- Node.js and npm installed
- Basic understanding of SQL and database concepts

## Step 1: Create a New Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Fill in project details:
   - **Name**: `agri-connect`
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose the closest region to your users
   - **Pricing Plan**: Start with the free tier
5. Click "Create new project"
6. Wait for the project to be created (this may take a few minutes)

## Step 2: Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (something like `https://your-project-id.supabase.co`)
   - **Project API Keys** → **anon public** (this is safe to use in your frontend)
   - **Project API Keys** → **service_role** (keep this secret, for server-side operations)

## Step 3: Configure Environment Variables

1. In your project root, update your `.env.local` file:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

2. Make sure `.env.local` is in your `.gitignore` file (it should be already)

## Step 4: Set Up the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the entire contents of `supabase/schema.sql` and paste it into the editor
4. Click "Run" to execute the schema
5. Verify that all tables were created by checking the **Table Editor**

## Step 5: Configure Authentication

### Email Settings
1. Go to **Authentication** → **Settings**
2. Under **Site URL**, add:
   - `http://localhost:3000` (for development)
   - Your production URL when you deploy
3. Under **Redirect URLs**, add:
   - `http://localhost:3000/auth/callback`
   - Your production callback URL

### Email Templates (Optional)
1. Go to **Authentication** → **Email Templates**
2. Customize the templates or use the ones provided in `supabase/templates/`

## Step 6: Set Up Storage Buckets

1. Go to **Storage** in your Supabase dashboard
2. Create the following buckets:

### Avatars Bucket
- **Name**: `avatars`
- **Public**: ✅ Yes
- **File size limit**: 2MB
- **Allowed MIME types**: `image/*`

### Products Bucket
- **Name**: `products`
- **Public**: ✅ Yes
- **File size limit**: 5MB
- **Allowed MIME types**: `image/*`

### Chat Files Bucket
- **Name**: `chat-files`
- **Public**: ❌ No
- **File size limit**: 10MB
- **Allowed MIME types**: `image/*, application/pdf, text/*`

## Step 7: Configure Storage Policies

For each bucket, you need to set up Row Level Security policies:

### Avatars Policies
```sql
-- Allow public read access
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
    FOR SELECT USING (bucket_id = 'avatars');

-- Allow users to upload their own avatar
CREATE POLICY "Users can upload own avatar" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'avatars' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- Allow users to update their own avatar
CREATE POLICY "Users can update own avatar" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'avatars' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- Allow users to delete their own avatar
CREATE POLICY "Users can delete own avatar" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'avatars' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );
```

### Products Policies
```sql
-- Allow public read access
CREATE POLICY "Product images are publicly accessible" ON storage.objects
    FOR SELECT USING (bucket_id = 'products');

-- Allow producers to upload product images
CREATE POLICY "Producers can upload product images" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'products' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- Allow producers to update their product images
CREATE POLICY "Producers can update product images" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'products' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- Allow producers to delete their product images
CREATE POLICY "Producers can delete product images" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'products' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );
```

### Chat Files Policies
```sql
-- Allow users to access files in their chats
CREATE POLICY "Users can access chat files" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'chat-files' AND
        EXISTS (
            SELECT 1 FROM chats 
            WHERE (participant_1 = auth.uid() OR participant_2 = auth.uid())
            AND chats.id::text = (storage.foldername(name))[1]
        )
    );

-- Allow users to upload files to their chats
CREATE POLICY "Users can upload chat files" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'chat-files' AND
        EXISTS (
            SELECT 1 FROM chats 
            WHERE (participant_1 = auth.uid() OR participant_2 = auth.uid())
            AND chats.id::text = (storage.foldername(name))[1]
        )
    );
```

## Step 8: Test Your Setup

1. Start your development server:
```bash
npm run dev
```

2. Check that your app can connect to Supabase:
   - Open your browser's developer tools
   - Go to your app at `http://localhost:3000`
   - Check the console for any Supabase connection errors

3. Test the database connection by trying to sign up a new user

## Step 9: Optional - Set Up Real-time Subscriptions

If you want real-time features (like live chat), enable real-time for specific tables:

1. Go to **Database** → **Replication**
2. Enable replication for:
   - `messages` (for real-time chat)
   - `notifications` (for real-time notifications)
   - `orders` (for real-time order updates)

## Step 10: Production Considerations

### Security
- Never expose your `service_role` key in client-side code
- Review and test all RLS policies
- Enable 2FA on your Supabase account
- Regularly rotate your API keys

### Performance
- Set up database indexes for frequently queried columns
- Consider enabling connection pooling for high-traffic applications
- Monitor your database performance in the Supabase dashboard

### Backup
- Enable automatic backups in your Supabase project settings
- Consider setting up additional backup strategies for critical data

## Troubleshooting

### Common Issues

1. **"Invalid API key" error**
   - Check that your environment variables are correctly set
   - Ensure you're using the correct project URL and API key
   - Restart your development server after changing environment variables

2. **RLS policy errors**
   - Check that RLS is enabled on your tables
   - Verify that your policies are correctly written
   - Test policies in the Supabase SQL editor

3. **Storage upload errors**
   - Verify that storage buckets are created
   - Check that storage policies are correctly configured
   - Ensure file sizes are within limits

### Getting Help

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord Community](https://discord.supabase.com)
- [Supabase GitHub Issues](https://github.com/supabase/supabase/issues)

## Next Steps

Once your Supabase setup is complete, you can:

1. Implement user authentication in your Next.js app
2. Create user registration and login forms
3. Build user profile management
4. Implement product management features
5. Add real-time chat functionality

---

**Note**: Keep your database credentials secure and never commit them to version control. Always use environment variables for sensitive configuration.