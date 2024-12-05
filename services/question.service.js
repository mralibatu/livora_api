const db = require("../config/config");

const getAll = async () => {
    return await db.Question.findAll();
};

const findQuestionById = async (id) => {
    return await db.Question.findByPk(id, {
        include: {
            model: db.QuestionOption,
            as: "questionxquestionoption",
            attributes: ["id","option_text","is_correct"], 
        },
    });
};

const createQuestion = async ({ question_text, options }) => {
    const sequelize = db.sequelize;
  
    const transaction = await sequelize.transaction();
  
    try {
      const newQuestion = await db.Question.create(
        { question_text },
        { transaction }
      );
  
      const optionsWithQuestionId = options.map((option) => ({
        ...option,
        question_id: newQuestion.id, 
      }));
  
      await db.QuestionOption.bulkCreate(optionsWithQuestionId, { transaction });
  
      await transaction.commit(); 
      return newQuestion;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };
  

  const updateQuestion = async ({ id, question_text, options }) => {
    const sequelize = db.sequelize;
    const transaction = await sequelize.transaction();
  
    try {
      await db.Question.update(
        { question_text },
        {
          where: { id },
          transaction,
        }
      );
  
      await db.QuestionOption.destroy({
        where: { question_id: id },
        transaction,
      });
  
      if (options && options.length > 0) {
        const optionsWithQuestionId = options.map(option => ({
          ...option,
          question_id: id, 
        }));
  
        await db.QuestionOption.bulkCreate(optionsWithQuestionId, { transaction });
      }
  
      await transaction.commit();
  
      return { id, question_text, options };
    } catch (error) {
      await transaction.rollback(); 
      throw error;
    }
  };
  

  const deleteQuestion = async (id) => {
    const sequelize = db.sequelize;
    const transaction = await sequelize.transaction();

    try {
        await db.QuestionOption.destroy({
            where: { question_id: id },
            transaction,
        });
        await db.Question.destroy({
            where: { id },
            transaction,
        });

        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};


module.exports = {
    getAll,
    findQuestionById,
    createQuestion,
    updateQuestion,
    deleteQuestion
}