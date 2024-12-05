const express = require("express");
const router = express.Router();
const examService = require("../services/exam.service");


router.get("/", async (req, res) => {
    try {
        var exams = await examService.getAll();
        res.json(exams);
    } catch (err) {
        console.log(err);
        res.status(500).json({ statusCode: 500, error: "Something went wrong" });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const examId = req.params.id;
        const userId = req.query.userId; 
        
        const whereCondition = userId ? { id: userId } : null;

        const exam = await examService.findExamWithQuestionsById(examId, whereCondition);
        
        if (!exam) {
            return res
                .status(404)
                .json({ statusCode: 404, error: "Exam does not exist or is not accessible to this user" });
        }
        
        return res.json(exam); // Sınav bilgilerini döndür
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ statusCode: 500, error: "Something went wrong" });
    }
});

router.post("/", async (req, res) => {
    try {
        var createExam = await examService.createExam(req.body);
        res.status(201).json(createExam);
    } catch (error) {
        console.log(error);
        res.status(500).json({ statusCode: 500, error: "Something went wrong" });
    }
});

router.put("/:id", async (req, res) => {
    try {
        var existingExam = await examService.findExamById(req.params.id);
        console.log(existingExam);
        if (!existingExam) {
            return res
                .status(404)
                .json({ statusCode: 404, error: "Exam Does not exist" });
        }
        var updatedExam = await examService.updateExam(req.body);
        return res.json(updatedExam);
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ statusCode: 500, error: "Something went wrong" });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        var existingExam = await examService.findExambyId(req.params.id);
        if (!existingExam) {
            return res
                .status(404)
                .json({ statusCode: 404, error: "Exam Does not exist" });
        }

        await examService.deleteExam(req.params.id);
        return res.json({
            statusCode: 200,
            message: `Exam with id: ${req.params.id} is deleted successfully`,
        });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ statusCode: 500, error: "Something went wrong" });
    }
});

module.exports = router;