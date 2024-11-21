const express = require("express");
const router = express.Router();
const questionService = require("../services/question.service");


router.get("/", async (req, res) => {
    try {
        var questions = await questionService.getAll();
        res.json(questions);
    } catch (err) {
        console.log(err);
        res.status(500).json({ statusCode: 500, error: "Something went wrong" });
    }
});

router.get("/:id", async (req, res) => {
    try {
        var question = await questionService.findQuestionById(req.params.id);
        if (!question) {
            return res
                .status(404)
                .json({ statusCode: 404, error: "Question Does not exist" });
        }
        return res.json(question);
    } catch (error) {
        return res
            .status(500)
            .json({ statusCode: 500, error: "Something went wrong" });
    }
});


router.post("/", async (req, res) => {
    try {
        var createdQuestion = await questionService.createQuestion(req.body);
        res.status(201).json(createdQuestion);
    } catch (error) {
        console.log(error);
        res.status(500).json({ statusCode: 500, error: "Something went wrong" });
    }
});

router.put("/:id", async (req, res) => {
    try {
        var existingQuestion = await questionService.findQuestionById(req.params.id);
        console.log(existingQuestion);
        if (!existingQuestion) {
            return res
                .status(404)
                .json({ statusCode: 404, error: "Question Does not exist" });
        }
        var updatedQuestion = await questionService.updateQuestion(req.body);
        return res.json(updatedQuestion);
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ statusCode: 500, error: "Something went wrong" });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        var existingQuestion = await questionService.findQuestionById(req.params.id);
        if (!existingQuestion) {
            return res
                .status(404)
                .json({ statusCode: 404, error: "Question Does not exist" });
        }

        await questionService.deleteQuestion(req.params.id);
        return res.json({
            statusCode: 200,
            message: `Question with id: ${req.params.id} is deleted successfully`,
        });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ statusCode: 500, error: "Something went wrong" });
    }
});

module.exports = router;