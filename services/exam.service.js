const { where } = require("sequelize");
const db = require("../config/config");

const getAll = async () => {
    return await db.Exam.findAll();
};

const getExams = async () => {
    return await db.Exam.findAll({
        where: {
            is_matching: false
        }
    });
};

const getMatchingExams = async () => {
    return await db.Exam.findAll({
        where: {
            is_matching: true
        }
    });
};

const findExamById = async (id) => {
    return await db.Exam.findByPk(id, {
        include: {
            model: db.UserExam,
            as: "examxuserexam",
            attributes: ["id"], 
            include: [
                {
                    model: db.User,
                    as: "userexamxuser",
                    attributes: ["username"],
                },
            ],
        },
    });
};


const findExamByIdWithUserInfo = async (id) => {
    return await db.Exam.findByPk(id, {
        include: {
            model: db.UserExam, 
            as: "examxuserexam",
            include: [
                {
                    model: db.User,
                    as: "userexamxuser",
                    attributes: ["username"],
                }
            ],
        },
    });
};

const findQuestionsByExamId = async (examId) => {
    // Sınav id'sine göre soruları alıyoruz
    const questions = await db.Question.findAll({
      where: { exam_id: examId },
      include: [
        // Sorunun seçeneklerini alıyoruz
        {
          model: db.QuestionOption,
          as: "questionxquestionoption",
          attributes: ["id", "option_text", "is_correct"],
        },
        // Eğer soru eşleşme sorusu ise, matchingPairs'leri alıyoruz
        {
          model: db.MatchingPairs,
          as: "questionxmatchingpairs",
          attributes: ["id", "item_left", "item_right"],
        }
      ]
    });
  
    // Sadece sorulara ihtiyacımız olduğunda, bir dönüşüm yapıyoruz
    return questions.map(question => {
      if (question.is_matching) {
        // Eşleşme sorusuysa, matchingPairs'leri döndürüyoruz
        return {
          question: {
            id: question.id,
            question_text: question.question_text,
            is_matching: question.is_matching,
          },
          matchingPairs: question.questionxmatchingpairs.map(pair => ({
            id: pair.id,
            item_left: pair.item_left,
            item_right: pair.item_right,
          }))
        };
      } else {
        // Normal soru ise, seçenekleri döndürüyoruz
        return {
          question: {
            id: question.id,
            question_text: question.question_text,
            is_matching: question.is_matching,
          },
          options: question.questionxquestionoption.map(option => ({
            id: option.id,
            option_text: option.option_text,
            is_correct: option.is_correct,
          }))
        };
      }
    });
  };

const createExam = async ({ exam_name, timer_seconds, is_private = 0, created_by_id, is_matching}) => {
    const newExam = await db.Exam.create(
        {
            exam_name,
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
    getExams,
    getMatchingExams,
    findQuestionsByExamId,
    findExamByIdWithUserInfo,
    createExam,
    findExamById,
    updateExam,
    deleteExam,
};