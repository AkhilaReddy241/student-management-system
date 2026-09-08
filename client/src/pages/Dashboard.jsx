import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import StudentChart from "../components/StudentChart";

function Dashboard() {
  const [students, setStudents] = useState([]);

  // ==========================================
  // PASSWORD MANAGEMENT STATES
  // ==========================================

  const [credentials, setCredentials] = useState([]);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    getStudents();
  }, []);

  // ==========================================
  // GET STUDENTS
  // ==========================================

  const getStudents = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/students"
      );

      setStudents(
        res.data.students ||
        res.data.data ||
        []
      );
    } catch (err) {
      console.log(
        "Failed to load students:",
        err
      );
    }
  };

  // ==========================================
  // STUDENT COUNTS
  // ==========================================

  const totalStudents = students.length;

  const getDepartmentCount = (department) => {
    return students.filter(
      (student) =>
        student.department?.toLowerCase() ===
        department.toLowerCase()
    ).length;
  };

  const cseStudents = getDepartmentCount("cse");
  const eceStudents = getDepartmentCount("ece");
  const itStudents = getDepartmentCount("it");
  const eeeStudents = getDepartmentCount("eee");
  const mechStudents = getDepartmentCount("mech");

  // ==========================================
  // GENERATE PASSWORDS
  // ==========================================

  const generateStudentPasswords = async () => {
    const confirmed = window.confirm(
      "This will reset the password for ALL students.\n\nDo you want to continue?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setPasswordLoading(true);
      setPasswordMessage("");
      setPasswordError("");
      setCredentials([]);

      // Get admin JWT token
      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("adminToken");

      if (!token) {
        setPasswordError(
          "Admin authentication token not found. Please login again."
        );
        return;
      }

      const res = await axios.post(
        "http://localhost:5000/api/admin/generate-student-passwords",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        setCredentials(
          res.data.credentials || []
        );

        setPasswordMessage(
          `${res.data.count} student password(s) generated successfully.`
        );
      } else {
        setPasswordError(
          res.data.message ||
          "Failed to generate passwords."
        );
      }

    } catch (error) {
      console.error(
        "GENERATE STUDENT PASSWORDS ERROR:",
        error
      );

      setPasswordError(
        error.response?.data?.message ||
        "Failed to generate student passwords."
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  // ==========================================
  // RETURN
  // ==========================================

  return (
    <div className="container-fluid mt-4">

      {/* ==========================================
          TITLE
      ========================================== */}

      <div className="mb-4">
        <h2 className="fw-bold">
          Admin Dashboard
        </h2>

        <p className="text-muted">
          Welcome to Student Management System
        </p>
      </div>

      {/* ==========================================
          TOTAL STUDENTS
      ========================================== */}

      <div className="row">

        <div className="col-md-4 mb-3">
          <div className="card shadow border-0 bg-primary text-white">
            <div className="card-body">

              <div className="d-flex justify-content-between align-items-center">

                <div>
                  <h6 className="text-uppercase">
                    Total Students
                  </h6>

                  <h1 className="fw-bold">
                    {totalStudents}
                  </h1>
                </div>

                <div style={{ fontSize: "45px" }}>
                  🎓
                </div>

              </div>

            </div>
          </div>
        </div>

        {/* CSE */}

        <div className="col-md-2 mb-3">
          <div className="card shadow border-0 bg-success text-white">

            <div className="card-body text-center">

              <h6>CSE</h6>

              <h2 className="fw-bold">
                {cseStudents}
              </h2>

            </div>

          </div>
        </div>

        {/* ECE */}

        <div className="col-md-2 mb-3">
          <div className="card shadow border-0 bg-warning text-dark">

            <div className="card-body text-center">

              <h6>ECE</h6>

              <h2 className="fw-bold">
                {eceStudents}
              </h2>

            </div>

          </div>
        </div>

        {/* IT */}

        <div className="col-md-2 mb-3">
          <div className="card shadow border-0 bg-danger text-white">

            <div className="card-body text-center">

              <h6>IT</h6>

              <h2 className="fw-bold">
                {itStudents}
              </h2>

            </div>

          </div>
        </div>

        {/* EEE */}

        <div className="col-md-2 mb-3">
          <div className="card shadow border-0 bg-info text-white">

            <div className="card-body text-center">

              <h6>EEE</h6>

              <h2 className="fw-bold">
                {eeeStudents}
              </h2>

            </div>

          </div>
        </div>

        {/* MECH */}

        <div className="col-md-2 mb-3">
          <div className="card shadow border-0 bg-secondary text-white">

            <div className="card-body text-center">

              <h6>MECH</h6>

              <h2 className="fw-bold">
                {mechStudents}
              </h2>

            </div>

          </div>
        </div>

      </div>

      {/* ==========================================
          QUICK ACCESS
      ========================================== */}

      <div className="card shadow border-0 mt-4">

        <div className="card-body">

          <h4 className="mb-4">
            Quick Access
          </h4>

          <div className="row">

            {/* STUDENTS */}

            <div className="col-md-3 mb-3">

              <Link
                to="/students"
                className="text-decoration-none"
              >

                <div className="card border-primary h-100">

                  <div className="card-body text-center">

                    <h1>👨‍🎓</h1>

                    <h5>
                      Students
                    </h5>

                    <p className="text-muted mb-0">
                      Manage students
                    </p>

                  </div>

                </div>

              </Link>

            </div>

            {/* ATTENDANCE */}

            <div className="col-md-3 mb-3">

              <Link
                to="/attendance"
                className="text-decoration-none"
              >

                <div className="card border-success h-100">

                  <div className="card-body text-center">

                    <h1>📅</h1>

                    <h5>
                      Attendance
                    </h5>

                    <p className="text-muted mb-0">
                      Manage attendance
                    </p>

                  </div>

                </div>

              </Link>

            </div>

            {/* MARKS */}

            <div className="col-md-3 mb-3">

              <Link
                to="/marks"
                className="text-decoration-none"
              >

                <div className="card border-warning h-100">

                  <div className="card-body text-center">

                    <h1>📊</h1>

                    <h5>
                      Marks
                    </h5>

                    <p className="text-muted mb-0">
                      Manage examination marks
                    </p>

                  </div>

                </div>

              </Link>

            </div>

            {/* REPORT CARD */}

            <div className="col-md-3 mb-3">

              <Link
                to="/report-card"
                className="text-decoration-none"
              >

                <div className="card border-danger h-100">

                  <div className="card-body text-center">

                    <h1>📄</h1>

                    <h5>
                      Report Card
                    </h5>

                    <p className="text-muted mb-0">
                      View student reports
                    </p>

                  </div>

                </div>

              </Link>

            </div>

          </div>

        </div>

      </div>

      {/* ==========================================
          STUDENT CHART
      ========================================== */}

      <div className="card shadow border-0 mt-4 mb-4">

        <div className="card-body">

          <h4 className="mb-4">
            Student Statistics
          </h4>

          <StudentChart
            students={students}
          />

        </div>

      </div>

      {/* ==========================================
          MANAGEMENT
      ========================================== */}

      <div className="card shadow border-0 mb-4">

        <div className="card-body">

          <h4 className="mb-4">
            Management
          </h4>

          <div className="row">

            {/* FACULTY */}

            <div className="col-md-4 mb-3">

              <Link
                to="/faculty"
                className="text-decoration-none"
              >

                <button className="btn btn-outline-primary w-100 py-3">

                  👨‍🏫 &nbsp;
                  Faculty Management

                </button>

              </Link>

            </div>

            {/* SUBJECT */}

            <div className="col-md-4 mb-3">

              <Link
                to="/faculty/subjects"
                className="text-decoration-none"
              >

                <button className="btn btn-outline-success w-100 py-3">

                  📚 &nbsp;
                  Subject Management

                </button>

              </Link>

            </div>

            {/* PROFILE */}

            <div className="col-md-4 mb-3">

              <Link
                to="/profile"
                className="text-decoration-none"
              >

                <button className="btn btn-outline-secondary w-100 py-3">

                  👤 &nbsp;
                  Admin Profile

                </button>

              </Link>

            </div>

          </div>

        </div>

      </div>

      {/* ==========================================
          STUDENT PASSWORD MANAGEMENT
      ========================================== */}

      <div className="card shadow border-0 mb-4">

        <div className="card-body">

          <h4 className="mb-3">
            🔐 Student Password Management
          </h4>

          <p className="text-muted">
            Generate temporary passwords for all students.
            The generated passwords will replace the existing
            student passwords.
          </p>

          <div className="alert alert-warning">
            <strong>⚠️ Warning:</strong>{" "}
            Generating passwords will reset the passwords
            of all students.
          </div>

          <button
            className="btn btn-primary"
            onClick={generateStudentPasswords}
            disabled={passwordLoading}
          >
            {passwordLoading
              ? "Generating..."
              : "🔑 Generate Student Passwords"}
          </button>

          {/* SUCCESS MESSAGE */}

          {passwordMessage && (
            <div className="alert alert-success mt-3">
              ✅ {passwordMessage}
            </div>
          )}

          {/* ERROR MESSAGE */}

          {passwordError && (
            <div className="alert alert-danger mt-3">
              ❌ {passwordError}
            </div>
          )}

          {/* GENERATED CREDENTIALS */}

          {credentials.length > 0 && (
            <div className="mt-4">

              <h5 className="mb-3">
                Student Login Credentials
              </h5>

              <div className="alert alert-info">
                <strong>Important:</strong>{" "}
                Save or print these temporary passwords.
                They are shown here because the database
                stores only encrypted password hashes.
              </div>

              <div className="table-responsive">

                <table className="table table-bordered table-striped">

                  <thead className="table-dark">

                    <tr>
                      <th>S.No</th>
                      <th>Roll Number</th>
                      <th>Student Name</th>
                      <th>Email</th>
                      <th>Temporary Password</th>
                    </tr>

                  </thead>

                  <tbody>

                    {credentials.map(
                      (student, index) => (
                        <tr key={student.rollNumber}>

                          <td>
                            {index + 1}
                          </td>

                          <td>
                            {student.rollNumber}
                          </td>

                          <td>
                            {student.name}
                          </td>

                          <td>
                            {student.email}
                          </td>

                          <td>
                            <strong>
                              {student.temporaryPassword}
                            </strong>
                          </td>

                        </tr>
                      )
                    )}

                  </tbody>

                </table>

              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default Dashboard;