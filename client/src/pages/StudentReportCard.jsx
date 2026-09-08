import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";

function StudentReportCard() {
  const { id } = useParams();

  const [marks, setMarks] = useState([]);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  // =========================
  // GET STUDENT MARKS
  // =========================

  useEffect(() => {
    getStudentMarks();
  }, [id]);

  const getStudentMarks = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        "http://localhost:5000/api/marks"
      );

      const allMarks = res.data.data || [];

      // Get only this student's marks
      const studentMarks = allMarks.filter(
        (item) =>
          item.student &&
          String(item.student._id) === String(id)
      );

      setMarks(studentMarks);

      // Get student details
      if (studentMarks.length > 0) {
        setStudent(studentMarks[0].student);
      }
    } catch (error) {
      console.log("Get Student Marks Error:", error);
      toast.error("Failed to load student report");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // GRADE
  // =========================

  const getGrade = (percentage) => {
    if (percentage >= 90) return "A+";
    if (percentage >= 80) return "A";
    if (percentage >= 70) return "B+";
    if (percentage >= 60) return "B";
    if (percentage >= 50) return "C";
    if (percentage >= 40) return "D";

    return "F";
  };

  // =========================
  // REPORT CALCULATION
  // =========================

  const report = useMemo(() => {
    if (marks.length === 0) {
      return {
        total: 0,
        maxMarks: 0,
        percentage: 0,
        cgpa: "0.00",
        grade: "F",
        passed: false,
      };
    }

    // Add finalTotal from every subject
    const total = marks.reduce(
      (sum, item) =>
        sum + Number(item.finalTotal || 0),
      0
    );

    // Every subject is out of 100
    const maxMarks = marks.length * 100;

    const percentage =
      maxMarks > 0
        ? (total / maxMarks) * 100
        : 0;

    const cgpa = (percentage / 10).toFixed(2);

    const grade = getGrade(percentage);

    // Backend already gives result
    const passed = marks.every(
      (item) => item.result === "Pass"
    );

    return {
      total,
      maxMarks,
      percentage,
      cgpa,
      grade,
      passed,
    };
  }, [marks]);

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="container text-center mt-5">
        <div className="spinner-border text-primary" />

        <p className="mt-3">
          Loading student report...
        </p>
      </div>
    );
  }

  // =========================
  // NO DATA
  // =========================

  if (!student) {
    return (
      <div className="container mt-5">
        <div className="card shadow-sm border-0">
          <div className="card-body text-center py-5">

            <div className="fs-1">
              📭
            </div>

            <h4 className="mt-3">
              Student Report Not Found
            </h4>

            <p className="text-muted">
              No marks were found for this student.
            </p>

            <Link
              to="/report-card"
              className="btn btn-primary"
            >
              ← Back to Report Cards
            </Link>

          </div>
        </div>
      </div>
    );
  }

  // Get semester from marks
  const semester = marks[0]?.semester || "N/A";

  // =========================
  // PAGE
  // =========================

  return (
    <div className="container-fluid px-4 py-4">

      {/* =========================
          HEADER
      ========================= */}

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>
          <h2 className="fw-bold mb-1">
            📄 Student Report Card
          </h2>

          <p className="text-muted mb-0">
            Complete academic performance
          </p>
        </div>

        <Link
          to="/report-card"
          className="btn btn-secondary"
        >
          ← Back to Report Cards
        </Link>

      </div>

      {/* =========================
          STUDENT INFORMATION
      ========================= */}

      <div className="card border-0 shadow-sm mb-4">

        <div className="card-header bg-primary text-white">

          <h5 className="mb-0 fw-bold">
            👨‍🎓 Student Information
          </h5>

        </div>

        <div className="card-body">

          <div className="row">

            <div className="col-md-3 mb-3">
              <small className="text-muted">
                Roll Number
              </small>

              <h5 className="fw-bold">
                {student.rollNumber}
              </h5>
            </div>

            <div className="col-md-3 mb-3">
              <small className="text-muted">
                Student Name
              </small>

              <h5 className="fw-bold">
                {student.name}
              </h5>
            </div>

            <div className="col-md-3 mb-3">
              <small className="text-muted">
                Department
              </small>

              <h5 className="fw-bold">
                {student.department}
              </h5>
            </div>

            <div className="col-md-3 mb-3">
              <small className="text-muted">
                Semester
              </small>

              <h5 className="fw-bold">
                {semester}
              </h5>
            </div>

          </div>

        </div>

      </div>

      {/* =========================
          SUBJECT MARKS
      ========================= */}

      <div className="card border-0 shadow-sm mb-4">

        <div className="card-header bg-white">

          <h5 className="fw-bold mb-0">
            📚 Subject-wise Marks
          </h5>

        </div>

        <div className="card-body p-0">

          <div className="table-responsive">

            <table className="table table-hover align-middle mb-0">

              <thead className="table-dark">

                <tr>
                  <th>#</th>
                  <th>Subject</th>
                  <th>Internal 1</th>
                  <th>Internal 2</th>
                  <th>Internal Average</th>
                  <th>External</th>
                  <th>Final Total</th>
                  <th>Grade</th>
                  <th>Result</th>
                </tr>

              </thead>

              <tbody>

                {marks.map((item, index) => {

                  const internal1 =
                    Number(
                      item.internal1?.total || 0
                    );

                  const internal2 =
                    Number(
                      item.internal2?.total || 0
                    );

                  const internalAverage =
                    Number(
                      item.internalAverage || 0
                    );

                  const external =
                    Number(
                      item.externalMarks || 0
                    );

                  const finalTotal =
                    Number(
                      item.finalTotal || 0
                    );

                  const percentage =
                    finalTotal;

                  const grade =
                    item.grade ||
                    getGrade(percentage);

                  const passed =
                    item.result === "Pass";

                  return (
                    <tr key={item._id}>

                      <td>
                        {index + 1}
                      </td>

                      <td className="fw-bold">
                        {item.subject}
                      </td>

                      <td>
                        {internal1}
                      </td>

                      <td>
                        {internal2}
                      </td>

                      <td>
                        <strong>
                          {internalAverage}
                        </strong>
                      </td>

                      <td>
                        {external}
                      </td>

                      <td>
                        <strong>
                          {finalTotal}
                        </strong>
                        <span className="text-muted">
                          {" "} / 100
                        </span>
                      </td>

                      <td>

                        <span
                          className={`badge ${
                            grade === "F"
                              ? "bg-danger"
                              : grade === "A+" ||
                                grade === "A"
                              ? "bg-success"
                              : "bg-primary"
                          }`}
                        >
                          {grade}
                        </span>

                      </td>

                      <td>

                        <span
                          className={`badge ${
                            passed
                              ? "bg-success"
                              : "bg-danger"
                          }`}
                        >
                          {passed
                            ? "Pass"
                            : "Fail"}
                        </span>

                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>

        </div>

      </div>

      {/* =========================
          RESULT SUMMARY
      ========================= */}

      <div className="row g-3 mb-4">

        <div className="col-md-3">

          <div className="card border-0 shadow-sm h-100">

            <div className="card-body text-center">

              <small className="text-muted">
                Total Marks
              </small>

              <h2 className="fw-bold mt-2">

                {report.total}

                <span className="text-muted fs-5">
                  {" "}
                  / {report.maxMarks}
                </span>

              </h2>

            </div>

          </div>

        </div>

        <div className="col-md-3">

          <div className="card border-0 shadow-sm h-100">

            <div className="card-body text-center">

              <small className="text-muted">
                Percentage
              </small>

              <h2 className="fw-bold text-primary mt-2">
                {report.percentage.toFixed(2)}%
              </h2>

            </div>

          </div>

        </div>

        <div className="col-md-3">

          <div className="card border-0 shadow-sm h-100">

            <div className="card-body text-center">

              <small className="text-muted">
                CGPA
              </small>

              <h2 className="fw-bold text-info mt-2">
                {report.cgpa}
              </h2>

            </div>

          </div>

        </div>

        <div className="col-md-3">

          <div className="card border-0 shadow-sm h-100">

            <div className="card-body text-center">

              <small className="text-muted">
                Grade
              </small>

              <h2 className="fw-bold text-success mt-2">
                {report.grade}
              </h2>

            </div>

          </div>

        </div>

      </div>

      {/* =========================
          FINAL RESULT
      ========================= */}

      <div
        className={`card border-0 shadow-sm mb-4 ${
          report.passed
            ? "border-start border-success border-5"
            : "border-start border-danger border-5"
        }`}
      >

        <div className="card-body text-center py-4">

          <h4 className="fw-bold">
            Final Result
          </h4>

          <h2
            className={
              report.passed
                ? "text-success fw-bold"
                : "text-danger fw-bold"
            }
          >
            {report.passed
              ? "PASS ✅"
              : "FAIL ❌"}
          </h2>

          <p className="text-muted mb-0">

            Overall Grade:{" "}

            <strong>
              {report.grade}
            </strong>

            {" | "}

            Percentage:{" "}

            <strong>
              {report.percentage.toFixed(2)}%
            </strong>

          </p>

        </div>

      </div>

      {/* =========================
          GRADE SCALE
      ========================= */}

      <div className="card border-0 shadow-sm">

        <div className="card-body">

          <h5 className="fw-bold mb-3">
            📌 Grade Scale
          </h5>

          <div className="row text-center">

            <div className="col">
              <strong>A+</strong>
              <br />
              <small>90–100</small>
            </div>

            <div className="col">
              <strong>A</strong>
              <br />
              <small>80–89</small>
            </div>

            <div className="col">
              <strong>B+</strong>
              <br />
              <small>70–79</small>
            </div>

            <div className="col">
              <strong>B</strong>
              <br />
              <small>60–69</small>
            </div>

            <div className="col">
              <strong>C</strong>
              <br />
              <small>50–59</small>
            </div>

            <div className="col">
              <strong>D</strong>
              <br />
              <small>40–49</small>
            </div>

            <div className="col">
              <strong>F</strong>
              <br />
              <small>Below 40</small>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default StudentReportCard;