import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function FacultyLogin() {

  const navigate = useNavigate();

  const [faculty, setFaculty] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);


  // ==========================================
  // INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {

    setFaculty({
      ...faculty,
      [e.target.name]: e.target.value,
    });

  };


  // ==========================================
  // LOGIN
  // ==========================================

  const handleSubmit = async (e) => {

    e.preventDefault();


    if (!faculty.email.trim()) {

      toast.error("Please enter email");

      return;
    }


    if (!faculty.password) {

      toast.error("Please enter password");

      return;
    }


    try {

      setLoading(true);


      const res = await axios.post(
        "http://localhost:5000/api/auth/faculty/login",
        {
          email: faculty.email,
          password: faculty.password,
        }
      );


      console.log(
        "Faculty Login Response:",
        res.data
      );


      if (res.data.success) {

        // Save JWT

        localStorage.setItem(
          "token",
          res.data.token
        );


        // Save role

        localStorage.setItem(
          "role",
          "faculty"
        );


        // Save faculty information

        localStorage.setItem(
          "faculty",
          JSON.stringify(
            res.data.faculty
          )
        );


        toast.success(
          "Faculty Login Successful"
        );


        /*
          For now we use the existing dashboard.

          Later we will create a dedicated
          Faculty Dashboard.
        */

        navigate("/dashboard");

      }

    } catch (error) {

      console.log(
        "Faculty Login Error:",
        error.response?.data || error
      );


      toast.error(
        error.response?.data?.message ||
        "Invalid email or password"
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
          👨‍🏫 Faculty Login
        </h2>


        <form onSubmit={handleSubmit}>


          {/* EMAIL */}

          <div className="mb-3">

            <label className="form-label">
              Email
            </label>

            <input
              type="email"
              className="form-control"
              placeholder="Enter faculty email"
              name="email"
              value={faculty.email}
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
              value={faculty.password}
              onChange={handleChange}
            />

          </div>


          {/* LOGIN */}

          <button
            type="submit"
            className="btn btn-success w-100"
            disabled={loading}
          >

            {loading
              ? "Logging in..."
              : "Faculty Login"}

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

export default FacultyLogin;