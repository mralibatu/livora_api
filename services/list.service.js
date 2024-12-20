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

const findListByIdWithWords = async (id) => {
    return await db.List.findByPk(id, {
        include: [
            {
                model: db.Category,
                as: "listxcategory",
                attributes: ["category_name", "difficulty_level", "isWordCategory"],
            },
            {
                model: db.WordList,
                as: "listxwordlist",
                include: {
                    model: db.Word,
                    as: "wordlistxword",
                    attributes: ["foreign_word", "main_lang_word", "hint_text", "level_id", "part_of_speech_id", "category_id"],
                },
            },
        ],
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
    findListById,
    findListByIdWithWords,
    createList,
    updateList,
    deleteList,
};