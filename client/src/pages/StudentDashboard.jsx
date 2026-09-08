import { useNavigate } from "react-router-dom";

function StudentDashboard() {

  const navigate = useNavigate();

  const studentData =
    JSON.parse(localStorage.getItem("student"));

  return (
    <div className="container mt-5">

      <div className="card shadow p-4">

        <h2 className="text-center mb-4">
          🎓 Student Dashboard
        </h2>

        {studentData && (
          <div className="mb-4">

            <h4>
              Welcome, {studentData.name} 👋
            </h4>

            <p>
              <strong>Roll Number:</strong>{" "}
              {studentData.rollNumber}
            </p>

            <p>
              <strong>Email:</strong>{" "}
              {studentData.email}
            </p>

            <p>
              <strong>Department:</strong>{" "}
              {studentData.department}
            </p>

            <p>
              <strong>Semester:</strong>{" "}
              {studentData.semester}
            </p>

          </div>
        )}

        <div className="row">

          <div className="col-md-4 mb-3">

            <button
              className="btn btn-primary w-100"
              onClick={() =>
                navigate("/student/attendance")
              }
            >
              📅 My Attendance
            </button>

          </div>


          <div className="col-md-4 mb-3">

            <button
              className="btn btn-success w-100"
              onClick={() =>
                navigate("/student/marks")
              }
            >
              📊 My Marks
            </button>

          </div>


          <div className="col-md-4 mb-3">

            <button
              className="btn btn-warning w-100"
              onClick={() =>
                navigate("/student/report-card")
              }
            >
              📄 My Report Card
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default StudentDashboard;