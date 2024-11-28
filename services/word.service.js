const db = require("../config/config");

const getAll = async () => {
    return await db.Word.findAll();
};

const findWordById = async (id) => {
    return await db.Word.findByPk(id);
};

const createWord = async ({ foreign_word, main_lang_word, hint_text, level_id, part_of_speech_id, category_id = 1 }) => {
    const newWord = await db.Word.create(
        {
            foreign_word,
            main_lang_word,
            ...(hint_text && { hint_text }),
            level_id,
            ...(part_of_speech_id && { part_of_speech_id }),
            category_id: category_id || 1,
        }
    );
    return newWord;
};

const updateWord = async ({ id, foreign_word, main_lang_word, hint_text, level_id, part_of_speech_id, category_id }) => {
    await db.Word.update(
        { foreign_word, main_lang_word, hint_text, level_id, part_of_speech_id, category_id },
        {
            where: {
                id: id,
            },
        }
    );
    return { id, foreign_word, main_lang_word, hint_text, level_id, part_of_speech_id, category_id };
};

const findWordByIdWithCategory = async (id) => {
    return await db.Word.findByPk(id, {
        include: {
            model: db.Category,
            as: "wordxcategory", // Alias defined in the relationship
            attributes: ["category_name"], // Only fetch the category_name column
        },
    });
};

const deleteWord = async (id) => {
    await db.Word.destroy({
        where: { id: id },
    });
};

module.exports = {
    getAll,
    createWord,
    findWordById,
    updateWord,
    deleteWord,
    findWordByIdWithCategory
};