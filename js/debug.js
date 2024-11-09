// js/debug.js
const DEBUG = {
    log: function(message, data = null) {
        const timestamp = new Date().toISOString();
        if (data) {
            console.log(`[${timestamp}] ${message}`, data);
        } else {
            console.log(`[${timestamp}] ${message}`);
        }
    },
    error: function(message, error = null) {
        const timestamp = new Date().toISOString();
        if (error) {
            console.error(`[${timestamp}] ERROR: ${message}`, error);
        } else {
            console.error(`[${timestamp}] ERROR: ${message}`);
        }
    }
};