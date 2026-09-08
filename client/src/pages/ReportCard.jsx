import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function ReportCard() {
  const [marks, setMarks] = useState([]);

  const [rollNumber, setRollNumber] = useState("");
  const [department, setDepartment] = useState("All");

  const [loading, setLoading] = useState(true);

  // ==========================================
  // GET ALL MARKS
  // ==========================================

  useEffect(() => {
    getMarks();
  }, []);

  const getMarks = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        "http://localhost:5000/api/marks"
      );

      console.log("MARKS API RESPONSE:", res.data);

      setMarks(res.data.data || []);
    } catch (err) {
      console.error("Get Marks Error:", err);

      toast.error("Failed to load report cards");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // GRADE
  // ==========================================

  const getGrade = (percentage) => {
    if (percentage >= 90) return "A+";
    if (percentage >= 80) return "A";
    if (percentage >= 70) return "B+";
    if (percentage >= 60) return "B";
    if (percentage >= 50) return "C";
    if (percentage >= 40) return "D";

    return "F";
  };

  // ==========================================
  // CGPA
  // ==========================================

  const getCGPA = (percentage) => {
    return (percentage / 10).toFixed(2);
  };

  // ==========================================
  // BUILD STUDENT REPORT
  // ==========================================

  const reports = useMemo(() => {
    const grouped = {};

    // Group marks by student
    marks.forEach((item) => {
      if (!item.student) return;

      const studentId = item.student._id;

      if (!grouped[studentId]) {
        grouped[studentId] = {
          student: item.student,
          marks: [],
        };
      }

      grouped[studentId].marks.push(item);
    });

    // Create report for every student
    return Object.values(grouped).map((studentData) => {
      // ======================================
      // TOTAL MARKS
      // IMPORTANT:
      // API uses finalTotal, NOT marks
      // ======================================

      const total = studentData.marks.reduce(
        (sum, item) => {
          return sum + Number(item.finalTotal || 0);
        },
        0
      );

      // ======================================
      // NUMBER OF SUBJECTS
      // ======================================

      const subjects = studentData.marks.length;

      // ======================================
      // MAXIMUM MARKS
      // Each subject = 100
      // ======================================

      const maxMarks = subjects * 100;

      // ======================================
      // PERCENTAGE
      // ======================================

      const percentage =
        maxMarks > 0
          ? (total / maxMarks) * 100
          : 0;

      // ======================================
      // CGPA
      // ======================================

      const cgpa = getCGPA(percentage);

      // ======================================
      // OVERALL GRADE
      // ======================================

      const grade = getGrade(percentage);

      // ======================================
      // PASS / FAIL
      // Every subject needs >= 40
      // ======================================

      const passed = studentData.marks.every(
        (item) =>
          Number(item.finalTotal || 0) >= 40
      );

      return {
        ...studentData,
        total,
        maxMarks,
        percentage,
        cgpa,
        grade,
        passed,
      };
    });
  }, [marks]);

  // ==========================================
  // FILTER REPORTS
  // ==========================================

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const roll = String(
        report.student?.rollNumber || ""
      ).toLowerCase();

      const search = rollNumber.toLowerCase();

      const matchesRoll = roll.includes(search);

      const matchesDepartment =
        department === "All" ||
        report.student?.department === department;

      return matchesRoll && matchesDepartment;
    });
  }, [reports, rollNumber, department]);

  // ==========================================
  // STATISTICS
  // ==========================================

  const totalStudents = filteredReports.length;

  const totalPassed = filteredReports.filter(
    (item) => item.passed
  ).length;

  const totalFailed =
    totalStudents - totalPassed;

  const averagePercentage =
    totalStudents > 0
      ? (
          filteredReports.reduce(
            (sum, item) =>
              sum + item.percentage,
            0
          ) / totalStudents
        ).toFixed(2)
      : "0.00";

  const highestPercentage =
    totalStudents > 0
      ? Math.max(
          ...filteredReports.map(
            (item) => item.percentage
          )
        ).toFixed(2)
      : "0.00";

  const lowestPercentage =
    totalStudents > 0
      ? Math.min(
          ...filteredReports.map(
            (item) => item.percentage
          )
        ).toFixed(2)
      : "0.00";

  // ==========================================
  // PASS RATE
  // ==========================================

  const passRate =
    totalStudents > 0
      ? (
          (totalPassed / totalStudents) *
          100
        ).toFixed(2)
      : "0.00";

  // ==========================================
  // TOPPER
  // ==========================================

  const topper =
    filteredReports.length > 0
      ? [...filteredReports].sort(
          (a, b) =>
            b.percentage - a.percentage
        )[0]
      : null;

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="container-fluid px-4 py-4">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>
          <h2 className="fw-bold mb-1">
            📄 Student Report Cards
          </h2>

          <p className="text-muted mb-0">
            View student academic performance
          </p>
        </div>

        <Link
          to="/marks"
          className="btn btn-primary px-4"
        >
          ← Marks Management
        </Link>

      </div>

      {/* ======================================
          STATISTICS
      ====================================== */}

      <div className="row g-3 mb-4">

        {/* TOTAL STUDENTS */}

        <div className="col-lg-3 col-md-6">
          <div className="card border-0 shadow-sm h-100">

            <div className="card-body">

              <small className="text-muted">
                Total Students
              </small>

              <h2 className="fw-bold mt-2">
                {totalStudents}
              </h2>

              <span className="text-primary">
                👨‍🎓 Students
              </span>

            </div>

          </div>
        </div>

        {/* AVERAGE */}

        <div className="col-lg-3 col-md-6">
          <div className="card border-0 shadow-sm h-100">

            <div className="card-body">

              <small className="text-muted">
                Average Percentage
              </small>

              <h2 className="fw-bold mt-2">
                {averagePercentage}%
              </h2>

              <span className="text-info">
                📊 Class Average
              </span>

            </div>

          </div>
        </div>

        {/* HIGHEST */}

        <div className="col-lg-3 col-md-6">
          <div className="card border-0 shadow-sm h-100">

            <div className="card-body">

              <small className="text-muted">
                Highest Percentage
              </small>

              <h2 className="fw-bold mt-2 text-success">
                {highestPercentage}%
              </h2>

              <span className="text-success">
                🏆 Best Performance
              </span>

            </div>

          </div>
        </div>

        {/* PASS RATE */}

        <div className="col-lg-3 col-md-6">
          <div className="card border-0 shadow-sm h-100">

            <div className="card-body">

              <small className="text-muted">
                Pass Rate
              </small>

              <h2 className="fw-bold mt-2">
                {passRate}%
              </h2>

              <span className="text-success">
                ✅ {totalPassed} Passed
              </span>

              {totalFailed > 0 && (
                <span className="text-danger ms-2">
                  ❌ {totalFailed} Failed
                </span>
              )}

            </div>

          </div>
        </div>

      </div>

      {/* ======================================
          FILTER
      ====================================== */}

      <div className="card border-0 shadow-sm mb-4">

        <div className="card-body">

          <div className="row g-3">

            {/* ROLL NUMBER */}

            <div className="col-md-7">

              <label className="form-label fw-semibold">
                Search Roll Number
              </label>

              <div className="input-group">

                <span className="input-group-text">
                  🔍
                </span>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter roll number..."
                  value={rollNumber}
                  onChange={(e) =>
                    setRollNumber(
                      e.target.value
                    )
                  }
                />

              </div>

            </div>

            {/* DEPARTMENT */}

            <div className="col-md-5">

              <label className="form-label fw-semibold">
                Department
              </label>

              <select
                className="form-select"
                value={department}
                onChange={(e) =>
                  setDepartment(
                    e.target.value
                  )
                }
              >

                <option value="All">
                  All Departments
                </option>

                <option value="CSE">
                  CSE
                </option>

                <option value="ECE">
                  ECE
                </option>

                <option value="EEE">
                  EEE
                </option>

                <option value="IT">
                  IT
                </option>

                <option value="MECH">
                  MECH
                </option>

              </select>

            </div>

          </div>

        </div>

      </div>

      {/* ======================================
          TOP PERFORMER
      ====================================== */}

      {topper && (
        <div className="card border-0 shadow-sm mb-4">

          <div className="card-body">

            <div className="row align-items-center">

              <div className="col-md-8">

                <small className="text-muted">
                  🏆 Top Performer
                </small>

                <h4 className="fw-bold mt-2">
                  {topper.student?.name}
                </h4>

                <p className="mb-0 text-muted">

                  Roll No:{" "}
                  {topper.student?.rollNumber}

                  {" | "}

                  Department:{" "}
                  {topper.student?.department}

                </p>

              </div>

              <div className="col-md-4 text-md-end">

                <h2 className="text-success fw-bold">

                  {topper.percentage.toFixed(2)}
                  %

                </h2>

                <span className="badge bg-success">
                  Grade {topper.grade}
                </span>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* ======================================
          REPORT TABLE
      ====================================== */}

      <div className="card border-0 shadow-sm">

        <div className="card-header bg-white py-3">

          <h5 className="fw-bold mb-0">
            📋 Student Performance
          </h5>

        </div>

        <div className="card-body p-0">

          <div className="table-responsive">

            <table className="table table-hover align-middle mb-0">

              <thead className="table-dark">

                <tr>

                  <th>#</th>

                  <th>
                    Roll No
                  </th>

                  <th>
                    Name
                  </th>

                  <th>
                    Department
                  </th>

                  <th>
                    Total
                  </th>

                  <th>
                    Percentage
                  </th>

                  <th>
                    CGPA
                  </th>

                  <th>
                    Grade
                  </th>

                  <th>
                    Result
                  </th>

                  <th>
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {/* LOADING */}

                {loading ? (

                  <tr>

                    <td
                      colSpan="10"
                      className="text-center py-5"
                    >

                      <div
                        className="spinner-border text-primary"
                      />

                      <p className="mt-3 mb-0">
                        Loading report cards...
                      </p>

                    </td>

                  </tr>

                ) : filteredReports.length > 0 ? (

                  /* REPORT DATA */

                  filteredReports.map(
                    (report, index) => (

                      <tr
                        key={
                          report.student?._id
                        }
                      >

                        <td>
                          {index + 1}
                        </td>

                        <td className="fw-semibold">

                          {
                            report.student
                              ?.rollNumber
                          }

                        </td>

                        <td>

                          {
                            report.student
                              ?.name
                          }

                        </td>

                        <td>

                          <span className="badge bg-light text-dark border">

                            {
                              report.student
                                ?.department
                            }

                          </span>

                        </td>

                        <td>

                          <strong>
                            {report.total}
                          </strong>

                          <span className="text-muted">
                            {" "}
                            /{" "}
                            {report.maxMarks}
                          </span>

                        </td>

                        <td>

                          <strong>

                            {report.percentage.toFixed(
                              2
                            )}

                            %

                          </strong>

                        </td>

                        <td>

                          <strong className="text-primary">

                            {report.cgpa}

                          </strong>

                        </td>

                        <td>

                          <span
                            className={`badge ${
                              report.grade === "F"
                                ? "bg-danger"
                                : report.grade ===
                                      "A+" ||
                                    report.grade === "A"
                                ? "bg-success"
                                : "bg-primary"
                            }`}
                          >

                            {report.grade}

                          </span>

                        </td>

                        <td>

                          <span
                            className={`badge ${
                              report.passed
                                ? "bg-success"
                                : "bg-danger"
                            }`}
                          >

                            {report.passed
                              ? "Pass"
                              : "Fail"}

                          </span>

                        </td>

                        <td>

                          <Link
                            to={`/report-card/${report.student?._id}`}
                            className="btn btn-primary btn-sm"
                          >
                            👁 View Details
                          </Link>

                        </td>

                      </tr>

                    )
                  )

                ) : (

                  /* NO DATA */

                  <tr>

                    <td
                      colSpan="10"
                      className="text-center py-5"
                    >

                      <div className="fs-1">
                        📭
                      </div>

                      <h5>
                        No Report Cards Found
                      </h5>

                      <p className="text-muted">
                        Try changing the search
                        or department filter.
                      </p>

                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

      {/* ======================================
          GRADE SCALE
      ====================================== */}

      <div className="card border-0 shadow-sm mt-4">

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

export default ReportCard;