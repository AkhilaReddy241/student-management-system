const Attendance = require("../models/Attendance");

// =====================================================
// MARK ATTENDANCE
// =====================================================

const markAttendance = async (req, res) => {
  try {
    const {
      student,
      department,
      semester,
      subject,
      faculty,
      date,
      status,
    } = req.body;

    console.log("=================================");
    console.log("MARK ATTENDANCE REQUEST");
    console.log(req.body);
    console.log("=================================");

    // Validation
    if (
      !student ||
      !department ||
      !semester ||
      !subject ||
      !faculty ||
      !date ||
      !status
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check duplicate attendance
    const existingAttendance = await Attendance.findOne({
      student,
      subject,
      date,
    });

    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        message:
          "Attendance already marked for this student, subject and date",
      });
    }

    // Create attendance
    const attendance = await Attendance.create({
      student,
      department: department.toUpperCase(),
      semester: Number(semester),
      subject,
      faculty,
      date,
      status,
    });

    return res.status(201).json({
      success: true,
      message: "Attendance marked successfully",
      data: attendance,
    });
  } catch (error) {
    console.error("MARK ATTENDANCE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// GET ATTENDANCE
// =====================================================

const getAttendance = async (req, res) => {
  try {
    const filter = {};

    if (req.query.date) {
      filter.date = req.query.date;
    }

    if (req.query.department) {
      filter.department = req.query.department.toUpperCase();
    }

    if (req.query.semester) {
      filter.semester = Number(req.query.semester);
    }

    if (req.query.subject) {
      filter.subject = req.query.subject;
    }

    const attendance = await Attendance.find(filter)
      .populate(
        "student",
        "rollNumber name department semester"
      )
      .populate(
        "subject",
        "subjectCode subjectName"
      )
      .sort({ date: -1 });

    return res.status(200).json({
      success: true,
      count: attendance.length,
      data: attendance,
    });
  } catch (error) {
    console.error("GET ATTENDANCE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// DELETE ATTENDANCE
// =====================================================

const deleteAttendance = async (req, res) => {
  try {
    const attendance =
      await Attendance.findByIdAndDelete(req.params.id);

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance record not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Attendance deleted successfully",
    });
  } catch (error) {
    console.error("DELETE ATTENDANCE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// CHECK ATTENDANCE
// Department + Semester + Subject + Date
// =====================================================

const checkAttendance = async (req, res) => {
  try {
    const {
      date,
      department,
      semester,
      subject,
    } = req.query;

    console.log("=================================");
    console.log("CHECK ATTENDANCE");
    console.log("Date:", date);
    console.log("Department:", department);
    console.log("Semester:", semester);
    console.log("Subject:", subject);
    console.log("=================================");

    if (
      !date ||
      !department ||
      !semester ||
      !subject
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Date, department, semester and subject are required",
      });
    }

    const attendance = await Attendance.findOne({
      date,
      department: department.toUpperCase(),
      semester: Number(semester),
      subject,
    });

    if (attendance) {
      return res.status(200).json({
        success: true,
        exists: true,
        message: "Attendance already marked",
      });
    }

    return res.status(200).json({
      success: true,
      exists: false,
      message: "Attendance not marked",
    });
  } catch (error) {
    console.error("CHECK ATTENDANCE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// MONTHLY ATTENDANCE REPORT
// =====================================================

const getMonthlyAttendanceReport = async (req, res) => {
  try {
    const {
      month,
      year,
      department,
      rollNumber,
    } = req.query;

    const attendance = await Attendance.find()
      .populate(
        "student",
        "rollNumber name department"
      );

    const filteredAttendance = attendance.filter(
      (item) => {
        if (!item.student) {
          return false;
        }

        const attendanceDate =
          new Date(item.date);

        const attendanceMonth =
          attendanceDate.getMonth() + 1;

        const attendanceYear =
          attendanceDate.getFullYear();

        const monthMatch =
          !month ||
          attendanceMonth === Number(month);

        const yearMatch =
          !year ||
          attendanceYear === Number(year);

        const departmentMatch =
          !department ||
          item.student.department?.toLowerCase() ===
            department.toLowerCase();

        const rollMatch =
          !rollNumber ||
          item.student.rollNumber
            ?.toLowerCase()
            .includes(
              rollNumber.toLowerCase()
            );

        return (
          monthMatch &&
          yearMatch &&
          departmentMatch &&
          rollMatch
        );
      }
    );

    const report = {};

    filteredAttendance.forEach((item) => {
      const id =
        item.student._id.toString();

      if (!report[id]) {
        report[id] = {
          rollNumber:
            item.student.rollNumber,

          name: item.student.name,

          department:
            item.student.department,

          present: 0,

          absent: 0,

          totalDays: 0,
        };
      }

      report[id].totalDays++;

      if (item.status === "Present") {
        report[id].present++;
      } else {
        report[id].absent++;
      }
    });

    const result = Object.values(report).map(
      (student) => ({
        ...student,

        attendancePercentage:
          student.totalDays === 0
            ? 0
            : (
                (student.present /
                  student.totalDays) *
                100
              ).toFixed(2),
      })
    );

    return res.status(200).json({
      success: true,
      count: result.length,
      data: result,
    });
  } catch (error) {
    console.error(
      "MONTHLY REPORT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// GET STUDENT ATTENDANCE
// =====================================================

const getStudentAttendance = async (req, res) => {
  try {
    const { studentId } = req.query;

    console.log("=================================");
    console.log("GET STUDENT ATTENDANCE");
    console.log("Student ID:", studentId);
    console.log("=================================");

    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: "Student ID is required",
      });
    }

    const attendance = await Attendance.find({
      student: studentId,
    })
      .populate(
        "student",
        "rollNumber name department semester email"
      )
      .populate(
        "subject",
        "subjectCode subjectName"
      )
      .sort({
        date: -1,
      });

    return res.status(200).json({
      success: true,
      count: attendance.length,
      data: attendance,
    });

  } catch (error) {

    console.error(
      "GET STUDENT ATTENDANCE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



module.exports = {
  markAttendance,
  getAttendance,
  deleteAttendance,
  checkAttendance,
  getMonthlyAttendanceReport,
  getStudentAttendance,
};