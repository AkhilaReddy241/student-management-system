import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function StudentMyReportCard() {
  const [reportCard, setReportCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState("");

  // =====================================================
  // GET REPORT CARD
  // =====================================================

  const getReportCard = async (semester) => {
    try {
      setLoading(true);
      setReportCard(null);

      // =================================================
      // GET STUDENT FROM LOCAL STORAGE
      // =================================================

      const studentData = localStorage.getItem("student");

      console.log("STUDENT FROM LOCAL STORAGE:", studentData);

      if (!studentData) {
        toast.error(
          "Student information not found. Please login again."
        );
        return;
      }

      // =================================================
      // PARSE STUDENT
      // =================================================

      let student;

      try {
        student = JSON.parse(studentData);
      } catch (error) {
        console.error("Invalid student data:", error);

        toast.error(
          "Invalid student information. Please login again."
        );

        return;
      }

      console.log("STUDENT OBJECT:", student);

      // =================================================
      // GET STUDENT ID
      // =================================================

      const studentId = student._id || student.id;

      console.log("STUDENT ID:", studentId);

      if (!studentId) {
        toast.error(
          "Student ID not found. Please login again."
        );
        return;
      }

      // =================================================
      // GET TOKEN
      // =================================================

      const token = localStorage.getItem("token");

      console.log(
        "TOKEN EXISTS:",
        token ? "YES" : "NO"
      );

      if (!token) {
        toast.error(
          "Login session expired. Please login again."
        );
        return;
      }

      // =================================================
      // API URL
      // =================================================

      const url =
        `http://localhost:5000/api/report-card/my-report-card?studentId=${studentId}&semester=${semester}`;

      console.log("REPORT CARD URL:", url);

      // =================================================
      // API REQUEST
      // =================================================

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(
        "REPORT CARD RESPONSE:",
        response.data
      );

      // =================================================
      // SUCCESS
      // =================================================

      if (response.data.success) {
        setReportCard(response.data.data);
      } else {
        toast.error(
          response.data.message ||
          "Failed to load report card"
        );
      }

    } catch (error) {
      console.error(
        "STUDENT REPORT CARD ERROR:",
        error
      );

      console.error(
        "SERVER RESPONSE:",
        error.response?.data
      );

      // =================================================
      // 401
      // =================================================

      if (error.response?.status === 401) {
        toast.error(
          "Your login session has expired. Please login again."
        );

        localStorage.removeItem("token");
        localStorage.removeItem("role");

        return;
      }

      // =================================================
      // 400
      // =================================================

      if (error.response?.status === 400) {
        toast.error(
          error.response?.data?.message ||
          "Student ID or semester is invalid."
        );

        return;
      }

      // =================================================
      // 404
      // =================================================

      if (error.response?.status === 404) {
        toast.error(
          error.response?.data?.message ||
          "No report card found for this semester."
        );

        setReportCard(null);
        return;
      }

      // =================================================
      // OTHER ERRORS
      // =================================================

      toast.error(
        error.response?.data?.message ||
        "Failed to load report card"
      );

    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // SEMESTER CHANGE
  // =====================================================

  const handleSemesterChange = (e) => {
    const semester = e.target.value;

    setSelectedSemester(semester);

    if (!semester) {
      setReportCard(null);
      return;
    }

    getReportCard(semester);
  };

  // =====================================================
  // GET DATA
  // =====================================================

  const student = reportCard?.student;
  const subjects = reportCard?.subjects || [];
  const summary = reportCard?.summary || {};

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="container mt-4 mb-5">

      {/* =================================================
          TITLE
      ================================================= */}

      <h2 className="text-center mb-4">
        🎓 My Report Card
      </h2>

      {/* =================================================
          SEMESTER SELECTION
      ================================================= */}

      <div className="card shadow mb-4">

        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">
            Select Semester
          </h5>
        </div>

        <div className="card-body">

          <label className="form-label">
            <strong>Semester</strong>
          </label>

          <select
            className="form-select"
            value={selectedSemester}
            onChange={handleSemesterChange}
          >
            <option value="">
              -- Select Semester --
            </option>

            {[1, 2, 3, 4, 5, 6, 7, 8].map(
              (semester) => (
                <option
                  key={semester}
                  value={semester}
                >
                  Semester {semester}
                </option>
              )
            )}

          </select>

        </div>
      </div>

      {/* =================================================
          NO SEMESTER SELECTED
      ================================================= */}

      {!selectedSemester && (
        <div className="alert alert-info text-center">
          Please select a semester to view your report card.
        </div>
      )}

      {/* =================================================
          LOADING
      ================================================= */}

      {loading && (
        <div className="text-center mt-4">

          <div className="spinner-border text-primary">
          </div>

          <h5 className="mt-3">
            Loading Report Card...
          </h5>

        </div>
      )}

      {/* =================================================
          REPORT CARD
      ================================================= */}

      {!loading && reportCard && (
        <>
          {/* =============================================
              STUDENT INFORMATION
          ============================================= */}

          <div className="card shadow mb-4">

            <div className="card-header bg-primary text-white">

              <h5 className="mb-0">
                Student Information
              </h5>

            </div>

            <div className="card-body">

              <div className="row">

                <div className="col-md-6 mb-3">
                  <strong>Name:</strong>{" "}
                  {student?.name || "N/A"}
                </div>

                <div className="col-md-6 mb-3">
                  <strong>Roll Number:</strong>{" "}
                  {student?.rollNumber || "N/A"}
                </div>

                <div className="col-md-6 mb-3">
                  <strong>Department:</strong>{" "}
                  {student?.department || "N/A"}
                </div>

                <div className="col-md-6 mb-3">
                  <strong>Semester:</strong>{" "}
                  {selectedSemester}
                </div>

                <div className="col-md-6 mb-3">
                  <strong>Email:</strong>{" "}
                  {student?.email || "N/A"}
                </div>

              </div>

            </div>
          </div>

          {/* =============================================
              SUBJECT MARKS
          ============================================= */}

          <div className="card shadow mb-4">

            <div className="card-header bg-dark text-white">

              <h5 className="mb-0">
                Subject Marks - Semester {selectedSemester}
              </h5>

            </div>

            <div className="card-body">

              {subjects.length === 0 ? (

                <div className="alert alert-info">
                  No marks available for Semester{" "}
                  {selectedSemester}.
                </div>

              ) : (

                <div className="table-responsive">

                  <table className="table table-bordered table-striped text-center align-middle">

                    <thead className="table-dark">

                      <tr>

                        <th>Subject</th>

                        <th>Semester</th>

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

                      {subjects.map(
                        (subject, index) => (

                          <tr key={index}>

                            <td>
                              {subject.subject || "N/A"}
                            </td>

                            <td>
                              {subject.semester || selectedSemester}
                            </td>

                            <td>
                              {subject.internal1?.total ?? 0}
                            </td>

                            <td>
                              {subject.internal2?.total ?? 0}
                            </td>

                            <td>
                              {subject.internalAverage ?? 0}
                            </td>

                            <td>
                              {subject.externalMarks ?? 0}
                            </td>

                            <td>
                              <strong>
                                {subject.finalTotal ?? 0}
                              </strong>
                            </td>

                            <td>
                              <strong>
                                {subject.grade || "N/A"}
                              </strong>
                            </td>

                            <td>

                              {subject.result === "Pass" ? (

                                <span className="badge bg-success">
                                  PASS
                                </span>

                              ) : (

                                <span className="badge bg-danger">
                                  FAIL
                                </span>

                              )}

                            </td>

                          </tr>

                        )
                      )}

                    </tbody>

                  </table>

                </div>

              )}

            </div>
          </div>

          {/* =============================================
              OVERALL SUMMARY
          ============================================= */}

          <div className="card shadow mb-4">

            <div className="card-header bg-success text-white">

              <h5 className="mb-0">
                Overall Summary
              </h5>

            </div>

            <div className="card-body">

              {/* SUBJECT COUNTS */}

              <div className="row text-center">

                <div className="col-md-4 mb-3">

                  <div className="card border-primary">

                    <div className="card-body">

                      <h6>
                        Total Subjects
                      </h6>

                      <h3>
                        {summary.totalSubjects ?? 0}
                      </h3>

                    </div>

                  </div>

                </div>

                <div className="col-md-4 mb-3">

                  <div className="card border-success">

                    <div className="card-body">

                      <h6>
                        Passed Subjects
                      </h6>

                      <h3 className="text-success">
                        {summary.passedSubjects ?? 0}
                      </h3>

                    </div>

                  </div>

                </div>

                <div className="col-md-4 mb-3">

                  <div className="card border-danger">

                    <div className="card-body">

                      <h6>
                        Failed Subjects
                      </h6>

                      <h3 className="text-danger">
                        {summary.failedSubjects ?? 0}
                      </h3>

                    </div>

                  </div>

                </div>

              </div>

              <hr />

              {/* TOTAL / PERCENTAGE / RESULT */}

              <div className="row text-center">

                <div className="col-md-4 mb-3">

                  <strong>
                    Total Marks
                  </strong>

                  <h4 className="mt-2">

                    {summary.totalMarks ?? 0}
                    {" / "}
                    {summary.maxMarks ?? 0}

                  </h4>

                </div>

                <div className="col-md-4 mb-3">

                  <strong>
                    Percentage
                  </strong>

                  <h4 className="mt-2">

                    {summary.percentage ?? "0.00"}%

                  </h4>

                </div>

                <div className="col-md-4 mb-3">

                  <strong>
                    Overall Result
                  </strong>

                  <h4 className="mt-2">

                    {summary.overallResult === "Pass" ? (

                      <span className="text-success">
                        PASS
                      </span>

                    ) : (

                      <span className="text-danger">
                        FAIL
                      </span>

                    )}

                  </h4>

                </div>

              </div>

            </div>
          </div>
        </>
      )}

    </div>
  );
}

export default StudentMyReportCard;