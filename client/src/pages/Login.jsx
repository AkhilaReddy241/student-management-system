import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  return (
    <div
      className="container mt-5"
      style={{ maxWidth: "600px" }}
    >
      <div className="card shadow p-4">

        <h2 className="text-center mb-3">
          🔐 Student Management System
        </h2>

        <p className="text-center text-muted mb-4">
          Select your login type
        </p>


        {/* ================= ADMIN ================= */}

        <button
          className="btn btn-primary w-100 mb-3"
          style={{
            padding: "15px",
            fontSize: "20px"
          }}
          onClick={() => navigate("/admin-login")}
        >
          👨‍💼 Admin Login
        </button>


        {/* ================= FACULTY ================= */}

        <button
          className="btn btn-success w-100 mb-3"
          style={{
            padding: "15px",
            fontSize: "20px"
          }}
          onClick={() => navigate("/faculty-login")}
        >
          👨‍🏫 Faculty Login
        </button>


        {/* ================= STUDENT ================= */}

        <button
          className="btn btn-warning w-100"
          style={{
            padding: "15px",
            fontSize: "20px"
          }}
          onClick={() => navigate("/student-login")}
        >
          🎓 Student Login
        </button>

      </div>
    </div>
  );
}

export default Login;