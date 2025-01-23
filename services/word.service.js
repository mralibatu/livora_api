const db = require("../config/config");

const getAll = async () => {
    return await db.Word.findAll();
};

const getWordsByCategory = async (categoryId) => {
    try {
        const words = await db.Word.findAll({
            where: { category_id: categoryId }, // Filter by category_id
            include: [
                {
                    model: db.Category,
                    as: 'wordxcategory', // Match the alias used in the association
                },
            ],
        });

        return words;
    } catch (error) {
        throw new Error(`Error fetching words for category ${categoryId}: ${error.message}`);
    }
};

const getWordsByLevel = async (levelId) => {
    try {
        const words = await db.Word.findAll({
            where: { level_id: levelId }, // Filter by level_id
            include: [
                {
                    model: db.Category,
                    as: 'wordxcategory', // Include the associated category
                },
            ],
        });

        return words;
    } catch (error) {
        throw new Error(`Error fetching words for level ${levelId}: ${error.message}`);
    }
};


const findWordById = async (id) => {
    return await db.Word.findByPk(id, {
        include: [
            {
                model: db.ProficiencyLevel,
                as: "wordxlevel",
                attributes: ["level_name", "level_cefr", "level_number"],
            },
            {
                model: db.PartOfSpeech,
                as: "wordxpartofspeech",
                attributes: ["part_name", "part_abbreviation"],
            },
            {
                model: db.Category,
                as: "wordxcategory",
                attributes: ["category_name", "difficulty_level"],
            },
        ],
    });
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

const deleteWord = async (id) => {
    await db.Word.destroy({
        where: { id: id },
    });
};

module.exports = {
    getAll,
    getWordsByCategory,
    getWordsByLevel,
    createWord,
    findWordById,
    updateWord,
    deleteWord,
};