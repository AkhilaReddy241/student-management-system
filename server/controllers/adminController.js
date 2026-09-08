const Admin = require("../models/Admin");
const Student = require("../models/Student");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// =====================================================
// REGISTER ADMIN
// =====================================================

const registerAdmin = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Username, email and password are required",
      });
    }

    // Check if admin already exists
    const adminExists = await Admin.findOne({
      $or: [
        { username },
        { email },
      ],
    });

    if (adminExists) {
      return res.status(400).json({
        success: false,
        message: "Admin already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // Create admin
    const admin = await Admin.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "Admin Registered Successfully",
      data: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
      },
    });

  } catch (error) {

    console.error(
      "REGISTER ADMIN ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// =====================================================
// LOGIN ADMIN
// =====================================================

const loginAdmin = async (req, res) => {
  try {

    const {
      username,
      password,
    } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    // Find admin
    const admin = await Admin.findOne({
      username,
    });

    if (!admin) {
      return res.status(400).json({
        success: false,
        message: "Invalid Username",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(
      password,
      admin.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid Password",
      });
    }

    // Check JWT secret
    if (!process.env.JWT_SECRET) {
      console.error(
        "JWT_SECRETis missing"
      );

      return res.status(500).json({
        success: false,
        message: "JWT secret key is not configured",
      });
    }

    // Create token
    const token = jwt.sign(
      {
        id: admin._id,
        role: "admin",
        username: admin.username,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      username: admin.username,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
      },
    });

  } catch (error) {

    console.error(
      "LOGIN ADMIN ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// =====================================================
// GET ADMIN PROFILE
// =====================================================

const getProfile = async (req, res) => {
  try {
    console.log("======================================");
    console.log("GET ADMIN PROFILE");
    console.log("Authenticated User:", req.user);
    console.log("======================================");

    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "User authentication information missing",
      });
    }

    const admin = await Admin.findById(req.user.id).select("-password");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: admin,
    });

  } catch (error) {
    console.error("GET ADMIN PROFILE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// =====================================================
// UPDATE ADMIN PROFILE
// =====================================================

const updateProfile = async (req, res) => {
  try {

    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Admin authentication required",
      });
    }

    const {
      username,
      email,
    } = req.body;

    // Find admin
    const admin = await Admin.findById(
      req.user.id
    );

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    // Update only provided fields
    if (username) {
      admin.username = username;
    }

    if (email) {
      admin.email = email;
    }

    await admin.save();

    res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
      data: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
      },
    });

  } catch (error) {

    console.error(
      "UPDATE ADMIN PROFILE ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// =====================================================
// CHANGE PASSWORD
// =====================================================

const changePassword = async (req, res) => {
  try {

    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Admin authentication required",
      });
    }

    const {
      currentPassword,
      newPassword,
    } = req.body;

    // Validation
    if (
      !currentPassword ||
      !newPassword
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Current password and new password are required",
      });
    }

    // Find admin
    const admin = await Admin.findById(
      req.user.id
    );

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    // Check current password
    const isMatch = await bcrypt.compare(
      currentPassword,
      admin.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message:
          "Current Password is Incorrect",
      });
    }

    // Hash new password
    const hashedPassword =
      await bcrypt.hash(
        newPassword,
        10
      );

    // Save password
    admin.password =
      hashedPassword;

    await admin.save();

    res.status(200).json({
      success: true,
      message:
        "Password Changed Successfully",
    });

  } catch (error) {

    console.error(
      "CHANGE PASSWORD ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// =====================================================
// GENERATE PASSWORDS FOR ALL STUDENTS
// =====================================================

const generateStudentPasswords = async (req, res) => {
  try {
    // Check admin authentication
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Admin authentication required",
      });
    }

    // Get students
    const students = await Student.find().select(
      "_id rollNumber name email"
    );

    if (students.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No students found",
      });
    }

    const credentials = [];

    for (const student of students) {
      // Make sure roll number exists
      if (student.rollNumber === undefined || student.rollNumber === null) {
        console.log(
          `Skipping student ${student._id} because rollNumber is missing`
        );

        continue;
      }

      // Temporary password
      const temporaryPassword = `STU@${student.rollNumber}`;

      // Hash password
      const hashedPassword = await bcrypt.hash(
        temporaryPassword,
        10
      );

      // Update ONLY password
      await Student.updateOne(
        { _id: student._id },
        {
          $set: {
            password: hashedPassword,
          },
        }
      );

      // Return credentials
      credentials.push({
        rollNumber: student.rollNumber,
        name: student.name,
        email: student.email,
        temporaryPassword,
      });
    }

    if (credentials.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No students with valid roll numbers were found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Student passwords generated successfully",
      count: credentials.length,
      credentials,
    });
  } catch (error) {
    console.error(
      "GENERATE STUDENT PASSWORDS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  registerAdmin,
  loginAdmin,
  getProfile,
  updateProfile,
  changePassword,
    generateStudentPasswords,
};