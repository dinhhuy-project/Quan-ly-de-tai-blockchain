'use strict';

const { Contract } = require('fabric-contract-api');

class TopicContract extends Contract {
    /**
     * Get consistent timestamp across all peers
     */
    getTimestamp(ctx) {
        const txTime = ctx.stub.getTxTimestamp();
        return new Date(txTime.seconds * 1000 + Math.floor(txTime.nanos / 1000000)).toISOString();
    }

    /**
     * Initialize the contract
     */
    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        console.info('============= END : Initialize Ledger ===========');
    }

    // ========================== STUDENT ORG (ORG1) FUNCTIONS ==========================

    /**
     * Student: Đăng ký đề tài mới
     * @param {*} ctx - context
     * @param {string} topicId - ID của đề tài (duy nhất)
     * @param {string} title - Tiêu đề đề tài
     * @param {string} description - Mô tả chi tiết đề tài
     * @param {string} studentId - ID sinh viên đăng ký
     * @param {string} studentName - Tên sinh viên
     * @param {string} field - Lĩnh vực (AI, Web, Mobile, ...)
     */
    async registerTopic(ctx, topicId, title, description, studentId, studentName, field) {
        console.info('============= START : Register Topic ===========');

        // Kiểm tra xem đề tài đã tồn tại chưa
        const topicAsBytes = await ctx.stub.getState(topicId);
        if (topicAsBytes && topicAsBytes.length > 0) {
            throw new Error(`Topic with ID ${topicId} already exists`);
        }
        
        // Kiểm tra quyền: chỉ Org1 (Student) mới có thể đăng ký
        const clientMSPID = ctx.clientIdentity.getMSPID();
        if (!clientMSPID.includes('Org1')) {
            throw new Error('Only Student Org (Org1) can register topics');
        }

        const topic = {
            docType: 'topic',
            topicId: topicId,
            title: title,
            description: description,
            studentId: studentId,
            studentName: studentName,
            field: field,
            status: 'PENDING', // PENDING, APPROVED, REJECTED
            approvedBy: '',
            comments: '',
            createdAt: this.getTimestamp(ctx),
            updatedAt: this.getTimestamp(ctx),
            history: [
                {
                    timestamp: this.getTimestamp(ctx),
                    action: 'REGISTERED',
                    status: 'PENDING',
                    actor: studentName,
                    details: 'Topic registered by student'
                }
            ],
            progress: {
                stage: 'INITIAL',
                percentage: 0,
                lastUpdate: this.getTimestamp(ctx),
                updates: []
            }
        };

        await ctx.stub.putState(topicId, Buffer.from(JSON.stringify(topic)));
        console.info('============= END : Register Topic ===========');
        return JSON.stringify(topic);
    }

    /**
     * Student: Cập nhật tiến độ thực hiện
     * @param {*} ctx - context
     * @param {string} topicId - ID của đề tài
     * @param {string} stage - Giai đoạn (INITIAL, ANALYSIS, DEVELOPMENT, TESTING, COMPLETED)
     * @param {number} percentage - Phần trăm hoàn thành (0-100)
     * @param {string} details - Chi tiết về tiến độ
     */
    async updateProgress(ctx, topicId, stage, percentage, details) {
        console.info('============= START : Update Progress ===========');
        
        // Kiểm tra quyền: chỉ Org1 (Student) mới có thể cập nhật tiến độ
        const clientMSPID = ctx.clientIdentity.getMSPID();
        if (!clientMSPID.includes('Org1')) {
            throw new Error('Only Student Org (Org1) can update progress');
        }

        const topicAsBytes = await ctx.stub.getState(topicId);
        if (!topicAsBytes || topicAsBytes.length === 0) {
            throw new Error(`Topic with ID ${topicId} does not exist`);
        }

        const topic = JSON.parse(topicAsBytes.toString());

        // Chỉ có thể cập nhật tiến độ nếu đề tài đã được phê duyệt
        if (topic.status !== 'APPROVED') {
            throw new Error('Topic must be approved before updating progress');
        }

        // Validate percentage
        const percentageNum = parseInt(percentage);
        if (isNaN(percentageNum) || percentageNum < 0 || percentageNum > 100) {
            throw new Error('Percentage must be a number between 0 and 100');
        }

        topic.progress = {
            stage: stage,
            percentage: percentageNum,
            lastUpdate: this.getTimestamp(ctx),
            updates: topic.progress.updates || []
        };

        topic.progress.updates.push({
            timestamp: this.getTimestamp(ctx),
            stage: stage,
            percentage: percentageNum,
            details: details
        });

        // Thêm vào lịch sử
        topic.history.push({
            timestamp: this.getTimestamp(ctx),
            action: 'PROGRESS_UPDATE',
            status: topic.status,
            actor: topic.studentName,
            details: `Progress updated to ${stage} - ${percentageNum}%`
        });

        topic.updatedAt = this.getTimestamp(ctx);
        await ctx.stub.putState(topicId, Buffer.from(JSON.stringify(topic)));
        console.info('============= END : Update Progress ===========');
        return JSON.stringify(topic);
    }

    /**
     * Student: Xem trạng thái phê duyệt
     * @param {*} ctx - context
     * @param {string} topicId - ID của đề tài
     */
    async getApprovalStatus(ctx, topicId) {
        console.info('============= START : Get Approval Status ===========');

        const topicAsBytes = await ctx.stub.getState(topicId);
        if (!topicAsBytes || topicAsBytes.length === 0) {
            throw new Error(`Topic with ID ${topicId} does not exist`);
        }

        const topic = JSON.parse(topicAsBytes.toString());
        const status = {
            topicId: topic.topicId,
            title: topic.title,
            status: topic.status,
            approvedBy: topic.approvedBy,
            comments: topic.comments,
            createdAt: topic.createdAt,
            updatedAt: topic.updatedAt
        };

        console.info('============= END : Get Approval Status ===========');
        return JSON.stringify(status);
    }

    /**
     * Student: Tra cứu lịch sử thay đổi
     * @param {*} ctx - context
     * @param {string} topicId - ID của đề tài
     */
    async getChangeHistory(ctx, topicId) {
        console.info('============= START : Get Change History ===========');

        const topicAsBytes = await ctx.stub.getState(topicId);
        if (!topicAsBytes || topicAsBytes.length === 0) {
            throw new Error(`Topic with ID ${topicId} does not exist`);
        }

        const topic = JSON.parse(topicAsBytes.toString());
        const history = {
            topicId: topic.topicId,
            title: topic.title,
            history: topic.history
        };

        console.info('============= END : Get Change History ===========');
        return JSON.stringify(history);
    }

    // ========================== SUPERVISOR ORG (ORG2) FUNCTIONS ==========================

    /**
     * Supervisor: Duyệt đề tài
     * @param {*} ctx - context
     * @param {string} topicId - ID của đề tài
     * @param {string} supervisorId - ID giáo viên hướng dẫn
     * @param {string} supervisorName - Tên giáo viên hướng dẫn
     * @param {string} comments - Nhận xét khi duyệt
     */
    async approveTopic(ctx, topicId, supervisorId, supervisorName, comments) {
        console.info('============= START : Approve Topic ===========');
        
        // Kiểm tra quyền: chỉ Org2 (Supervisor) mới có thể duyệt
        const clientMSPID = ctx.clientIdentity.getMSPID();
        if (!clientMSPID.includes('Org2')) {
            throw new Error('Only Supervisor Org (Org2) can approve topics');
        }

        const topicAsBytes = await ctx.stub.getState(topicId);
        if (!topicAsBytes || topicAsBytes.length === 0) {
            throw new Error(`Topic with ID ${topicId} does not exist`);
        }

        const topic = JSON.parse(topicAsBytes.toString());

        if (topic.status !== 'PENDING') {
            throw new Error(`Topic with status ${topic.status} cannot be approved`);
        }

        topic.status = 'APPROVED';
        topic.approvedBy = supervisorName;
        topic.comments = comments;
        topic.supervisorId = supervisorId;
        topic.supervisorName = supervisorName;
        topic.updatedAt = this.getTimestamp(ctx);

        topic.history.push({
            timestamp: this.getTimestamp(ctx),
            action: 'APPROVED',
            status: 'APPROVED',
            actor: supervisorName,
            details: `Approved by supervisor: ${comments}`
        });

        await ctx.stub.putState(topicId, Buffer.from(JSON.stringify(topic)));
        console.info('============= END : Approve Topic ===========');
        return JSON.stringify(topic);
    }

    /**
     * Supervisor: Từ chối đề tài
     * @param {*} ctx - context
     * @param {string} topicId - ID của đề tài
     * @param {string} supervisorId - ID giáo viên hướng dẫn
     * @param {string} supervisorName - Tên giáo viên hướng dẫn
     * @param {string} reason - Lý do từ chối
     */
    async rejectTopic(ctx, topicId, supervisorId, supervisorName, reason) {
        console.info('============= START : Reject Topic ===========');

        // Kiểm tra quyền: chỉ Org2 (Supervisor) mới có thể từ chối
        const clientMSPID = ctx.clientIdentity.getMSPID();
        if (!clientMSPID.includes('Org2')) {
            throw new Error('Only Supervisor Org (Org2) can reject topics');
        }

        const topicAsBytes = await ctx.stub.getState(topicId);
        if (!topicAsBytes || topicAsBytes.length === 0) {
            throw new Error(`Topic with ID ${topicId} does not exist`);
        }

        const topic = JSON.parse(topicAsBytes.toString());

        if (topic.status !== 'PENDING') {
            throw new Error(`Topic with status ${topic.status} cannot be rejected`);
        }

        topic.status = 'REJECTED';
        topic.approvedBy = supervisorName;
        topic.comments = reason;
        topic.supervisorId = supervisorId;
        topic.supervisorName = supervisorName;
        topic.updatedAt = this.getTimestamp(ctx);

        topic.history.push({
            timestamp: this.getTimestamp(ctx),
            action: 'REJECTED',
            status: 'REJECTED',
            actor: supervisorName,
            details: `Rejected by supervisor: ${reason}`
        });

        await ctx.stub.putState(topicId, Buffer.from(JSON.stringify(topic)));
        console.info('============= END : Reject Topic ===========');
        return JSON.stringify(topic);
    }

    /**
     * Supervisor: Thêm nhận xét, đánh giá
     * @param {*} ctx - context
     * @param {string} topicId - ID của đề tài
     * @param {string} supervisorId - ID giáo viên hướng dẫn
     * @param {string} supervisorName - Tên giáo viên hướng dẫn
     * @param {string} evaluation - Nội dung đánh giá
     * @param {number} rating - Đánh giá điểm (0-10)
     */
    async addEvaluation(ctx, topicId, supervisorId, supervisorName, evaluation, rating) {
        console.info('============= START : Add Evaluation ===========');
        
        // Kiểm tra quyền: chỉ Org2 (Supervisor) mới có thể đánh giá
        const clientMSPID = ctx.clientIdentity.getMSPID();
        if (!clientMSPID.includes('Org2')) {
            throw new Error('Only Supervisor Org (Org2) can add evaluations');
        }

        const topicAsBytes = await ctx.stub.getState(topicId);
        if (!topicAsBytes || topicAsBytes.length === 0) {
            throw new Error(`Topic with ID ${topicId} does not exist`);
        }

        const topic = JSON.parse(topicAsBytes.toString());

        if (topic.status !== 'APPROVED') {
            throw new Error('Topic must be approved before adding evaluation');
        }

        // Validate rating
        const ratingNum = parseFloat(rating);
        if (isNaN(ratingNum) || ratingNum < 0 || ratingNum > 10) {
            throw new Error('Rating must be a number between 0 and 10');
        }

        if (!topic.evaluations) {
            topic.evaluations = [];
        }

        topic.evaluations.push({
            timestamp: this.getTimestamp(ctx),
            supervisorId: supervisorId,
            supervisorName: supervisorName,
            evaluation: evaluation,
            rating: ratingNum
        });

        topic.history.push({
            timestamp: this.getTimestamp(ctx),
            action: 'EVALUATION_ADDED',
            status: topic.status,
            actor: supervisorName,
            details: `Evaluation added: Rating ${ratingNum}/10`
        });

        topic.updatedAt = this.getTimestamp(ctx);
        await ctx.stub.putState(topicId, Buffer.from(JSON.stringify(topic)));
        console.info('============= END : Add Evaluation ===========');
        return JSON.stringify(topic);
    }

    /**
     * Supervisor: Theo dõi tiến độ
     * @param {*} ctx - context
     * @param {string} topicId - ID của đề tài
     */
    async trackProgress(ctx, topicId) {
        console.info('============= START : Track Progress ===========');

        const topicAsBytes = await ctx.stub.getState(topicId);
        if (!topicAsBytes || topicAsBytes.length === 0) {
            throw new Error(`Topic with ID ${topicId} does not exist`);
        }

        const topic = JSON.parse(topicAsBytes.toString());
        const progressInfo = {
            topicId: topic.topicId,
            title: topic.title,
            studentName: topic.studentName,
            supervisorName: topic.supervisorName,
            progress: topic.progress,
            status: topic.status,
            updatedAt: topic.updatedAt
        };

        console.info('============= END : Track Progress ===========');
        return JSON.stringify(progressInfo);
    }

    // ========================== COMMON FUNCTIONS (BOTH ORGS) ==========================

    /**
     * Lấy danh sách tất cả đề tài
     * @param {*} ctx - context
     */
    async getTopics(ctx) {
        console.info('============= START : Get Topics ===========');

        const allResults = [];
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();

        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }

            // Chỉ lấy các bản ghi có docType là 'topic'
            if (record.docType === 'topic') {
                allResults.push(record);
            }

            result = await iterator.next();
        }

        await iterator.close();
        console.info('============= END : Get Topics ===========');
        return JSON.stringify(allResults);
    }

    /**
     * Lấy thông tin chi tiết của một đề tài theo ID
     * @param {*} ctx - context
     * @param {string} topicId - ID của đề tài
     */
    async getTopicById(ctx, topicId) {
        console.info('============= START : Get Topic By ID ===========');

        const topicAsBytes = await ctx.stub.getState(topicId);
        if (!topicAsBytes || topicAsBytes.length === 0) {
            throw new Error(`Topic with ID ${topicId} does not exist`);
        }

        const topic = JSON.parse(topicAsBytes.toString());
        console.info('============= END : Get Topic By ID ===========');
        return JSON.stringify(topic);
    }

    /**
     * Lấy danh sách đề tài của sinh viên cụ thể
     * @param {*} ctx - context
     * @param {string} studentId - ID của sinh viên
     */
    async getTopicsByStudent(ctx, studentId) {
        console.info('============= START : Get Topics By Student ===========');

        const allResults = [];
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();

        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
                // Filter by studentId and docType
                if (record.docType === 'topic' && record.studentId === studentId) {
                    allResults.push(record);
                }
            } catch (err) {
                console.log(err);
            }
            result = await iterator.next();
        }

        await iterator.close();
        console.info('============= END : Get Topics By Student ===========');
        return JSON.stringify(allResults);
    }

    /**
     * Lấy danh sách đề tài được giáo viên hướng dẫn
     * @param {*} ctx - context
     * @param {string} supervisorId - ID của giáo viên
     */
    async getTopicsBySupervisor(ctx, supervisorId) {
        console.info('============= START : Get Topics By Supervisor ===========');

        const allResults = [];
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();

        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
                // Filter by supervisorId and docType
                if (record.docType === 'topic' && record.supervisorId === supervisorId) {
                    allResults.push(record);
                }
            } catch (err) {
                console.log(err);
            }
            result = await iterator.next();
        }

        await iterator.close();
        console.info('============= END : Get Topics By Supervisor ===========');
        return JSON.stringify(allResults);
    }

    /**
     * Lấy danh sách đề tài theo trạng thái
     * @param {*} ctx - context
     * @param {string} status - Trạng thái (PENDING, APPROVED, REJECTED)
     */
    async getTopicsByStatus(ctx, status) {
        console.info('============= START : Get Topics By Status ===========');

        const allResults = [];
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();

        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
                // Filter by status and docType
                if (record.docType === 'topic' && record.status === status) {
                    allResults.push(record);
                }
            } catch (err) {
                console.log(err);
            }
            result = await iterator.next();
        }

        await iterator.close();
        console.info('============= END : Get Topics By Status ===========');
        return JSON.stringify(allResults);
    }

    /**
     * Lấy danh sách đề tài theo lĩnh vực
     * @param {*} ctx - context
     * @param {string} field - Lĩnh vực (AI, Web, Mobile, ...)
     */
    async getTopicsByField(ctx, field) {
        console.info('============= START : Get Topics By Field ===========');

        const allResults = [];
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();

        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
                // Filter by field and docType
                if (record.docType === 'topic' && record.field === field) {
                    allResults.push(record);
                }
            } catch (err) {
                console.log(err);
            }
            result = await iterator.next();
        }

        await iterator.close();
        console.info('============= END : Get Topics By Field ===========');
        return JSON.stringify(allResults);
    }
}

module.exports = TopicContract;
