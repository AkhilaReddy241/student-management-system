import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function Navbar() {

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const username = localStorage.getItem("username");

  const faculty =
    JSON.parse(localStorage.getItem("faculty")) || {};

  const student =
    JSON.parse(localStorage.getItem("student")) || {};


  // ==========================================
  // DISPLAY NAME
  // ==========================================

  let displayName = username;

  if (role === "faculty") {
    displayName = faculty.name || faculty.email;
  }

  if (role === "student") {
    displayName = student.name || student.email;
  }


  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("role");

    localStorage.removeItem("username");
    localStorage.removeItem("faculty");
    localStorage.removeItem("student");

    toast.success("Logged Out Successfully");

    window.location.href = "/login";
  };


  return (

    <nav
      className="navbar navbar-expand-lg navbar-dark bg-primary px-4"
      style={{
        minHeight: "70px"
      }}
    >

      <div className="container-fluid">

        <div className="collapse navbar-collapse show">

          <ul className="navbar-nav me-auto">


            {/* =====================================
                HOME
            ===================================== */}

            <li className="nav-item">

              <Link
                className="nav-link text-white fw-bold"
                to="/"
              >
                Home
              </Link>

            </li>


            {/* =====================================
                ADMIN
            ===================================== */}

            {token && role === "admin" && (

              <>

                {/* DASHBOARD */}

                <li className="nav-item">

                  <Link
                    className="nav-link text-white fw-bold"
                    to="/dashboard"
                  >
                    Dashboard
                  </Link>

                </li>


                {/* STUDENTS */}

                <li className="nav-item">

                  <Link
                    className="nav-link text-white fw-bold"
                    to="/students"
                  >
                    Students
                  </Link>

                </li>


                {/* ADD STUDENT */}

                <li className="nav-item">

                  <Link
                    className="nav-link text-white fw-bold"
                    to="/add-student"
                  >
                    Add Student
                  </Link>

                </li>


                {/* FACULTY */}

                <li className="nav-item">

                  <Link
                    className="nav-link text-white fw-bold"
                    to="/faculty"
                  >
                    Faculty
                  </Link>

                </li>


                {/* ATTENDANCE */}

                <li className="nav-item">

                  <Link
                    className="nav-link text-white fw-bold"
                    to="/attendance"
                  >
                    Attendance
                  </Link>

                </li>


                {/* MARKS */}

                <li className="nav-item dropdown">

                  <a
                    className="nav-link dropdown-toggle text-white fw-bold"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Marks
                  </a>


                  <ul className="dropdown-menu">

                    <li>

                      <Link
                        className="dropdown-item"
                        to="/marks"
                      >
                        Marks Dashboard
                      </Link>

                    </li>

                    <li>
                      <hr className="dropdown-divider" />
                    </li>

                    <li>

                      <Link
                        className="dropdown-item"
                        to="/marks/internal1"
                      >
                        Internal 1
                      </Link>

                    </li>

                    <li>

                      <Link
                        className="dropdown-item"
                        to="/marks/internal2"
                      >
                        Internal 2
                      </Link>

                    </li>

                    <li>

                      <Link
                        className="dropdown-item"
                        to="/marks/external"
                      >
                        External
                      </Link>

                    </li>

                  </ul>

                </li>


                {/* REPORT CARD */}

                <li className="nav-item">

                  <Link
                    className="nav-link text-white fw-bold"
                    to="/report-card"
                  >
                    Report Card
                  </Link>

                </li>


                {/* SUBJECTS */}

                <li className="nav-item">

                  <Link
                    className="nav-link text-white fw-bold"
                    to="/faculty/subjects"
                  >
                    Subjects
                  </Link>

                </li>


                {/* PROFILE */}

                <li className="nav-item">

                  <Link
                    className="nav-link text-white fw-bold"
                    to="/profile"
                  >
                    Profile
                  </Link>

                </li>

              </>

            )}


            {/* =====================================
                FACULTY
            ===================================== */}

            {token && role === "faculty" && (

              <>

                {/* DASHBOARD */}

                <li className="nav-item">

                  <Link
                    className="nav-link text-white fw-bold"
                    to="/dashboard"
                  >
                    Dashboard
                  </Link>

                </li>


                {/* ATTENDANCE */}

                <li className="nav-item">

                  <Link
                    className="nav-link text-white fw-bold"
                    to="/attendance"
                  >
                    Attendance
                  </Link>

                </li>


                {/* MARKS */}

                <li className="nav-item dropdown">

                  <a
                    className="nav-link dropdown-toggle text-white fw-bold"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Marks
                  </a>


                  <ul className="dropdown-menu">

                    <li>

                      <Link
                        className="dropdown-item"
                        to="/marks"
                      >
                        Marks Dashboard
                      </Link>

                    </li>

                    <li>
                      <hr className="dropdown-divider" />
                    </li>

                    <li>

                      <Link
                        className="dropdown-item"
                        to="/marks/internal1"
                      >
                        Internal 1
                      </Link>

                    </li>

                    <li>

                      <Link
                        className="dropdown-item"
                        to="/marks/internal2"
                      >
                        Internal 2
                      </Link>

                    </li>

                    <li>

                      <Link
                        className="dropdown-item"
                        to="/marks/external"
                      >
                        External
                      </Link>

                    </li>

                  </ul>

                </li>


                {/* REPORT CARD */}

                <li className="nav-item">

                  <Link
                    className="nav-link text-white fw-bold"
                    to="/report-card"
                  >
                    Report Card
                  </Link>

                </li>


                {/* PROFILE */}

                <li className="nav-item">

                  <Link
                    className="nav-link text-white fw-bold"
                    to="/profile"
                  >
                    Profile
                  </Link>

                </li>

              </>

            )}


            {/* =====================================
                STUDENT
            ===================================== */}

            {token && role === "student" && (

              <>

                {/* STUDENT DASHBOARD */}

                <li className="nav-item">

                  <Link
                    className="nav-link text-white fw-bold"
                    to="/student-dashboard"
                  >
                    Dashboard
                  </Link>

                </li>


                {/* MY ATTENDANCE */}

                <li className="nav-item">

                  <Link
                    className="nav-link text-white fw-bold"
                    to="/student/attendance"
                  >
                    My Attendance
                  </Link>

                </li>


                {/* MY MARKS */}

                <li className="nav-item">

                  <Link
                    className="nav-link text-white fw-bold"
                    to="/student/marks"
                  >
                    My Marks
                  </Link>

                </li>


                {/* MY REPORT CARD */}

                <li className="nav-item">

                  <Link
                    className="nav-link text-white fw-bold"
                    to="/student/report-card"
                  >
                    My Report Card
                  </Link>

                </li>


                {/* PROFILE */}

                <li className="nav-item">

                  <Link
                    className="nav-link text-white fw-bold"
                    to="/profile"
                  >
                    Profile
                  </Link>

                </li>

              </>

            )}


            {/* =====================================
                NOT LOGGED IN
            ===================================== */}

            {!token && (

              <li className="nav-item">

                <Link
                  className="nav-link text-white fw-bold"
                  to="/login"
                >
                  Login
                </Link>

              </li>

            )}

          </ul>


          {/* =====================================
              RIGHT SIDE
          ===================================== */}

          {token && (

            <div className="d-flex align-items-center">

              <span
                className="text-white fw-bold me-3"
                style={{
                  fontSize: "18px"
                }}
              >
                👋 Welcome, {displayName}
              </span>


              <span
                className="badge bg-light text-dark me-3"
                style={{
                  fontSize: "14px"
                }}
              >
                {role}
              </span>


              <button
                className="btn btn-danger fw-bold"
                onClick={handleLogout}
              >
                Logout
              </button>

            </div>

          )}

        </div>

      </div>

    </nav>

  );
}

export default Navbar;