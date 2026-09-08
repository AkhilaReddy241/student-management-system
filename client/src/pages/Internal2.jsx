import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function Internal2() {
  const API = "http://localhost:5000/api";

  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState([]);

  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    student: "",
    semester: "",
    subjectId: "",
    subject: "",
    examMarks: "",
    assignmentMarks: "",
  });

  // ==========================================
  // LOAD DATA
  // ==========================================

  useEffect(() => {
    getStudents();
    getMarks();
  }, []);

  // ==========================================
  // GET STUDENTS
  // ==========================================

  const getStudents = async () => {
    try {
      const res = await axios.get(`${API}/students`);

      console.log("Students API response:", res.data);

      // Backend returns:
      // {
      //   count: ...,
      //   students: [...]
      // }

      const studentData = res.data?.students || [];

      setStudents(
        Array.isArray(studentData) ? studentData : []
      );
    } catch (error) {
      console.log(
        "Get Students Error:",
        error.response?.data || error.message
      );

      toast.error("Failed to load students");
    }
  };

  // ==========================================
  // GET MARKS
  // ==========================================

  const getMarks = async () => {
    try {
      const res = await axios.get(`${API}/marks`);

      console.log("Marks API response:", res.data);

      // Supports either:
      // { data: [...] }
      // OR
      // { marks: [...] }

      const marksData =
        res.data?.data ||
        res.data?.marks ||
        [];

      setMarks(
        Array.isArray(marksData) ? marksData : []
      );
    } catch (error) {
      console.log(
        "Get Marks Error:",
        error.response?.data || error.message
      );

      toast.error("Failed to load marks");
    }
  };

  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // CALCULATE MARKS
  // ==========================================

  const exam = Number(formData.examMarks || 0);

  const assignment = Number(
    formData.assignmentMarks || 0
  );

  const total = exam + assignment;

  // ==========================================
  // CALCULATE GRADE
  // ==========================================

  const calculateGrade = (percentage) => {
    if (percentage >= 90) return "A+";
    if (percentage >= 80) return "A";
    if (percentage >= 70) return "B+";
    if (percentage >= 60) return "B";
    if (percentage >= 50) return "C";
    if (percentage >= 40) return "D";

    return "F";
  };

  // ==========================================
  // SAVE INTERNAL 2
  // ==========================================

  const saveInternal2 = async () => {
    try {
      // ========================================
      // REQUIRED FIELD VALIDATION
      // ========================================

      if (
        !formData.student ||
        !formData.semester ||
        !formData.subjectId ||
        !formData.subject ||
        formData.examMarks === "" ||
        formData.assignmentMarks === ""
      ) {
        toast.error("Please fill all fields");
        return;
      }

      // ========================================
      // EXAM MARKS VALIDATION
      // ========================================

      if (
        !Number.isFinite(exam) ||
        exam < 0 ||
        exam > 25
      ) {
        toast.error(
          "Exam marks must be between 0 and 25"
        );
        return;
      }

      // ========================================
      // ASSIGNMENT VALIDATION
      // ========================================

      if (
        !Number.isFinite(assignment) ||
        assignment < 0 ||
        assignment > 5
      ) {
        toast.error(
          "Assignment marks must be between 0 and 5"
        );
        return;
      }

      // ========================================
      // API REQUEST
      // ========================================

      await axios.post(
        `${API}/marks/internal2`,
        {
          student: formData.student,

          semester: Number(
            formData.semester
          ),

          subjectId: formData.subjectId,

          subject: formData.subject,

          examMarks: exam,

          assignmentMarks: assignment,
        }
      );

      // ========================================
      // SUCCESS
      // ========================================

      toast.success(
        "Internal 2 marks saved successfully"
      );

      resetForm();

      await getMarks();
    } catch (error) {
      console.log(
        "Save Internal 2 Error:",
        error.response?.data || error.message
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to save Internal 2 marks"
      );
    }
  };

  // ==========================================
  // EDIT MARKS
  // ==========================================

  const editMarks = (item) => {
    setEditingId(item._id);

    setFormData({
      student: item.student?._id || "",

      semester: item.semester || "",

      subjectId: item.subjectId || "",

      subject: item.subject || "",

      examMarks:
        item.internal2?.examMarks ?? "",

      assignmentMarks:
        item.internal2?.assignmentMarks ?? "",
    });

    // Scroll to top
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================
  // UPDATE MARKS
  // ==========================================

  const updateMarks = async () => {
    try {
      // ========================================
      // VALIDATION
      // ========================================

      if (
        formData.examMarks === "" ||
        formData.assignmentMarks === ""
      ) {
        toast.error(
          "Enter exam and assignment marks"
        );

        return;
      }

      // ========================================
      // EXAM VALIDATION
      // ========================================

      if (
        !Number.isFinite(exam) ||
        exam < 0 ||
        exam > 25
      ) {
        toast.error(
          "Exam marks must be between 0 and 25"
        );

        return;
      }

      // ========================================
      // ASSIGNMENT VALIDATION
      // ========================================

      if (
        !Number.isFinite(assignment) ||
        assignment < 0 ||
        assignment > 5
      ) {
        toast.error(
          "Assignment marks must be between 0 and 5"
        );

        return;
      }

      // ========================================
      // CHECK EDITING ID
      // ========================================

      if (!editingId) {
        toast.error("No marks record selected");
        return;
      }

      // ========================================
      // UPDATE API
      // ========================================

      await axios.put(
        `${API}/marks/${editingId}`,
        {
          internal2: {
            examMarks: exam,

            assignmentMarks: assignment,
          },
        }
      );

      toast.success(
        "Internal 2 marks updated successfully"
      );

      resetForm();

      await getMarks();
    } catch (error) {
      console.log(
        "Update Internal 2 Error:",
        error.response?.data || error.message
      );

      toast.error(
        error.response?.data?.message ||
          "Update failed"
      );
    }
  };

  // ==========================================
  // DELETE MARKS
  // ==========================================

  const deleteMarks = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this marks record?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await axios.delete(
        `${API}/marks/${id}`
      );

      toast.success(
        "Marks deleted successfully"
      );

      await getMarks();
    } catch (error) {
      console.log(
        "Delete Marks Error:",
        error.response?.data || error.message
      );

      toast.error("Delete failed");
    }
  };

  // ==========================================
  // RESET FORM
  // ==========================================

  const resetForm = () => {
    setFormData({
      student: "",
      semester: "",
      subjectId: "",
      subject: "",
      examMarks: "",
      assignmentMarks: "",
    });

    setEditingId(null);
  };

  // ==========================================
  // FILTER INTERNAL 2 RECORDS
  // ==========================================

  const internal2Marks = marks.filter(
    (item) => item.internal2
  );

  // ==========================================
  // RETURN
  // ==========================================

  return (
    <div className="container-fluid mt-4">

      {/* =====================================
          PAGE TITLE
      ====================================== */}

      <h2 className="text-center mb-4">
        Internal 2 Marks
      </h2>

      {/* =====================================
          ADD / EDIT FORM
      ====================================== */}

      <div className="card shadow p-4 mb-4">

        <h4 className="mb-4">
          {editingId
            ? "Edit Internal 2 Marks"
            : "Add Internal 2 Marks"}
        </h4>

        <div className="row">

          {/* =================================
              STUDENT
          ================================== */}

          <div className="col-md-4 mb-3">

            <label className="form-label">
              Student
            </label>

            <select
              className="form-select"
              name="student"
              value={formData.student}
              onChange={handleChange}
              disabled={editingId !== null}
            >

              <option value="">
                Select Student
              </option>

              {students.map((student) => (
                <option
                  key={student._id}
                  value={student._id}
                >
                  {student.rollNumber} -{" "}
                  {student.name}
                </option>
              ))}

            </select>

          </div>

          {/* =================================
              SEMESTER
          ================================== */}

          <div className="col-md-2 mb-3">

            <label className="form-label">
              Semester
            </label>

            <select
              className="form-select"
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              disabled={editingId !== null}
            >

              <option value="">
                Select
              </option>

              {[1, 2, 3, 4, 5, 6, 7, 8].map(
                (sem) => (
                  <option
                    key={sem}
                    value={sem}
                  >
                    {sem}
                  </option>
                )
              )}

            </select>

          </div>

          {/* =================================
              SUBJECT ID
          ================================== */}

          <div className="col-md-3 mb-3">

            <label className="form-label">
              Subject ID
            </label>

            <input
              type="text"
              className="form-control"
              name="subjectId"
              placeholder="CS101"
              value={formData.subjectId}
              onChange={handleChange}
              disabled={editingId !== null}
            />

          </div>

          {/* =================================
              SUBJECT
          ================================== */}

          <div className="col-md-3 mb-3">

            <label className="form-label">
              Subject
            </label>

            <input
              type="text"
              className="form-control"
              name="subject"
              placeholder="Java"
              value={formData.subject}
              onChange={handleChange}
              disabled={editingId !== null}
            />

          </div>

          {/* =================================
              EXAM MARKS
          ================================== */}

          <div className="col-md-4 mb-3">

            <label className="form-label">
              Exam Marks
              <span className="text-muted">
                {" "}
                (Maximum 25)
              </span>
            </label>

            <input
              type="number"
              className="form-control"
              name="examMarks"
              min="0"
              max="25"
              value={formData.examMarks}
              onChange={handleChange}
            />

          </div>

          {/* =================================
              ASSIGNMENT MARKS
          ================================== */}

          <div className="col-md-4 mb-3">

            <label className="form-label">
              Assignment Marks
              <span className="text-muted">
                {" "}
                (Maximum 5)
              </span>
            </label>

            <input
              type="number"
              className="form-control"
              name="assignmentMarks"
              min="0"
              max="5"
              value={formData.assignmentMarks}
              onChange={handleChange}
            />

          </div>

          {/* =================================
              TOTAL
          ================================== */}

          <div className="col-md-4 mb-3">

            <label className="form-label">
              Total
            </label>

            <div className="form-control bg-light">
              <strong>
                {total} / 30
              </strong>
            </div>

          </div>

        </div>

        {/* =================================
            BUTTONS
        ================================== */}

        <div className="text-center mt-3">

          <button
            type="button"
            className={
              editingId
                ? "btn btn-warning btn-lg"
                : "btn btn-primary btn-lg"
            }
            onClick={
              editingId
                ? updateMarks
                : saveInternal2
            }
          >
            {editingId
              ? "Update Marks"
              : "Save Internal 2"}
          </button>

          {editingId && (
            <button
              type="button"
              className="btn btn-secondary btn-lg ms-2"
              onClick={resetForm}
            >
              Cancel
            </button>
          )}

        </div>

      </div>

      {/* =====================================
          INTERNAL 2 TABLE
      ====================================== */}

      <div className="card shadow p-3">

        <h4 className="text-center mb-4">
          Internal 2 Marks Records
        </h4>

        <div className="table-responsive">

          <table className="table table-bordered table-striped text-center align-middle">

            <thead className="table-dark">

              <tr>
                <th>Roll No</th>
                <th>Name</th>
                <th>Subject ID</th>
                <th>Subject</th>
                <th>Exam Marks</th>
                <th>Assignment Marks</th>
                <th>Total</th>
                <th>Grade</th>
                <th>Percentage</th>
                <th>Result</th>
                <th>Action</th>
              </tr>

            </thead>

            <tbody>

              {internal2Marks.length > 0 ? (

                internal2Marks.map((item) => {

                  // ==================================
                  // CALCULATE TOTAL
                  // ==================================

                  const examMarks = Number(
                    item.internal2?.examMarks || 0
                  );

                  const assignmentMarks = Number(
                    item.internal2?.assignmentMarks || 0
                  );

                  const internalTotal =
                    examMarks + assignmentMarks;

                  // ==================================
                  // PERCENTAGE
                  // ==================================

                  const percentage = (
                    (internalTotal / 30) * 100
                  ).toFixed(2);

                  // ==================================
                  // GRADE
                  // ==================================

                  const grade = calculateGrade(
                    Number(percentage)
                  );

                  // ==================================
                  // RESULT
                  // PASS MARK = 12 / 30
                  // ==================================

                  const result =
                    internalTotal >= 12
                      ? "Pass"
                      : "Fail";

                  return (
                    <tr key={item._id}>

                      {/* ROLL NO */}

                      <td>
                        {item.student?.rollNumber || "-"}
                      </td>

                      {/* NAME */}

                      <td>
                        {item.student?.name || "-"}
                      </td>

                      {/* SUBJECT ID */}

                      <td>
                        {item.subjectId || "-"}
                      </td>

                      {/* SUBJECT */}

                      <td>
                        {item.subject || "-"}
                      </td>

                      {/* EXAM */}

                      <td>
                        <span className="badge bg-primary">
                          {examMarks}/25
                        </span>
                      </td>

                      {/* ASSIGNMENT */}

                      <td>
                        <span className="badge bg-info text-dark">
                          {assignmentMarks}/5
                        </span>
                      </td>

                      {/* TOTAL */}

                      <td>
                        <strong>
                          {internalTotal}/30
                        </strong>
                      </td>

                      {/* GRADE */}

                      <td>
                        <span
                          className={
                            grade === "F"
                              ? "badge bg-danger"
                              : "badge bg-success"
                          }
                        >
                          {grade}
                        </span>
                      </td>

                      {/* PERCENTAGE */}

                      <td>
                        {percentage}%
                      </td>

                      {/* RESULT */}

                      <td>
                        <span
                          className={
                            result === "Pass"
                              ? "badge bg-success"
                              : "badge bg-danger"
                          }
                        >
                          {result}
                        </span>
                      </td>

                      {/* ACTION */}

                      <td>

                        <button
                          type="button"
                          className="btn btn-warning btn-sm me-2"
                          onClick={() =>
                            editMarks(item)
                          }
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() =>
                            deleteMarks(item._id)
                          }
                        >
                          Delete
                        </button>

                      </td>

                    </tr>
                  );
                })

              ) : (

                <tr>

                  <td
                    colSpan="11"
                    className="text-center"
                  >
                    No Internal 2 Marks Found
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default Internal2;