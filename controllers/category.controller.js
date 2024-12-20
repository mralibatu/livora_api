const express = require("express");
const router = express.Router();
const categoryService = require("../services/category.service");

router.get("/", async (req, res) => {
    try {
        var categories = await categoryService.getAll();
        res.json(categories);
    } catch (err) {
        console.log(err);
        res.status(500).json({ statusCode: 500, error: "Something went wrong" });
    }
});

router.post("/", async (req, res) => {
    try {
        var createCategory = await categoryService.createCategory(req.body);
        res.status(201).json(createCategory);
    } catch (error) {
        console.log(error);
        res.status(500).json({ statusCode: 500, error: "Something went wrong" });
    }
});

router.put("/:id", async (req, res) => {
    try {
        var existingCategory = await categoryService.findCategoryById(req.params.id);
        console.log(existingCategory);
        if (!existingCategory) {
            return res
                .status(404)
                .json({ statusCode: 404, error: "Category Does not exist" });
        }
        var updatedCategory = await categoryService.updateCategory(req.body);
        return res.json(updatedCategory);
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ statusCode: 500, error: "Something went wrong" });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        var existingCategory = await categoryService.findCategoryById(req.params.id);
        if (!existingCategory) {
            return res
                .status(404)
                .json({ statusCode: 404, error: "Category Does not exist" });
        }

        await categoryService.deleteCategory(req.params.id);
        return res.json({
            statusCode: 200,
            message: `Category with id: ${req.params.id} is deleted successfully`,
        });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ statusCode: 500, error: "Something went wrong" });
    }
});

module.exports = router;