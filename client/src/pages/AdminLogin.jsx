import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function AdminLogin() {

  const navigate = useNavigate();

  const [admin, setAdmin] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);


  // ==========================================
  // INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {

    setAdmin({
      ...admin,
      [e.target.name]: e.target.value,
    });

  };


  // ==========================================
  // LOGIN
  // ==========================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!admin.username.trim()) {

      toast.error("Please enter username");

      return;
    }

    if (!admin.password) {

      toast.error("Please enter password");

      return;
    }


    try {

      setLoading(true);


      const res = await axios.post(
        "http://localhost:5000/api/admin/login",
        {
          username: admin.username,
          password: admin.password,
        }
      );


      if (res.data.success) {

        // Save token

        localStorage.setItem(
          "token",
          res.data.token
        );


        // Save username

        localStorage.setItem(
          "username",
          res.data.username || admin.username
        );


        // Save role

        localStorage.setItem(
          "role",
          "admin"
        );


        toast.success(
          "Admin Login Successful"
        );


        navigate("/dashboard");

      }

    } catch (error) {

      console.log(
        "Admin Login Error:",
        error.response?.data || error
      );


      toast.error(
        error.response?.data?.message ||
        "Invalid Username or Password"
      );

    } finally {

      setLoading(false);

    }

  };


  return (

    <div
      className="container mt-5"
      style={{
        maxWidth: "550px",
      }}
    >

      <div className="card shadow p-4">

        <h2 className="text-center mb-4">
          👨‍💼 Admin Login
        </h2>


        <form onSubmit={handleSubmit}>


          {/* USERNAME */}

          <div className="mb-3">

            <label className="form-label">
              Username
            </label>

            <input
              type="text"
              className="form-control"
              placeholder="Enter username"
              name="username"
              value={admin.username}
              onChange={handleChange}
            />

          </div>


          {/* PASSWORD */}

          <div className="mb-3">

            <label className="form-label">
              Password
            </label>

            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              name="password"
              value={admin.password}
              onChange={handleChange}
            />

          </div>


          {/* LOGIN */}

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >

            {loading
              ? "Logging in..."
              : "Admin Login"}

          </button>


          {/* BACK */}

          <button
            type="button"
            className="btn btn-secondary w-100 mt-3"
            onClick={() => navigate("/login")}
          >
            ← Back to Login Selection
          </button>

        </form>

      </div>

    </div>

  );
}

export default AdminLogin;