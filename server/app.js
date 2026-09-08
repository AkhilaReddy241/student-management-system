const express = require("express");
const cors = require("cors");

const studentRoutes = require("./routes/studentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const marksRoutes = require("./routes/marksRoutes");
const facultyRoutes = require("./routes/facultyRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const authRoutes = require("./routes/authRoutes");
const reportCardRoutes = require("./routes/reportCardRoutes");

const app = express();


// ======================================================
// MIDDLEWARE
// ======================================================

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({
  extended: true
}));

app.use("/uploads", express.static("uploads"));


// ======================================================
// TEST
// ======================================================

app.get("/", (req, res) => {
  res.send(
    "Student Management System Backend Running..."
  );
});


// ======================================================
// PUT TEST
// ======================================================

app.put("/test", (req, res) => {
  res.json({
    success: true,
    message: "PUT request is working!",
  });
});


// ======================================================
// STUDENT
// ======================================================

app.use(
  "/api/students",
  studentRoutes
);


// ======================================================
// ADMIN
// ======================================================

app.use(
  "/api/admin",
  adminRoutes
);


// ======================================================
// ATTENDANCE
// ======================================================

app.use(
  "/api/attendance",
  attendanceRoutes
);


// ======================================================
// MARKS
// ======================================================

app.use(
  "/api/marks",
  marksRoutes
);


// ======================================================
// FACULTY
// ======================================================

app.use(
  "/api/faculty",
  facultyRoutes
);



// ======================================================
// SUBJECTS
// ======================================================

app.use(
  "/api/subjects",
  subjectRoutes
);


// ======================================================
// AUTH
// ======================================================

app.use(
  "/api/auth",
  authRoutes
);


// ======================================================
// REPORT CARD
// ======================================================



app.use(
  "/api/report-card",
  reportCardRoutes
);


// ======================================================
// 404
// ======================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  });
});


module.exports = app;