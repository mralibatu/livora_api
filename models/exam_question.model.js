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
        exam_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        question_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    };
    const options = {
        timestamps: false,
        tableName: "ExamQuestion"
    };

    const ExamQuestion =  sequelize.define("ExamQuestion", attributes, options);

    return ExamQuestion;
}
