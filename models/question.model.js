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
        exam_id:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        question_text: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        is_matching: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
    };
    const options = {
        timestamps: false,
        tableName:"Questions"
    };

    return sequelize.define("Question", attributes, options);
}