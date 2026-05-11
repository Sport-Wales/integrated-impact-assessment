/**
 * Simple Logging Utility
 * 
 * WHY THIS EXISTS:
 * - Local dev: console.log works fine
 * - Azure: Must use context.log to send logs to Application Insights
 * - This wrapper handles both automatically
 * 
 * USAGE IN FUNCTIONS:
 * const logger = require('../utils/logger');
 * 
 * // At start of function:
 * logger.setContext(context);
 * 
 * // Then use anywhere:
 * logger.info('User submitted form');
 * logger.error('Database connection failed', error);
 */

let currentContext = null;

const logger = {
  /**
   * Set the Azure Functions context
   * Call this at the start of every function handler
   */
  setContext(context) {
    currentContext = context;
  },

  /**
   * Log informational messages
   * Examples: "User logged in", "Form submitted"
   */
  info(...args) {
    if (currentContext) {
      currentContext.log(...args);
    } else {
      console.log(...args);
    }
  },

  /**
   * Log error messages
   * Examples: Database failures, authentication errors
   */
  error(...args) {
    if (currentContext) {
      currentContext.error(...args);
    } else {
      console.error(...args);
    }
  },

  /**
   * Log warning messages
   * Examples: Deprecated feature used, slow query detected
   */
  warn(...args) {
    if (currentContext) {
      currentContext.warn(...args);
    } else {
      console.warn(...args);
    }
  }
};

module.exports = logger;
