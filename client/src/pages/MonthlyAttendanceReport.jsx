import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function MonthlyAttendanceReport() {
  const [report, setReport] = useState([]);

  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [department, setDepartment] = useState("");
  const [rollNumber, setRollNumber] = useState("");

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/attendance/monthly-report",
        {
          params: {
            month,
            year,
            department,
            rollNumber,
          },
        }
      );

      setReport(res.data.data);

    } catch (err) {
      console.log(err);
    }
  };



  const exportToExcel = () => {
  const worksheet = XLSX.utils.json_to_sheet(report);

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Monthly Attendance"
  );

  XLSX.writeFile(
    workbook,
    "Monthly_Attendance_Report.xlsx"
  );
};


const exportToPDF = () => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Monthly Attendance Report", 14, 20);

  autoTable(doc, {
    startY: 30,
    head: [[
      "Roll No",
      "Name",
      "Department",
      "Working Days",
      "Present",
      "Absent",
      "Attendance %"
    ]],
    body: report.map((student) => [
      student.rollNumber,
      student.name,
      student.department,
      student.totalDays,
      student.present,
      student.absent,
      student.attendancePercentage + "%"
    ]),
  });

  doc.save("Monthly_Attendance_Report.pdf");
};

// Summary Statistics
const totalStudents = report.length;

const totalPresent = report.reduce(
  (sum, student) => sum + student.present,
  0
);

const totalAbsent = report.reduce(
  (sum, student) => sum + student.absent,
  0
);

const averageAttendance =
  totalStudents > 0
    ? (
        report.reduce(
          (sum, student) =>
            sum + student.attendancePercentage,
          0
        ) / totalStudents
      ).toFixed(2)
    : 0;

const highestAttendance =
  report.length > 0
    ? Math.max(
        ...report.map(
          (student) => student.attendancePercentage
        )
      )
    : 0;

const lowestAttendance =
  report.length > 0
    ? Math.min(
        ...report.map(
          (student) => student.attendancePercentage
        )
      )
    : 0;


    const lowAttendanceStudents = report.filter(
  (student) => Number(student.attendancePercentage) < 75
);


  return (
    <div className="container mt-4">

      <h2 className="text-center mb-4">
        Monthly Attendance Report
      </h2>

      <div className="row text-center mb-4">

  <div className="col-md-2">
    <div className="card bg-primary text-white">
      <div className="card-body">
        <h6>Total Students</h6>
        <h3>{totalStudents}</h3>
      </div>
    </div>
  </div>

  <div className="col-md-2">
    <div className="card bg-success text-white">
      <div className="card-body">
        <h6>Total Present</h6>
        <h3>{totalPresent}</h3>
      </div>
    </div>
  </div>

  <div className="col-md-2">
    <div className="card bg-danger text-white">
      <div className="card-body">
        <h6>Total Absent</h6>
        <h3>{totalAbsent}</h3>
      </div>
    </div>
  </div>

  <div className="col-md-2">
    <div className="card bg-warning text-dark">
      <div className="card-body">
        <h6>Average %</h6>
        <h3>{averageAttendance}%</h3>
      </div>
    </div>
  </div>

  <div className="col-md-2">
    <div className="card bg-info text-white">
      <div className="card-body">
        <h6>Highest %</h6>
        <h3>{highestAttendance}%</h3>
      </div>
    </div>
  </div>

  <div className="col-md-2">
    <div className="card bg-secondary text-white">
      <div className="card-body">
        <h6>Lowest %</h6>
        <h3>{lowestAttendance}%</h3>
      </div>
    </div>
  </div>

</div>

      <div className="text-center mb-4">

        <Link
          to="/attendance-history"
          className="btn btn-secondary me-3"
        >
          Attendance History
        </Link>

        <button
          className="btn btn-primary"
          onClick={fetchReport}
        >
          Search
        </button>

      </div>

      <div className="row mb-4">

        <div className="col-md-3">

          <label>Month</label>

          <select
            className="form-select"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          >
            <option value="">All</option>

            {[...Array(12)].map((_, index) => (
              <option
                key={index + 1}
                value={index + 1}
              >
                {index + 1}
              </option>
            ))}

          </select>

        </div>

        <div className="col-md-2">

          <label>Year</label>

          <input
            type="number"
            className="form-control"
            placeholder="2026"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />

        </div>

        <div className="col-md-3">

          <label>Department</label>

          <select
            className="form-select"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          >
            <option value="">All</option>
            <option>CSE</option>
            <option>ECE</option>
            <option>EEE</option>
            <option>IT</option>
            <option>MECH</option>
          </select>

        </div>

        <div className="col-md-4">

          <label>Roll Number</label>

          <input
            type="text"
            className="form-control"
            placeholder="Search Roll Number"
            value={rollNumber}
            onChange={(e) => setRollNumber(e.target.value)}
          />

        </div>

<div className="text-center mt-4 mb-4">
  <button
    className="btn btn-success me-2"
    onClick={exportToExcel}
  >
    Export Excel
  </button>

  <button
    className="btn btn-danger"
    onClick={exportToPDF}
  >
    Export PDF
  </button>
</div>

      </div>
    


    <h4 className="text-danger mt-5 mb-3">
  Students Below 75% Attendance
</h4>

<table className="table table-bordered table-striped mb-5">
  <thead className="table-dark">
    <tr>
      <th>Roll No</th>
      <th>Name</th>
      <th>Department</th>
      <th>Attendance %</th>
      <th>Status</th>
    </tr>
  </thead>

  <tbody>
    {lowAttendanceStudents.length > 0 ? (
      lowAttendanceStudents.map((student, index) => (
        <tr key={index}>
          <td>{student.rollNumber}</td>
          <td>{student.name}</td>
          <td>{student.department}</td>
          <td>{student.attendancePercentage}%</td>
          <td>
            <span className="badge bg-danger">
              Below 75%
            </span>
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan="5" className="text-center">
          🎉 No students have attendance below 75%.
        </td>
      </tr>
    )}
  </tbody>
</table>



      <table className="table table-bordered table-striped">

        <thead className="table-dark">

          <tr>

            <th>Roll No</th>

            <th>Name</th>

            <th>Department</th>

            <th>Total Days</th>

            <th>Present</th>

            <th>Absent</th>

            <th>Attendance %</th>

          </tr>

        </thead>

        <tbody>

          {report.length > 0 ? (

            report.map((student, index) => (

              <tr key={index}>

                <td>{student.rollNumber}</td>

                <td>{student.name}</td>

                <td>{student.department}</td>

                <td>{student.totalDays}</td>

                <td>{student.present}</td>

                <td>{student.absent}</td>

                <td>{student.attendancePercentage}%</td>

              </tr>

            ))

          ) : (

            <tr>

              <td
                colSpan="7"
                className="text-center"
              >
                No Records Found
              </td>

            </tr>

          )}

        </tbody>

      </table>

    </div>
  );
}

export default MonthlyAttendanceReport;