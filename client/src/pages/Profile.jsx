import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // CHANGE PASSWORD STATES
  // ==========================================

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    getProfile();
  }, []);

  // ==========================================
  // GET PROFILE
  // ==========================================

  const getProfile = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");

      console.log("=================================");
      console.log("GET PROFILE");
      console.log("ROLE:", role);
      console.log("TOKEN EXISTS:", token ? "YES" : "NO");
      console.log("=================================");

      if (!token) {
        toast.error("Please login again");
        setLoading(false);
        return;
      }

      if (!role) {
        toast.error("User role not found. Please login again");
        setLoading(false);
        return;
      }

      let profileUrl = "";

      if (role === "admin") {
        profileUrl =
          "http://localhost:5000/api/admin/profile";
      } else if (role === "student") {
        profileUrl =
          "http://localhost:5000/api/students/profile";
      } else if (role === "faculty") {
        profileUrl =
          "http://localhost:5000/api/faculty/profile";
      } else {
        toast.error("Invalid user role");
        setLoading(false);
        return;
      }

      console.log("PROFILE URL:", profileUrl);

      const res = await axios.get(profileUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("PROFILE RESPONSE:", res.data);

      if (res.data.student) {
        setProfile(res.data.student);
      } else if (res.data.data) {
        setProfile(res.data.data);
      } else {
        toast.error(
          res.data.message || "Failed to load profile"
        );
      }
    } catch (error) {
      console.error(
        "GET PROFILE ERROR:",
        error.response?.data || error.message
      );

      if (error.response?.status === 401) {
        toast.error(
          "Session expired. Please login again."
        );

        localStorage.removeItem("token");
        localStorage.removeItem("role");

        return;
      }

      toast.error(
        error.response?.data?.message ||
          "Failed to load profile"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // PASSWORD INPUT CHANGE
  // ==========================================

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  // ==========================================
  // CHANGE PASSWORD
  // ==========================================

  const handleChangePassword = async (e) => {
    e.preventDefault();

    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = passwordData;

    // Clear previous messages
    toast.dismiss();

    // Check fields
    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      toast.error("Please fill all password fields.");
      return;
    }

    // Check passwords
    if (newPassword !== confirmPassword) {
      toast.error(
        "New password and confirm password do not match."
      );
      return;
    }

    // Minimum length
    if (newPassword.length < 6) {
      toast.error(
        "New password must be at least 6 characters long."
      );
      return;
    }

    try {
      setPasswordLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        toast.error(
          "Authentication token not found. Please login again."
        );
        return;
      }

      const res = await axios.put(
        "http://localhost:5000/api/students/change-password",
        {
          currentPassword,
          newPassword,
          confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "CHANGE PASSWORD RESPONSE:",
        res.data
      );

      if (res.data.success) {
        toast.success(
          "Password changed successfully!"
        );

        // Clear fields
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      console.error(
        "CHANGE PASSWORD ERROR:",
        error.response?.data || error.message
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to change password."
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="card shadow">
          <div className="card-body">
            <h4>Loading Profile...</h4>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // NO PROFILE
  // ==========================================

  if (!profile) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning">
          Profile information not available.
        </div>
      </div>
    );
  }

  // ==========================================
  // GET ROLE
  // ==========================================

  const role = localStorage.getItem("role");

  // ==========================================
  // PROFILE UI
  // ==========================================

  return (
    <div className="container mt-5">

      {/* =====================================
          PROFILE CARD
         ===================================== */}

      <div className="card shadow">

        {/* HEADER */}

        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">
            My Profile
          </h4>
        </div>

        {/* BODY */}

        <div className="card-body">

          <div className="row">

            {/* NAME */}

            <div className="col-md-6 mb-4">
              <strong>Name:</strong>

              <div className="mt-1">
                {profile.name ||
                  profile.username ||
                  "N/A"}
              </div>
            </div>

            {/* EMAIL */}

            <div className="col-md-6 mb-4">
              <strong>Email:</strong>

              <div className="mt-1">
                {profile.email || "N/A"}
              </div>
            </div>

            {/* ROLE */}

            <div className="col-md-6 mb-4">
              <strong>Role:</strong>

              <div className="mt-1 text-capitalize">
                {role || "N/A"}
              </div>
            </div>

            {/* =================================
                STUDENT DETAILS
               ================================= */}

            {role === "student" && (
              <>
                {/* ROLL NUMBER */}

                <div className="col-md-6 mb-4">
                  <strong>Roll Number:</strong>

                  <div className="mt-1">
                    {profile.rollNumber || "N/A"}
                  </div>
                </div>

                {/* DEPARTMENT */}

                <div className="col-md-6 mb-4">
                  <strong>Department:</strong>

                  <div className="mt-1">
                    {profile.department || "N/A"}
                  </div>
                </div>

                {/* SEMESTER */}

                <div className="col-md-6 mb-4">
                  <strong>Semester:</strong>

                  <div className="mt-1">
                    {profile.semester ?? "N/A"}
                  </div>
                </div>
              </>
            )}

            {/* =================================
                FACULTY DETAILS
               ================================= */}

            {role === "faculty" && (
              <>
                <div className="col-md-6 mb-4">
                  <strong>Faculty ID:</strong>

                  <div className="mt-1">
                    {profile.facultyId || "N/A"}
                  </div>
                </div>

                <div className="col-md-6 mb-4">
                  <strong>Department:</strong>

                  <div className="mt-1">
                    {profile.department || "N/A"}
                  </div>
                </div>
              </>
            )}

            {/* =================================
                ADMIN DETAILS
               ================================= */}

            {role === "admin" && (
              <div className="col-md-6 mb-4">
                <strong>Admin ID:</strong>

                <div className="mt-1">
                  {profile.adminId || "N/A"}
                </div>
              </div>
            )}

          </div>

        </div>
      </div>

      {/* =====================================
          STUDENT CHANGE PASSWORD
         ===================================== */}

      {role === "student" && (
        <div className="card shadow mt-4 mb-5">

          <div className="card-header bg-danger text-white">
            <h5 className="mb-0">
              🔐 Change Password
            </h5>
          </div>

          <div className="card-body">

            <form onSubmit={handleChangePassword}>

              {/* CURRENT PASSWORD */}

              <div className="mb-3">

                <label className="form-label">
                  Current Password
                </label>

                <input
                  type="password"
                  name="currentPassword"
                  className="form-control"
                  placeholder="Enter current password"
                  value={
                    passwordData.currentPassword
                  }
                  onChange={handlePasswordChange}
                />

              </div>

              {/* NEW PASSWORD */}

              <div className="mb-3">

                <label className="form-label">
                  New Password
                </label>

                <input
                  type="password"
                  name="newPassword"
                  className="form-control"
                  placeholder="Enter new password"
                  value={
                    passwordData.newPassword
                  }
                  onChange={handlePasswordChange}
                />

                <small className="text-muted">
                  Password must be at least 6
                  characters.
                </small>

              </div>

              {/* CONFIRM PASSWORD */}

              <div className="mb-3">

                <label className="form-label">
                  Confirm New Password
                </label>

                <input
                  type="password"
                  name="confirmPassword"
                  className="form-control"
                  placeholder="Confirm new password"
                  value={
                    passwordData.confirmPassword
                  }
                  onChange={handlePasswordChange}
                />

              </div>

              {/* BUTTON */}

              <button
                type="submit"
                className="btn btn-danger"
                disabled={passwordLoading}
              >
                {passwordLoading
                  ? "Changing Password..."
                  : "🔐 Change Password"}
              </button>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

export default Profile;