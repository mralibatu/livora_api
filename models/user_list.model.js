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
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        list_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        is_completed: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: 0
        },
    };
    const options = {
        timestamps: false,
        tableName: "UserList"
    };

    return sequelize.define("UserList", attributes, options);
}
