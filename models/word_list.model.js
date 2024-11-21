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
        list_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    };
    const options = {
        timestamps: false,
        tableName: "WordList"
    };

    return sequelize.define("WordList", attributes, options);
}
