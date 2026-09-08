const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Student = require("../models/Student");

// =====================================================
// CREATE STUDENT
// POST /api/students
// =====================================================

const createStudent = async (req, res) => {
  try {
    const {
      rollNumber,
      name,
      email,
      password,
      department,
      semester,
      phone,
      address,
    } = req.body;

    if (
      rollNumber === undefined ||
      !name ||
      !email ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Roll number, name, email and password are required",
      });
    }

    const existingStudent = await Student.findOne({
      $or: [
        { rollNumber: Number(rollNumber) },
        { email: email.toLowerCase() },
      ],
    });

    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message:
          "Student with this roll number or email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = await Student.create({
      rollNumber: Number(rollNumber),
      name,
      email,
      password: hashedPassword,
      department,
      semester:
        semester !== undefined && semester !== ""
          ? Number(semester)
          : undefined,
      phone,
      address,
    });

    const studentResponse = student.toObject();
    delete studentResponse.password;

    return res.status(201).json({
      success: true,
      message: "Student created successfully",
      student: studentResponse,
    });
  } catch (error) {
    console.error("CREATE STUDENT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create student",
    });
  }
};


// =====================================================
// GET ALL STUDENTS
// GET /api/students
// =====================================================

const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .select("-password")
      .sort({
        rollNumber: 1,
      });
 console.log(
      "======================================"
    );

      console.log(
      "STUDENTS SORTED:",
      students.map((student) => student.rollNumber)
    );
    console.log(
      "======================================"
    );


    return res.status(200).json({
      count: students.length,
      students,
    });
  } catch (error) {
    console.error("GET ALL STUDENTS ERROR:", error);

    return res.status(500).json({
      message: "Failed to get students",
      error: error.message,
    });
  }
};


// =====================================================
// GET STUDENT BY ID
// GET /api/students/:id
// =====================================================

const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID",
      });
    }

    const student = await Student.findById(id)
      .select("-password");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    return res.status(200).json({
      success: true,
      student,
    });
  } catch (error) {
    console.error("GET STUDENT BY ID ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get student",
      error: error.message,
    });
  }
};


// =====================================================
// UPDATE STUDENT
// PUT /api/students/:id
// =====================================================

const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID",
      });
    }

    const {
      rollNumber,
      name,
      email,
      department,
      semester,
      phone,
      address,
    } = req.body;

    // -----------------------------------------------
    // Validate roll number
    // -----------------------------------------------

    if (
      rollNumber !== undefined &&
      rollNumber !== null &&
      rollNumber !== ""
    ) {
      const numericRollNumber = Number(rollNumber);

      if (
        Number.isNaN(numericRollNumber) ||
        !Number.isInteger(numericRollNumber)
      ) {
        return res.status(400).json({
          success: false,
          message: "Roll number must be a valid number",
        });
      }
    }

    // -----------------------------------------------
    // Check duplicate roll number
    // -----------------------------------------------

    if (
      rollNumber !== undefined &&
      rollNumber !== null &&
      rollNumber !== ""
    ) {
      const existingRollNumber = await Student.findOne({
        rollNumber: Number(rollNumber),
        _id: { $ne: id },
      });

      if (existingRollNumber) {
        return res.status(400).json({
          success: false,
          message: "Roll number already exists",
        });
      }
    }

    // -----------------------------------------------
    // Check duplicate email
    // -----------------------------------------------

    if (email) {
      const existingEmail = await Student.findOne({
        email: email.toLowerCase(),
        _id: { $ne: id },
      });

      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: "Email already exists",
        });
      }
    }

    // -----------------------------------------------
    // Build update object
    // -----------------------------------------------

    const updateData = {};

    if (rollNumber !== undefined && rollNumber !== "") {
      updateData.rollNumber = Number(rollNumber);
    }

    if (name !== undefined) {
      updateData.name = name;
    }

    if (email !== undefined) {
      updateData.email = email;
    }

    if (department !== undefined) {
      updateData.department = department;
    }

    if (semester !== undefined && semester !== "") {
      updateData.semester = Number(semester);
    }

    if (phone !== undefined) {
      updateData.phone = phone;
    }

    if (address !== undefined) {
      updateData.address = address;
    }

    // -----------------------------------------------
    // Update
    // -----------------------------------------------

    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!updatedStudent) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Student updated successfully",
      student: updatedStudent,
    });
  } catch (error) {
    console.error("UPDATE STUDENT ERROR:", error);

    return res.status(500).json({
      success: false,
      message:
        error.message || "Failed to update student",
    });
  }
};


// =====================================================
// DELETE STUDENT
// DELETE /api/students/:id
// =====================================================

const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID",
      });
    }

    const student = await Student.findByIdAndDelete(id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (error) {
    console.error("DELETE STUDENT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete student",
      error: error.message,
    });
  }
};


