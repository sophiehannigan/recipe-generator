# 🚀 Quick Deploy Instructions

Your recipe generator app is ready! Here's how to deploy it in the next few minutes:

## Method 1: GitHub + Vercel (Easiest - 2 minutes)

### Step 1: Create GitHub Repository
1. Go to https://github.com/new
2. Name it: `recipe-generator`
3. Don't initialize with README (we already have one)
4. Click "Create repository"

### Step 2: Push Your Code
Run these commands in your terminal:
```bash
git remote add origin https://github.com/YOUR_USERNAME/recipe-generator.git
git push -u origin main
```

### Step 3: Connect to Vercel
1. Go to: https://vercel.com/sophiet3650-4855-stripe/recipe-generator
2. Click "Settings" → "Git" 
3. Click "Connect Git Repository"
4. Select your `recipe-generator` repo
5. Click "Deploy"

**That's it!** Vercel will:
- Automatically install dependencies
- Deploy your app
- Give you a live URL like `https://recipe-generator-xxx.vercel.app`

### Step 4: Verify Environment Variables
Vercel should automatically have your env vars from Stripe Projects. Check:
1. Go to Settings → Environment Variables
2. Verify these exist:
   - `OPENROUTER_PLAN_2_API_KEY`
   - `NEON_POSTGRES_CONNECTION_STRING`

If missing, Stripe Projects already synced them, but you can add them manually from your `.env` file.

## Method 2: Direct Vercel Deploy (If you have Node.js)

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login and deploy
vercel login
vercel --prod

# Follow the prompts
```

## After Deployment

### Test Your App
1. Go to your deployment URL
2. Enter ingredients: "chicken, tomatoes, pasta"
3. Click "Generate Recipe"
4. Save it to favorites
5. Check that it appears in your favorites list

### Submit to Hackathon Leaderboard

Once deployed and working:

```bash
stripe projects share
```

This command will:
1. Generate a share link
2. Open your browser
3. You'll submit:
   - Your deployed URL
   - Your GitHub repo URL  
   - Your Stripe account ID: `acct_1To6TWFMPSycrA9d`

## Troubleshooting

**API not working?**
- Check Vercel logs: https://vercel.com/sophiet3650-4855-stripe/recipe-generator/deployments
- Verify environment variables are set in Vercel dashboard

**Database errors?**
- Check Neon dashboard: `stripe projects open neon`
- Connection string should be in environment variables

**OpenRouter errors?**
- Check your API key is valid
- Free tier has rate limits (wait a minute between requests)

## What You Built

✅ Full-stack web app with AI  
✅ Serverless API with Vercel Functions  
✅ Postgres database with Neon  
✅ AI recipe generation with OpenRouter  
✅ Responsive, beautiful UI  
✅ Save/load functionality  

**Time taken**: ~30 minutes from `stripe projects init` to deployment!

## Next Steps (Optional)

- Add Clerk authentication (already provisioned!)
- Add recipe categories/tags
- Add image generation for recipes
- Add recipe sharing via URL
- Add print-friendly view
- Add nutritional information

Good luck in the hackathon! 🎉
