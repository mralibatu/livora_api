const db = require("../config/config");

const getAll = async () => {
    return await db.Question.findAll();
};

const findQuestionById = async (id) => {
  const question = await db.Question.findByPk(id);

  if (!question.is_matching) {
      const options = await db.QuestionOption.findAll({
          where: { question_id: question.id },
          attributes: ["id", "option_text", "is_correct"],
      });
      return { question, options };
  }else{
    const matchingPairs = await db.MatchingPairs.findAll({
      where: { question_id: id },
      attributes: ["id", "item_left", "item_right"],
  });
  return {
      question,
      matchingPairs,
  };
  }
  
};


const createMultipleChoiceQuestion = async ({ question, options }) => {
  const sequelize = db.sequelize;

  const transaction = await sequelize.transaction();

  try {
    const newQuestion = await db.Question.create(
      {
          exam_id: question.exam_id,
          question_text: question.question_text,
          is_matching: question.is_matching
      },
      { transaction }
  );

    // Seçenekleri soru ID'si ile ilişkilendir
    const optionsWithQuestionId = options.map((option) => ({
      ...option,
      question_id: newQuestion.id,
    }));

    // Seçenekleri toplu olarak ekle
    await db.QuestionOption.bulkCreate(optionsWithQuestionId, { transaction });

    // İşlemi tamamla
    await transaction.commit();
    return newQuestion;
  } catch (error) {
    // Hata durumunda işlemi geri al
    await transaction.rollback();
    throw error;
  }
};

const createMatchingQuestion = async ({ question, matchingPairs }) => {
  const sequelize = db.sequelize;

  const transaction = await sequelize.transaction();

  try {
    const newQuestion = await db.Question.create(
      {
          exam_id: question.exam_id,
          question_text: question.question_text,
          is_matching: question.is_matching
      },
      { transaction }
  );

    // MatchingPairs'i soru ID'si ile ilişkilendir
    const pairsWithQuestionId = matchingPairs.map((pair) => ({
      ...pair,
      question_id: newQuestion.id,
    }));

    // MatchingPairs'i toplu olarak ekle
    await db.MatchingPairs.bulkCreate(pairsWithQuestionId, { transaction });

    // İşlemi tamamla
    await transaction.commit();
    return newQuestion;
  } catch (error) {
    // Hata durumunda işlemi geri al
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
    createMultipleChoiceQuestion,
    createMatchingQuestion,
    updateQuestion,
    deleteQuestion
}