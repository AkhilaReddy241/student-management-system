import { BrowserRouter, Routes, Route } from "react-router-dom";

// Components
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import FacultyLogin from "./pages/FacultyLogin";
import StudentLogin from "./pages/StudentLogin";
import Dashboard from "./pages/Dashboard";
import Unauthorized from "./pages/Unauthorized";

// Student
import StudentDashboard from "./pages/StudentDashboard";
import StudentAttendance from "./pages/StudentAttendance";
import StudentMarks from "./pages/StudentMarks";
import StudentMyReportCard from "./pages/StudentMyReportCard";

import Student from "./pages/Student";
import AddStudent from "./pages/AddStudent";
import EditStudent from "./pages/EditStudent";
import ViewStudent from "./pages/ViewStudent";

// Profile
import Profile from "./pages/Profile";

// Attendance
import Attendance from "./pages/Attendance";
import AttendanceHistory from "./pages/AttendanceHistory";
import MonthlyAttendanceReport from "./pages/MonthlyAttendanceReport";

// Marks
import Marks from "./pages/Marks";
import Internal1 from "./pages/Internal1";
import Internal2 from "./pages/Internal2";
import ExternalMarks from "./pages/ExternalMarks";

// Reports
import ReportCard from "./pages/ReportCard";
import StudentReportCard from "./pages/StudentReportCard";

// Faculty
import Faculty from "./pages/Faculty";
import AddFaculty from "./pages/AddFaculty";
import SubjectManagement from "./pages/SubjectManagement";


function App() {

  return (

    <BrowserRouter>

      <Navbar />

      <Routes>

        {/* ================= HOME ================= */}

        <Route
          path="/"
          element={<Home />}
        />


        {/* ================= LOGIN ================= */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/admin-login"
          element={<AdminLogin />}
        />

        <Route
          path="/faculty-login"
          element={<FacultyLogin />}
        />

        <Route
          path="/student-login"
          element={<StudentLogin />}
        />


        {/* ================= ADMIN / FACULTY DASHBOARD ================= */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute
              allowedRoles={["admin", "faculty"]}
            >
              <Dashboard />
            </ProtectedRoute>
          }
        />


        {/* ================= STUDENT DASHBOARD ================= */}

        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute
              allowedRoles={["student"]}
            >
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/attendance"
          element={
            <ProtectedRoute
              allowedRoles={["student"]}
            >
              <StudentAttendance />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/marks"
          element={
            <ProtectedRoute
              allowedRoles={["student"]}
            >
              <StudentMarks />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/report-card"
          element={
            <ProtectedRoute
              allowedRoles={["student"]}
            >
              <StudentMyReportCard />
            </ProtectedRoute>
          }
        />


        {/* ================= STUDENTS ================= */}

        <Route
          path="/students"
          element={
            <ProtectedRoute
              allowedRoles={["admin"]}
            >
              <Student />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-student"
          element={
            <ProtectedRoute
              allowedRoles={["admin"]}
            >
              <AddStudent />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-student/:id"
          element={
            <ProtectedRoute
              allowedRoles={["admin"]}
            >
              <EditStudent />
            </ProtectedRoute>
          }
        />

        <Route
          path="/view-student/:id"
          element={
            <ProtectedRoute
              allowedRoles={["admin"]}
            >
              <ViewStudent />
            </ProtectedRoute>
          }
        />


        {/* ================= PROFILE ================= */}

        <Route
          path="/profile"
          element={
            <ProtectedRoute
              allowedRoles={[
                "admin",
                "faculty",
                "student"
              ]}
            >
              <Profile />
            </ProtectedRoute>
          }
        />


        {/* ================= ATTENDANCE ================= */}

        <Route
          path="/attendance"
          element={
            <ProtectedRoute
              allowedRoles={["admin", "faculty"]}
            >
              <Attendance />
            </ProtectedRoute>
          }
        />

        <Route
          path="/attendance-history"
          element={
            <ProtectedRoute
              allowedRoles={["admin", "faculty"]}
            >
              <AttendanceHistory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/monthly-attendance-report"
          element={
            <ProtectedRoute
              allowedRoles={["admin", "faculty"]}
            >
              <MonthlyAttendanceReport />
            </ProtectedRoute>
          }
        />


        {/* ================= MARKS ================= */}

        <Route
          path="/marks"
          element={
            <ProtectedRoute
              allowedRoles={["admin", "faculty"]}
            >
              <Marks />
            </ProtectedRoute>
          }
        />

        <Route
          path="/marks/internal1"
          element={
            <ProtectedRoute
              allowedRoles={["admin", "faculty"]}
            >
              <Internal1 />
            </ProtectedRoute>
          }
        />

        <Route
          path="/marks/internal2"
          element={
            <ProtectedRoute
              allowedRoles={["admin", "faculty"]}
            >
              <Internal2 />
            </ProtectedRoute>
          }
        />

        <Route
          path="/marks/external"
          element={
            <ProtectedRoute
              allowedRoles={["admin", "faculty"]}
            >
              <ExternalMarks />
            </ProtectedRoute>
          }
        />


        {/* ================= REPORT CARD ================= */}

        <Route
          path="/report-card"
          element={
            <ProtectedRoute
              allowedRoles={["admin", "faculty"]}
            >
              <ReportCard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/report-card/:id"
          element={
            <ProtectedRoute
              allowedRoles={["admin", "faculty"]}
            >
              <StudentReportCard />
            </ProtectedRoute>
          }
        />


        {/* ================= FACULTY ================= */}

        <Route
          path="/faculty"
          element={
            <ProtectedRoute
              allowedRoles={["admin"]}
            >
              <Faculty />
            </ProtectedRoute>
          }
        />

        <Route
          path="/faculty/add"
          element={
            <ProtectedRoute
              allowedRoles={["admin"]}
            >
              <AddFaculty />
            </ProtectedRoute>
          }
        />

        <Route
          path="/faculty/subjects"
          element={
            <ProtectedRoute
              allowedRoles={["admin"]}
            >
              <SubjectManagement />
            </ProtectedRoute>
          }
        />


        {/* ================= UNAUTHORIZED ================= */}

        <Route
          path="/unauthorized"
          element={<Unauthorized />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;