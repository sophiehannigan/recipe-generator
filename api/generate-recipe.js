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
            return res.status(500).json({ error: 'OpenRouter API key not configured' });
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
        
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
                'HTTP-Referer': 'https://recipe-generator.vercel.app',
                'X-Title': 'Recipe Generator'
            },
            body: JSON.stringify({
                model: 'meta-llama/llama-3.2-3b-instruct:free',
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
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('OpenRouter error:', errorText);
            return res.status(500).json({ error: 'Failed to generate recipe from AI' });
        }
        
        const data = await response.json();
        const recipe = data.choices?.[0]?.message?.content;
        
        if (!recipe) {
            return res.status(500).json({ error: 'No recipe generated' });
        }
        
        return res.status(200).json({ recipe });
        
    } catch (error) {
        console.error('Error generating recipe:', error);
        return res.status(500).json({ error: 'Internal server error: ' + error.message });
    }
}
