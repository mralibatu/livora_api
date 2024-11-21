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
        level_name: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        level_cefr: {
            type: DataTypes.STRING(5),
            allowNull: false
        },
        level_number: {
            type: DataTypes.TINYINT,
            allowNull: false
        },
    };
    const options = {
        timestamps: false,
        tableName: "ProficiencyLevels"
    };

    return sequelize.define("ProficiencyLevel", attributes, options);
}
