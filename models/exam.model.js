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
        exam_name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        timer_seconds: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        is_private: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: 0
        },
        created_by_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        is_matching: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        },
    };
    const options = {
        timestamps: false,
        tableName: "Exams"
    };

    const Exam =  sequelize.define("Exam", attributes, options);


    return Exam;
}
