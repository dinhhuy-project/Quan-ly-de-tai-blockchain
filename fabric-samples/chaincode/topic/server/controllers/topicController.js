const fabricClient = require('../fabric/fabricClient');
const { validateTopicInput, validateProgressInput, validateEvaluationInput } = require('../utils/validators');

// ========================== STUDENT ORG (ORG1) CONTROLLERS ==========================

/**
 * POST /api/topics/register
 * Student: Đăng ký đề tài mới
 */
exports.registerTopic = async (req, res, next) => {
    try {
        const { topicId, title, description, studentId, studentName, field } = req.body;

        // Validate input
        validateTopicInput({ topicId, title, description, studentId, studentName, field });

        console.log(`Registering topic: ${topicId}`);

        // Call chaincode function
        const result = await fabricClient.submitTransaction(
            'registerTopic',
            topicId,
            title,
            description,
            studentId,
            studentName,
            field
        );

        res.status(201).json({
            success: true,
            message: 'Topic registered successfully',
            data: JSON.parse(result)
        });
    } catch (error) {
        next({
            status: 400,
            message: error.message || 'Failed to register topic',
            details: error.toString()
        });
    }
};

/**
 * PUT /api/topics/:topicId/progress
 * Student: Cập nhật tiến độ thực hiện
 */
exports.updateProgress = async (req, res, next) => {
    try {
        const { topicId } = req.params;
        const { stage, percentage, details } = req.body;

        // Validate input
        validateProgressInput({ stage, percentage, details });

        console.log(`Updating progress for topic: ${topicId}`);

        const result = await fabricClient.submitTransaction(
            'updateProgress',
            topicId,
            stage,
            percentage.toString(),
            details
        );

        res.status(200).json({
            success: true,
            message: 'Progress updated successfully',
            data: JSON.parse(result)
        });
    } catch (error) {
        next({
            status: 400,
            message: error.message || 'Failed to update progress',
            details: error.toString()
        });
    }
};

/**
 * GET /api/topics/:topicId/approval-status
 * Student: Xem trạng thái phê duyệt
 */
exports.getApprovalStatus = async (req, res, next) => {
    try {
        const { topicId } = req.params;

        console.log(`Getting approval status for topic: ${topicId}`);

        const result = await fabricClient.evaluateTransaction('getApprovalStatus', topicId);

        res.status(200).json({
            success: true,
            data: JSON.parse(result)
        });
    } catch (error) {
        next({
            status: 404,
            message: error.message || 'Failed to get approval status',
            details: error.toString()
        });
    }
};

/**
 * GET /api/topics/:topicId/change-history
 * Student: Tra cứu lịch sử thay đổi
 */
exports.getChangeHistory = async (req, res, next) => {
    try {
        const { topicId } = req.params;

        console.log(`Getting change history for topic: ${topicId}`);

        const result = await fabricClient.evaluateTransaction('getChangeHistory', topicId);

        res.status(200).json({
            success: true,
            data: JSON.parse(result)
        });
    } catch (error) {
        next({
            status: 404,
            message: error.message || 'Failed to get change history',
            details: error.toString()
        });
    }
};

// ========================== SUPERVISOR ORG (ORG2) CONTROLLERS ==========================

/**
 * PUT /api/topics/:topicId/approve
 * Supervisor: Duyệt đề tài
 */
exports.approveTopic = async (req, res, next) => {
    try {
        const { topicId } = req.params;
        const { supervisorId, supervisorName, comments } = req.body;

        if (!supervisorId || !supervisorName || !comments) {
            throw new Error('supervisorId, supervisorName, and comments are required');
        }

        console.log(`Approving topic: ${topicId} by ${supervisorName}`);

        const result = await fabricClient.submitTransaction(
            'approveTopic',
            topicId,
            supervisorId,
            supervisorName,
            comments
        );

        res.status(200).json({
            success: true,
            message: 'Topic approved successfully',
            data: JSON.parse(result)
        });
    } catch (error) {
        next({
            status: 400,
            message: error.message || 'Failed to approve topic',
            details: error.toString()
        });
    }
};

/**
 * PUT /api/topics/:topicId/reject
 * Supervisor: Từ chối đề tài
 */
exports.rejectTopic = async (req, res, next) => {
    try {
        const { topicId } = req.params;
        const { supervisorId, supervisorName, reason } = req.body;

        if (!supervisorId || !supervisorName || !reason) {
            throw new Error('supervisorId, supervisorName, and reason are required');
        }

        console.log(`Rejecting topic: ${topicId} by ${supervisorName}`);

        const result = await fabricClient.submitTransaction(
            'rejectTopic',
            topicId,
            supervisorId,
            supervisorName,
            reason
        );

        res.status(200).json({
            success: true,
            message: 'Topic rejected successfully',
            data: JSON.parse(result)
        });
    } catch (error) {
        next({
            status: 400,
            message: error.message || 'Failed to reject topic',
            details: error.toString()
        });
    }
};

