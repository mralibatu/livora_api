const express = require("express");
const router = express.Router();
const userService = require("../services/user.service");

router.get("/", async (req, res) => {
    try {
        var users = await userService.getAll();
        res.json(users);
    } catch (err) {
        console.log(err);
        res.status(500).json({ statusCode: 500, error: "Something went wrong" });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const userId = req.params.id; // Get the user ID from the URL
        const user = await userService.getUserById(userId); // Call the service function
        
        res.json(user); // Send the user data as JSON
    } catch (err) {
        console.error(err);
        if (err.message.includes("not found")) {
            return res.status(404).json({ statusCode: 404, error: err.message });
        }
        res.status(500).json({ statusCode: 500, error: "Something went wrong" });
    }
});



router.get("/:userId/words", async (req, res) => {
    const { userId } = req.params;

    try {
        var words = await userService.getAllWordsForUser(userId);
        res.json(words);
    } catch (err) {
        console.log(err);
        res.status(500).json({ statusCode: 500, error: "Something went wrong" });
    }
});

router.get("/:userId/learnedwords", async (req, res) => {
    const { userId } = req.params;

    try {
        var learnedWords = await userService.getLearnedWordsForUser(userId);
        res.json(learnedWords);
    } catch (err) {
        console.log(err);
        res.status(500).json({ statusCode: 500, error: "Something went wrong" });
    }
});

router.get("/:userId/wordstats", async (req, res) => {
    const { userId } = req.params;

    try {
        var stats = await userService.getUserWordStats(userId);
        res.json(stats);
    } catch (err) {
        console.log(err);
        res.status(500).json({ statusCode: 500, error: "Something went wrong" });
    }
});

router.get("/:userId/wordstats/:wordId", async (req, res) => {
    const { userId, wordId} = req.params;

    try {
        var stats = await userService.getUserWordInfo(userId, wordId);
        res.json(stats);
    } catch (err) {
        console.log(err);
        res.status(500).json({ statusCode: 500, error: "Something went wrong" });
    }
});



router.get("/:userId/examstats", async (req, res) => {
    const { userId } = req.params;

    try {
        var stats = await userService.getUserExamStats(userId);
        res.json(stats);
    } catch (err) {
        console.log(err);
        res.status(500).json({ statusCode: 500, error: "Something went wrong" });
    }
});

router.post("/:userId/examstats/:examId", async (req, res) => {
    const { userId, examId } = req.params;
    const { isCompleted, point } = req.body;  // Expecting isCompleted and point from the request body

    try {
        // Prepare the updates object with the new data
        const updates = { is_completed: isCompleted, point };

        // Call the service to update the UserExam record
        const result = await userService.updateUserExam(userId, examId, updates);

        // Send response if update is successful
        res.status(200).json({
            success: true,
            message: result.message,
            data: result.data,
        });
    } catch (err) {
        console.error('Error updating user exam:', err);
        res.status(500).json({
            success: false,
            error: 'Something went wrong while updating the user exam',
        });
    }
});


router.get("/:userId/examstats/:examId", async (req, res) => {
    try {
        const { userId, examId } = req.params;

        const stats = await userService.getUserExamStatsByExam(userId,examId);
        
        if (!stats) {
            return res
                .status(404)
                .json({ statusCode: 404, error: "Exam does not exist or is not accessible to this user" });
        }
        
        return res.json(stats);
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ statusCode: 500, error: "Something went wrong" });
    }
});

router.get("/:userId/liststats", async (req, res) => {
    try {
        const { userId} = req.params;

        const stats = await userService.getUserListStats(userId);
        
        if (!stats) {
            return res
                .status(404)
                .json({ statusCode: 404, error: "List does not exist or is not accessible to this user" });
        }
        
        return res.json(stats);
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ statusCode: 500, error: "Something went wrong" });
    }
});


router.get("/:userId/liststats/:listId", async (req, res) => {
    try {
        const { userId, listId } = req.params;

        const stats = await userService.getSpecificListStats(userId,listId);
        
        if (!stats) {
            return res
                .status(404)
                .json({ statusCode: 404, error: "List does not exist or is not accessible to this user" });
        }
        
        return res.json(stats);
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ statusCode: 500, error: "Something went wrong" });
    }
});

router.post('/:id/update', async (req, res) => {
    try {
        const userId = req.params.id;
        const userData = req.body;
        
        const updatedUser = await userService.updateUser(userId, userData);
        
        res.status(200).json({
            success: true,
            data: updatedUser
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

router.post('/:id/wordstats/:wordId', async (req, res) => {
    try {
        const userId = req.params.id; // Extract userId from the URL
        const wordId = req.params.wordId; // Extract wordId from the URL
        const { is_learned, is_favorite } = req.body; // Extract fields to update from the request body

        // Update the UserWord info via the service
        const updatedUserWord = await userService.updateUserWordInfo(userId, wordId, { is_learned, is_favorite });

        res.status(200).json({
            success: true,
            data: updatedUserWord,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message,
        });
    }
});



module.exports = router;