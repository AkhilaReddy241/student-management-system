import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function Student() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const studentsPerPage = 5;

  // =====================================================
  // GET ALL STUDENTS
  // =====================================================

  useEffect(() => {
    getStudents();
  }, []);

  const getStudents = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/students"
      );

      console.log("FULL API RESPONSE:", res.data);

      const studentData =
        res.data?.students ||
        res.data?.data ||
        [];

      console.log(
        "STUDENTS FROM API:",
        studentData
      );

      // -----------------------------------------------
      // SORT BY ROLL NUMBER
      // -----------------------------------------------

      const sortedStudents = Array.isArray(studentData)
        ? [...studentData].sort(
            (a, b) =>
              Number(a.rollNumber) -
              Number(b.rollNumber)
          )
        : [];

      console.log(
        "STUDENTS AFTER FRONTEND SORT:",
        sortedStudents.map(
          (student) => student.rollNumber
        )
      );

      setStudents(sortedStudents);
    } catch (err) {
      console.error(
        "GET STUDENTS ERROR:",
        err
      );

      setStudents([]);

      toast.error(
        "Failed to load students"
      );
    }
  };

  // =====================================================
  // DELETE STUDENT
  // =====================================================

  const deleteStudent = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/students/${id}`
      );

      toast.success(
        "Student Deleted Successfully"
      );

      getStudents();
    } catch (err) {
      console.error(
        "DELETE STUDENT ERROR:",
        err
      );

      toast.error("Delete Failed");
    }
  };

  // =====================================================
  // SEARCH + DEPARTMENT FILTER
  // =====================================================

  const filteredStudents = students.filter(
    (student) => {
      const name = String(
        student.name || ""
      );

      const rollNumber = String(
        student.rollNumber ?? ""
      );

      const studentDepartment = String(
        student.department || ""
      );

      const searchText =
        search.toLowerCase();

      const matchSearch =
        name
          .toLowerCase()
          .includes(searchText) ||
        rollNumber
          .toLowerCase()
          .includes(searchText);

      const matchDepartment =
        department === "" ||
        studentDepartment.toUpperCase() ===
          department.toUpperCase();

      return (
        matchSearch &&
        matchDepartment
      );
    }
  );

  // =====================================================
  // SORT FILTERED STUDENTS
  // =====================================================

  const sortedFilteredStudents = [
    ...filteredStudents,
  ].sort(
    (a, b) =>
      Number(a.rollNumber) -
      Number(b.rollNumber)
  );

  // =====================================================
  // PAGINATION
  // =====================================================

  const indexOfLastStudent =
    currentPage * studentsPerPage;

  const indexOfFirstStudent =
    indexOfLastStudent -
    studentsPerPage;

  const currentStudents =
    sortedFilteredStudents.slice(
      indexOfFirstStudent,
      indexOfLastStudent
    );

  const totalPages = Math.ceil(
    sortedFilteredStudents.length /
      studentsPerPage
  );

  // =====================================================
  // RESET PAGE WHEN SEARCH/FILTER CHANGES
  // =====================================================

  useEffect(() => {
    setCurrentPage(1);
  }, [search, department]);

  // =====================================================
  // EXPORT EXCEL
  // =====================================================

  const exportToExcel = () => {
    const data =
      sortedFilteredStudents.map(
        (student) => ({
          RollNumber:
            student.rollNumber,

          Name:
            student.name,

          Email:
            student.email,

          Department:
            student.department,

          Semester:
            student.semester,

          Phone:
            student.phone,
        })
      );

    const worksheet =
      XLSX.utils.json_to_sheet(data);

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Students"
    );

    XLSX.writeFile(
      workbook,
      "Students.xlsx"
    );
  };

  // =====================================================
  // EXPORT PDF
  // =====================================================

  const exportToPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);

    doc.text(
      "Student List",
      14,
      20
    );

    autoTable(doc, {
      startY: 30,

      head: [
        [
          "Roll No",
          "Name",
          "Email",
          "Department",
          "Semester",
        ],
      ],

      body:
        sortedFilteredStudents.map(
          (student) => [
            student.rollNumber,
            student.name,
            student.email,
            student.department,
            student.semester,
          ]
        ),
    });

    doc.save(
      "Students.pdf"
    );
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="container mt-4">

      {/* =================================================
          TITLE
      ================================================= */}

      <h2 className="text-center mb-4">
        Students List
      </h2>

      {/* =================================================
          SEARCH
      ================================================= */}

      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search by Name or Roll Number..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
      />

      {/* =================================================
          DEPARTMENT FILTER
      ================================================= */}

      <select
        className="form-select mb-3"
        value={department}
        onChange={(e) => {
          setDepartment(e.target.value);
        }}
      >
        <option value="">
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

      {/* =================================================
          EXPORT BUTTONS
      ================================================= */}

      <div className="text-center mb-4">

        <button
          className="btn btn-success me-3"
          onClick={exportToExcel}
        >
          Export to Excel
        </button>

        <button
          className="btn btn-danger"
          onClick={exportToPDF}
        >
          Export to PDF
        </button>

      </div>

      {/* =================================================
          STUDENT TABLE
      ================================================= */}

      <table className="table table-bordered table-striped text-center align-middle">

        <thead>
          <tr>
            <th>Photo</th>
            <th>Roll No</th>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Semester</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>

          {currentStudents.length > 0 ? (

            currentStudents.map(
              (student) => (

                <tr
                  key={student._id}
                >

                  {/* PHOTO */}

                  <td>
                    <img
                      src={
                        student.photo
                          ? `http://localhost:5000/uploads/${student.photo}`
                          : "https://via.placeholder.com/60"
                      }
                      alt={
                        student.name
                      }
                      width="60"
                      height="60"
                      style={{
                        borderRadius:
                          "50%",
                        objectFit:
                          "cover",
                      }}
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/60";
                      }}
                    />
                  </td>

                  {/* ROLL NUMBER */}

                  <td>
                    {student.rollNumber}
                  </td>

                  {/* NAME */}

                  <td>
                    {student.name}
                  </td>

                  {/* EMAIL */}

                  <td>
                    {student.email}
                  </td>

                  {/* DEPARTMENT */}

                  <td>
                    {student.department}
                  </td>

                  {/* SEMESTER */}

                  <td>
                    {student.semester}
                  </td>

                  {/* ACTIONS */}

                  <td>

                    <Link
                      to={`/view-student/${student._id}`}
                      className="btn btn-info btn-sm me-2"
                    >
                      View
                    </Link>

                    <Link
                      to={`/edit-student/${student._id}`}
                      className="btn btn-warning btn-sm me-2"
                    >
                      Edit
                    </Link>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() =>
                        deleteStudent(
                          student._id
                        )
                      }
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              )
            )

          ) : (

            <tr>
              <td colSpan="7">
                No Students Found
              </td>
            </tr>

          )}

        </tbody>

      </table>

      {/* =================================================
          PAGINATION
      ================================================= */}

      <div className="d-flex justify-content-center align-items-center mt-3 mb-4">

        <button
          className="btn btn-secondary me-3"
          disabled={
            currentPage === 1
          }
          onClick={() =>
            setCurrentPage(
              currentPage - 1
            )
          }
        >
          Previous
        </button>

        <span>
          Page {currentPage} of{" "}
          {totalPages || 1}
        </span>

        <button
          className="btn btn-secondary ms-3"
          disabled={
            currentPage === totalPages ||
            totalPages === 0
          }
          onClick={() =>
            setCurrentPage(
              currentPage + 1
            )
          }
        >
          Next
        </button>

      </div>

    </div>
  );
}

export default Student;