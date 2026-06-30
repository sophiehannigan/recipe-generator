export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    const apiKey = process.env.OPENROUTER_PLAN_2_API_KEY;
    
    if (!apiKey) {
        return res.status(500).json({ 
            error: 'API key not configured',
            envVars: Object.keys(process.env).filter(k => k.includes('OPEN'))
        });
    }
    
    // Test a simple API call
    try {
        const response = await fetch('https://openrouter.ai/api/v1/models', {
            headers: {
                'Authorization': `Bearer ${apiKey}`
            }
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            return res.status(500).json({ 
                error: 'API key test failed',
                status: response.status,
                details: errorText
            });
        }
        
        const data = await response.json();
        
        return res.status(200).json({ 
            success: true,
            apiKeyConfigured: true,
            apiKeyPrefix: apiKey.substring(0, 10) + '...',
            modelsAvailable: data.data ? data.data.length : 0
        });
        
    } catch (error) {
        return res.status(500).json({ 
            error: 'Test failed',
            message: error.message
        });
    }
}
