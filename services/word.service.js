const db = require("../config/config");

const getAll = async () => {
    return await db.Word.findAll();
};

module.exports = {
    getAll
};