const db = require("../config/config");

const getAll = async () => {
    return await db.Exam.findAll();
};

const findExamById = async (id) => {
    return await db.Exam.findByPk(id, {
        include: {
            model: db.UserExam, 
            as: "userexamxexam",
            include: [
                {
                    model: db.User,
                    as: "userexamxuser",
                    attributes: ["username"]
                }
            ],
        },
    });
};

const findExamWithQuestionsById = async (id, whereCondition) => {
    return await db.Exam.findByPk(id, {
        include: [
            {
                model: db.UserExam, 
                as: "examxuserexam",
                include: [
                    {
                        model: db.User, 
                        as: "userexamxuser", 
                        attributes: ["username"],
                        where: whereCondition,
                    }
                ],
            },
            {
                model: db.Question,
                as: "examxquestion", // Sorularla ilişkiyi belirtme
                include: [
                    {
                        model: db.QuestionOption,
                        as: "questionxquestionoption", // Seçeneklerle ilişkiyi belirtme
                        attributes: ["id", "option_text", "is_correct"], // Sadece gerekli alanları seç
                    }
                ],
                attributes: ["id", "question_text"], // Sadece gerekli alanları seç
            }
        ],
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
    findExamWithQuestionsById,
    createExam,
    findExamById,
    updateExam,
    deleteExam,
};