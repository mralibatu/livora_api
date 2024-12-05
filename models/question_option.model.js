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
        question_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        option_text: {
            type: DataTypes.STRING(150),
            allowNull: false
        },
        is_correct: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
    };
    const options = {
        timestamps: false,
        tableName: "QuestionOptions"
    };

    const QuestionOption = sequelize.define("QuestionOption", attributes, options);

    return QuestionOption;
}
