# 🍳 AI Recipe Generator

An AI-powered recipe generator built in 30 minutes for the Stripe Projects Hackathon!

## Features

- 🤖 **AI-Powered**: Uses OpenRouter's free AI models to generate creative recipes
- 💾 **Save Favorites**: Store your favorite recipes in a Neon Postgres database
- 🚀 **Fast & Simple**: Clean, responsive UI that works on any device
- 🔒 **Secure**: Built with input validation and parameterized queries

## Tech Stack

- **AI**: OpenRouter (free tier with Llama 3.2)
- **Database**: Neon Postgres (serverless)
- **Hosting**: Vercel (hobby plan)
- **Auth Ready**: Clerk integration (not implemented in MVP)

## How It Works

1. Enter ingredients you have on hand
2. Add any dietary preferences or restrictions
3. Click "Generate Recipe" and let AI create a custom recipe
4. Save your favorites to access them later

## Setup with Stripe Projects

This project was initialized and provisioned using the Stripe Projects CLI:

```bash
stripe projects init recipe-generator
stripe projects add openrouter/free
stripe projects add neon/free
stripe projects add neon/postgres
stripe projects add clerk/auth
stripe projects add vercel/hobby
stripe projects env --pull
```

## Local Development

1. Clone this repository
2. Install dependencies: `npm install`
3. Run locally: `npm run dev`
4. Open http://localhost:3000

## Deploy

Deploy to Vercel:
```bash
vercel --prod
```

Or push to GitHub and connect to Vercel for automatic deployments.

## Environment Variables

All environment variables are automatically managed by Stripe Projects:
- `OPENROUTER_PLAN_2_API_KEY`: OpenRouter API key
- `NEON_POSTGRES_CONNECTION_STRING`: Neon database connection
- `VERCEL_*`: Vercel deployment credentials

## Built For

Stripe Projects Hackathon - June 30, 2026

**Time to Build**: ~30 minutes from init to deploy
