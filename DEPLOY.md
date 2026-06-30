# Deployment Guide

## Option 1: Deploy via GitHub (Recommended)

1. Create a new repository on GitHub
2. Push your code:
```bash
git remote add origin https://github.com/YOUR_USERNAME/recipe-generator.git
git branch -M main
git push -u origin main
```

3. Go to your Vercel project: https://vercel.com/sophiet3650-4855-stripe/recipe-generator
4. Click "Settings" → "Git"
5. Connect your GitHub repository
6. Vercel will automatically deploy!

## Option 2: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel --token=$VERCEL_TOKEN
```

## After Deployment

Your app will be live at a URL like: `https://recipe-generator-xxx.vercel.app`

### Important: Set Environment Variables in Vercel

The environment variables from `.env` need to be added to Vercel:

1. Go to: https://vercel.com/sophiet3650-4855-stripe/recipe-generator/settings/environment-variables
2. Add these variables:
   - `OPENROUTER_PLAN_2_API_KEY`
   - `NEON_POSTGRES_CONNECTION_STRING`
   - `CLERK_APPLICATION_ID`
   - `CLERK_ENVIRONMENTS`

Or run:
```bash
stripe projects env --pull
```

Then copy the values to Vercel's dashboard.

## Submit to Leaderboard

Once deployed:

```bash
stripe projects share
```

This generates a share link for the hackathon leaderboard!
