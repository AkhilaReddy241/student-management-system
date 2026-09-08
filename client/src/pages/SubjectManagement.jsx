import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function SubjectManagement() {

  const [subjects, setSubjects] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");

  const [formData, setFormData] = useState({
    subjectCode: "",
    subjectName: "",
    department: "",
    semester: "",
    credits: "",
    faculty: "",
  });

  useEffect(() => {
    getSubjects();
  }, []);

  const getSubjects = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/subjects"
      );

      setSubjects(res.data.data || []);
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

  const saveSubject = async () => {
    try {

      if (editingId) {

        await axios.put(
          `http://localhost:5000/api/subjects/${editingId}`,
          formData
        );

        toast.success("Subject Updated Successfully");

      } else {

        await axios.post(
          "http://localhost:5000/api/subjects",
          formData
        );

        toast.success("Subject Added Successfully");
      }

      setEditingId(null);

      setFormData({
        subjectCode: "",
        subjectName: "",
        department: "",
        semester: "",
        credits: "",
        faculty: "",
      });

      getSubjects();

    } catch (err) {
      console.log(err);
      toast.error("Operation Failed");
    }
  };

  const editSubject = (item) => {

    setEditingId(item._id);

    setFormData({
      subjectCode: item.subjectCode,
      subjectName: item.subjectName,
      department: item.department,
      semester: item.semester,
      credits: item.credits,
      faculty: item.faculty,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const deleteSubject = async (id) => {

    if (!window.confirm("Delete Subject?")) return;

    try {

      await axios.delete(
        `http://localhost:5000/api/subjects/${id}`
      );

      toast.success("Subject Deleted");

      getSubjects();

    } catch (err) {

      toast.error("Delete Failed");

    }
  };

  const filteredSubjects = subjects.filter((item) => {

    const matchSearch =
      item.subjectName
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      item.subjectCode
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchDepartment =
      departmentFilter === "" ||
      item.department === departmentFilter;

    return matchSearch && matchDepartment;
  });

  return (

    <div className="container mt-4">

      <h2 className="text-center mb-4">
        Subject Management
      </h2>

      <div className="card shadow p-4 mb-4">

        <h4 className="text-center mb-4">
          {editingId ? "Update Subject" : "Add Subject"}
        </h4>

        <div className="row">

          <div className="col-md-4 mb-3">
            <label>Subject Code</label>

            <input
              className="form-control"
              name="subjectCode"
              value={formData.subjectCode}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4 mb-3">
            <label>Subject Name</label>

            <input
              className="form-control"
              name="subjectName"
              value={formData.subjectName}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4 mb-3">

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

          <div className="col-md-4 mb-3">

            <label>Semester</label>

            <input
              type="number"
              className="form-control"
              name="semester"
              value={formData.semester}
              onChange={handleChange}
            />

          </div>

          <div className="col-md-4 mb-3">

            <label>Credits</label>

            <input
              type="number"
              className="form-control"
              name="credits"
              value={formData.credits}
              onChange={handleChange}
            />

          </div>

          <div className="col-md-4 mb-3">

            <label>Faculty</label>

            <input
              className="form-control"
              name="faculty"
              value={formData.faculty}
              onChange={handleChange}
            />

          </div>

          <div className="col-12 text-center mt-3">

            <button
              className={`btn ${
                editingId
                  ? "btn-warning"
                  : "btn-primary"
              }`}
              onClick={saveSubject}
            >
              {editingId
                ? "Update Subject"
                : "Save Subject"}
            </button>

          </div>

        </div>

      </div>

            <div className="row mb-4">

        <div className="col-md-6">
          <input
            className="form-control"
            placeholder="Search Subject"
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

      <div className="card shadow">

        <div className="card-header bg-dark text-white">
          <h5 className="mb-0">Subject List</h5>
        </div>

        <div className="table-responsive">

          <table className="table table-bordered table-striped mb-0">

            <thead className="table-dark">

              <tr>
                <th>Code</th>
                <th>Subject Name</th>
                <th>Department</th>
                <th>Semester</th>
                <th>Credits</th>
                <th>Faculty</th>
                <th>Action</th>
              </tr>

            </thead>

            <tbody>

              {filteredSubjects.length > 0 ? (

                filteredSubjects.map((item) => (

                  <tr key={item._id}>

                    <td>{item.subjectCode}</td>
                    <td>{item.subjectName}</td>
                    <td>{item.department}</td>
                    <td>{item.semester}</td>
                    <td>{item.credits}</td>
                    <td>{item.faculty}</td>

                    <td>

                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => editSubject(item)}
                      >
                        Edit
                      </button>

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => deleteSubject(item._id)}
                      >
                        Delete
                      </button>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>
                  <td colSpan="7" className="text-center">
                    No Subjects Found
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

export default SubjectManagement;