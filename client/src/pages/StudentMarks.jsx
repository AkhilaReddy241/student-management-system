import React, { useEffect, useState } from "react";
import axios from "axios";

function StudentMarks() {
  const [student, setStudent] = useState(null);
  const [marks, setMarks] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState("");
  const [activeTab, setActiveTab] = useState(null);
  const [loading, setLoading] = useState(true);

  const API = "http://localhost:5000/api";

  // =========================
  // LOAD STUDENT
  // =========================

  useEffect(() => {
    const studentData = JSON.parse(
      localStorage.getItem("student")
    );

    if (!studentData) {
      setLoading(false);
      return;
    }

    setStudent(studentData);
    fetchMarks(studentData);
  }, []);

  // =========================
  // FETCH MARKS
  // =========================

  const fetchMarks = async (studentData) => {
    try {
      const response = await axios.get(
        `${API}/marks`
      );

      const allMarks =
        response.data.data ||
        response.data.marks ||
        [];

      const studentId =
        studentData.id ||
        studentData._id;

      const studentMarks = allMarks.filter(
        (mark) => {
          const markStudentId =
            mark.student?._id ||
            mark.student?.id ||
            mark.student;

          return (
            String(markStudentId) ===
            String(studentId)
          );
        }
      );

      setMarks(studentMarks);
    } catch (error) {
      console.error(
        "Error fetching marks:",
        error
      );
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
  // RESULT
  // =========================

  const getResult = (percentage) => {
    return percentage >= 40
      ? "Pass"
      : "Fail";
  };

  // =========================
  // INTERNAL 1 TOTAL
  // =========================

  const getInternal1Total = (mark) => {
    const exam = Number(
      mark.internal1?.examMarks || 0
    );

    const assignment = Number(
      mark.internal1?.assignmentMarks || 0
    );

    return exam + assignment;
  };

  // =========================
  // INTERNAL 2 TOTAL
  // =========================

  const getInternal2Total = (mark) => {
    const exam = Number(
      mark.internal2?.examMarks || 0
    );

    const assignment = Number(
      mark.internal2?.assignmentMarks || 0
    );

    return exam + assignment;
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="card shadow p-4 text-center">
          <h4>Loading marks...</h4>
        </div>
      </div>
    );
  }

  // =========================
  // STUDENT NOT FOUND
  // =========================

  if (!student) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          Student login information not found.
        </div>
      </div>
    );
  }

  // =========================
  // FILTER SEMESTER
  // =========================

  const semesterMarks = selectedSemester
    ? marks.filter(
        (mark) =>
          Number(mark.semester) ===
          Number(selectedSemester)
      )
    : [];

  return (
    <div className="container mt-4 mb-5">

      {/* =========================
          HEADER
      ========================== */}

      <div className="card shadow p-4 mb-4">

        <h2 className="text-center mb-4">
          📊 My Marks
        </h2>

        <div className="row">

          <div className="col-md-3">
            <strong>Name:</strong>{" "}
            {student.name}
          </div>

          <div className="col-md-3">
            <strong>Roll Number:</strong>{" "}
            {student.rollNumber}
          </div>

          <div className="col-md-3">
            <strong>Department:</strong>{" "}
            {student.department}
          </div>

          <div className="col-md-3">
            <strong>Current Semester:</strong>{" "}
            {student.semester}
          </div>

        </div>

      </div>

      {/* =========================
          SEMESTER SELECTION
      ========================== */}

      <div className="card shadow p-4 mb-4">

        <h5 className="mb-3">
          📚 Select Semester
        </h5>

        <select
          className="form-select"
          value={selectedSemester}
          onChange={(e) => {
            setSelectedSemester(e.target.value);
            setActiveTab(null);
          }}
        >

          <option value="">
            -- Select Semester --
          </option>

          <option value="1">
            Semester 1
          </option>

          <option value="2">
            Semester 2
          </option>

          <option value="3">
            Semester 3
          </option>

          <option value="4">
            Semester 4
          </option>

          <option value="5">
            Semester 5
          </option>

          <option value="6">
            Semester 6
          </option>

          <option value="7">
            Semester 7
          </option>

          <option value="8">
            Semester 8
          </option>

        </select>

      </div>

      {/* =========================
          MARK BUTTONS
      ========================== */}

      {selectedSemester && (
        <div className="card shadow p-4 mb-4">

          <div className="row">

            {/* INTERNAL 1 */}

            <div className="col-md-4 mb-2">

              <button
                type="button"
                className={`btn w-100 ${
                  activeTab === "internal1"
                    ? "btn-primary"
                    : "btn-outline-primary"
                }`}
                onClick={() =>
                  setActiveTab("internal1")
                }
              >
                📝 Internal 1
              </button>

            </div>

            {/* INTERNAL 2 */}

            <div className="col-md-4 mb-2">

              <button
                type="button"
                className={`btn w-100 ${
                  activeTab === "internal2"
                    ? "btn-info"
                    : "btn-outline-info"
                }`}
                onClick={() =>
                  setActiveTab("internal2")
                }
              >
                📝 Internal 2
              </button>

            </div>

            {/* EXTERNAL */}

            <div className="col-md-4 mb-2">

              <button
                type="button"
                className={`btn w-100 ${
                  activeTab === "external"
                    ? "btn-warning"
                    : "btn-outline-warning"
                }`}
                onClick={() =>
                  setActiveTab("external")
                }
              >
                📚 External
              </button>

            </div>

          </div>

        </div>
      )}

      {/* =========================
          NO SEMESTER MESSAGE
      ========================== */}

      {!selectedSemester && (
        <div className="alert alert-info text-center">
          Please select a semester to view your marks.
        </div>
      )}

      {/* ==================================================
          INTERNAL 1
      ================================================== */}

      {activeTab === "internal1" && (

        <div className="card shadow">

          <div className="card-header bg-primary text-white">

            <h4 className="mb-0">
              📝 Internal 1 - Semester{" "}
              {selectedSemester}
            </h4>

          </div>

          <div className="card-body">

            {semesterMarks.filter(
              (mark) => mark.internal1
            ).length === 0 ? (

              <p className="text-center">
                No Internal 1 marks available
                for Semester {selectedSemester}.
              </p>

            ) : (

              <div className="table-responsive">

                <table className="table table-bordered table-striped text-center">

                  <thead className="table-dark">

                    <tr>
                      <th>Subject</th>
                      <th>Exam /25</th>
                      <th>Assignment /5</th>
                      <th>Total /30</th>
                      <th>Percentage</th>
                      <th>Grade</th>
                      <th>Result</th>
                    </tr>

                  </thead>

                  <tbody>

                    {semesterMarks.map((mark) => {

                      if (!mark.internal1) {
                        return null;
                      }

                      const exam = Number(
                        mark.internal1.examMarks || 0
                      );

                      const assignment =
                        Number(
                          mark.internal1
                            .assignmentMarks || 0
                        );

                      const total =
                        getInternal1Total(mark);

                      const percentage =
                        (total / 30) * 100;

                      const grade =
                        getGrade(percentage);

                      const result =
                        getResult(percentage);

                      return (
                        <tr key={mark._id}>

                          <td>
                            {mark.subject}
                          </td>

                          <td>
                            {exam}
                          </td>

                          <td>
                            {assignment}
                          </td>

                          <td>
                            <strong>
                              {total} / 30
                            </strong>
                          </td>

                          <td>
                            {percentage.toFixed(2)}%
                          </td>

                          <td>
                            <strong>
                              {grade}
                            </strong>
                          </td>

                          <td>

                            <span
                              className={`badge ${
                                result === "Pass"
                                  ? "bg-success"
                                  : "bg-danger"
                              }`}
                            >
                              {result}
                            </span>

                          </td>

                        </tr>
                      );
                    })}

                  </tbody>

                </table>

              </div>
            )}

          </div>

        </div>
      )}

      {/* ==================================================
          INTERNAL 2
      ================================================== */}

      {activeTab === "internal2" && (

        <div className="card shadow">

          <div className="card-header bg-info text-dark">

            <h4 className="mb-0">
              📝 Internal 2 - Semester{" "}
              {selectedSemester}
            </h4>

          </div>

          <div className="card-body">

            {semesterMarks.filter(
              (mark) => mark.internal2
            ).length === 0 ? (

              <p className="text-center">
                No Internal 2 marks available
                for Semester {selectedSemester}.
              </p>

            ) : (

              <div className="table-responsive">

                <table className="table table-bordered table-striped text-center">

                  <thead className="table-dark">

                    <tr>
                      <th>Subject</th>
                      <th>Exam /25</th>
                      <th>Assignment /5</th>
                      <th>Total /30</th>
                      <th>Percentage</th>
                      <th>Grade</th>
                      <th>Result</th>
                    </tr>

                  </thead>

                  <tbody>

                    {semesterMarks.map((mark) => {

                      if (!mark.internal2) {
                        return null;
                      }

                      const exam = Number(
                        mark.internal2.examMarks || 0
                      );

                      const assignment =
                        Number(
                          mark.internal2
                            .assignmentMarks || 0
                        );

                      const total =
                        getInternal2Total(mark);

                      const percentage =
                        (total / 30) * 100;

                      const grade =
                        getGrade(percentage);

                      const result =
                        getResult(percentage);

                      return (
                        <tr key={mark._id}>

                          <td>
                            {mark.subject}
                          </td>

                          <td>
                            {exam}
                          </td>

                          <td>
                            {assignment}
                          </td>

                          <td>
                            <strong>
                              {total} / 30
                            </strong>
                          </td>

                          <td>
                            {percentage.toFixed(2)}%
                          </td>

                          <td>
                            <strong>
                              {grade}
                            </strong>
                          </td>

                          <td>

                            <span
                              className={`badge ${
                                result === "Pass"
                                  ? "bg-success"
                                  : "bg-danger"
                              }`}
                            >
                              {result}
                            </span>

                          </td>

                        </tr>
                      );
                    })}

                  </tbody>

                </table>

              </div>
            )}

          </div>

        </div>
      )}

      {/* ==================================================
          EXTERNAL
      ================================================== */}

      {activeTab === "external" && (

        <div className="card shadow">

          <div className="card-header bg-warning">

            <h4 className="mb-0">
              📚 External - Semester{" "}
              {selectedSemester}
            </h4>

          </div>

          <div className="card-body">

            {semesterMarks.filter(
              (mark) =>
                mark.externalMarks !== null &&
                mark.externalMarks !== undefined
            ).length === 0 ? (

              <p className="text-center">
                No External marks available
                for Semester {selectedSemester}.
              </p>

            ) : (

              <div className="table-responsive">

                <table className="table table-bordered table-striped text-center">

                  <thead className="table-dark">

                    <tr>
                      <th>Subject</th>
                      <th>External /70</th>
                      <th>Total /70</th>
                      <th>Percentage</th>
                      <th>Grade</th>
                      <th>Result</th>
                    </tr>

                  </thead>

                  <tbody>

                    {semesterMarks.map((mark) => {

                      if (
                        mark.externalMarks === null ||
                        mark.externalMarks === undefined
                      ) {
                        return null;
                      }

                      const external =
                        Number(
                          mark.externalMarks
                        );

                      const percentage =
                        (external / 70) * 100;

                      const grade =
                        getGrade(percentage);

                      const result =
                        getResult(percentage);

                      return (
                        <tr key={mark._id}>

                          <td>
                            {mark.subject}
                          </td>

                          <td>
                            {external}
                          </td>

                          <td>
                            <strong>
                              {external} / 70
                            </strong>
                          </td>

                          <td>
                            {percentage.toFixed(2)}%
                          </td>

                          <td>
                            <strong>
                              {grade}
                            </strong>
                          </td>

                          <td>

                            <span
                              className={`badge ${
                                result === "Pass"
                                  ? "bg-success"
                                  : "bg-danger"
                              }`}
                            >
                              {result}
                            </span>

                          </td>

                        </tr>
                      );
                    })}

                  </tbody>

                </table>

              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
}

export default StudentMarks;