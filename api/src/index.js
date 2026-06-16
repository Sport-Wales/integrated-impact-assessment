const { app } = require('@azure/functions');

// NOTE: Do NOT enable enableHttpStream here.
// Azure SWA's proxy does not forward streamed request bodies correctly,
// which causes request.json() and request.text() to return empty content.
// Default buffered mode works correctly with SWA.
