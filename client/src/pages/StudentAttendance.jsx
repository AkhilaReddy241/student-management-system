import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function StudentAttendance() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getStudentAttendance = async () => {
      try {
        const studentData = localStorage.getItem("student");

        console.log("Student LocalStorage:", studentData);

        if (!studentData) {
          toast.error(
            "Student information not found. Please login again."
          );
          setLoading(false);
          return;
        }

        const student = JSON.parse(studentData);

        console.log("Logged-in Student:", student);

        const studentId = student._id || student.id;

        console.log("Student ID:", studentId);

        if (!studentId) {
          toast.error(
            "Student ID not found. Please login again."
          );
          setLoading(false);
          return;
        }

        const res = await axios.get(
          "http://localhost:5000/api/attendance/student",
          {
            params: {
              studentId: studentId,
            },
          }
        );

        console.log("Attendance Response:", res.data);

        if (res.data.success) {
          setAttendance(res.data.data || []);
        }
      } catch (error) {
        console.log(
          "Attendance Error:",
          error.response?.data || error.message
        );

        toast.error(
          error.response?.data?.message ||
            "Failed to load attendance"
        );
      } finally {
        setLoading(false);
      }
    };

    getStudentAttendance();
  }, []);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="container mt-5">
        <h3>Loading Attendance...</h3>
      </div>
    );
  }

  // ==========================================
  // NO ATTENDANCE
  // ==========================================

  if (attendance.length === 0) {
    return (
      <div className="container mt-5">
        <h2 className="mb-4">📅 My Attendance</h2>

        <div className="alert alert-info">
          No attendance records found.
        </div>
      </div>
    );
  }

  // ==========================================
  // OVERALL ATTENDANCE
  // ==========================================

  const totalClasses = attendance.length;

  const presentClasses = attendance.filter(
    (item) => item.status === "Present"
  ).length;

  const absentClasses = attendance.filter(
    (item) => item.status !== "Present"
  ).length;

  const overallPercentage =
    totalClasses > 0
      ? (presentClasses / totalClasses) * 100
      : 0;

  // ==========================================
  // ATTENDANCE STATUS
  // ==========================================

  let statusClass = "";
  let statusMessage = "";
  let statusIcon = "";

  if (overallPercentage >= 90) {
    statusClass = "alert-success";
    statusIcon = "🟢";
    statusMessage =
      "Excellent! Your attendance is very good. Keep it up!";
  } else if (overallPercentage >= 80) {
    statusClass = "alert-success";
    statusIcon = "🟢";
    statusMessage =
      "Good attendance. Keep attending classes regularly.";
  } else if (overallPercentage >= 75) {
    statusClass = "alert-warning";
    statusIcon = "🟡";
    statusMessage =
      "Your attendance is close to 75%. Try to attend more classes to maintain a safe attendance level.";
  } else if (overallPercentage >= 65) {
    statusClass = "alert-warning";
    statusIcon = "🟠";
    statusMessage =
      "Warning: Your attendance is below 75%. Please attend classes regularly to improve your attendance.";
  } else {
    statusClass = "alert-danger";
    statusIcon = "🔴";
    statusMessage =
      "Critical: Your attendance is very low. Please attend classes regularly and improve your attendance.";
  }

  // ==========================================
  // SUBJECT-WISE ATTENDANCE
  // ==========================================

  const subjectMap = {};

  attendance.forEach((item) => {
    const subjectName = item.subject
      ? `${item.subject.subjectCode} - ${item.subject.subjectName}`
      : "N/A";

    if (!subjectMap[subjectName]) {
      subjectMap[subjectName] = {
        subject: subjectName,
        present: 0,
        total: 0,
      };
    }

    subjectMap[subjectName].total += 1;

    if (item.status === "Present") {
      subjectMap[subjectName].present += 1;
    }
  });

  const subjectAttendance = Object.values(subjectMap).map(
    (subject) => {
      const percentage =
        subject.total > 0
          ? (subject.present / subject.total) * 100
          : 0;

      return {
        ...subject,
        percentage,
      };
    }
  );

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="container mt-5">

      <h2 className="mb-4">
        📅 My Attendance
      </h2>

      {/* ======================================
          OVERALL ATTENDANCE CARD
      ====================================== */}

      <div className="card shadow mb-4">
        <div className="card-body text-center">

          <h4 className="mb-3">
            Overall Attendance
          </h4>

          <h1 className="display-4 fw-bold">
            {overallPercentage.toFixed(1)}%
          </h1>

          <p className="text-muted mb-3">
            {presentClasses} / {totalClasses} classes attended
          </p>

          <div className="progress mb-3" style={{ height: "25px" }}>
            <div
              className={`progress-bar ${
                overallPercentage >= 75
                  ? "bg-success"
                  : "bg-danger"
              }`}
              role="progressbar"
              style={{
                width: `${Math.min(
                  overallPercentage,
                  100
                )}%`,
              }}
            >
              {overallPercentage.toFixed(1)}%
            </div>
          </div>

          <div className={`alert ${statusClass} mb-0`}>
            <h5>
              {statusIcon} Attendance Status
            </h5>

            <p className="mb-0">
              {statusMessage}
            </p>
          </div>

        </div>
      </div>

      {/* ======================================
          ATTENDANCE SUMMARY
      ====================================== */}

      <div className="row mb-4">

        <div className="col-md-4 mb-3">
          <div className="card shadow text-center h-100">
            <div className="card-body">
              <h6 className="text-muted">
                Total Classes
              </h6>

              <h3>
                {totalClasses}
              </h3>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card shadow text-center h-100">
            <div className="card-body">
              <h6 className="text-muted">
                Present
              </h6>

              <h3 className="text-success">
                {presentClasses}
              </h3>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card shadow text-center h-100">
            <div className="card-body">
              <h6 className="text-muted">
                Absent
              </h6>

              <h3 className="text-danger">
                {absentClasses}
              </h3>
            </div>
          </div>
        </div>

      </div>

      {/* ======================================
          SUBJECT-WISE ATTENDANCE
      ====================================== */}

      <div className="card shadow">

        <div className="card-body">

          <h4 className="mb-4">
            📊 Subject-wise Attendance
          </h4>

          <div className="table-responsive">

            <table className="table table-bordered table-hover">

              <thead className="table-primary">

                <tr>
                  <th>Subject</th>
                  <th>Present</th>
                  <th>Total Classes</th>
                  <th>Percentage</th>
                  <th>Status</th>
                </tr>

              </thead>

              <tbody>

                {subjectAttendance.map(
                  (subject, index) => (

                    <tr key={index}>

                      <td>
                        {subject.subject}
                      </td>

                      <td>
                        {subject.present}
                      </td>

                      <td>
                        {subject.total}
                      </td>

                      <td>
                        <strong>
                          {subject.percentage.toFixed(1)}%
                        </strong>
                      </td>

                      <td>

                        {subject.percentage >= 75 ? (

                          <span className="badge bg-success">
                            🟢 Good
                          </span>

                        ) : subject.percentage >= 65 ? (

                          <span className="badge bg-warning text-dark">
                            🟠 Improve
                          </span>

                        ) : (

                          <span className="badge bg-danger">
                            🔴 Critical
                          </span>

                        )}

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

      {/* ======================================
          FINAL WARNING
      ====================================== */}

      {overallPercentage < 75 && (

        <div className="alert alert-danger mt-4">

          <h5>
            ⚠️ Attendance Warning
          </h5>

          <p className="mb-0">
            Your overall attendance is below 75%.
            Please attend classes regularly to improve
            your attendance.
          </p>

        </div>

      )}

    </div>
  );
}

export default StudentAttendance;