const db = require("../config/config");

const getAll = async () => {
    return await db.Question.findAll();
};

const findQuestionById = async (id) => {
    return await db.Question.findByPk(id);
};

const createQuestion = async ({question_text}) => {
    const newQuestion = await db.Question.create(
        question_text
    );
    return newQuestion
};

const updateQuestion = async ({id,question_text}) => {
    await db.Question.update(
        {question_text},
        {
            where: {
                id:id,
            },
        }
    );
    return {id, question_text};
};

const deleteQuestion = async (id) => {
    await db.Question.destroy(
        {
            where: {id:id},
        }
    );
};

module.exports = {
    getAll,
    findQuestionById,
    createQuestion,
    updateQuestion,
    deleteQuestion
}