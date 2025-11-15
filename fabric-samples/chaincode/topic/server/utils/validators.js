/**
 * Validate topic registration input
 */
function validateTopicInput({ topicId, title, description, studentId, studentName, field }) {
    if (!topicId || topicId.trim() === '') {
        throw new Error('topicId is required');
    }

    if (!title || title.trim() === '') {
        throw new Error('title is required');
    }

    if (!description || description.trim() === '') {
        throw new Error('description is required');
    }

    if (!studentId || studentId.trim() === '') {
        throw new Error('studentId is required');
    }

    if (!studentName || studentName.trim() === '') {
        throw new Error('studentName is required');
    }

    if (!field || field.trim() === '') {
        throw new Error('field is required');
    }

    return true;
}

/**
 * Validate progress update input
 */
function validateProgressInput({ stage, percentage, details }) {
    if (!stage || stage.trim() === '') {
        throw new Error('stage is required');
    }

    const validStages = ['INITIAL', 'ANALYSIS', 'DEVELOPMENT', 'TESTING', 'COMPLETED'];
    if (!validStages.includes(stage)) {
        throw new Error(`stage must be one of: ${validStages.join(', ')}`);
    }

    if (percentage === undefined || percentage === null || percentage === '') {
        throw new Error('percentage is required');
    }

    const percentageNum = parseInt(percentage);
    if (isNaN(percentageNum) || percentageNum < 0 || percentageNum > 100) {
        throw new Error('percentage must be a number between 0 and 100');
    }

    if (!details || details.trim() === '') {
        throw new Error('details is required');
    }

    return true;
}

/**
 * Validate evaluation input
 */
function validateEvaluationInput({ supervisorId, supervisorName, evaluation, rating }) {
    if (!supervisorId || supervisorId.trim() === '') {
        throw new Error('supervisorId is required');
    }

    if (!supervisorName || supervisorName.trim() === '') {
        throw new Error('supervisorName is required');
    }

    if (!evaluation || evaluation.trim() === '') {
        throw new Error('evaluation is required');
    }

    if (rating === undefined || rating === null || rating === '') {
        throw new Error('rating is required');
    }

    const ratingNum = parseFloat(rating);
    if (isNaN(ratingNum) || ratingNum < 0 || ratingNum > 10) {
        throw new Error('rating must be a number between 0 and 10');
    }

    return true;
}

module.exports = {
    validateTopicInput,
    validateProgressInput,
    validateEvaluationInput
};
