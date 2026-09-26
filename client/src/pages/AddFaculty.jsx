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
    password: "",
  });

  useEffect(() => {
    getFaculty();
  }, []);

  // Get all faculty
  const getFaculty = async () => {
    try {
      const res = await axios.get(
        "https://student-management-system-ult0.onrender.com/api/faculty"
      );

      setFaculty(res.data.data || []);
    } catch (err) {
      console.log("GET FACULTY ERROR:", err);
      toast.error("Failed to load faculty");
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Add / Update faculty
  const saveFaculty = async () => {
    // Validate required fields
    if (
      !formData.facultyId ||
      !formData.name ||
      !formData.department ||
      !formData.email
    ) {
      toast.error(
        "Faculty ID, Name, Department and Email are required"
      );
      return;
    }

    // Password required only when adding
    if (!editingId && !formData.password) {
      toast.error("Password is required");
      return;
    }

    try {
      if (editingId) {
        // Update faculty
        await axios.put(
          `https://student-management-system-ult0.onrender.com/api/faculty/${editingId}`,
          formData
        );

        toast.success("Faculty Updated Successfully");
      } else {
        // Add faculty
        await axios.post(
          "https://student-management-system-ult0.onrender.com/api/faculty",
          formData
        );

        toast.success("Faculty Added Successfully");
      }

      // Reset edit mode
      setEditingId(null);

      // Reset form
      setFormData({
        facultyId: "",
        name: "",
        department: "",
        designation: "",
        qualification: "",
        experience: "",
        email: "",
        phone: "",
        password: "",
      });

      // Reload faculty
      getFaculty();
    } catch (err) {
      console.log("FACULTY SAVE ERROR:", err);

      const message =
        err.response?.data?.message ||
        "Operation Failed";

      toast.error(message);
    }
  };

  // Edit faculty
  const editFaculty = (item) => {
    setEditingId(item._id);

    setFormData({
      facultyId: item.facultyId || "",
      name: item.name || "",
      department: item.department || "",
      designation: item.designation || "",
      qualification: item.qualification || "",
      experience: item.experience || "",
      email: item.email || "",
      phone: item.phone || "",
      password: "",
    });
  };

  // Delete faculty
  const deleteFaculty = async (id) => {
    if (!window.confirm("Delete Faculty?")) {
      return;
    }

    try {
      await axios.delete(
        `https://student-management-system-ult0.onrender.com/api/faculty/${id}`
      );

      toast.success("Faculty Deleted");

      getFaculty();
    } catch (err) {
      console.log("DELETE FACULTY ERROR:", err);

      const message =
        err.response?.data?.message ||
        "Delete Failed";

      toast.error(message);
    }
  };

  // Filter faculty
  const filteredFaculty = faculty.filter((item) => {
    const name = item.name || "";
    const facultyId = item.facultyId || "";
    const department = item.department || "";

    const matchSearch =
      name.toLowerCase().includes(search.toLowerCase()) ||
      facultyId.toLowerCase().includes(search.toLowerCase());

    const matchDepartment =
      departmentFilter === "" ||
      department === departmentFilter;

    return matchSearch && matchDepartment;
  });

  return (
    <div className="container mt-4">

      <h2 className="text-center mb-4">
        Faculty Management
      </h2>

      {/* Faculty Form */}
      <div className="card p-4 mb-4 shadow">

        <div className="row">

          {/* Faculty ID */}
          <div className="col-md-3 mb-3">
            <label className="form-label">
              Faculty ID
            </label>

            <input
              type="text"
              className="form-control"
              name="facultyId"
              placeholder="Enter Faculty ID"
              value={formData.facultyId}
              onChange={handleChange}
            />
          </div>

          {/* Name */}
          <div className="col-md-3 mb-3">
            <label className="form-label">
              Name
            </label>

            <input
              type="text"
              className="form-control"
              name="name"
              placeholder="Enter Name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          {/* Department */}
          <div className="col-md-3 mb-3">
            <label className="form-label">
              Department
            </label>

            <select
              className="form-select"
              name="department"
              value={formData.department}
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
          </div>

          {/* Designation */}
          <div className="col-md-3 mb-3">
            <label className="form-label">
              Designation
            </label>

            <input
              type="text"
              className="form-control"
              name="designation"
              placeholder="Professor / Assistant Professor"
              value={formData.designation}
              onChange={handleChange}
            />
          </div>

          {/* Qualification */}
          <div className="col-md-3 mb-3">
            <label className="form-label">
              Qualification
            </label>

            <input
              type="text"
              className="form-control"
              name="qualification"
              placeholder="B.Tech / M.Tech / PhD"
              value={formData.qualification}
              onChange={handleChange}
            />
          </div>

          {/* Experience */}
          <div className="col-md-3 mb-3">
            <label className="form-label">
              Experience
            </label>

            <input
              type="number"
              className="form-control"
              name="experience"
              placeholder="Years"
              value={formData.experience}
              onChange={handleChange}
            />
          </div>

          {/* Email */}
          <div className="col-md-3 mb-3">
            <label className="form-label">
              Email
            </label>

            <input
              type="email"
              className="form-control"
              name="email"
              placeholder="Enter Email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {/* Phone */}
          <div className="col-md-3 mb-3">
            <label className="form-label">
              Phone
            </label>

            <input
              type="text"
              className="form-control"
              name="phone"
              placeholder="Enter Phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          {/* Password */}
          <div className="col-md-3 mb-3">
            <label className="form-label">
              Password
            </label>

            <input
              type="password"
              className="form-control"
              name="password"
              placeholder={
                editingId
                  ? "Enter new password if required"
                  : "Enter Password"
              }
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {/* Button */}
          <div className="col-12 text-center mt-3">

            <button
              type="button"
              className={`btn ${
                editingId
                  ? "btn-warning"
                  : "btn-primary"
              }`}
              onClick={saveFaculty}
            >
              {editingId
                ? "Update Faculty"
                : "Add Faculty"}
            </button>

            {/* Cancel Edit */}
            {editingId && (
              <button
                type="button"
                className="btn btn-secondary ms-2"
                onClick={() => {
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
                    password: "",
                  });
                }}
              >
                Cancel
              </button>
            )}

          </div>

        </div>
      </div>

      {/* Search and Filter */}
      <div className="row mb-4">

        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Search Faculty"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

        <div className="col-md-6">
          <select
            className="form-select"
            value={departmentFilter}
            onChange={(e) =>
              setDepartmentFilter(e.target.value)
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

      </div>

      {/* Faculty Table */}
      <div className="table-responsive">

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

                  <td>
                    {item.facultyId}
                  </td>

                  <td>
                    {item.name}
                  </td>

                  <td>
                    {item.department}
                  </td>

                  <td>
                    {item.designation}
                  </td>

                  <td>
                    {item.qualification}
                  </td>

                  <td>
                    {item.experience} Years
                  </td>

                  <td>
                    {item.email}
                  </td>

                  <td>
                    {item.phone}
                  </td>

                  <td>

                    <button
                      type="button"
                      className="btn btn-warning btn-sm me-2"
                      onClick={() =>
                        editFaculty(item)
                      }
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() =>
                        deleteFaculty(item._id)
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
                  colSpan="9"
                  className="text-center"
                >
                  No Faculty Found
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default AddFaculty;