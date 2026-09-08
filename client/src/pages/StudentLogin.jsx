import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function StudentLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // ==========================================
  // LOGIN
  // ==========================================

  const handleLogin = async (e) => {
    e.preventDefault();

    // ==========================================
    // VALIDATION
    // ==========================================

    if (!email.trim()) {
      toast.error("Please enter email");
      return;
    }

    if (!password) {
      toast.error("Please enter password");
      return;
    }

    try {
      setLoading(true);

      // ==========================================
      // STUDENT LOGIN API
      // ==========================================

      const res = await axios.post(
        "http://localhost:5000/api/auth/student/login",
        {
          email: email.trim().toLowerCase(),
          password: password,
        }
      );

      console.log(
        "================================="
      );

      console.log(
        "STUDENT LOGIN RESPONSE:"
      );

      console.log(res.data);

      console.log(
        "================================="
      );

      // ==========================================
      // LOGIN SUCCESS
      // ==========================================

      if (res.data.success) {
        // ========================================
        // GET STUDENT OBJECT
        // ========================================

        const student = res.data.student;

        console.log(
          "Logged in student:",
          student
        );

        // ========================================
        // CHECK STUDENT OBJECT
        // ========================================

        if (!student) {
          toast.error(
            "Student information not received from server"
          );

          console.error(
            "Student object missing:",
            res.data
          );

          return;
        }

        // ========================================
        // GET MONGODB STUDENT ID
        // ========================================

        const studentId =
          student._id ||
          student.id ||
          student.studentId;

        console.log(
          "MongoDB Student ID:",
          studentId
        );

        // ========================================
        // STUDENT ID VALIDATION
        // ========================================

        if (!studentId) {
          toast.error(
            "Student ID not received from server"
          );

          console.error(
            "Student ID missing from student object:",
            student
          );

          return;
        }

        // ========================================
        // SAVE TOKEN
        // ========================================

        if (res.data.token) {
          localStorage.setItem(
            "token",
            res.data.token
          );
        }

        // ========================================
        // SAVE ROLE
        // ========================================

        localStorage.setItem(
          "role",
          "student"
        );

        // ========================================
        // SAVE STUDENT ID
        // ========================================

        localStorage.setItem(
          "studentId",
          studentId
        );

        // ========================================
        // SAVE COMPLETE STUDENT OBJECT
        // ========================================

        localStorage.setItem(
          "student",
          JSON.stringify(student)
        );

        // ========================================
        // REMOVE OLD LOGIN DATA
        // ========================================

        localStorage.removeItem(
          "username"
        );

        localStorage.removeItem(
          "user"
        );

        localStorage.removeItem(
          "faculty"
        );

        // ========================================
        // VERIFY LOCAL STORAGE
        // ========================================

        console.log(
          "================================="
        );

        console.log(
          "STUDENT LOGIN STORAGE"
        );

        console.log(
          "studentId:",
          localStorage.getItem(
            "studentId"
          )
        );

        console.log(
          "student:",
          JSON.parse(
            localStorage.getItem(
              "student"
            )
          )
        );

        console.log(
          "role:",
          localStorage.getItem("role")
        );

        console.log(
          "token:",
          localStorage.getItem("token")
            ? "Token exists"
            : "Token missing"
        );

        console.log(
          "================================="
        );

        // ========================================
        // SUCCESS MESSAGE
        // ========================================

        toast.success(
          "Student login successful"
        );

        // ========================================
        // GO TO DASHBOARD
        // ========================================

        navigate(
          "/student-dashboard"
        );
      } else {
        toast.error(
          res.data.message ||
            "Student login failed"
        );
      }
    } catch (error) {
      console.error(
        "================================="
      );

      console.error(
        "STUDENT LOGIN ERROR:"
      );

      console.error(
        error.response?.data ||
          error.message ||
          error
      );

      console.error(
        "================================="
      );

      toast.error(
        error.response?.data?.message ||
          "Student login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow p-4">

            {/* ================================= */}
            {/* TITLE */}
            {/* ================================= */}

            <h2 className="text-center mb-4">
              🎓 Student Login
            </h2>

            {/* ================================= */}
            {/* LOGIN FORM */}
            {/* ================================= */}

            <form onSubmit={handleLogin}>

              {/* =============================== */}
              {/* EMAIL */}
              {/* =============================== */}

              <div className="mb-3">

                <label className="form-label">
                  Email
                </label>

                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter student email"
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
                  disabled={loading}
                />

              </div>

              {/* =============================== */}
              {/* PASSWORD */}
              {/* =============================== */}

              <div className="mb-3">

                <label className="form-label">
                  Password
                </label>

                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                  disabled={loading}
                />

              </div>

              {/* =============================== */}
              {/* LOGIN BUTTON */}
              {/* =============================== */}

              <div className="d-grid">

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading
                    ? "Logging in..."
                    : "Student Login"}
                </button>

              </div>

              {/* =============================== */}
              {/* BACK BUTTON */}
              {/* =============================== */}

              <button
                type="button"
                className="btn btn-secondary w-100 mt-3"
                onClick={() =>
                  navigate("/login")
                }
                disabled={loading}
              >
                ← Back to Login Selection
              </button>

            </form>

          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentLogin;