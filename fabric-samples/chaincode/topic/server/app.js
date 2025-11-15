require('dotenv').config();
const express = require('express');
const cors = require('cors');
const topicRoutes = require('./routes/topicRoutes');
const fabricConnectionMiddleware = require('./middleware/fabricConnection');
const fabricClient = require('./fabric/fabricClient');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Fabric connection middleware
app.use(fabricConnectionMiddleware);

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// API Routes
app.use('/api/topics', topicRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error',
        details: err.details || ''
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

const server = app.listen(PORT, () => {
    console.log(`Topic API Server is running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\nShutting down server...');
    try {
        await fabricClient.disconnect();
    } catch (error) {
        console.error('Error during shutdown:', error);
    }
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});

module.exports = app;
