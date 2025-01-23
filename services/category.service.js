const { where } = require("sequelize");
const db = require("../config/config");

const getAll = async () => {
    return await db.Category.findAll({
        attributes: {
            include: [
                [
                    db.sequelize.fn('COUNT', db.sequelize.col('wordxcategory.id')),
                    'wordCount',
                ],
            ],
        },
        include: [
            {
                model: db.Word,
                as: 'wordxcategory', // Alias matches the association
                attributes: [], // Exclude word details
            },
        ],
        group: [
            'Category.id',
            'Category.category_name',
            'Category.difficulty_level', // Add non-aggregated column
            'Category.isWordCategory',  // Add non-aggregated column
        ],
    });
};



const findCategoryById = async (id) => {
    return await db.Category.findByPk(id);
};

const createCategory = async ({category_name, difficulty_level, isWordCategory}) => {
    const newCategory = await db.Category.create(
        {
            category_name,
            difficulty_level,
            isWordCategory,
        }
    );
    return newCategory;
};

const updateCategory = async ({id, category_name, difficulty_level, isWordCategory}) => {
    await db.Category.update(
        {category_name, difficulty_level, isWordCategory},
        {where:{id:id,},}
    );

    return {id, category_name, difficulty_level, isWordCategory};
};

const deleteCategory = async (id) => {
    await db.Category.destroy({
        where: {id: id},
    });
};

module.exports = {
    getAll,
    findCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
};