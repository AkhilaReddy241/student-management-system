const express = require("express");

const router = express.Router();


const {
    createFaculty,
    getAllFaculty,
    getFacultyById,
    updateFaculty,
    deleteFaculty,
        getProfile
} = require("../controllers/facultyController");

const authMiddleware = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");


// ==========================================
// FACULTY MANAGEMENT
// ==========================================



// ======================================================
// FACULTY PROFILE
// IMPORTANT: MUST COME BEFORE /:id
// ======================================================

router.get("/profile", getProfile);


// Create Faculty
router.post("/", createFaculty);

// Get All Faculty
router.get("/", getAllFaculty);

// Get Faculty By ID
router.get("/:id", getFacultyById);

// Update Faculty
router.put("/:id", updateFaculty);

// Delete Faculty
router.delete("/:id", deleteFaculty);

module.exports = router;