import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function AddStudent() {
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

  const handleChange = (e) => {
    setStudent({
      ...student,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !student.rollNumber ||
      !student.name ||
      !student.email ||
      !student.department ||
      !student.semester ||
      !student.phone
    ) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("rollNumber", student.rollNumber);
      formData.append("name", student.name);
      formData.append("email", student.email);
      formData.append("department", student.department);

      // IMPORTANT: semester instead of year
      formData.append("semester", student.semester);

      formData.append("phone", student.phone);

      if (photo) {
        formData.append("photo", photo);
      }

      await axios.post(
        "http://localhost:5000/api/students",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Student Added Successfully");

      navigate("/students");
    } catch (err) {
      console.log(err);
      toast.error("Error Adding Student");
    }
  };

  return (
    <div className="container mt-4">

      <h2 className="text-center mb-4">
        Add Student
      </h2>

      <div className="card shadow p-4">

        <form onSubmit={handleSubmit}>

          {/* Roll Number */}
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Roll Number"
            name="rollNumber"
            value={student.rollNumber}
            onChange={handleChange}
          />

          {/* Name */}
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Name"
            name="name"
            value={student.name}
            onChange={handleChange}
          />

          {/* Email */}
          <input
            type="email"
            className="form-control mb-3"
            placeholder="Email"
            name="email"
            value={student.email}
            onChange={handleChange}
          />

          {/* Department */}
          <select
            className="form-select mb-3"
            name="department"
            value={student.department}
            onChange={handleChange}
          >
            <option value="">
              Select Department
            </option>

            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
            <option value="EEE">EEE</option>
            <option value="IT">IT</option>
            <option value="MECH">MECH</option>
          </select>

          {/* Semester */}
          <select
            className="form-select mb-3"
            name="semester"
            value={student.semester}
            onChange={handleChange}
          >
            <option value="">
              Select Semester
            </option>

            {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
              <option
                key={sem}
                value={sem}
              >
                Semester {sem}
              </option>
            ))}
          </select>

          {/* Phone */}
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Phone"
            name="phone"
            value={student.phone}
            onChange={handleChange}
          />

          {/* Photo */}
          <div className="mb-3">

            <label className="form-label">
              Student Photo
            </label>

            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={(e) =>
                setPhoto(e.target.files[0])
              }
            />

          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary"
          >
            Save Student
          </button>

        </form>

      </div>

    </div>
  );
}

export default AddStudent;