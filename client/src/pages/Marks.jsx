import React from "react";
import { Link } from "react-router-dom";

function Marks() {
  return (
    <div className="container-fluid mt-4">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="text-center mb-5">

        <h2 className="fw-bold">
          Marks Management
        </h2>

        <p className="text-muted">
          Manage Internal 1, Internal 2 and External Marks
        </p>

      </div>


      {/* =====================================================
          MARKS MANAGEMENT CARDS
      ===================================================== */}

      <div className="row justify-content-center">


        {/* ===================================================
            INTERNAL 1
        =================================================== */}

        <div className="col-md-4 mb-4">

          <div className="card shadow h-100 border-0">

            <div className="card-body text-center p-4">

              {/* ICON */}

              <div
                className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-3"
                style={{
                  width: "80px",
                  height: "80px",
                  fontSize: "30px",
                  fontWeight: "bold",
                }}
              >
                1
              </div>


              {/* TITLE */}

              <h4 className="fw-bold mb-3">
                Internal Examination 1
              </h4>


              {/* DESCRIPTION */}

              <p className="text-muted mb-4">
                Manage Internal 1 examination,
                assignment and total marks.
              </p>


              {/* BUTTON */}

              <Link
                to="/marks/internal1"
                className="btn btn-primary btn-lg"
              >
                Manage Internal 1
              </Link>

            </div>

          </div>

        </div>


        {/* ===================================================
            INTERNAL 2
        =================================================== */}

        <div className="col-md-4 mb-4">

          <div className="card shadow h-100 border-0">

            <div className="card-body text-center p-4">

              {/* ICON */}

              <div
                className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center mx-auto mb-3"
                style={{
                  width: "80px",
                  height: "80px",
                  fontSize: "30px",
                  fontWeight: "bold",
                }}
              >
                2
              </div>


              {/* TITLE */}

              <h4 className="fw-bold mb-3">
                Internal Examination 2
              </h4>


              {/* DESCRIPTION */}

              <p className="text-muted mb-4">
                Manage Internal 2 examination,
                assignment and total marks.
              </p>


              {/* BUTTON */}

              <Link
                to="/marks/internal2"
                className="btn btn-success btn-lg"
              >
                Manage Internal 2
              </Link>

            </div>

          </div>

        </div>


        {/* ===================================================
            EXTERNAL
        =================================================== */}

        <div className="col-md-4 mb-4">

          <div className="card shadow h-100 border-0">

            <div className="card-body text-center p-4">

              {/* ICON */}

              <div
                className="rounded-circle bg-danger text-white d-flex align-items-center justify-content-center mx-auto mb-3"
                style={{
                  width: "80px",
                  height: "80px",
                  fontSize: "30px",
                  fontWeight: "bold",
                }}
              >
                E
              </div>


              {/* TITLE */}

              <h4 className="fw-bold mb-3">
                External Examination
              </h4>


              {/* DESCRIPTION */}

              <p className="text-muted mb-4">
                Manage external examination
                and final marks.
              </p>


              {/* BUTTON */}

              <Link
                to="/marks/external"
                className="btn btn-danger btn-lg"
              >
                Manage External
              </Link>

            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          MARKS STRUCTURE
      ===================================================== */}

      <div className="card shadow border-0 mt-4">

        <div className="card-body p-4">

          <h5 className="fw-bold mb-4 text-center">
            Marks Structure
          </h5>


          <div className="row text-center">


            {/* =================================================
                INTERNAL 1 STRUCTURE
            ================================================= */}

            <div className="col-md-4 mb-3">

              <div className="border rounded p-4 h-100">

                <h6 className="text-primary fw-bold mb-3">
                  Internal 1
                </h6>

                <p className="mb-2">
                  Exam:
                  {" "}
                  <strong>
                    25 Marks
                  </strong>
                </p>

                <p className="mb-2">
                  Assignment:
                  {" "}
                  <strong>
                    5 Marks
                  </strong>
                </p>

                <hr />

                <p className="mb-0">
                  Total:
                  {" "}
                  <strong>
                    30 Marks
                  </strong>
                </p>

              </div>

            </div>


            {/* =================================================
                INTERNAL 2 STRUCTURE
            ================================================= */}

            <div className="col-md-4 mb-3">

              <div className="border rounded p-4 h-100">

                <h6 className="text-success fw-bold mb-3">
                  Internal 2
                </h6>

                <p className="mb-2">
                  Exam:
                  {" "}
                  <strong>
                    25 Marks
                  </strong>
                </p>

                <p className="mb-2">
                  Assignment:
                  {" "}
                  <strong>
                    5 Marks
                  </strong>
                </p>

                <hr />

                <p className="mb-0">
                  Total:
                  {" "}
                  <strong>
                    30 Marks
                  </strong>
                </p>

              </div>

            </div>


            {/* =================================================
                EXTERNAL STRUCTURE
            ================================================= */}

            <div className="col-md-4 mb-3">

              <div className="border rounded p-4 h-100">

                <h6 className="text-danger fw-bold mb-3">
                  External
                </h6>

                <p className="mb-2">
                  External Exam:
                  {" "}
                  <strong>
                    70 Marks
                  </strong>
                </p>

                <p className="mb-2">
                  Internal Average:
                  {" "}
                  <strong>
                    30 Marks
                  </strong>
                </p>

                <hr />

                <p className="mb-0">
                  Final:
                  {" "}
                  <strong>
                    100 Marks
                  </strong>
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          MARKS FLOW
      ===================================================== */}

      <div className="card shadow border-0 mt-4 mb-4">

        <div className="card-body p-4">

          <h5 className="fw-bold text-center mb-4">
            Marks Calculation
          </h5>

          <div className="row text-center">

            <div className="col-md-3 mb-3">

              <div className="border rounded p-3">

                <h6 className="fw-bold text-primary">
                  Internal 1
                </h6>

                <p className="mb-0">
                  25 + 5
                </p>

                <strong>
                  = 30 Marks
                </strong>

              </div>

            </div>


            <div className="col-md-3 mb-3">

              <div className="border rounded p-3">

                <h6 className="fw-bold text-success">
                  Internal 2
                </h6>

                <p className="mb-0">
                  25 + 5
                </p>

                <strong>
                  = 30 Marks
                </strong>

              </div>

            </div>


            <div className="col-md-3 mb-3">

              <div className="border rounded p-3">

                <h6 className="fw-bold text-warning">
                  Internal Average
                </h6>

                <p className="mb-0">
                  Internal 1 + Internal 2
                </p>

                <strong>
                  Average = 30
                </strong>

              </div>

            </div>


            <div className="col-md-3 mb-3">

              <div className="border rounded p-3">

                <h6 className="fw-bold text-danger">
                  Final Marks
                </h6>

                <p className="mb-0">
                  Internal + External
                </p>

                <strong>
                  = 100 Marks
                </strong>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Marks;