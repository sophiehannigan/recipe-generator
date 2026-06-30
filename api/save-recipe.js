import { Client } from 'pg';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    const client = new Client({
        connectionString: process.env.NEON_POSTGRES_CONNECTION_STRING,
        ssl: { rejectUnauthorized: false }
    });
    
    try {
        const { recipe, ingredients } = req.body;
        
        if (!recipe || !ingredients) {
            return res.status(400).json({ error: 'Recipe and ingredients are required' });
        }
        
        await client.connect();
        
        // Create table if it doesn't exist
        await client.query(`
            CREATE TABLE IF NOT EXISTS recipes (
                id SERIAL PRIMARY KEY,
                ingredients TEXT NOT NULL,
                recipe_text TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        // Insert the recipe using parameterized query
        const result = await client.query(
            'INSERT INTO recipes (ingredients, recipe_text) VALUES ($1, $2) RETURNING id',
            [ingredients, recipe]
        );
        
        return res.status(200).json({ 
            success: true, 
            id: result.rows[0].id 
        });
        
    } catch (error) {
        console.error('Error saving recipe:', error);
        return res.status(500).json({ error: 'Failed to save recipe: ' + error.message });
    } finally {
        await client.end();
    }
}
