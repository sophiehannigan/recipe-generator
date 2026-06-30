import { Client } from 'pg';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    const client = new Client({
        connectionString: process.env.NEON_POSTGRES_CONNECTION_STRING,
        ssl: { rejectUnauthorized: false }
    });
    
    try {
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
        
        const result = await client.query(
            'SELECT id, ingredients, created_at FROM recipes ORDER BY created_at DESC LIMIT 50'
        );
        
        return res.status(200).json({ recipes: result.rows });
        
    } catch (error) {
        console.error('Error fetching recipes:', error);
        return res.status(500).json({ error: 'Failed to fetch recipes: ' + error.message });
    } finally {
        await client.end();
    }
}
