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
        category_name: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        difficulty_level: {
            type: DataTypes.TINYINT,
            allowNull: false
        },
        isWordCategory: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
    };
    const options = {
        timestamps: false,
        tableName: "Category"
    };

    return sequelize.define("Category", attributes, options);
}
