const express = require("express");
const router = express.Router();
const wordService = require("../services/word.service");


router.get("/", async (req, res) => {
    try{
        var words = await wordService.getAll();
        res.json(words);
    }catch (err)
    {
        console.log(err);
        res.status(500).json({statusCode:500, error:"Something went wrong"});
    }
});

module.exports = router;