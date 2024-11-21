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
        question_text: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
    };
    const options = {
        timestamps: false,
        tableName: "MatchingQuestions"
    };

    return sequelize.define("MatchingQuestion", attributes, options);
}
