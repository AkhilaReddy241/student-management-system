import { useNavigate } from "react-router-dom";

function Unauthorized() {

  const navigate = useNavigate();

  return (
    <div className="container mt-5 text-center">

      <div className="card shadow p-5">

        <h1>🚫 Access Denied</h1>

        <p className="mt-3">
          You do not have permission to access this page.
        </p>

        <button
          className="btn btn-primary mt-3"
          onClick={() => navigate("/login")}
        >
          Back to Login
        </button>

      </div>

    </div>
  );
}

export default Unauthorized;