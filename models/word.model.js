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
        foreing_word: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        main_lang_word: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        hint_text: {
            type: DataTypes.STRING(150),
            allowNull: true
        },
        level_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        part_of_speech_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    };
    const options = {
        timestamps: false,
    };

    return sequelize.define("Word", attributes, options);
}