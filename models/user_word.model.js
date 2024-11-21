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
        word_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        is_learned: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        last_reviewed: {
            type: DataTypes.DATE,
            allowNull: false
        },
        review_count: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        is_favorite: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
    };
    const options = {
        timestamps: false,
        tableName: "UserWord"
    };

    return sequelize.define("UserWord", attributes, options);
}
