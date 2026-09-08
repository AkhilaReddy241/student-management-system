import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

// =====================================================
// API BASE URL
// =====================================================

const API = "http://localhost:5000/api";

function Attendance() {
  // =====================================================
  // STATES
  // =====================================================

  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [department, setDepartment] = useState("");
  const [semester, setSemester] = useState("");
  const [subject, setSubject] = useState("");
  const [faculty, setFaculty] = useState("");
  const [date, setDate] = useState("");

  const [availableSemesters, setAvailableSemesters] =
    useState([]);

  const [attendanceStatus, setAttendanceStatus] =
    useState({});

  const [attendanceExists, setAttendanceExists] =
    useState(false);

  const [showAttendanceForm, setShowAttendanceForm] =
    useState(false);

  const [saving, setSaving] = useState(false);

  // =====================================================
  // LOAD SUBJECTS WHEN PAGE LOADS
  // =====================================================

  useEffect(() => {
    getSubjects();
  }, []);

  // =====================================================
  // GET SUBJECTS
  // =====================================================

  const getSubjects = async () => {
    try {
      const res = await axios.get(`${API}/subjects`);

      console.log(
        "================================="
      );
      console.log("SUBJECTS API RESPONSE:");
      console.log(res.data);
      console.log(
        "================================="
      );

      // Support different backend response formats
      const subjectData =
        res.data?.subjects ||
        res.data?.data ||
        [];

      if (Array.isArray(subjectData)) {
        setSubjects(subjectData);
      } else {
        setSubjects([]);
      }

    } catch (error) {
      console.error(
        "SUBJECTS ERROR:",
        error.response?.data ||
          error.message
      );

      toast.error(
        "Failed to load subjects"
      );
    }
  };

  // =====================================================
  // DEPARTMENT CHANGE
  // =====================================================

  const handleDepartmentChange = async (e) => {
    const selectedDepartment =
      e.target.value;

    console.log(
      "Selected Department:",
      selectedDepartment
    );

    // Update department
    setDepartment(
      selectedDepartment
    );

    // Reset dependent fields
    setSemester("");
    setSubject("");
    setStudents([]);
    setAttendanceStatus({});
    setAttendanceExists(false);
    setShowAttendanceForm(false);
    setAvailableSemesters([]);

    // If department is empty
    if (!selectedDepartment) {
      return;
    }

    try {
      // ================================================
      // GET ALL STUDENTS
      // ================================================

      const res = await axios.get(
        `${API}/students`
      );

      console.log(
        "================================="
      );
      console.log(
        "STUDENTS API RESPONSE:"
      );
      console.log(res.data);
      console.log(
        "================================="
      );

      // IMPORTANT:
      // Current backend returns:
      //
      // {
      //   count: 3,
      //   students: [...]
      // }
      //
      // Therefore use res.data.students

      const allStudents =
        res.data?.students ||
        res.data?.data ||
        [];

      console.log(
        "ALL STUDENTS:",
        allStudents
      );

      // Make sure response is an array
      if (!Array.isArray(allStudents)) {
        console.error(
          "Students data is not an array:",
          allStudents
        );

        toast.error(
          "Invalid students response from server"
        );

        return;
      }

      // ================================================
      // FILTER BY DEPARTMENT
      // ================================================

      const departmentStudents =
        allStudents.filter(
          (student) => {
            const studentDepartment =
              student.department
                ?.trim()
                .toUpperCase();

            const selectedDept =
              selectedDepartment
                .trim()
                .toUpperCase();

            return (
              studentDepartment ===
              selectedDept
            );
          }
        );

      console.log(
        "DEPARTMENT STUDENTS:",
        departmentStudents
      );

      // ================================================
      // GET AVAILABLE SEMESTERS
      // ================================================

      const semesters = [
        ...new Set(
          departmentStudents
            .map((student) =>
              Number(student.semester)
            )
            .filter(
              (sem) =>
                Number.isFinite(sem)
            )
        ),
      ].sort(
        (a, b) => a - b
      );

      console.log(
        "AVAILABLE SEMESTERS:",
        semesters
      );

      setAvailableSemesters(
        semesters
      );

      // ================================================
      // NO STUDENTS
      // ================================================

      if (departmentStudents.length === 0) {
        toast.warning(
          `No students found in ${selectedDepartment}`
        );

        return;
      }

    } catch (error) {
      console.error(
        "DEPARTMENT ERROR:",
        error.response?.data ||
          error.message
      );

      toast.error(
        error.response?.data
          ?.message ||
          "Failed to load students"
      );
    }
  };

  // =====================================================
  // SEMESTER CHANGE
  // =====================================================

  const handleSemesterChange = (e) => {
    const selectedSemester =
      e.target.value;

    console.log(
      "Selected Semester:",
      selectedSemester
    );

    setSemester(
      selectedSemester
    );

    setStudents([]);
    setAttendanceStatus({});
    setAttendanceExists(false);
    setShowAttendanceForm(false);
  };

  // =====================================================
  // SUBJECT CHANGE
  // =====================================================

  const handleSubjectChange = (e) => {
    const selectedSubject =
      e.target.value;

    console.log(
      "Selected Subject:",
      selectedSubject
    );

    setSubject(
      selectedSubject
    );

    setStudents([]);
    setAttendanceStatus({});
    setAttendanceExists(false);
    setShowAttendanceForm(false);
  };

  // =====================================================
  // FACULTY CHANGE
  // =====================================================

  const handleFacultyChange = (e) => {
    setFaculty(
      e.target.value
    );

    setShowAttendanceForm(false);
  };

  // =====================================================
  // DATE CHANGE
  // =====================================================

  const handleDateChange = (e) => {
    setDate(
      e.target.value
    );

    setStudents([]);
    setAttendanceStatus({});
    setAttendanceExists(false);
    setShowAttendanceForm(false);
  };

  // =====================================================
  // GET STUDENTS
  // =====================================================

  const getStudents = async () => {
    try {
      console.log(
        "================================="
      );
      console.log(
        "GETTING STUDENTS..."
      );
      console.log(
        "Department:",
        department
      );
      console.log(
        "Semester:",
        semester
      );
      console.log(
        "================================="
      );

      // ================================================
      // GET STUDENTS
      // ================================================

      const res = await axios.get(
        `${API}/students`
      );

      console.log(
        "STUDENTS API RESPONSE:",
        res.data
      );

      // Current backend response:
      //
      // {
      //    count: 3,
      //    students: [...]
      // }

      const allStudents =
        res.data?.students ||
        res.data?.data ||
        [];

      console.log(
        "ALL STUDENTS:",
        allStudents
      );

      if (!Array.isArray(allStudents)) {
        console.error(
          "Invalid student array:",
          allStudents
        );

        toast.error(
          "Invalid students data"
        );

        return;
      }

      // ================================================
      // FILTER STUDENTS
      // ================================================

      const filtered =
        allStudents.filter(
          (student) => {
            const studentDepartment =
              student.department
                ?.trim()
                .toUpperCase();

            const selectedDepartment =
              department
                .trim()
                .toUpperCase();

            const studentSemester =
              Number(
                student.semester
              );

            const selectedSemester =
              Number(semester);

            return (
              studentDepartment ===
                selectedDepartment &&
              studentSemester ===
                selectedSemester
            );
          }
        );

      console.log(
        "================================="
      );

      console.log(
        "FILTERED STUDENTS:"
      );

      console.log(
        filtered
      );

      console.log(
        "FILTERED STUDENT COUNT:",
        filtered.length
      );

      console.log(
        "================================="
      );

      // ================================================
      // NO STUDENTS FOUND
      // ================================================

      if (filtered.length === 0) {
        setStudents([]);
        setAttendanceStatus({});
        setShowAttendanceForm(false);

        toast.warning(
          `No students found for ${department} - Semester ${semester}`
        );

        return;
      }

      // ================================================
      // SET STUDENTS
      // ================================================

      setStudents(
        filtered
      );

      // ================================================
      // DEFAULT STATUS = PRESENT
      // ================================================

      const status = {};

      filtered.forEach(
        (student) => {
          status[student._id] =
            "Present";
        }
      );

      setAttendanceStatus(
        status
      );

      // ================================================
      // SHOW ATTENDANCE FORM
      // ================================================

      setShowAttendanceForm(
        true
      );

    } catch (error) {
      console.error(
        "GET STUDENTS ERROR:",
        error.response?.data ||
          error.message
      );

      toast.error(
        error.response?.data
          ?.message ||
          "Failed to load students"
      );
    }
  };

  // =====================================================
  // CHECK ATTENDANCE
  // =====================================================

  const checkAttendance = async () => {
    try {
      console.log(
        "Checking attendance..."
      );

      const res = await axios.get(
        `${API}/attendance/check`,
        {
          params: {
            date: date,

            department:
              department,

            semester:
              Number(semester),

            subject:
              subject,
          },
        }
      );

      console.log(
        "ATTENDANCE CHECK RESPONSE:",
        res.data
      );

      // ================================================
      // ATTENDANCE ALREADY EXISTS
      // ================================================

      if (res.data?.exists) {
        setAttendanceExists(
          true
        );

        toast.warning(
          "Attendance already marked for this department, semester, subject and date."
        );

        return true;
      }

      // ================================================
      // ATTENDANCE DOES NOT EXIST
      // ================================================

      setAttendanceExists(
        false
      );

      return false;

    } catch (error) {
      console.error(
        "ATTENDANCE CHECK ERROR:",
        error.response?.data ||
          error.message
      );

      toast.error(
        error.response?.data
          ?.message ||
          "Failed to check attendance"
      );

      return false;
    }
  };

  // =====================================================
  // LOAD STUDENTS BUTTON
  // =====================================================

  const loadStudents = async () => {

    // ================================================
    // VALIDATION
    // ================================================

    if (!department) {
      toast.error(
        "Please select Department"
      );

      return;
    }

    if (!semester) {
      toast.error(
        "Please select Semester"
      );

      return;
    }

    if (!subject) {
      toast.error(
        "Please select Subject"
      );

      return;
    }

    if (!faculty.trim()) {
      toast.error(
        "Please enter Faculty Name"
      );

      return;
    }

    if (!date) {
      toast.error(
        "Please select Date"
      );

      return;
    }

    // ================================================
    // CHECK EXISTING ATTENDANCE
    // ================================================

    const alreadyMarked =
      await checkAttendance();

    if (alreadyMarked) {
      setShowAttendanceForm(
        false
      );

      return;
    }

    // ================================================
    // LOAD STUDENTS
    // ================================================

    await getStudents();
  };

  // =====================================================
  // STATUS CHANGE
  // =====================================================

  const handleStatusChange = (
    studentId,
    value
  ) => {
    console.log(
      "Status changed:",
      studentId,
      value
    );

    setAttendanceStatus(
      (prev) => ({
        ...prev,
        [studentId]:
          value,
      })
    );
  };

  // =====================================================
  // SAVE ATTENDANCE
  // =====================================================

  const saveAttendance = async () => {

    // ================================================
    // VALIDATION
    // ================================================

    if (students.length === 0) {
      toast.error(
        "No students to save"
      );

      return;
    }

    setSaving(true);

    let saved = 0;

    try {

      // ==============================================
      // SAVE EACH STUDENT
      // ==============================================

      for (const student of students) {

        try {

          const payload = {

            // Student MongoDB _id
            student:
              student._id,

            // Department
            department:
              department,

            // Semester
            semester:
              Number(semester),

            // Subject MongoDB _id
            subject:
              subject,

            // Faculty name
            faculty:
              faculty.trim(),

            // Attendance date
            date:
              date,

            // Present / Absent
            status:
              attendanceStatus[
                student._id
              ] ||
              "Present",
          };

          console.log(
            "================================="
          );

          console.log(
            "SENDING ATTENDANCE:"
          );

          console.log(
            payload
          );

          console.log(
            "================================="
          );

          // ==========================================
          // POST ATTENDANCE
          // ==========================================

          const response =
            await axios.post(
              `${API}/attendance`,
              payload
            );

          console.log(
            "ATTENDANCE SAVED:",
            response.data
          );

          saved++;

        } catch (error) {

          console.error(
            `FAILED FOR STUDENT ${student._id}:`,
            error.response?.data ||
              error.message
          );

          const backendMessage =
            error.response?.data
              ?.message;

          toast.error(
            `${student.name}: ${
              backendMessage ||
              "Failed to save attendance"
            }`
          );
        }
      }

      // ==============================================
      // RESULT
      // ==============================================

      if (
        saved ===
        students.length
      ) {

        toast.success(
          `${saved} attendance records saved successfully.`
        );

        setShowAttendanceForm(
          false
        );

        setAttendanceExists(
          true
        );

      } else if (
        saved > 0
      ) {

        toast.warning(
          `${saved} out of ${students.length} attendance records saved.`
        );

      } else {

        toast.error(
          "No attendance records were saved."
        );
      }

    } finally {

      setSaving(false);

    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="container mt-4">

      {/* =================================================
          PAGE TITLE
      ================================================= */}

      <h2 className="text-center mb-4">
        Attendance Management
      </h2>

      {/* =================================================
          SELECTION CARD
      ================================================= */}

      <div className="card shadow p-4 mb-4">

        <div className="row">

          {/* ============================================
              DEPARTMENT
          ============================================ */}

          <div className="col-md-3 mb-3">

            <label className="form-label">
              Department
            </label>

            <select
              className="form-select"
              value={department}
              onChange={
                handleDepartmentChange
              }
            >

              <option value="">
                Select Department
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

          {/* ============================================
              SEMESTER
          ============================================ */}

          <div className="col-md-2 mb-3">

            <label className="form-label">
              Semester
            </label>

            <select
              className="form-select"
              value={semester}
              onChange={
                handleSemesterChange
              }
              disabled={
                !department ||
                availableSemesters.length ===
                  0
              }
            >

              <option value="">
                Select Semester
              </option>

              {availableSemesters.map(
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

          {/* ============================================
              SUBJECT
          ============================================ */}

          <div className="col-md-3 mb-3">

            <label className="form-label">
              Subject
            </label>

            <select
              className="form-select"
              value={subject}
              onChange={
                handleSubjectChange
              }
            >

              <option value="">
                Select Subject
              </option>

              {subjects.map(
                (sub) => (

                  <option
                    key={sub._id}
                    value={sub._id}
                  >
                    {sub.subjectName}
                  </option>

                )
              )}

            </select>

          </div>

          {/* ============================================
              FACULTY
          ============================================ */}

          <div className="col-md-2 mb-3">

            <label className="form-label">
              Faculty
            </label>

            <input
              type="text"
              className="form-control"
              value={faculty}
              onChange={
                handleFacultyChange
              }
              placeholder="Faculty Name"
            />

          </div>

          {/* ============================================
              DATE
          ============================================ */}

          <div className="col-md-2 mb-3">

            <label className="form-label">
              Date
            </label>

            <input
              type="date"
              className="form-control"
              value={date}
              onChange={
                handleDateChange
              }
            />

          </div>

        </div>

        {/* =================================================
            BUTTONS
        ================================================= */}

        <div className="text-center">

          <button
            className="btn btn-primary"
            onClick={
              loadStudents
            }
          >
            Load Students
          </button>

          <Link
            to="/attendance-history"
            className="btn btn-success ms-3"
          >
            Attendance History
          </Link>

        </div>

      </div>

      {/* =================================================
          ATTENDANCE FORM
      ================================================= */}

      {showAttendanceForm &&
        !attendanceExists && (

          <div className="card shadow p-4">

            {/* ==========================================
                HEADER
            ========================================== */}

            <h4 className="mb-4 text-center">
              Student Attendance
            </h4>

            {/* ==========================================
                ATTENDANCE INFORMATION
            ========================================== */}

            <p className="text-center">

              <strong>
                Department:
              </strong>{" "}
              {department}

              {" | "}

              <strong>
                Semester:
              </strong>{" "}
              {semester}

              {" | "}

              <strong>
                Subject:
              </strong>{" "}
              {
                subjects.find(
                  (sub) =>
                    sub._id ===
                    subject
                )?.subjectName
              }

              {" | "}

              <strong>
                Faculty:
              </strong>{" "}
              {faculty}

              {" | "}

              <strong>
                Date:
              </strong>{" "}
              {date}

            </p>

            {/* ==========================================
                STUDENT TABLE
            ========================================== */}

            <div className="table-responsive">

              <table className="table table-bordered table-striped">

                <thead className="table-dark">

                  <tr>

                    <th>
                      Roll Number
                    </th>

                    <th>
                      Name
                    </th>

                    <th>
                      Department
                    </th>

                    <th>
                      Semester
                    </th>

                    <th>
                      Status
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {students.length > 0 ? (

                    students.map(
                      (student) => (

                        <tr
                          key={
                            student._id
                          }
                        >

                          {/* ROLL NUMBER */}

                          <td>
                            {
                              student.rollNumber
                            }
                          </td>

                          {/* NAME */}

                          <td>
                            {
                              student.name
                            }
                          </td>

                          {/* DEPARTMENT */}

                          <td>
                            {
                              student.department
                            }
                          </td>

                          {/* SEMESTER */}

                          <td>
                            {
                              student.semester
                            }
                          </td>

                          {/* STATUS */}

                          <td>

                            <select
                              className="form-select"
                              value={
                                attendanceStatus[
                                  student._id
                                ] ||
                                "Present"
                              }
                              onChange={(
                                e
                              ) =>
                                handleStatusChange(
                                  student._id,
                                  e.target.value
                                )
                              }
                            >

                              <option value="Present">
                                Present
                              </option>

                              <option value="Absent">
                                Absent
                              </option>

                            </select>

                          </td>

                        </tr>

                      )
                    )

                  ) : (

                    <tr>

                      <td
                        colSpan="5"
                        className="text-center"
                      >
                        No Students Found
                      </td>

                    </tr>

                  )}

                </tbody>

              </table>

            </div>

            {/* ==========================================
                SAVE ATTENDANCE
            ========================================== */}

            {students.length > 0 && (

              <div className="text-center mt-4">

                <button
                  className="btn btn-success btn-lg"
                  onClick={
                    saveAttendance
                  }
                  disabled={saving}
                >

                  {saving
                    ? "Saving..."
                    : "Save Attendance"}

                </button>

              </div>

            )}

          </div>

        )}

      {/* =================================================
          ATTENDANCE ALREADY MARKED
      ================================================= */}

      {attendanceExists && (

        <div className="alert alert-warning text-center">

          <h5>
            Attendance has already
            been marked for this
            department, semester,
            subject and date.
          </h5>

          <Link
            to="/attendance-history"
            className="btn btn-success mt-3"
          >
            View Attendance History
          </Link>

        </div>

      )}

    </div>
  );
}

export default Attendance;