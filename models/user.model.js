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
        name: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        surname: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        photo: {
            type: DataTypes.BLOB('long'),
            allowNull: false
        },
        password: {
            type: DataTypes.BLOB(255),
            allowNull: false
        },
        daily_goal: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        streak_count: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        device_id: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
    };
    const options = {
        timestamps: false,
        tableName: "Users"
    };

    return sequelize.define("User", attributes, options);
}
