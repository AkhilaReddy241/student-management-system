import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

function EditStudent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState({
    rollNumber: "",
    name: "",
    email: "",
    department: "",
    semester: "",
    phone: "",
  });

  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get student
  useEffect(() => {
    getStudent();
  }, [id]);

 const getStudent = async () => {
  try {
    const res = await axios.get(
      `http://localhost:5000/api/students/${id}`
    );

    console.log("FULL STUDENT RESPONSE:", res.data);

    const data = res.data.student
  

    console.log("STUDENT DATA:", data);

    if (!data) {
      throw new Error("Student data not found in API response");
    }

    setStudent({
      rollNumber: data.rollNumber || "",
      name: data.name || "",
      email: data.email || "",
      department: data.department || "",
      semester: data.semester || "",
      phone: data.phone || "",
    });

  } catch (err) {
    console.error("Get student error:", err);

    toast.error(
      err.response?.data?.message ||
      "Failed to load student"
    );
  } finally {
    setLoading(false);
  }
};

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setStudent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

        console.log("========== UPDATE ==========");
        console.log("Student ID:", id);
        console.log("Student Data:", student);

        const res = await axios.put(
            `http://localhost:5000/api/students/${id}`,
            student
        );

        console.log("Update Response:", res.data);

        if (res.data.success) {

            toast.success("Student Updated Successfully");

            navigate("/students");

        } else {

            toast.error(
                res.data.message || "Update failed"
            );
        }

    } catch (err) {

        console.error("UPDATE ERROR:", err);

        console.error(
            "SERVER ERROR:",
            err.response?.data
        );

        toast.error(
            err.response?.data?.message ||
            "Update Failed"
        );
    }
};
  return (
    <div className="container mt-4">

      <div className="card shadow">

        <div className="card-header bg-primary text-white">
          <h3 className="mb-0">✏ Edit Student</h3>
        </div>

        <div className="card-body">

          <form onSubmit={handleSubmit}>

            {/* Roll Number */}
            <label className="form-label">
              Roll Number
            </label>

            <input
              type="text"
              className="form-control mb-3"
              name="rollNumber"
              value={student.rollNumber}
              onChange={handleChange}
            />

            {/* Name */}
            <label className="form-label">
              Name
            </label>

            <input
              type="text"
              className="form-control mb-3"
              name="name"
              value={student.name}
              onChange={handleChange}
            />

            {/* Email */}
            <label className="form-label">
              Email
            </label>

            <input
              type="email"
              className="form-control mb-3"
              name="email"
              value={student.email}
              onChange={handleChange}
            />

            {/* Department */}
            <label className="form-label">
              Department
            </label>

            <select
              className="form-select mb-3"
              name="department"
              value={student.department}
              onChange={handleChange}
            >
              <option value="">Select Department</option>
              <option value="CSE">CSE</option>
              <option value="ECE">ECE</option>
              <option value="EEE">EEE</option>
              <option value="IT">IT</option>
              <option value="MECH">MECH</option>
            </select>

            {/* Semester */}
            <label className="form-label">
              Semester
            </label>

            <select
              className="form-select mb-3"
              name="semester"
              value={student.semester}
              onChange={handleChange}
            >
              <option value="">Select Semester</option>

              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <option key={sem} value={sem}>
                  Semester {sem}
                </option>
              ))}
            </select>

            {/* Phone */}
            <label className="form-label">
              Phone
            </label>

            <input
              type="text"
              className="form-control mb-3"
              name="phone"
              value={student.phone}
              onChange={handleChange}
            />

            {/* Photo */}
            <label className="form-label">
              Student Photo
            </label>

            <input
              type="file"
              className="form-control mb-4"
              accept="image/*"
              onChange={(e) => {
                setPhoto(e.target.files[0]);
              }}
            />

            <button
              type="submit"
              className="btn btn-success me-2"
            >
              Update Student
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/students")}
            >
              Cancel
            </button>

          </form>

        </div>
      </div>

    </div>
  );
}

export default EditStudent;