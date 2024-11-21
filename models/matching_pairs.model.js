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
        item_left: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        item_right: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
    };
    const options = {
        timestamps: false,
        tableName: "MatchingPairs"
    };

    return sequelize.define("MatchingPair", attributes, options);
}
