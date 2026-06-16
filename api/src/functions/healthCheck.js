/**
 * Health Check Endpoint
 * 
 * URL: /api/healthCheck
 * Method: GET
 * Auth: None required (anonymous)
 * 
 * WHAT IT DOES:
 * 1. Tests database connection
 * 2. Returns system status as JSON
 * 3. Returns HTTP 200 if healthy, 503 if unhealthy
 * 
 * WHY IT EXISTS:
 * - Azure Portal can monitor this endpoint
 * - Developers can quickly test if backend is working
 * - Shows which database type is configured
 * 
 * EXAMPLE RESPONSE (healthy):
 * {
 *   "status": "healthy",
 *   "timestamp": "2025-05-07T10:30:00.000Z",
 *   "database": "connected",
 *   "dbType": "postgres",
 *   "environment": "development"
 * }
 * 
 * EXAMPLE RESPONSE (unhealthy):
 * {
 *   "status": "unhealthy",
 *   "timestamp": "2025-05-07T10:30:00.000Z",
 *   "database": "disconnected",
 *   "error": "Connection timeout",
 *   "environment": "production"
 * }
 */

const { app } = require('@azure/functions');
const db = require('../db');
const logger = require('../utils/logger');

app.http('healthCheck', {
    methods: ['GET'],
    authLevel: 'anonymous', // No login required (it's a health check)
    handler: async (request, context) => {
        // Setup logging
        logger.setContext(context);
        logger.info('Health check requested');

        // Build response object
        const health = {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            database: 'dev db',
            environment: 'development'
        };

        // Test database connection
        try {
            // Test basic connectivity
            await db.query('SELECT 1', []);
            health.database = 'connected';
            health.dbType = process.env.DB_TYPE || 'postgres';

            // Test that the assessments table exists and has the right columns
            const tableCheck = await db.query(
              `SELECT column_name FROM information_schema.columns 
               WHERE table_name = 'assessments' ORDER BY ordinal_position`, []
            );
            health.tableExists = tableCheck.length > 0;
            health.columns = tableCheck.map(r => r.column_name);
            
        } catch (error) {
            // Database connection failed
            health.status = 'unhealthy';
            health.database = 'disconnected';
            health.error = error.message;
            logger.error('Database health check failed:', error);
        }

        // Return appropriate HTTP status code
        // 200 = OK, 503 = Service Unavailable
        return {
            status: health.status === 'healthy' ? 200 : 503,
            jsonBody: health
        };
    }
});
