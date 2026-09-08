const mongoose = require("mongoose");
const Marks = require("../models/Marks");

// ======================================================
// HELPER FUNCTIONS
// ======================================================

const calculateInternalTotal = (internal) => {
    if (!internal) {
        return 0;
    }

    const examMarks = Number(internal.examMarks || 0);
    const assignmentMarks = Number(internal.assignmentMarks || 0);

    return examMarks + assignmentMarks;
};


const calculateGrade = (finalTotal) => {
    if (finalTotal >= 90) return "A+";
    if (finalTotal >= 80) return "A";
    if (finalTotal >= 70) return "B+";
    if (finalTotal >= 60) return "B";
    if (finalTotal >= 50) return "C";
    if (finalTotal >= 40) return "D";

    return "F";
};


const calculateResult = (finalTotal) => {
    return finalTotal >= 40 ? "Pass" : "Fail";
};


const calculateMarks = (marks) => {
    const internal1Total =
        calculateInternalTotal(marks.internal1);

    const internal2Total =
        calculateInternalTotal(marks.internal2);

    // Average only when both internals are available
    let internalAverage = 0;

    if (marks.internal1 && marks.internal2) {
        internalAverage =
            (internal1Total + internal2Total) / 2;
    }

    const externalMarks =
        Number(marks.externalMarks || 0);

    const finalTotal =
        internalAverage + externalMarks;

    const grade =
        calculateGrade(finalTotal);

    const result =
        calculateResult(finalTotal);

    return {
        internal1Total,
        internal2Total,
        internalAverage,
        externalMarks,
        finalTotal,
        grade,
        result
    };
};


// ======================================================
// GET ALL MARKS
// ======================================================

