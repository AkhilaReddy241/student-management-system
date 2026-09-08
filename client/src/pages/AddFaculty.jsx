import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function AddFaculty() {
  const [faculty, setFaculty] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");

  const [formData, setFormData] = useState({
    facultyId: "",
    name: "",
    department: "",
    designation: "",
    qualification: "",
    experience: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    getFaculty();
  }, []);

  const getFaculty = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/faculty");
      setFaculty(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const saveFaculty = async () => {
    try {
      if (editingId) {
        await axios.put(
          `http://localhost:5000/api/faculty/${editingId}`,
          formData
        );
        toast.success("Faculty Updated Successfully");
      } else {
        await axios.post(
          "http://localhost:5000/api/faculty",
          formData
        );
        toast.success("Faculty Added Successfully");
      }

      setEditingId(null);

      setFormData({
        facultyId: "",
        name: "",
        department: "",
        designation: "",
        qualification: "",
        experience: "",
        email: "",
        phone: "",
      });

      getFaculty();
    } catch (err) {
      console.log(err);
      toast.error("Operation Failed");
    }
  };

  const editFaculty = (item) => {
    setEditingId(item._id);

    setFormData({
      facultyId: item.facultyId,
      name: item.name,
      department: item.department,
      designation: item.designation,
      qualification: item.qualification,
      experience: item.experience,
      email: item.email,
      phone: item.phone,
    });
  };

  const deleteFaculty = async (id) => {
    if (!window.confirm("Delete Faculty?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/faculty/${id}`);
      toast.success("Faculty Deleted");
      getFaculty();
    } catch (err) {
      toast.error("Delete Failed");
    }
  };

  const filteredFaculty = faculty.filter((item) => {
    const matchSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.facultyId.toLowerCase().includes(search.toLowerCase());

    const matchDepartment =
      departmentFilter === "" ||
      item.department === departmentFilter;

    return matchSearch && matchDepartment;
  });

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Faculty Management</h2>

      <div className="card p-4 mb-4">
        <div className="row">

          <div className="col-md-3 mb-3">
            <label>Faculty ID</label>
            <input
              className="form-control"
              name="facultyId"
              value={formData.facultyId}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-3 mb-3">
            <label>Name</label>
            <input
              className="form-control"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-3 mb-3">
            <label>Department</label>
            <select
              className="form-select"
              name="department"
              value={formData.department}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option>CSE</option>
              <option>ECE</option>
              <option>EEE</option>
              <option>IT</option>
              <option>MECH</option>
            </select>
          </div>

          <div className="col-md-3 mb-3">
            <label>Designation</label>
            <input
              className="form-control"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-3 mb-3">
            <label>Qualification</label>
            <input
              className="form-control"
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-3 mb-3">
            <label>Experience</label>
            <input
              type="number"
              className="form-control"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-3 mb-3">
            <label>Email</label>
            <input
              className="form-control"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-3 mb-3">
            <label>Phone</label>
            <input
              className="form-control"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="col-12 text-center mt-3">
            <button
              className={`btn ${
                editingId ? "btn-warning" : "btn-primary"
              }`}
              onClick={saveFaculty}
            >
              {editingId ? "Update Faculty" : "Add Faculty"}
            </button>
          </div>

        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-6">
          <input
            className="form-control"
            placeholder="Search Faculty"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="col-md-6">
          <select
            className="form-select"
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
          >
            <option value="">All Departments</option>
            <option>CSE</option>
            <option>ECE</option>
            <option>EEE</option>
            <option>IT</option>
            <option>MECH</option>
          </select>
        </div>
      </div>

      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Department</th>
            <th>Designation</th>
            <th>Qualification</th>
            <th>Experience</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredFaculty.length > 0 ? (
            filteredFaculty.map((item) => (
              <tr key={item._id}>
                <td>{item.facultyId}</td>
                <td>{item.name}</td>
                <td>{item.department}</td>
                <td>{item.designation}</td>
                <td>{item.qualification}</td>
                <td>{item.experience} Years</td>
                <td>{item.email}</td>
                <td>{item.phone}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => editFaculty(item)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteFaculty(item._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="text-center">
                No Faculty Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AddFaculty;