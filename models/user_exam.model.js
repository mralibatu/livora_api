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
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        is_completed: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        point: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
    };
    const options = {
        timestamps: false,
        tableName: "UserExam"
    };

    return sequelize.define("UserExam", attributes, options);
}
