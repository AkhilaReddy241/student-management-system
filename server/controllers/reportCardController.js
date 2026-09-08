const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const Student = require("../models/Student");
const Marks = require("../models/Marks");

const getMyReportCard = async (req, res) => {
  try {
    console.log("=================================");
    console.log("GET MY REPORT CARD");
    console.log("=================================");

    // ------------------------------------
    // 1. Check JWT secret
    // ------------------------------------

    if (!process.env.JWT_SECRET) {
      console.error("❌ JWT_SECRET is missing");

      return res.status(500).json({
        success: false,
        message: "JWT_SECRET is missing",
      });
    }

    // ------------------------------------
    // 2. Get token
    // ------------------------------------

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token missing",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token missing",
      });
    }

    // ------------------------------------
    // 3. Verify JWT
    // ------------------------------------

    let decoded;

    try {
      decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      console.log("Decoded JWT:", decoded);
    } catch (error) {
      console.error("JWT ERROR:", error);

      return res.status(401).json({
        success: false,
        message:
          error.name === "TokenExpiredError"
            ? "Token expired. Please login again."
            : "Invalid token",
      });
    }

    // ------------------------------------
    // 4. Get student ID + semester
    // ------------------------------------

    const studentId = req.query.studentId;
    const semester = req.query.semester;

    console.log("Query Student ID:", studentId);
    console.log("Query Semester:", semester);
    console.log("Authenticated Student ID:", decoded.id);

    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: "Student ID is required",
      });
    }

    if (!semester) {
      return res.status(400).json({
        success: false,
        message: "Semester is required",
      });
    }

    // ------------------------------------
    // 5. Validate student ID
    // ------------------------------------

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Student ID",
      });
    }

    // ------------------------------------
    // 6. Validate semester
    // ------------------------------------

    const selectedSemester = Number(semester);

    if (
      !Number.isInteger(selectedSemester) ||
      selectedSemester < 1 ||
      selectedSemester > 8
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid semester. Select between 1 and 8.",
      });
    }

    // ------------------------------------
    // 7. Security check
    // ------------------------------------

    if (decoded.role === "student") {
      if (String(decoded.id) !== String(studentId)) {
        return res.status(403).json({
          success: false,
          message:
            "You are not authorized to view this report card",
        });
      }
    }

    // ------------------------------------
    // 8. Find student
    // ------------------------------------

    const student = await Student.findById(studentId)
      .select("-password")
      .lean();

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    console.log("Student found:", student.name);
    console.log("Selected semester:", selectedSemester);

    // ------------------------------------
    // 9. Find ONLY selected semester marks
    // ------------------------------------

    const marks = await Marks.find({
      student: studentId,
      semester: selectedSemester,
    })
      .sort({ subject: 1 })
      .lean();

    console.log(
      `Semester ${selectedSemester} marks count:`,
      marks.length
    );

    console.log(
      `Semester ${selectedSemester} marks:`,
      marks
    );

    // ------------------------------------
    // 10. Convert marks into subjects
    // ------------------------------------

    const subjects = marks.map((mark) => {
      // ----------------------------------
      // Internal 1
      // ----------------------------------

      const internal1 =
        mark.internal1 &&
        typeof mark.internal1 === "object"
          ? Number(
              mark.internal1.total ??
              (
                Number(mark.internal1.examMarks || 0) +
                Number(mark.internal1.assignmentMarks || 0)
              )
            )
          : Number(mark.internal1 || 0);

      // ----------------------------------
      // Internal 2
      // ----------------------------------

      const internal2 =
        mark.internal2 &&
        typeof mark.internal2 === "object"
          ? Number(
              mark.internal2.total ??
              (
                Number(mark.internal2.examMarks || 0) +
                Number(mark.internal2.assignmentMarks || 0)
              )
            )
          : Number(mark.internal2 || 0);

      // ----------------------------------
      // External
      // ----------------------------------

      const externalMarks = Number(
        mark.externalMarks ??
        mark.external ??
        mark.externalMark ??
        0
      );

      // ----------------------------------
      // Internal Average
      // ----------------------------------

      const internalAverage =
        mark.internalAverage !== undefined
          ? Number(mark.internalAverage)
          : (internal1 + internal2) / 2;

      // ----------------------------------
      // Final Total
      // ----------------------------------

      const finalTotal =
        mark.finalTotal !== undefined
          ? Number(mark.finalTotal)
          : internalAverage + externalMarks;

      // ----------------------------------
      // Grade
      // ----------------------------------

      let grade;

      if (finalTotal >= 90) {
        grade = "A+";
      } else if (finalTotal >= 80) {
        grade = "A";
      } else if (finalTotal >= 70) {
        grade = "B+";
      } else if (finalTotal >= 60) {
        grade = "B";
      } else if (finalTotal >= 50) {
        grade = "C";
      } else if (finalTotal >= 40) {
        grade = "D";
      } else {
        grade = "F";
      }

      // ----------------------------------
      // Result
      // ----------------------------------

      const result =
        mark.result ||
        (finalTotal >= 40 ? "Pass" : "Fail");

      return {
        subject:
          mark.subjectName ||
          mark.subject ||
          mark.subjectCode ||
          "N/A",

        semester: selectedSemester,

        internal1: {
          total: Number(internal1.toFixed(2)),
        },

        internal2: {
          total: Number(internal2.toFixed(2)),
        },

        internalAverage: Number(
          internalAverage.toFixed(2)
        ),

        externalMarks: Number(
          externalMarks.toFixed(2)
        ),

        finalTotal: Number(
          finalTotal.toFixed(2)
        ),

        grade,

        result,
      };
    });

    // ------------------------------------
    // 11. Calculate summary
    // ------------------------------------

    const totalSubjects = subjects.length;

    const passedSubjects = subjects.filter(
      (subject) => subject.result === "Pass"
    ).length;

    const failedSubjects = subjects.filter(
      (subject) => subject.result === "Fail"
    ).length;

    const totalMarks = subjects.reduce(
      (total, subject) =>
        total + Number(subject.finalTotal || 0),
      0
    );

    const maxMarks = totalSubjects * 100;

    const percentage =
      maxMarks > 0
        ? Number(
            ((totalMarks / maxMarks) * 100).toFixed(2)
          )
        : 0;

    const overallResult =
      failedSubjects > 0
        ? "Fail"
        : totalSubjects > 0
        ? "Pass"
        : "No Result";

    // ------------------------------------
    // 12. Send response
    // ------------------------------------

    return res.status(200).json({
      success: true,

      message:
        `Report card fetched successfully for Semester ${selectedSemester}`,

      data: {
        student: {
          id: student._id,
          name: student.name,
          rollNumber: student.rollNumber,
          email: student.email,
          department: student.department,

          // Show selected semester
          semester: selectedSemester,
        },

        semester: selectedSemester,

        subjects,

        summary: {
          totalSubjects,
          passedSubjects,
          failedSubjects,
          totalMarks,
          maxMarks,
          percentage,
          overallResult,
        },
      },
    });

  } catch (error) {
    console.error("=================================");
    console.error("REPORT CARD ERROR:");
    console.error(error);
    console.error("=================================");

    return res.status(500).json({
      success: false,
      message:
        error.message || "Server Error",
    });
  }
};

module.exports = {
  getMyReportCard,
};