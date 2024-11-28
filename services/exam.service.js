const db = require("../config/config");

const getAll = async () => {
    return await db.Exam.findAll();
};

const findExamById = async (id) => {
    return await db.Exam.findByPk(id, {
        include: {
            model: db.User,
            as: "examxuser",
            attributes: ["username"],
        },
    });
};

const createExam = async ({ exam_name, timer_seconds, is_private = 0, created_by_id, is_matching}) => {
    const newExam = await db.Exam.create(
        {
            exam_name,
            main_lang_word,
            ...(timer_seconds && { timer_seconds}),
            created_by_id,
            ...(is_matching && { is_matching }),
            is_private: is_private || 0,
        }
    );
    return newExam;
};

const updateExam = async ({ id, exam_name, timer_seconds, is_private, created_by_id, is_matching }) => {
    await db.Exam.update(
        { exam_name, timer_seconds, is_private, created_by_id, is_matching },
        {
            where: {
                id: id,
            },
        }
    );
    return { id, exam_name, timer_seconds, is_private, created_by_id, is_matching };
};

const deleteExam = async (id) => {
    await db.Exam.destroy({
        where: { id: id },
    });
};

module.exports = {
    getAll,
    createExam,
    findExamById,
    updateExam,
    deleteExam,
};