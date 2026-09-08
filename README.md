# 🎓 Student Management System

A full-stack Student Management System built using the **MERN stack** to manage students, faculty, subjects, attendance, marks, authentication, and semester-wise report cards.

---

## 🚀 Project Overview

The Student Management System provides separate dashboards and functionality for:

- 👨‍💼 Admin
- 👨‍🏫 Faculty
- 🎓 Students

The system uses **React.js** for the frontend, **Node.js + Express.js** for the backend, and **MongoDB** for database management.

---

## 🛠️ Technologies Used

### Frontend
- React.js
- React Router
- Axios
- Bootstrap
- CSS
- Vite

### Backend
- Node.js
- Express.js
- REST APIs
- JWT Authentication
- bcrypt.js
- Multer

### Database
- MongoDB
- Mongoose

### Tools
- Git
- GitHub
- Postman
- VS Code

---

# ✨ Features

## 👨‍💼 Admin

- Admin Login
- Admin Profile
- Student Management
- Add Student
- Edit Student
- View Student Details
- Delete Student
- Faculty Management
- Subject Management
- Attendance Management
- Marks Management
- Internal 1 Marks
- Internal 2 Marks
- External Marks
- Student Password Generation
- Student Credentials Management
- Report Card Management

---

## 👨‍🏫 Faculty

- Faculty Login
- Faculty Profile
- Student Management
- Attendance Management
- Attendance History
- Marks Management
- Internal Marks Entry
- External Marks Entry
- Subject Management

---

## 🎓 Student

- Student Login
- Student Dashboard
- Student Profile
- Change Password
- View Attendance
- Overall Attendance Percentage
- Attendance Status
- Attendance Warning
- Semester-wise Marks
- Internal 1 Marks
- Internal 2 Marks
- External Marks
- Semester-wise Report Card

---

# 🔐 Authentication & Authorization

The application uses **JWT-based authentication**.

Different user roles have access to different features:

```text
Admin
  ↓
Admin Dashboard

Faculty
  ↓
Faculty Dashboard

Student
  ↓
Student Dashboard