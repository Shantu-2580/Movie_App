# Supabase Setup Guide for Movie App

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - **Name**: `movie-app` (or your preferred name)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose closest to your users
6. Click "Create new project"
7. Wait for the project to be created (takes 1-2 minutes)

## Step 2: Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **anon public** key (starts with `eyJ...`)

## Step 3: Create the Database Table

1. In your Supabase dashboard, go to **Table Editor**
2. Click **"Create a new table"**
3. Configure the table:
   - **Name**: `trending_searches`
   - **Description**: `Stores trending movie search data`
4. Add these columns:

| Column Name | Type | Default Value | Primary Key | Nullable |
|-------------|------|---------------|-------------|----------|
| `id` | `int8` | `auto-increment` | ✅ Yes | ❌ No |
| `searchTerm` | `text` | - | ❌ No | ❌ No |
| `movie_id` | `int4` | - | ❌ No | ❌ No |
| `title` | `text` | - | ❌ No | ❌ No |
| `count` | `int4` | `1` | ❌ No | ❌ No |
| `poster_url` | `text` | - | ❌ No | ✅ Yes |
| `created_at` | `timestamptz` | `now()` | ❌ No | ❌ No |
| `updated_at` | `timestamptz` | `now()` | ❌ No | ❌ No |

5. Click **"Save"**

## Step 4: Create an Index for Better Performance

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **"New query"**
3. Run this SQL:

```sql
-- Create index for faster trending queries
CREATE INDEX idx_trending_searches_count_desc 
ON trending_searches (count DESC);

-- Create unique index to prevent duplicate search terms
CREATE UNIQUE INDEX idx_trending_searches_search_term 
ON trending_searches (searchTerm);
```

4. Click **"Run"**

## Step 5: Set Up Row Level Security (RLS)

1. In **SQL Editor**, create a new query
2. Run this SQL to enable RLS and create policies:

```sql
-- Enable RLS on the table
ALTER TABLE trending_searches ENABLE ROW LEVEL SECURITY;

-- Policy for reading trending data (public read)
CREATE POLICY "Allow public read access" ON trending_searches
    FOR SELECT USING (true);

-- Policy for inserting new search data (public insert)
CREATE POLICY "Allow public insert" ON trending_searches
    FOR INSERT WITH CHECK (true);

-- Policy for updating search counts (public update)
CREATE POLICY "Allow public update" ON trending_searches
    FOR UPDATE USING (true);
```

3. Click **"Run"**

## Step 6: Configure Environment Variables

1. In your project root, create/update `.env` file:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
EXPO_PUBLIC_SUPABASE_TRENDING_TABLE=trending_searches
```

2. Replace the values with your actual project URL and anon key from Step 2

## Step 7: Test Your Setup

1. Restart your Expo development server:
   ```bash
   npx expo start --clear
   ```

2. Test the app:
   - Go to the Search tab
   - Search for a movie
   - Check if the search gets recorded
   - Go to Home tab to see if trending movies appear

## Step 8: Verify Data in Supabase

1. In your Supabase dashboard, go to **Table Editor**
2. Select `trending_searches` table
3. You should see data being inserted when you search for movies

## Troubleshooting

### Common Issues:

1. **"Invalid API key" error**:
   - Double-check your `EXPO_PUBLIC_SUPABASE_ANON_KEY` in `.env`
   - Make sure there are no extra spaces or quotes

2. **"Table doesn't exist" error**:
   - Verify table name in `EXPO_PUBLIC_SUPABASE_TRENDING_TABLE`
   - Check that the table was created successfully

3. **"Permission denied" error**:
   - Ensure RLS policies are set up correctly (Step 5)
   - Check that the policies allow the operations you need

4. **Data not appearing**:
   - Check the browser/device console for errors
   - Verify environment variables are loaded correctly
   - Restart Expo development server after changing `.env`

### Security Notes:

- The current setup allows public access to read/insert/update trending data
- For production, consider implementing user authentication
- You can restrict access further by modifying the RLS policies
- Consider adding rate limiting to prevent abuse

## Next Steps:

1. **Add user authentication** (optional):
   - Enable Supabase Auth
   - Add user profiles
   - Link searches to specific users

2. **Add saved movies feature**:
   - Create a `saved_movies` table
   - Link to user profiles
   - Implement save/unsave functionality

3. **Add more analytics**:
   - Track user preferences
   - Add movie ratings
   - Implement recommendation engine
