import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function ExternalMarks() {
  const API = "http://localhost:5000/api";

  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    student: "",
    semester: "",
    subject: "",
    externalMarks: "",
  });

  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {
    getStudents();
    getMarks();
  }, []);

  // =====================================================
  // GET STUDENTS
  // =====================================================

  const getStudents = async () => {
    try {
      const res = await axios.get(`${API}/students`);

      console.log("Students response:", res.data);

      const studentData = res.data?.students || [];

      setStudents(
        Array.isArray(studentData) ? studentData : []
      );
    } catch (error) {
      console.error(
        "Get Students Error:",
        error.response?.data || error.message
      );

      toast.error("Failed to load students");
    }
  };

  // =====================================================
  // GET MARKS
  // =====================================================

  const getMarks = async () => {
    try {
      const res = await axios.get(`${API}/marks`);

      console.log("Marks response:", res.data);

      const marksData =
        res.data?.data ||
        res.data?.marks ||
        [];

      console.log("Marks array:", marksData);

      setMarks(
        Array.isArray(marksData)
          ? marksData
          : []
      );
    } catch (error) {
      console.error(
        "Get Marks Error:",
        error.response?.data || error.message
      );

      toast.error("Failed to load marks");
    }
  };

  // =====================================================
  // GET STUDENT ID
  // =====================================================

  const getStudentId = (item) => {
    if (!item?.student) {
      return "";
    }

    if (typeof item.student === "string") {
      return item.student;
    }

    return item.student?._id || "";
  };

  // =====================================================
  // FIND MARKS RECORD
  // =====================================================

  const findMarksRecord = (
    studentId,
    semester,
    subject
  ) => {
    if (
      !studentId ||
      !semester ||
      !subject
    ) {
      return null;
    }

    const selectedSubject =
      subject.trim().toLowerCase();

    return marks.find((item) => {
      const itemStudentId =
        getStudentId(item);

      const itemSubject =
        item.subject
          ?.trim()
          .toLowerCase() || "";

      return (
        itemStudentId === studentId &&
        Number(item.semester) ===
          Number(semester) &&
        itemSubject === selectedSubject
      );
    });
  };

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // SAVE EXTERNAL MARKS
  // =====================================================

  const saveExternal = async () => {
    try {
      if (
        !formData.student ||
        !formData.semester ||
        !formData.subject.trim() ||
        formData.externalMarks === ""
      ) {
        toast.error(
          "Please fill all fields"
        );
        return;
      }

      const external = Number(
        formData.externalMarks
      );

      if (
        !Number.isFinite(external) ||
        external < 0 ||
        external > 70
      ) {
        toast.error(
          "External marks must be between 0 and 70"
        );
        return;
      }

      // -----------------------------------------------
      // FIND SAME MARKS DOCUMENT
      // -----------------------------------------------

      const existingRecord =
        findMarksRecord(
          formData.student,
          formData.semester,
          formData.subject
        );

      if (!existingRecord) {
        toast.error(
          "No marks record found. Please enter Internal 1 and Internal 2 marks first."
        );
        return;
      }

      console.log(
        "Selected Marks Record:",
        existingRecord
      );

      // -----------------------------------------------
      // CHECK INTERNAL 1
      // -----------------------------------------------

      if (!existingRecord.internal1) {
        toast.error(
          "Please enter Internal 1 marks first"
        );
        return;
      }

      // -----------------------------------------------
      // CHECK INTERNAL 2
      // -----------------------------------------------

      if (!existingRecord.internal2) {
        toast.error(
          "Please enter Internal 2 marks first"
        );
        return;
      }

      // -----------------------------------------------
      // INTERNAL 1 CALCULATION
      // -----------------------------------------------

      const internal1Exam =
        Number(
          existingRecord.internal1
            ?.examMarks || 0
        );

      const internal1Assignment =
        Number(
          existingRecord.internal1
            ?.assignmentMarks || 0
        );

      const internal1Total =
        internal1Exam +
        internal1Assignment;

      // -----------------------------------------------
      // INTERNAL 2 CALCULATION
      // -----------------------------------------------

      const internal2Exam =
        Number(
          existingRecord.internal2
            ?.examMarks || 0
        );

      const internal2Assignment =
        Number(
          existingRecord.internal2
            ?.assignmentMarks || 0
        );

      const internal2Total =
        internal2Exam +
        internal2Assignment;

      // -----------------------------------------------
      // INTERNAL AVERAGE
      // -----------------------------------------------

      const internalAverage =
        (internal1Total +
          internal2Total) /
        2;

      console.log(
        "Internal 1 Total:",
        internal1Total
      );

      console.log(
        "Internal 2 Total:",
        internal2Total
      );

      console.log(
        "Internal Average:",
        internalAverage
      );

      // -----------------------------------------------
      // CHECK EXTERNAL
      // -----------------------------------------------

      if (
        existingRecord.externalMarks !==
          undefined &&
        existingRecord.externalMarks !==
          null
      ) {
        toast.error(
          "External marks already exist for this student and subject"
        );
        return;
      }

      // -----------------------------------------------
      // SAVE EXTERNAL
      // -----------------------------------------------

      const payload = {
        student: formData.student,
        semester: Number(
          formData.semester
        ),
        subject:
          formData.subject.trim(),
        externalMarks: external,
      };

      console.log(
        "External payload:",
        payload
      );

      const response =
        await axios.post(
          `${API}/marks/external`,
          payload
        );

      console.log(
        "External save response:",
        response.data
      );

      toast.success(
        "External marks saved successfully"
      );

      resetForm();

      await getMarks();

    } catch (error) {
      console.error(
        "Save External Error:",
        error.response?.data ||
          error.message
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to save external marks"
      );
    }
  };

  // =====================================================
  // EDIT
  // =====================================================

  const editExternal = (item) => {
    setEditingId(item._id);

    setFormData({
      student: getStudentId(item),
      semester:
        item.semester || "",
      subject:
        item.subject || "",
      externalMarks:
        item.externalMarks ?? "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =====================================================
  // UPDATE
  // =====================================================

  const updateExternal = async () => {
    try {
      if (
        formData.externalMarks === ""
      ) {
        toast.error(
          "Enter external marks"
        );
        return;
      }

      const external = Number(
        formData.externalMarks
      );

      if (
        !Number.isFinite(external) ||
        external < 0 ||
        external > 70
      ) {
        toast.error(
          "External marks must be between 0 and 70"
        );
        return;
      }

      if (!editingId) {
        toast.error(
          "No external marks selected"
        );
        return;
      }

      const response =
        await axios.put(
          `${API}/marks/${editingId}`,
          {
            externalMarks: external,
          }
        );

      console.log(
        "Update response:",
        response.data
      );

      toast.success(
        "External marks updated successfully"
      );

      resetForm();

      await getMarks();

    } catch (error) {
      console.error(
        "Update External Error:",
        error.response?.data ||
          error.message
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to update external marks"
      );
    }
  };

  // =====================================================
  // DELETE
  // =====================================================

  const deleteExternal = async (
    id
  ) => {
    const confirmDelete =
      window.confirm(
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
      console.error(
        "Delete External Error:",
        error.response?.data ||
          error.message
      );

      toast.error(
        error.response?.data?.message ||
          "Delete failed"
      );
    }
  };

  // =====================================================
  // RESET
  // =====================================================

  const resetForm = () => {
    setFormData({
      student: "",
      semester: "",
      subject: "",
      externalMarks: "",
    });

    setEditingId(null);
  };

  // =====================================================
  // GRADE
  // =====================================================

  const calculateGrade = (
    percentage
  ) => {
    if (percentage >= 90)
      return "A+";

    if (percentage >= 80)
      return "A";

    if (percentage >= 70)
      return "B+";

    if (percentage >= 60)
      return "B";

    if (percentage >= 50)
      return "C";

    if (percentage >= 40)
      return "D";

    return "F";
  };

  // =====================================================
  // EXTERNAL RECORDS
  // =====================================================

  const externalRecords =
    marks.filter(
      (item) =>
        item.externalMarks !==
          undefined &&
        item.externalMarks !== null
    );

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="container-fluid mt-4">

      <h2 className="text-center mb-4">
        External Marks Management
      </h2>

      {/* =================================================
          FORM
      ================================================= */}

      <div className="card shadow p-4 mb-4">

        <h4 className="text-center mb-4">
          {editingId
            ? "Edit External Marks"
            : "Add External Marks"}
        </h4>

        <div className="row">

          {/* STUDENT */}

          <div className="col-md-3 mb-3">

            <label className="form-label">
              Student
            </label>

            <select
              className="form-select"
              name="student"
              value={
                formData.student
              }
              onChange={
                handleChange
              }
              disabled={
                editingId !== null
              }
            >

              <option value="">
                Select Student
              </option>

              {students.map(
                (student) => (
                  <option
                    key={
                      student._id
                    }
                    value={
                      student._id
                    }
                  >
                    {student.rollNumber} -{" "}
                    {student.name}
                  </option>
                )
              )}

            </select>

          </div>

          {/* SEMESTER */}

          <div className="col-md-2 mb-3">

            <label className="form-label">
              Semester
            </label>

            <select
              className="form-select"
              name="semester"
              value={
                formData.semester
              }
              onChange={
                handleChange
              }
              disabled={
                editingId !== null
              }
            >

              <option value="">
                Select Semester
              </option>

              {[1, 2, 3, 4, 5, 6, 7, 8].map(
                (sem) => (
                  <option
                    key={sem}
                    value={sem}
                  >
                    Semester {sem}
                  </option>
                )
              )}

            </select>

          </div>

          {/* SUBJECT */}

          <div className="col-md-3 mb-3">

            <label className="form-label">
              Subject
            </label>

            <input
              type="text"
              className="form-control"
              name="subject"
              placeholder="Example: Java"
              value={
                formData.subject
              }
              onChange={
                handleChange
              }
              disabled={
                editingId !== null
              }
            />

          </div>

          {/* EXTERNAL */}

          <div className="col-md-2 mb-3">

            <label className="form-label">
              External Marks (70)
            </label>

            <input
              type="number"
              className="form-control"
              name="externalMarks"
              min="0"
              max="70"
              value={
                formData.externalMarks
              }
              onChange={
                handleChange
              }
            />

          </div>

          {/* BUTTON */}

          <div className="col-md-2 mb-3 d-flex align-items-end">

            {editingId ? (
              <>
                <button
                  type="button"
                  className="btn btn-warning me-2"
                  onClick={
                    updateExternal
                  }
                >
                  Update
                </button>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={
                    resetForm
                  }
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                type="button"
                className="btn btn-primary w-100"
                onClick={
                  saveExternal
                }
              >
                Add External
              </button>
            )}

          </div>

        </div>

      </div>

      {/* =================================================
          TABLE
      ================================================= */}

      <div className="card shadow p-3">

        <h2 className="text-center mb-4">
          External Marks Records
        </h2>

        <div className="table-responsive">

          <table className="table table-bordered table-striped text-center align-middle">

            <thead className="table-dark">

              <tr>
                <th>Roll No</th>
                <th>Name</th>
                <th>Department</th>
                <th>Semester</th>
                <th>Subject</th>
                <th>Internal 1</th>
                <th>Internal 2</th>
                <th>Internal Average</th>
                <th>External</th>
                <th>Final</th>
                <th>Percentage</th>
                <th>Grade</th>
                <th>Result</th>
                <th>Action</th>
              </tr>

            </thead>

            <tbody>

              {externalRecords.length > 0 ? (

                externalRecords.map(
                  (item) => {

                    // =================================
                    // INTERNAL 1
                    // =================================

                    const internal1Exam =
                      Number(
                        item.internal1
                          ?.examMarks || 0
                      );

                    const internal1Assignment =
                      Number(
                        item.internal1
                          ?.assignmentMarks || 0
                      );

                    const internal1Total =
                      internal1Exam +
                      internal1Assignment;

                    // =================================
                    // INTERNAL 2
                    // =================================

                    const internal2Exam =
                      Number(
                        item.internal2
                          ?.examMarks || 0
                      );

                    const internal2Assignment =
                      Number(
                        item.internal2
                          ?.assignmentMarks || 0
                      );

                    const internal2Total =
                      internal2Exam +
                      internal2Assignment;

                    // =================================
                    // INTERNAL AVERAGE
                    // =================================

                    const calculatedInternalAverage =
                      item.internal1 &&
                      item.internal2
                        ? (
                            internal1Total +
                            internal2Total
                          ) / 2
                        : 0;

                    // =================================
                    // USE BACKEND VALUE WHEN AVAILABLE
                    // =================================

                    const internalAverage =
                      item.internalAverage !==
                        undefined &&
                      item.internalAverage !==
                        null
                        ? Number(
                            item.internalAverage
                          )
                        : calculatedInternalAverage;

                    // =================================
                    // EXTERNAL
                    // =================================

                    const external =
                      Number(
                        item.externalMarks || 0
                      );

                    // =================================
                    // FINAL
                    // =================================

                    const finalTotal =
                      internalAverage +
                      external;

                    // =================================
                    // PERCENTAGE
                    // =================================

                    const percentage =
                      finalTotal;

                    // =================================
                    // GRADE
                    // =================================

                    const grade =
                      item.grade ||
                      calculateGrade(
                        percentage
                      );

                    // =================================
                    // RESULT
                    // =================================

                    const result =
                      item.result ||
                      (
                        finalTotal >= 40
                          ? "Pass"
                          : "Fail"
                      );

                    return (
                      <tr
                        key={
                          item._id
                        }
                      >

                        <td>
                          {
                            item.student
                              ?.rollNumber ||
                            "-"
                          }
                        </td>

                        <td>
                          {
                            item.student
                              ?.name ||
                            "-"
                          }
                        </td>

                        <td>
                          {
                            item.student
                              ?.department ||
                            "-"
                          }
                        </td>

                        <td>
                          {
                            item.semester ||
                            "-"
                          }
                        </td>

                        <td>
                          {
                            item.subject ||
                            "-"
                          }
                        </td>

                        <td>
                          <span className="badge bg-info text-dark">
                            {internal1Total.toFixed(
                              2
                            )}
                            /30
                          </span>
                        </td>

                        <td>
                          <span className="badge bg-info text-dark">
                            {internal2Total.toFixed(
                              2
                            )}
                            /30
                          </span>
                        </td>

                        <td>
                          <span className="badge bg-primary">
                            {internalAverage.toFixed(
                              2
                            )}
                            /30
                          </span>
                        </td>

                        <td>
                          <span className="badge bg-danger">
                            {external.toFixed(
                              2
                            )}
                            /70
                          </span>
                        </td>

                        <td>
                          <strong>
                            {finalTotal.toFixed(
                              2
                            )}
                            /100
                          </strong>
                        </td>

                        <td>
                          <strong>
                            {percentage.toFixed(
                              2
                            )}
                            %
                          </strong>
                        </td>

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

                        <td>

                          <button
                            type="button"
                            className="btn btn-warning btn-sm me-2"
                            onClick={() =>
                              editExternal(
                                item
                              )
                            }
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() =>
                              deleteExternal(
                                item._id
                              )
                            }
                          >
                            Delete
                          </button>

                        </td>

                      </tr>
                    );
                  }
                )

              ) : (

                <tr>

                  <td
                    colSpan="14"
                    className="text-center"
                  >
                    No External Marks Found
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

export default ExternalMarks;