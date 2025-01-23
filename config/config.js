const { Sequelize } = require("sequelize");
const wordModel = require("../models/word.model");
const questionModel = require("../models/question.model");
const categoryModel = require("../models/category.model");
const examModel = require("../models/exam.model");
const listModel = require("../models/list.model");
const matchingPairsModel = require("../models/matching_pairs.model");
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
    },
);

const db = {
    sequelize,
    Sequelize,};

// Model initialization
db.Word = wordModel(sequelize);
db.Question = questionModel(sequelize);
db.Category = categoryModel(sequelize);
db.Exam = examModel(sequelize);
db.List = listModel(sequelize);
db.MatchingPairs = matchingPairsModel(sequelize);
db.PartOfSpeech = partOfSpeechModel(sequelize);
db.ProficiencyLevel = proficiencyLevelModel(sequelize);
db.QuestionOption = questionOptionModel(sequelize);
db.UserExam = userExamModel(sequelize);
db.UserList = userListModel(sequelize);
db.UserWord = userWordModel(sequelize);
db.User = userModel(sequelize);
db.WordList = wordListModel(sequelize);

db.Question.belongsTo(db.Exam,{
    foreignKey: "exam_id",
    as:"questionnxexam"
});

db.Exam.hasMany(db.Question,{
    foreignKey: "exam_id",
    as:"examxquestion"
});

db.Exam.hasMany(db.MatchingPairs,{
    foreignKey: "exam_id",
    as:"examxmatching"
});

db.Exam.belongsTo(db.User,{
    foreignKey: "created_by_id",
    as:"examxuser"
});

db.Question.hasMany(db.QuestionOption, {
    foreignKey: 'question_id', 
    as: 'questionxquestionoption'
  });
  

db.QuestionOption.belongsTo(db.Question,{
    foreignKey: "question_id",
    as:"questionoptionxquestion"
})

db.MatchingPairs.belongsTo(db.Exam,{
    foreignKey: "exam_id",
    as:"matchingpairsxexam"
})

db.Word.belongsTo(db.ProficiencyLevel, {
    foreignKey:'level_id',
    as:'wordxlevel'
});

db.Word.belongsTo(db.Category, {
    foreignKey:'category_id',
    as:'wordxcategory'
});

db.Category.hasMany(db.Word, {
    foreignKey: 'category_id',
    as: 'wordxcategory',
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

db.Exam.hasMany(db.UserExam, {
    foreignKey: "exam_id", 
    as: "examxuserexam",
});

db.User.hasMany(db.UserExam, {
    foreignKey: "user_id", 
    as: "userxuserexam",
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

db.List.hasMany(db.WordList,{
    foreignKey: 'list_id',
     as: 'listxwordlist' 
});

// Sync all models with the database
sequelize.sync({ force: false });

module.exports = db;
