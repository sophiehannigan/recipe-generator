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
        
        // All models failed
        return res.status(503).json({ 
            error: 'All AI services are currently busy. Please try again in a minute.',
            retry: true
        });
        
    } catch (error) {
        console.error('Error generating recipe:', error);
        return res.status(500).json({ error: 'Internal server error: ' + error.message });
    }
}
