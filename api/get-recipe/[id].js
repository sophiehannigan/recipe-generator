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
        const { id } = req.query;
        
        if (!id) {
            return res.status(400).json({ error: 'Recipe ID is required' });
        }
        
        await client.connect();
        
        // Use parameterized query to prevent SQL injection
        const result = await client.query(
            'SELECT * FROM recipes WHERE id = $1',
            [id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Recipe not found' });
        }
        
        return res.status(200).json({ recipe: result.rows[0] });
        
    } catch (error) {
        console.error('Error fetching recipe:', error);
        return res.status(500).json({ error: 'Failed to fetch recipe: ' + error.message });
    } finally {
        await client.end();
    }
}
