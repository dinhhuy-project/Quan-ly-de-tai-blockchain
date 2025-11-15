const fabricClient = require('../fabric/fabricClient');

/**
 * Middleware để khởi tạo Fabric connection dựa trên org từ request
 */
async function fabricConnectionMiddleware(req, res, next) {
    try {
        // Lấy organization từ header hoặc default là org1
        const org = req.headers['x-org'] || 'org1';

        // Validate org
        if (!['org1', 'org2'].includes(org)) {
            return res.status(400).json({
                error: 'Invalid organization. Must be org1 or org2',
                received: org
            });
        }

        // Store org in request
        req.org = org;

        // Initialize connection - THROW ERROR nếu fail
        await fabricClient.initializeFabricConnection(org);
        console.log(`✓ Fabric connection initialized for ${org}`);

        next();
    } catch (error) {
        console.error('Error in fabricConnectionMiddleware:', error.message);
        res.status(500).json({
            error: 'Failed to initialize Fabric connection',
            details: error.message
        });
    }
}

module.exports = fabricConnectionMiddleware;
