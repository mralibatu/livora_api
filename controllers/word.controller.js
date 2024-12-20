const express = require("express");
const router = express.Router();
const wordService = require("../services/word.service");


router.get("/", async (req, res) => {
    try {
        var words = await wordService.getAll();
        res.json(words);
    } catch (err) {
        console.log(err);
        res.status(500).json({ statusCode: 500, error: "Something went wrong" });
    }
});

router.get("/:id", async (req, res) => {
    try {
        var word = await wordService.findWordById(req.params.id);
        if (!word) {
            return res
                .status(404)
                .json({ statusCode: 404, error: "Word Does not exist" });
        }
        return res.json(word);
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ statusCode: 500, error: "Something went wrong" });
    }
});

router.get("/:id/category", async (req, res) => {
    try {
        var word = await wordService.findWordByIdWithCategory(req.params.id);
        if (!word) {
            return res
                .status(404)
                .json({ statusCode: 404, error: "Word does not exist" });
        }
        return res.json(word);
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ statusCode: 500, error: "Something went wrong" });
    }
});



router.post("/", async (req, res) => {
    try {
        var createWord = await wordService.createWord(req.body);
        res.status(201).json(createWord);
    } catch (error) {
        console.log(error);
        res.status(500).json({ statusCode: 500, error: "Something went wrong" });
    }
});

router.put("/:id", async (req, res) => {
    try {
        var existingWord = await wordService.findWordById(req.params.id);
        console.log(existingWord);
        if (!existingWord) {
            return res
                .status(404)
                .json({ statusCode: 404, error: "Word Does not exist" });
        }
        var updatedWord = await wordService.updateWord(req.body);
        return res.json(updatedWord);
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ statusCode: 500, error: "Something went wrong" });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        var existingWord = await wordService.findWordById(req.params.id);
        if (!existingWord) {
            return res
                .status(404)
                .json({ statusCode: 404, error: "Word Does not exist" });
        }

        await wordService.deleteWord(req.params.id);
        return res.json({
            statusCode: 200,
            message: `Word with id: ${req.params.id} is deleted successfully`,
        });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ statusCode: 500, error: "Something went wrong" });
    }
});

module.exports = router;