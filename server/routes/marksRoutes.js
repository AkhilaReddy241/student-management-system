const express = require("express");

const {
  getAllMarks,
  getMarksById,
  addInternal1,
  addInternal2,
  addExternal,
  updateMarks,
  deleteMarks,
} = require("../controllers/marksController");

const router = express.Router();

// GET ALL MARKS
router.get("/", getAllMarks);

// GET ONE MARKS RECORD
router.get("/:id", getMarksById);

// INTERNAL 1
router.post("/internal1", addInternal1);

// INTERNAL 2
router.post("/internal2", addInternal2);

// EXTERNAL
router.post("/external", addExternal);

// UPDATE
router.put("/:id", updateMarks);

// DELETE
router.delete("/:id", deleteMarks);

module.exports = router;