// =====================================================
// REGISTER STUDENT
// POST /api/students/register
// =====================================================

const registerStudent = async (req, res) => {
  try {
    const {
      rollNumber,
      name,
      email,
      password,
      department,
      semester,
      phone,
      address,
    } = req.body;

    if (
      rollNumber === undefined ||
      !name ||
      !email ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Roll number, name, email and password are required",
      });
    }

    const existingStudent = await Student.findOne({
      $or: [
        { rollNumber: Number(rollNumber) },
        { email: email.toLowerCase() },
      ],
    });

    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message:
          "Student with this roll number or email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const student = await Student.create({
      rollNumber: Number(rollNumber),
      name,
      email,
      password: hashedPassword,
      department,
      semester:
        semester !== undefined && semester !== ""
          ? Number(semester)
          : undefined,
      phone,
      address,
    });

    return res.status(201).json({
      success: true,
      message: "Student registered successfully",
      student: {
        id: student._id,
        rollNumber: student.rollNumber,
        name: student.name,
        email: student.email,
        department: student.department,
        semester: student.semester,
        phone: student.phone,
        address: student.address,
      },
    });
  } catch (error) {
    console.error("REGISTER STUDENT ERROR:", error);

    return res.status(500).json({
      success: false,
      message:
        error.message || "Failed to register student",
    });
  }
};


// =====================================================
// LOGIN STUDENT
// POST /api/students/login
// =====================================================

const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const student = await Student.findOne({
      email: email.toLowerCase(),
    });

    if (!student) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      student.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing");

      return res.status(500).json({
        success: false,
        message:
          "JWT secret key is not configured",
      });
    }

    const token = jwt.sign(
      {
        id: student._id,
        email: student.email,
        role: "student",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      role: "student",

      student: {
        id: student._id,
        name: student.name,
        rollNumber: student.rollNumber,
        email: student.email,
        department: student.department,
        semester: student.semester,
        phone: student.phone,
        address: student.address,
      },
    });
  } catch (error) {
    console.error("LOGIN STUDENT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// =====================================================
// GET STUDENT PROFILE
// GET /api/students/profile
// =====================================================

const getProfile = async (req, res) => {
  try {
    console.log("=================================");
    console.log("GET STUDENT PROFILE");
    console.log("=================================");

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing");

      return res.status(500).json({
        success: false,
        message: "JWT secret key is not configured",
      });
    }

    const authHeader = req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
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

    if (!decoded.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication information",
      });
    }

    const student = await Student.findById(
      decoded.id
    ).select("-password");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    return res.status(200).json({
      success: true,
      student,
    });
  } catch (error) {
    console.error("GET STUDENT PROFILE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// =====================================================
// RESET STUDENT PASSWORD
// PUT /api/students/reset-password
// =====================================================

const resetStudentPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Email and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters long",
      });
    }

    const student = await Student.findOne({
      email: email.toLowerCase(),
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    await Student.updateOne(
      { _id: student._id },
      {
        $set: {
          password: hashedPassword,
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Student password reset successfully",
    });
  } catch (error) {
    console.error(
      "RESET STUDENT PASSWORD ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// =====================================================
// CHANGE STUDENT PASSWORD
// PUT /api/students/change-password
// =====================================================

const changeStudentPassword = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Student authentication required",
      });
    }

    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = req.body;

    // -----------------------------------------------
    // Validate fields
    // -----------------------------------------------

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message: "All password fields are required",
      });
    }

    // -----------------------------------------------
    // Confirm password
    // -----------------------------------------------

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message:
          "New password and confirm password do not match",
      });
    }

    // -----------------------------------------------
    // Minimum password length
    // -----------------------------------------------

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "New password must be at least 6 characters long",
      });
    }

    // -----------------------------------------------
    // Find student
    // -----------------------------------------------

    const student = await Student.findById(
      req.user.id
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // -----------------------------------------------
    // Check current password
    // -----------------------------------------------

    const isMatch = await bcrypt.compare(
      currentPassword,
      student.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // -----------------------------------------------
    // Prevent same password
    // -----------------------------------------------

    const samePassword = await bcrypt.compare(
      newPassword,
      student.password
    );

    if (samePassword) {
      return res.status(400).json({
        success: false,
        message:
          "New password must be different from current password",
      });
    }

    // -----------------------------------------------
    // Hash new password
    // -----------------------------------------------

    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    // -----------------------------------------------
    // Update password
    // -----------------------------------------------

    await Student.updateOne(
      { _id: student._id },
      {
        $set: {
          password: hashedPassword,
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error(
      "CHANGE STUDENT PASSWORD ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  registerStudent,
  loginStudent,
  getProfile,
  resetStudentPassword,
  changeStudentPassword,
};