/**
 * POST /api/topics/:topicId/evaluation
 * Supervisor: Thêm nhận xét, đánh giá
 */
exports.addEvaluation = async (req, res, next) => {
    try {
        const { topicId } = req.params;
        const { supervisorId, supervisorName, evaluation, rating } = req.body;

        // Validate input
        validateEvaluationInput({ supervisorId, supervisorName, evaluation, rating });

        console.log(`Adding evaluation for topic: ${topicId}`);

        const result = await fabricClient.submitTransaction(
            'addEvaluation',
            topicId,
            supervisorId,
            supervisorName,
            evaluation,
            rating.toString()
        );

        res.status(201).json({
            success: true,
            message: 'Evaluation added successfully',
            data: JSON.parse(result)
        });
    } catch (error) {
        next({
            status: 400,
            message: error.message || 'Failed to add evaluation',
            details: error.toString()
        });
    }
};

/**
 * GET /api/topics/:topicId/progress
 * Supervisor: Theo dõi tiến độ
 */
exports.trackProgress = async (req, res, next) => {
    try {
        const { topicId } = req.params;

        console.log(`Tracking progress for topic: ${topicId}`);

        const result = await fabricClient.evaluateTransaction('trackProgress', topicId);

        res.status(200).json({
            success: true,
            data: JSON.parse(result)
        });
    } catch (error) {
        next({
            status: 404,
            message: error.message || 'Failed to track progress',
            details: error.toString()
        });
    }
};

// ========================== COMMON CONTROLLERS (BOTH ORGS) ==========================

/**
 * GET /api/topics
 * Lấy danh sách tất cả đề tài
 */
exports.getTopics = async (req, res, next) => {
    try {
        console.log('Getting all topics');

        const result = await fabricClient.evaluateTransaction('getTopics');

        res.status(200).json({
            success: true,
            data: JSON.parse(result)
        });
    } catch (error) {
        next({
            status: 500,
            message: error.message || 'Failed to get topics',
            details: error.toString()
        });
    }
};

/**
 * GET /api/topics/:topicId
 * Lấy thông tin chi tiết đề tài
 */
exports.getTopicById = async (req, res, next) => {
    try {
        const { topicId } = req.params;

        console.log(`Getting topic: ${topicId}`);

        const result = await fabricClient.evaluateTransaction('getTopicById', topicId);

        res.status(200).json({
            success: true,
            data: JSON.parse(result)
        });
    } catch (error) {
        next({
            status: 404,
            message: error.message || 'Failed to get topic',
            details: error.toString()
        });
    }
};

/**
 * GET /api/topics/student/:studentId
 * Lấy danh sách đề tài của sinh viên
 */
exports.getTopicsByStudent = async (req, res, next) => {
    try {
        const { studentId } = req.params;

        console.log(`Getting topics for student: ${studentId}`);

        const result = await fabricClient.evaluateTransaction('getTopicsByStudent', studentId);

        res.status(200).json({
            success: true,
            data: JSON.parse(result)
        });
    } catch (error) {
        next({
            status: 500,
            message: error.message || 'Failed to get topics by student',
            details: error.toString()
        });
    }
};

/**
 * GET /api/topics/supervisor/:supervisorId
 * Lấy danh sách đề tài của giáo viên
 */
exports.getTopicsBySupervisor = async (req, res, next) => {
    try {
        const { supervisorId } = req.params;

        console.log(`Getting topics for supervisor: ${supervisorId}`);

        const result = await fabricClient.evaluateTransaction('getTopicsBySupervisor', supervisorId);

        res.status(200).json({
            success: true,
            data: JSON.parse(result)
        });
    } catch (error) {
        next({
            status: 500,
            message: error.message || 'Failed to get topics by supervisor',
            details: error.toString()
        });
    }
};

/**
 * GET /api/topics/status/:status
 * Lấy danh sách đề tài theo trạng thái
 */
exports.getTopicsByStatus = async (req, res, next) => {
    try {
        const { status } = req.params;

        console.log(`Getting topics with status: ${status}`);

        const result = await fabricClient.evaluateTransaction('getTopicsByStatus', status);

        res.status(200).json({
            success: true,
            data: JSON.parse(result)
        });
    } catch (error) {
        next({
            status: 500,
            message: error.message || 'Failed to get topics by status',
            details: error.toString()
        });
    }
};

/**
 * GET /api/topics/field/:field
 * Lấy danh sách đề tài theo lĩnh vực
 */
exports.getTopicsByField = async (req, res, next) => {
    try {
        const { field } = req.params;

        console.log(`Getting topics in field: ${field}`);

        const result = await fabricClient.evaluateTransaction('getTopicsByField', field);

        res.status(200).json({
            success: true,
            data: JSON.parse(result)
        });
    } catch (error) {
        next({
            status: 500,
            message: error.message || 'Failed to get topics by field',
            details: error.toString()
        });
    }
};
