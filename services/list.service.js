const db = require("../config/config");

const getAll = async () => {
    return await db.List.findAll();
};

const findListById = async (id) => {
    return await db.List.findByPk(id, {
        include: {
            model: db.Category,
            as: "listxcategory",
            attributes: ["category_name","difficulty_level","isWordCategory"], 
        },
    });
};

const createList = async ({ list_name, repeat_day, is_private = 0, list_category_id}) => {
    const newList = await db.List.create(
        {
            list_name,
            ...(repeat_day && { repeat_day }),
            list_category_id,
            is_private: is_private || 0,
        }
    );
    return newList;
};

const updateList = async ({ id, list_name, repeat_day, is_private, list_category_id }) => {
    await db.List.update(
        { list_name, repeat_day, is_private, list_category_id},
        {
            where: {
                id: id,
            },
        }
    );
    return { id, list_name, repeat_day, is_private, list_category_id };
};

const deleteList = async (id) => {
    await db.List.destroy({
        where: { id: id },
    });
};

module.exports = {
    getAll,
    createList,
    findListById,
    updateList,
    deleteList,
};