const getAllMarks = async (req, res) => {
    try {

        const records = await Marks.find()
            .populate(
                "student",
                "name rollNumber department semester email phone"
            )
            .sort({ createdAt: -1 });

        const data = records.map((marks) => {

            const calculated =
                calculateMarks(marks);

            return {
                ...marks.toObject(),

                internal1: marks.internal1
                    ? {
                        examMarks:
                            marks.internal1.examMarks,

                        assignmentMarks:
                            marks.internal1.assignmentMarks,

                        total:
                            calculated.internal1Total
                    }
                    : null,

                internal2: marks.internal2
                    ? {
                        examMarks:
                            marks.internal2.examMarks,

                        assignmentMarks:
                            marks.internal2.assignmentMarks,

                        total:
                            calculated.internal2Total
                    }
                    : null,

                internalAverage:
                    calculated.internalAverage,

                externalMarks:
                    marks.externalMarks,

                finalTotal:
                    calculated.finalTotal,

                grade:
                    calculated.grade,

                result:
                    calculated.result
            };
        });

        res.status(200).json({
            success: true,
            count: data.length,
            data,
            marks: data
        });

    } catch (error) {

        console.error(
            "GET ALL MARKS ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ======================================================
// GET MARKS BY ID
// ======================================================

const getMarksById = async (req, res) => {
    try {

        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid marks ID"
            });
        }

        const marks = await Marks.findById(id)
            .populate(
                "student",
                "name rollNumber department semester email phone"
            );

        if (!marks) {
            return res.status(404).json({
                success: false,
                message: "Marks record not found"
            });
        }

        const calculated =
            calculateMarks(marks);

        const data = {
            ...marks.toObject(),

            internal1: marks.internal1
                ? {
                    examMarks:
                        marks.internal1.examMarks,

                    assignmentMarks:
                        marks.internal1.assignmentMarks,

                    total:
                        calculated.internal1Total
                }
                : null,

            internal2: marks.internal2
                ? {
                    examMarks:
                        marks.internal2.examMarks,

                    assignmentMarks:
                        marks.internal2.assignmentMarks,

                    total:
                        calculated.internal2Total
                }
                : null,

            internalAverage:
                calculated.internalAverage,

            finalTotal:
                calculated.finalTotal,

            grade:
                calculated.grade,

            result:
                calculated.result
        };

        res.status(200).json({
            success: true,
            data
        });

    } catch (error) {

        console.error(
            "GET MARKS BY ID ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ======================================================
// ADD INTERNAL 1
// ======================================================

const addInternal1 = async (req, res) => {
    try {

        const {
            student,
            semester,
            subjectId,
            subject,
            examMarks,
            assignmentMarks
        } = req.body;

        // ---------------------------------------------
        // Validation
        // ---------------------------------------------

        if (!student) {
            return res.status(400).json({
                success: false,
                message: "Student is required"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(student)) {
            return res.status(400).json({
                success: false,
                message: "Invalid student ID"
            });
        }

        if (!subject || !subject.trim()) {
            return res.status(400).json({
                success: false,
                message: "Subject is required"
            });
        }

        const semesterNumber =
            Number(semester);

        const exam =
            Number(examMarks);

        const assignment =
            Number(assignmentMarks);

        if (!Number.isInteger(semesterNumber) ||
            semesterNumber <= 0) {

            return res.status(400).json({
                success: false,
                message: "Invalid semester"
            });
        }

        if (!Number.isFinite(exam) ||
            exam < 0 ||
            exam > 25) {

            return res.status(400).json({
                success: false,
                message:
                    "Exam marks must be between 0 and 25"
            });
        }

        if (!Number.isFinite(assignment) ||
            assignment < 0 ||
            assignment > 5) {

            return res.status(400).json({
                success: false,
                message:
                    "Assignment marks must be between 0 and 5"
            });
        }

        // ---------------------------------------------
        // Find existing Marks document
        // ---------------------------------------------

        let marks = await Marks.findOne({
            student,
            semester: semesterNumber,
            subject: subject.trim()
        });

        // ---------------------------------------------
        // Create new document
        // ---------------------------------------------

        if (!marks) {

            marks = new Marks({
                student,
                semester: semesterNumber,
                subjectId: subjectId || undefined,
                subject: subject.trim(),

                internal1: {
                    examMarks: exam,
                    assignmentMarks: assignment
                },

                internal2: null,

                externalMarks: null
            });

        } else {

            // -----------------------------------------
            // Prevent duplicate Internal 1
            // -----------------------------------------

            if (marks.internal1 !== null &&
                marks.internal1 !== undefined) {

                return res.status(409).json({
                    success: false,
                    message:
                        "Internal 1 marks already exist for this student and subject"
                });
            }

            marks.internal1 = {
                examMarks: exam,
                assignmentMarks: assignment
            };

            if (subjectId) {
                marks.subjectId = subjectId;
            }
        }

        await marks.save();

        const populatedMarks =
            await Marks.findById(marks._id)
                .populate(
                    "student",
                    "name rollNumber department semester email phone"
                );

        const calculated =
            calculateMarks(populatedMarks);

        res.status(201).json({
            success: true,
            message:
                "Internal 1 marks saved successfully",

            data: {
                ...populatedMarks.toObject(),

                internal1: {
                    examMarks:
                        populatedMarks.internal1.examMarks,

                    assignmentMarks:
                        populatedMarks.internal1.assignmentMarks,

                    total:
                        calculated.internal1Total
                },

                internalAverage:
                    calculated.internalAverage,

                finalTotal:
                    calculated.finalTotal,

                grade:
                    calculated.grade,

                result:
                    calculated.result
            }
        });

    } catch (error) {

        console.error(
            "ADD INTERNAL 1 ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ======================================================
// ADD INTERNAL 2
// ======================================================

const addInternal2 = async (req, res) => {
    try {

        const {
            student,
            semester,
            subjectId,
            subject,
            examMarks,
            assignmentMarks
        } = req.body;

        // ---------------------------------------------
        // Validation
        // ---------------------------------------------

        if (!student) {
            return res.status(400).json({
                success: false,
                message: "Student is required"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(student)) {
            return res.status(400).json({
                success: false,
                message: "Invalid student ID"
            });
        }

        if (!subject || !subject.trim()) {
            return res.status(400).json({
                success: false,
                message: "Subject is required"
            });
        }

        const semesterNumber =
            Number(semester);

        const exam =
            Number(examMarks);

        const assignment =
            Number(assignmentMarks);

        if (!Number.isInteger(semesterNumber) ||
            semesterNumber <= 0) {

            return res.status(400).json({
                success: false,
                message: "Invalid semester"
            });
        }

        if (!Number.isFinite(exam) ||
            exam < 0 ||
            exam > 25) {

            return res.status(400).json({
                success: false,
                message:
                    "Exam marks must be between 0 and 25"
            });
        }

        if (!Number.isFinite(assignment) ||
            assignment < 0 ||
            assignment > 5) {

            return res.status(400).json({
                success: false,
                message:
                    "Assignment marks must be between 0 and 5"
            });
        }

        // ---------------------------------------------
        // Find existing document
        // ---------------------------------------------

        let marks = await Marks.findOne({
            student,
            semester: semesterNumber,
            subject: subject.trim()
        });

        // ---------------------------------------------
        // Create document if missing
        // ---------------------------------------------

        if (!marks) {

            marks = new Marks({
                student,
                semester: semesterNumber,
                subjectId: subjectId || undefined,
                subject: subject.trim(),

                internal1: null,

                internal2: {
                    examMarks: exam,
                    assignmentMarks: assignment
                },

                externalMarks: null
            });

        } else {

            // -----------------------------------------
            // Prevent duplicate Internal 2
            // -----------------------------------------

            if (marks.internal2 !== null &&
                marks.internal2 !== undefined) {

                return res.status(409).json({
                    success: false,
                    message:
                        "Internal 2 marks already exist for this student and subject"
                });
            }

            marks.internal2 = {
                examMarks: exam,
                assignmentMarks: assignment
            };

            if (subjectId) {
                marks.subjectId = subjectId;
            }
        }

        await marks.save();

        const populatedMarks =
            await Marks.findById(marks._id)
                .populate(
                    "student",
                    "name rollNumber department semester email phone"
                );

        const calculated =
            calculateMarks(populatedMarks);

        res.status(201).json({
            success: true,
            message:
                "Internal 2 marks saved successfully",

            data: {
                ...populatedMarks.toObject(),

                internal2: {
                    examMarks:
                        populatedMarks.internal2.examMarks,

                    assignmentMarks:
                        populatedMarks.internal2.assignmentMarks,

                    total:
                        calculated.internal2Total
                },

                internalAverage:
                    calculated.internalAverage,

                finalTotal:
                    calculated.finalTotal,

                grade:
                    calculated.grade,

                result:
                    calculated.result
            }
        });

    } catch (error) {

        console.error(
            "ADD INTERNAL 2 ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ======================================================
// ADD EXTERNAL MARKS
// ======================================================

const addExternal = async (req, res) => {
    try {

        const {
            student,
            semester,
            subject,
            externalMarks
        } = req.body;

        // ---------------------------------------------
        // Validation
        // ---------------------------------------------

        if (!student) {
            return res.status(400).json({
                success: false,
                message: "Student is required"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(student)) {
            return res.status(400).json({
                success: false,
                message: "Invalid student ID"
            });
        }

        if (!subject || !subject.trim()) {
            return res.status(400).json({
                success: false,
                message: "Subject is required"
            });
        }

        const semesterNumber =
            Number(semester);

        const external =
            Number(externalMarks);

        if (!Number.isInteger(semesterNumber) ||
            semesterNumber <= 0) {

            return res.status(400).json({
                success: false,
                message: "Invalid semester"
            });
        }

        if (!Number.isFinite(external) ||
            external < 0 ||
            external > 70) {

            return res.status(400).json({
                success: false,
                message:
                    "External marks must be between 0 and 70"
            });
        }

        // ---------------------------------------------
        // Find marks record
        // ---------------------------------------------

        const marks = await Marks.findOne({
            student,
            semester: semesterNumber,
            subject: subject.trim()
        });

        if (!marks) {
            return res.status(404).json({
                success: false,
                message:
                    "Marks record not found. Please enter Internal 1 and Internal 2 first."
            });
        }

        // ---------------------------------------------
        // Require both internals
        // ---------------------------------------------

        if (!marks.internal1) {
            return res.status(400).json({
                success: false,
                message:
                    "Internal 1 marks are not entered yet."
            });
        }

        if (!marks.internal2) {
            return res.status(400).json({
                success: false,
                message:
                    "Internal 2 marks are not entered yet."
            });
        }

        // ---------------------------------------------
        // Prevent duplicate external
        // ---------------------------------------------

        if (marks.externalMarks !== null &&
            marks.externalMarks !== undefined) {

            return res.status(409).json({
                success: false,
                message:
                    "External marks already exist for this student and subject"
            });
        }

        marks.externalMarks = external;

        await marks.save();

        const populatedMarks =
            await Marks.findById(marks._id)
                .populate(
                    "student",
                    "name rollNumber department semester email phone"
                );

        const calculated =
            calculateMarks(populatedMarks);

        res.status(201).json({
            success: true,
            message:
                "External marks saved successfully",

            data: {
                ...populatedMarks.toObject(),

                internal1: {
                    examMarks:
                        populatedMarks.internal1.examMarks,

                    assignmentMarks:
                        populatedMarks.internal1.assignmentMarks,

                    total:
                        calculated.internal1Total
                },

                internal2: {
                    examMarks:
                        populatedMarks.internal2.examMarks,

                    assignmentMarks:
                        populatedMarks.internal2.assignmentMarks,

                    total:
                        calculated.internal2Total
                },

                internalAverage:
                    calculated.internalAverage,

                externalMarks:
                    calculated.externalMarks,

                finalTotal:
                    calculated.finalTotal,

                grade:
                    calculated.grade,

                result:
                    calculated.result
            }
        });

    } catch (error) {

        console.error(
            "ADD EXTERNAL ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ======================================================
// UPDATE MARKS
// ======================================================

const updateMarks = async (req, res) => {
    try {

        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid marks ID"
            });
        }

        const marks =
            await Marks.findById(id);

        if (!marks) {
            return res.status(404).json({
                success: false,
                message: "Marks record not found"
            });
        }

        const {
            semester,
            subject,
            subjectId,
            internal1,
            internal2,
            externalMarks
        } = req.body;

        // ---------------------------------------------
        // Semester
        // ---------------------------------------------

        if (semester !== undefined) {

            const semesterNumber =
                Number(semester);

            if (!Number.isInteger(semesterNumber) ||
                semesterNumber <= 0) {

                return res.status(400).json({
                    success: false,
                    message: "Invalid semester"
                });
            }

            marks.semester =
                semesterNumber;
        }

        // ---------------------------------------------
        // Subject
        // ---------------------------------------------

        if (subject !== undefined) {

            if (!String(subject).trim()) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Subject cannot be empty"
                });
            }

            marks.subject =
                String(subject).trim();
        }

        // ---------------------------------------------
        // Subject ID
        // ---------------------------------------------

        if (subjectId !== undefined) {
            marks.subjectId =
                subjectId || undefined;
        }

        // ---------------------------------------------
        // Internal 1
        // ---------------------------------------------

        if (internal1 !== undefined) {

            const exam =
                Number(internal1.examMarks);

            const assignment =
                Number(internal1.assignmentMarks);

            if (!Number.isFinite(exam) ||
                exam < 0 ||
                exam > 25) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Internal 1 exam marks must be between 0 and 25"
                });
            }

            if (!Number.isFinite(assignment) ||
                assignment < 0 ||
                assignment > 5) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Internal 1 assignment marks must be between 0 and 5"
                });
            }

            marks.internal1 = {
                examMarks: exam,
                assignmentMarks: assignment
            };
        }

        // ---------------------------------------------
        // Internal 2
        // ---------------------------------------------

        if (internal2 !== undefined) {

            const exam =
                Number(internal2.examMarks);

            const assignment =
                Number(internal2.assignmentMarks);

            if (!Number.isFinite(exam) ||
                exam < 0 ||
                exam > 25) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Internal 2 exam marks must be between 0 and 25"
                });
            }

            if (!Number.isFinite(assignment) ||
                assignment < 0 ||
                assignment > 5) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Internal 2 assignment marks must be between 0 and 5"
                });
            }

            marks.internal2 = {
                examMarks: exam,
                assignmentMarks: assignment
            };
        }

        // ---------------------------------------------
        // External
        // ---------------------------------------------

        if (externalMarks !== undefined) {

            const external =
                Number(externalMarks);

            if (!Number.isFinite(external) ||
                external < 0 ||
                external > 70) {

                return res.status(400).json({
                    success: false,
                    message:
                        "External marks must be between 0 and 70"
                });
            }

            marks.externalMarks =
                external;
        }

        await marks.save();

        const populatedMarks =
            await Marks.findById(marks._id)
                .populate(
                    "student",
                    "name rollNumber department semester email phone"
                );

        const calculated =
            calculateMarks(populatedMarks);

        res.status(200).json({
            success: true,
            message:
                "Marks updated successfully",

            data: {
                ...populatedMarks.toObject(),

                internal1:
                    populatedMarks.internal1
                        ? {
                            examMarks:
                                populatedMarks.internal1.examMarks,

                            assignmentMarks:
                                populatedMarks.internal1.assignmentMarks,

                            total:
                                calculated.internal1Total
                        }
                        : null,

                internal2:
                    populatedMarks.internal2
                        ? {
                            examMarks:
                                populatedMarks.internal2.examMarks,

                            assignmentMarks:
                                populatedMarks.internal2.assignmentMarks,

                            total:
                                calculated.internal2Total
                        }
                        : null,

                internalAverage:
                    calculated.internalAverage,

                externalMarks:
                    calculated.externalMarks,

                finalTotal:
                    calculated.finalTotal,

                grade:
                    calculated.grade,

                result:
                    calculated.result
            }
        });

    } catch (error) {

        console.error(
            "UPDATE MARKS ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ======================================================
// DELETE MARKS
// ======================================================

const deleteMarks = async (req, res) => {
    try {

        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid marks ID"
            });
        }

        const marks =
            await Marks.findByIdAndDelete(id);

        if (!marks) {
            return res.status(404).json({
                success: false,
                message: "Marks record not found"
            });
        }

        res.status(200).json({
            success: true,
            message:
                "Marks deleted successfully"
        });

    } catch (error) {

        console.error(
            "DELETE MARKS ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ======================================================
// EXPORT
// ======================================================

module.exports = {
    getAllMarks,
    getMarksById,
    addInternal1,
    addInternal2,
    addExternal,
    updateMarks,
    deleteMarks
};