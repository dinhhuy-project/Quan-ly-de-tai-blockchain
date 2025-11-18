const express = require('express');
const topicController = require('../controllers/topicController');

const router = express.Router();

// ========================== STUDENT ORG (ORG1) ENDPOINTS ==========================

/**
 * POST /api/topics/register
 * Student: Đăng ký đề tài mới
 */
router.post('/register', topicController.registerTopic);

/**
 * PUT /api/topics/:topicId/progress
 * Student: Cập nhật tiến độ thực hiện
 */
router.put('/:topicId/progress', topicController.updateProgress);

/**
 * GET /api/topics/:topicId/approval-status
 * Student: Xem trạng thái phê duyệt
 */
router.get('/:topicId/approval-status', topicController.getApprovalStatus);

/**
 * GET /api/topics/:topicId/change-history
 * Student: Tra cứu lịch sử thay đổi
 */
router.get('/:topicId/change-history', topicController.getChangeHistory);

// ========================== SUPERVISOR ORG (ORG2) ENDPOINTS ==========================

/**
 * PUT /api/topics/:topicId/approve
 * Supervisor: Duyệt đề tài
 */
router.put('/:topicId/approve', topicController.approveTopic);

/**
 * PUT /api/topics/:topicId/reject
 * Supervisor: Từ chối đề tài
 */
router.put('/:topicId/reject', topicController.rejectTopic);

/**
 * POST /api/topics/:topicId/evaluation
 * Supervisor: Thêm nhận xét, đánh giá
 */
router.post('/:topicId/evaluation', topicController.addEvaluation);

/**
 * GET /api/topics/:topicId/progress
 * Supervisor: Theo dõi tiến độ
 */
router.get('/:topicId/progress', topicController.trackProgress);

// ========================== COMMON ENDPOINTS (BOTH ORGS) ==========================

/**
 * GET /api/topics
 * Lấy danh sách tất cả đề tài
 */
router.get('/', topicController.getTopics);

/**
 * GET /api/topics/:topicId
 * Lấy thông tin chi tiết đề tài
 */
router.get('/:topicId', topicController.getTopicById);

/**
 * GET /api/topics/student/:studentId
 * Lấy danh sách đề tài của sinh viên
 */
router.get('/student/:studentId', topicController.getTopicsByStudent);

/**
 * GET /api/topics/supervisor/:supervisorId
 * Lấy danh sách đề tài của giáo viên
 */
router.get('/supervisor/:supervisorId', topicController.getTopicsBySupervisor);

/**
 * GET /api/topics/status/:status
 * Lấy danh sách đề tài theo trạng thái
 */
router.get('/status/:status', topicController.getTopicsByStatus);

/**
 * GET /api/topics/field/:field
 * Lấy danh sách đề tài theo lĩnh vực
 */
router.get('/field/:field', topicController.getTopicsByField);

router.get("/fabric/blockchain-info", topicController.getBlockchainInfo);
router.get("/fabric/blocks", topicController.getAllBlocks);
router.get("/fabric/blocks/:number", topicController.getBlockByNumber);
router.get("/fabric/transactions", topicController.getAllTransactions);


module.exports = router;
