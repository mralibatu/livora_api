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
        part_name: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        part_abbreviation: {
            type: DataTypes.STRING(10),
            allowNull: false
        },
    };
    const options = {
        timestamps: false,
        tableName: "PartOfSpeech"
    };

    return sequelize.define("PartOfSpeech", attributes, options);
}
