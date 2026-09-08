import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

function ViewStudent() {
  const { id } = useParams();

  const [student, setStudent] = useState(null);

  useEffect(() => {
    getStudent();
  }, []);

  const getStudent = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/students/${id}`
      );

      setStudent(res.data.student);
    } catch (err) {
      console.log(err);
    }
  };

  if (!student) {
    return <div className="text-center mt-4">Loading...</div>;
  }

  return (
    <div className="container mt-4">
      <div className="card shadow">

        <div className="card-header bg-primary text-white">
          <h3>Student Details</h3>
        </div>

        <div className="card-body">

          {/* Student Photo */}
          {student.photo && (
            <div className="text-center mb-4">
              <img
                src={`http://localhost:5000/uploads/${student.photo}`}
                alt={student.name}
                className="img-thumbnail"
                style={{
                  width: "180px",
                  height: "180px",
                  objectFit: "cover",
                }}
              />
            </div>
          )}

          <h5>
            <b>Roll Number:</b> {student.rollNumber}
          </h5>

          <h5>
            <b>Name:</b> {student.name}
          </h5>

          <h5>
            <b>Email:</b> {student.email}
          </h5>

          <h5>
            <b>Department:</b> {student.department}
          </h5>

          <h5>
            <b>Semester:</b> {student.semester}
          </h5>

          <h5>
            <b>Phone:</b> {student.phone}
          </h5>

          <br />

          <Link
            to="/students"
            className="btn btn-secondary"
          >
            Back
          </Link>

        </div>
      </div>
    </div>
  );
}

export default ViewStudent;