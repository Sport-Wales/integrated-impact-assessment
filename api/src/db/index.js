/**
 * Database Connection Manager
 * 
 * This file provides a simple interface for database operations.
 * Functions import this file and call db.query() - that's it.
 * 
 * Supports:
 * - PostgreSQL (recommended for IIA Portal)
 * - SQL Server (fallback option)
 * 
 * Connection pooling is built-in for performance in serverless environment.
 */

const logger = require('../utils/logger');

// Global variables (shared across function invocations in Azure)
let dbClient = null;  // The database driver (pg or mssql)
let pool = null;      // The connection pool

/**
 * Get database connection pool
 * 
 * HOW IT WORKS:
 * 1. First call: Creates new pool, stores it in memory
 * 2. Subsequent calls: Returns existing pool (fast!)
 * 3. If connection dies: Automatically recreates it
 * 
 * This pattern is called "connection pooling" and prevents
 * the serverless function from opening 100 connections when
 * it processes 100 requests.
 */
async function getConnection() {
  // If we already have a working connection, use it
  // IMPORTANT: PostgreSQL pools don't have .connected property - they're always connected once created
  // SQL Server pools have .connected property
  if (pool) {
    const dbType = process.env.DB_TYPE || 'postgres';
    if (dbType === 'postgres') {
      return pool; // PostgreSQL pool is always ready once created
    } else if (dbType === 'sql' && pool.connected) {
      return pool; // SQL Server requires .connected check
    }
  }

  // Read configuration from environment variables
  const dbType = process.env.DB_TYPE || 'postgres';
  const connectionString = process.env.DB_CONNECTION_STRING;

  // Safety check: Make sure connection string exists
  if (!connectionString) {
    throw new Error('DB_CONNECTION_STRING not configured in local.settings.json or Azure Portal');
  }

  try {
    if (dbType === 'postgres') {
      // POSTGRESQL CONNECTION
      // Only load the 'pg' library if we need it (saves memory)
      if (!dbClient) {
        const { Pool } = require('pg');
        dbClient = Pool;
      }
      
      // Create connection pool with these settings:
      // - max: 10 connections maximum (prevents overwhelming database)
      // - idleTimeoutMillis: Close unused connections after 30 seconds
      // - connectionTimeoutMillis: Give up if connection takes > 10 seconds
      pool = new dbClient({
        connectionString,
        ssl: { rejectUnauthorized: false }, // Required for Azure PostgreSQL Flexible Server
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000,
      });

      // Test the connection by running a simple query
      await pool.query('SELECT 1');
      logger.info('PostgreSQL connection established');
      
    } else if (dbType === 'sql') {
      // SQL SERVER CONNECTION
      // Only load the 'mssql' library if we need it
      if (!dbClient) {
        const sql = require('mssql');
        dbClient = sql;
      }

      // SQL Server requires different configuration format
      const config = {
        connectionString,
        options: {
          encrypt: true,              // Required for Azure SQL
          trustServerCertificate: false,
          enableArithAbort: true,
        },
        pool: {
          max: 10,
          min: 2,
          idleTimeoutMillis: 30000,
        }
      };

      pool = await dbClient.connect(config);
      logger.info('SQL Server connection established');
      
    } else {
      throw new Error(`Unsupported database type: ${dbType}. Use 'postgres' or 'sql'`);
    }

    return pool;
    
  } catch (error) {
    logger.error('Database connection failed:', error.message);
    pool = null; // Clear failed connection
    throw error;
  }
}

/**
 * Execute a database query
 * 
 * USAGE EXAMPLE:
 * const db = require('../db');
 * const users = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
 * 
 * HOW IT WORKS:
 * - PostgreSQL: Uses $1, $2, $3 for parameters
 * - SQL Server: Converts params to @param0, @param1, @param2
 * - Returns: Array of rows (works same for both databases)
 * 
 * @param {string} text - SQL query string
 * @param {array} params - Array of parameters (e.g., [123, 'test'])
 * @returns {Promise<array>} - Array of row objects
 */
async function query(text, params = []) {
  try {
    const connection = await getConnection();
    const dbType = process.env.DB_TYPE || 'postgres';

    if (dbType === 'postgres') {
      // PostgreSQL: Simple and clean
      const result = await connection.query(text, params);
      return result.rows;
      
    } else {
      // SQL Server: Requires parameter binding
      const request = connection.request();
      
      // Convert array params to named params (@param0, @param1, etc.)
      params.forEach((param, index) => {
        request.input(`param${index}`, param);
      });
      
      const result = await request.query(text);
      return result.recordset;
    }
  } catch (error) {
    logger.error('Query failed:', error.message);
    throw error;
  }
}

/**
 * Close database connection
 * 
 * WHEN TO USE:
 * - During graceful shutdown
 * - In tests (cleanup after each test)
 * 
 * WHY IT EXISTS:
 * - Prevents "dangling" connections when function shuts down
 * - Azure will eventually close connections anyway, but this is cleaner
 */
async function close() {
  if (pool) {
    try {
      const dbType = process.env.DB_TYPE || 'postgres';
      
      if (dbType === 'postgres') {
        await pool.end();
      } else {
        await pool.close();
      }
      
      pool = null;
      logger.info('Database connection closed');
    } catch (error) {
      logger.error('Error closing database:', error.message);
    }
  }
}

// Export only what functions need
module.exports = {
  query,
  close
};
