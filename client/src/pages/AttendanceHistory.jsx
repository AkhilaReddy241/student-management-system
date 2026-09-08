import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

function AttendanceHistory() {
  const [attendance, setAttendance] = useState([]);

  const [date, setDate] = useState("");
  const [department, setDepartment] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [studentName, setStudentName] = useState("");

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/attendance"
      );

      setAttendance(res.data.data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load attendance");
    }
  };

  const deleteAttendance = async (id) => {
    if (!window.confirm("Delete this attendance?")) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/attendance/${id}`
      );

      toast.success("Attendance Deleted");

      fetchAttendance();
    } catch (err) {
      console.log(err);
      toast.error("Delete Failed");
    }
  };

  // ==========================
  // Filters
  // ==========================

  const filteredAttendance = attendance.filter((item) => {
    const matchDate =
      date === "" || item.date === date;

    const matchDepartment =
      department === "" ||
      item.student?.department?.toLowerCase() ===
        department.toLowerCase();

    const matchRoll =
      rollNumber === "" ||
      item.student?.rollNumber
        ?.toString()
        .toLowerCase()
        .includes(rollNumber.toLowerCase());

    const matchName =
      studentName === "" ||
      item.student?.name
        ?.toLowerCase()
        .includes(studentName.toLowerCase());

    return (
      matchDate &&
      matchDepartment &&
      matchRoll &&
      matchName
    );
  });

  // ==========================
  // Summary Cards
  // ==========================

  const totalStudents = filteredAttendance.length;

  const presentStudents = filteredAttendance.filter(
    (item) => item.status === "Present"
  ).length;

  const absentStudents = filteredAttendance.filter(
    (item) => item.status === "Absent"
  ).length;

  const attendancePercentage =
    totalStudents === 0
      ? 0
      : ((presentStudents / totalStudents) * 100).toFixed(2);

  // ==========================
  // Department Statistics
  // ==========================

  const departments = [
    "CSE",
    "ECE",
    "EEE",
    "IT",
    "MECH",
  ];

  return (
    <div className="container mt-4">

      <h2 className="text-center mb-4">
        Attendance History
      </h2>

      {/* Buttons */}

      <div className="text-center mb-4">

        <Link
          to="/attendance"
          className="btn btn-primary me-3"
        >
          Mark Attendance
        </Link>

        <Link
          to="/attendance-history"
          className="btn btn-success"
        >
          Attendance History
        </Link>

      </div>
      <div className="text-center mb-4">
  <Link
    to="/monthly-attendance-report"
    className="btn btn-info"
    style={{ marginBottom: "10px" }}
  >
    Monthly Report
  </Link>
</div>

      {/* Filters */}

      <div className="row mb-4">

        <div className="col-md-3">
          <input
            type="date"
            className="form-control"
            value={date}
            onChange={(e) =>
              setDate(e.target.value)
            }
          />
        </div>

        <div className="col-md-3">
          <select
            className="form-select"
            value={department}
            onChange={(e) =>
              setDepartment(e.target.value)
            }
          >
            <option value="">
              All Departments
            </option>

            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
            <option value="EEE">EEE</option>
            <option value="IT">IT</option>
            <option value="MECH">MECH</option>
          </select>
        </div>

        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search Roll Number"
            value={rollNumber}
            onChange={(e) =>
              setRollNumber(e.target.value)
            }
          />
        </div>

        

      </div>

      {/* Summary */}

      <div className="row mb-4">

        <div className="col-md-3">
          <div className="card bg-primary text-white">
            <div className="card-body text-center">
              <h5>Total</h5>
              <h2>{totalStudents}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card bg-success text-white">
            <div className="card-body text-center">
              <h5>Present</h5>
              <h2>{presentStudents}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card bg-danger text-white">
            <div className="card-body text-center">
              <h5>Absent</h5>
              <h2>{absentStudents}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card bg-warning">
            <div className="card-body text-center">
              <h5>Attendance %</h5>
              <h2>{attendancePercentage}%</h2>
            </div>
          </div>
        </div>

      </div>

      {/* Department Statistics */}

      <h4 className="mb-3">
        Department-wise Attendance Statistics
      </h4>

      <table className="table table-bordered mb-5">

        <thead className="table-dark">
          <tr>
            <th>Department</th>
            <th>Total</th>
            <th>Present</th>
            <th>Absent</th>
            <th>Attendance %</th>
          </tr>
        </thead>

        <tbody>

          {departments.map((dept) => {

            const deptStudents =
              filteredAttendance.filter(
                (item) =>
                  item.student?.department === dept
              );

            const total = deptStudents.length;

            const present =
              deptStudents.filter(
                (item) =>
                  item.status === "Present"
              ).length;

            const absent =
              deptStudents.filter(
                (item) =>
                  item.status === "Absent"
              ).length;

            const percent =
              total === 0
                ? 0
                : (
                    (present / total) *
                    100
                  ).toFixed(2);

            return (
              <tr key={dept}>
                <td>{dept}</td>
                <td>{total}</td>
                <td>{present}</td>
                <td>{absent}</td>
                <td>{percent}%</td>
              </tr>
            );
          })}

        </tbody>

      </table>

      {/* Attendance Table */}

      <table className="table table-bordered table-striped">

        <thead className="table-dark">

          <tr>
            <th>Date</th>
            <th>Roll No</th>
            <th>Name</th>
            <th>Department</th>
            <th>Status</th>
            <th>Action</th>
          </tr>

        </thead>

        <tbody>

          {filteredAttendance.length > 0 ? (

            filteredAttendance.map((item) => (

              <tr key={item._id}>

                <td>{item.date}</td>

                <td>{item.student?.rollNumber}</td>

                <td>{item.student?.name}</td>

                <td>{item.student?.department}</td>

                <td>
                  <span
                    className={
                      item.status === "Present"
                        ? "badge bg-success"
                        : "badge bg-danger"
                    }
                  >
                    {item.status}
                  </span>
                </td>

                <td>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() =>
                      deleteAttendance(item._id)
                    }
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))

          ) : (

            <tr>

              <td
                colSpan="6"
                className="text-center"
              >
                No Attendance Found
              </td>

            </tr>

          )}

        </tbody>

      </table>

    </div>
  );
}

export default AttendanceHistory;