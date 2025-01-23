const { where } = require("sequelize");
const db = require("../config/config");

const getAll = async () => {
  return await db.Exam.findAll({
    include: [
      {
        model: db.User,
        as: "examxuser",  // This is the association alias for the `Exam` and `User` models
        attributes: ["username"],  // Select only the `username` field
      },
      {
        model: db.Question,  // You may also want to include the associated `Question` model
        as: "examxquestion",  // Assuming this association exists on your Exam model
        required: false,  // If you want to include even those exams without questions
      },
    ],
  });
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
  // Sınav ID'sine göre tüm soruları ve seçenekleri alıyoruz
  const questions = await db.Question.findAll({
    where: { exam_id: examId },
    include: [
      {
        model: db.QuestionOption,
        as: "questionxquestionoption",
        attributes: ["id", "option_text", "is_correct"],
      },
    ],
  });

  // Sınav ID'sine göre eşleşme çiftlerini alıyoruz
  const matchingPairs = await db.MatchingPairs.findAll({
    include: [
      {
        model: db.Exam,
        as: "matchingpairsxexam",
        where: { id: examId },
        attributes: [], // Sadece filtreleme için gerekli, herhangi bir veri getirilmez
      },
    ],
    attributes: ["id", "item_left", "item_right"],
  });

  // Veriyi dönüştürüyoruz
  return questions.map((question) => {
    if (question.is_matching) {
      // Eşleşme soruları için matchingPairs ekleniyor
      return {
        question: {
          id: question.id,
          question_text: question.question_text,
          is_matching: question.is_matching,
        },
        matchingPairs: matchingPairs.map((pair) => ({
          id: pair.id,
          item_left: pair.item_left,
          item_right: pair.item_right,
        })),
      };
    } else {
      // Normal sorular için seçenekler ekleniyor
      return {
        question: {
          id: question.id,
          question_text: question.question_text,
          is_matching: question.is_matching,
        },
        options: question.questionxquestionoption.map((option) => ({
          id: option.id,
          option_text: option.option_text,
          is_correct: option.is_correct,
        })),
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