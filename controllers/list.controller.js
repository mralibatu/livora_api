const express = require("express");
const router = express.Router();
const listService = require("../services/list.service");


router.get("/", async (req, res) => {
    try {
        var lists = await listService.getAll();
        res.json(lists);
    } catch (err) {
        console.log(err);
        res.status(500).json({ statusCode: 500, error: "Something went wrong" });
    }
});

router.get("/:id", async (req, res) => {
    try {
        var list = await listService.findListById(req.params.id);
        if (!list) {
            return res
                .status(404)
                .json({ statusCode: 404, error: "List Does not exist" });
        }
        return res.json(list);
    } catch (error) {
        return res
            .status(500)
            .json({ statusCode: 500, error: "Something went wrong" });
    }
});


router.post("/", async (req, res) => {
    try {
        var createlist = await listService.createList(req.body);
        res.status(201).json(createlist);
    } catch (error) {
        console.log(error);
        res.status(500).json({ statusCode: 500, error: "Something went wrong" });
    }
});

router.put("/:id", async (req, res) => {
    try {
        var existinglist = await listService.findListById(req.params.id);
        console.log(existinglist);
        if (!existinglist) {
            return res
                .status(404)
                .json({ statusCode: 404, error: "List Does not exist" });
        }
        var updatedlist = await listService.updateList(req.body);
        return res.json(updatedlist);
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ statusCode: 500, error: "Something went wrong" });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        var existinglist = await listService.findListById(req.params.id);
        if (!existinglist) {
            return res
                .status(404)
                .json({ statusCode: 404, error: "List Does not exist" });
        }

        await listService.deleteList(req.params.id);
        return res.json({
            statusCode: 200,
            message: `List with id: ${req.params.id} is deleted successfully`,
        });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ statusCode: 500, error: "Something went wrong" });
    }
});

module.exports = router;