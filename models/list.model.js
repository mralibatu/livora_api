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
        list_name: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        repeat_day: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        is_private: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: 0
        },
        list_category_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
    };
    const options = {
        timestamps: false,
        tableName: "Lists"
    };

    const List =  sequelize.define("List", attributes, options);
    
    return List;
}
