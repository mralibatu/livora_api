const { DataTypes } = require("sequelize");

module.exports = model;

function model(sequelize) {
    const attributes = {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        matching_exam_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        matching_question_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    };
    const options = {
        timestamps: false,
        tableName: "MatchingExamQuestion"
    };

    const MatchingExamQuestion = sequelize.define("MatchingExamQuestion", attributes, options);

    MatchingExamQuestion.belongsTo(sequelize.models.Exam, {
        foreignKey: 'matching_exam_id',
        targetKey: 'id',
        as:'matchingExam'
    });

    MatchingExamQuestion.belongsTo(sequelize.models.MatchingQuestion, {
        foreignKey: 'matching_exam_id',
        targetKey: 'id',
        as:'matchingExam'
    });
}
