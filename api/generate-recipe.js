export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        const { ingredients, preferences } = req.body;
        
        if (!ingredients) {
            return res.status(400).json({ error: 'Ingredients are required' });
        }
        
        const apiKey = process.env.OPENROUTER_PLAN_2_API_KEY;
        
        if (!apiKey) {
            return res.status(500).json({ error: 'OpenRouter API key not configured. Please add OPENROUTER_PLAN_2_API_KEY to Vercel environment variables.' });
        }
        
        const prompt = `Create a detailed, delicious recipe using these ingredients: ${ingredients}.
${preferences ? `Additional preferences: ${preferences}` : ''}

Please provide:
1. Recipe name
2. Ingredients list with quantities
3. Step-by-step cooking instructions
4. Estimated cooking time
5. Number of servings

Make it creative and tasty!`;
        
        // Try multiple free models in order of preference
        const models = [
            'google/gemini-2.0-flash-exp:free',
            'meta-llama/llama-3.2-3b-instruct:free',
            'google/gemini-flash-1.5:free',
            'mistralai/mistral-7b-instruct:free'
        ];
        
        let lastError = null;
        
        for (const model of models) {
            try {
                const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`,
                        'HTTP-Referer': 'https://recipe-generator-psi-murex.vercel.app',
                        'X-Title': 'Recipe Generator'
                    },
                    body: JSON.stringify({
                        model: model,
                        messages: [
                            {
                                role: 'system',
                                content: 'You are a professional chef who creates amazing, easy-to-follow recipes.'
                            },
                            {
                                role: 'user',
                                content: prompt
                            }
                        ],
                        max_tokens: 1000
                    })
                });
                
                if (response.ok) {
                    const data = await response.json();
                    const recipe = data.choices?.[0]?.message?.content;
                    
                    if (recipe) {
                        return res.status(200).json({ recipe });
                    }
                }
                
                // If rate limited, try next model
                if (response.status === 429) {
                    continue;
                }
                
                lastError = await response.text();
            } catch (err) {
                lastError = err.message;
                continue;
            }
        }
        
        // All models failed - use demo recipe
        const demoRecipe = `🍳 ${ingredients.split(',')[0].trim().toUpperCase()} DELIGHT

📝 INGREDIENTS:
${ingredients.split(',').map((ing, i) => `• ${ing.trim()} - ${['2 cups', '1 lb', '3 cloves', '1 tbsp', '2 tsp'][i % 5]}`).join('\n')}
• Salt and pepper to taste
• Olive oil for cooking
${preferences ? `\n(Style: ${preferences})` : ''}

👨‍🍳 INSTRUCTIONS:

1. Prep & Season
   - Wash and prepare all ingredients
   - Season with salt and pepper

2. Heat & Cook
   - Heat olive oil in a large pan over medium-high heat
   - Add main ingredients and cook until golden (5-7 minutes)

3. Combine & Simmer  
   - Mix all ingredients together
   - Reduce heat and simmer for 10-15 minutes

4. Serve & Enjoy
   - Plate your creation beautifully
   - Garnish with fresh herbs if available

⏱️ TIME: 25-30 minutes
🍽️ SERVES: 4 people

💡 TIP: This is a demo recipe! AI models are busy due to hackathon traffic. The app will automatically use real AI when available.

✨ Your recipe has been generated! Click "Save to Favorites" to test the database functionality.`;
        
        return res.status(200).json({ 
            recipe: demoRecipe,
            isDemo: true
        });
        
    } catch (error) {
        console.error('Error generating recipe:', error);
        return res.status(500).json({ error: 'Internal server error: ' + error.message });
    }
}
