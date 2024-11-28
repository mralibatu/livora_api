const { Sequelize } = require("sequelize");
const wordModel = require("../models/word.model");
const questionModel = require("../models/question.model");
const categoryModel = require("../models/category.model");
const examQuestionModel = require("../models/exam_question.model");
const examModel = require("../models/exam.model");
const listModel = require("../models/list.model");
const matchingExamQuestionModel = require("../models/matching_exam_question.model");
const matchingPairsModel = require("../models/matching_pairs.model");
const matchingQuestionModel = require("../models/matching_question.model");
const partOfSpeechModel = require("../models/part_of_speech.model");
const proficiencyLevelModel = require("../models/proficiency_level.model");
const questionOptionModel = require("../models/question_option.model");
const userExamModel = require("../models/user_exam.model");
const userListModel = require("../models/user_list.model");
const userWordModel = require("../models/user_word.model");
const userModel = require("../models/user.model");
const wordListModel = require("../models/word_list.model");

require("dotenv").config();

const sequelize = new Sequelize(
    process.env.DB, // name of db
    process.env.USER, // sql server username
    process.env.PASSWORD, // sql server password
    {
        host: process.env.HOST, // server name of mssql
        port: process.env.SQL_PORT, // for tcp 1433
        dialect: process.env.DIALECT, // mssql for mssql
        dialectOptions: {
            options: { encrypt: false },
        },
    }
);

const db = {};

// Model initialization
db.Word = wordModel(sequelize);
db.Question = questionModel(sequelize);
db.Category = categoryModel(sequelize);
db.ExamQuestion = examQuestionModel(sequelize);
db.Exam = examModel(sequelize);
db.List = listModel(sequelize);
db.MatchingExamQuestion = matchingExamQuestionModel(sequelize);
db.MatchingPairs = matchingPairsModel(sequelize);
db.MatchingQuestion = matchingQuestionModel(sequelize);
db.PartOfSpeech = partOfSpeechModel(sequelize);
db.ProficiencyLevel = proficiencyLevelModel(sequelize);
db.QuestionOption = questionOptionModel(sequelize);
db.UserExam = userExamModel(sequelize);
db.UserList = userListModel(sequelize);
db.UserWord = userWordModel(sequelize);
db.User = userModel(sequelize);
db.WordList = wordListModel(sequelize);

db.ExamQuestion.belongsTo(db.Exam, {
    foreignKey: "exam_id",
    as: "examquestionxexam",
});

db.ExamQuestion.belongsTo(db.Question, {
    foreignKey: "question_id",
    as: "examquestionxquestion",
});

db.QuestionOption.belongsTo(db.Question,{
    foreignKey: "question_id",
    as:"questionoptionxquestion"
})

db.MatchingExamQuestion.belongsTo(db.Exam, {
    foreignKey: 'matching_exam_id',
    targetKey: 'id',
    as:'matchingexamquestionxexam'
});

db.MatchingExamQuestion.belongsTo(db.MatchingQuestion, {
    foreignKey: 'matching_exam_id',
    targetKey: 'id',
    as:'matchingexamquestionxquestion'
});

db.MatchingPairs.belongsTo(db.MatchingQuestion, {
    foreignKey: 'question_id',
    as:'matchingpairsxquestion'
});

db.Word.belongsTo(db.ProficiencyLevel, {
    foreignKey:'level_id',
    as:'wordxlevel'
});

db.Word.belongsTo(db.Category, {
    foreignKey:'category_id',
    as:'wordxcategory'
});

db.Word.belongsTo(db.PartOfSpeech, {
    foreignKey:'part_of_speech_id',
    as:'wordxpartofspeech'
});

db.UserList.belongsTo(db.User, {
    foreignKey:'user_id',
    as:'userlistxuser'
});

db.UserList.belongsTo(db.List, {
    foreignKey:'list_id',
    as:'userlistxlist'
});

db.UserExam.belongsTo(db.Exam, {
    foreignKey: "exam_id",
    as: "userexamxexam",
});

db.UserExam.belongsTo(db.User, {
    foreignKey: "user_id",
    as: "userexamxuser",
});

db.WordList.belongsTo(db.Word, {
    foreignKey: 'word_id',
    as:'wordlistxword'
});

db.WordList.belongsTo(db.List, {
    foreignKey: 'list_id',
    as:'wordlistxlist'
});

db.UserWord.belongsTo(db.Word,{
    foreignKey: 'word_id',
    as:'userwordxword'
});

db.UserWord.belongsTo(db.User,{
    foreignKey: 'user_id',
    as:'userwordxuser'
});

db.List.belongsTo(db.Category, {
    foreignKey:'list_category_id',
    as:'listxcategory'
});

// Sync all models with the database
sequelize.sync({ force: false });

module.exports = db;
