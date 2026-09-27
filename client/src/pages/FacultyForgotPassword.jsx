import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL =
  "https://student-management-system-ult0.onrender.com";

const FacultyForgotPassword = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  // =====================================================
  // STEP 1 - SEND OTP
  // =====================================================

  const handleSendOTP = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/faculty/forgot-password`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: email.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Failed to send OTP"
        );
        return;
      }

      setMessage(
        "OTP sent successfully to your email"
      );

      setStep(2);
    } catch (error) {
      console.error(
        "FACULTY SEND OTP ERROR:",
        error
      );

      setError(
        "Unable to connect to server"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // STEP 2 - VERIFY OTP
  // =====================================================

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!otp.trim()) {
      setError("Please enter the OTP");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/faculty/verify-otp`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: email.trim(),
            otp: otp.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Invalid OTP"
        );
        return;
      }

      setMessage(
        "OTP verified successfully"
      );

      setStep(3);
    } catch (error) {
      console.error(
        "FACULTY VERIFY OTP ERROR:",
        error
      );

      setError(
        "Unable to connect to server"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // STEP 3 - RESET PASSWORD
  // =====================================================

  const handleResetPassword = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (
      !newPassword ||
      !confirmPassword
    ) {
      setError(
        "Please enter both passwords"
      );
      return;
    }

    if (newPassword.length < 6) {
      setError(
        "Password must be at least 6 characters"
      );
      return;
    }

    if (
      newPassword !== confirmPassword
    ) {
      setError(
        "Passwords do not match"
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/faculty/reset-password`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: email.trim(),
            otp: otp.trim(),
            newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Failed to reset password"
        );
        return;
      }

      setMessage(
        "Password reset successfully"
      );

      setTimeout(() => {
        navigate("/faculty-login");
      }, 1500);
    } catch (error) {
      console.error(
        "FACULTY RESET PASSWORD ERROR:",
        error
      );

      setError(
        "Unable to connect to server"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // PAGE UI
  // =====================================================

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
      }}
    >
      <div
        className="card shadow p-4"
        style={{
          width: "100%",
          maxWidth: "450px",
        }}
      >
        {/* =================================================
            TITLE
        ================================================= */}

        <h3 className="text-center mb-4">
          Faculty Forgot Password
        </h3>

        {/* =================================================
            STEP INDICATOR
        ================================================= */}

        <div className="text-center mb-4">

          <span
            className={
              step >= 1
                ? "badge bg-primary me-2"
                : "badge bg-secondary me-2"
            }
          >
            1. Email
          </span>

          <span
            className={
              step >= 2
                ? "badge bg-primary me-2"
                : "badge bg-secondary me-2"
            }
          >
            2. OTP
          </span>

          <span
            className={
              step >= 3
                ? "badge bg-primary"
                : "badge bg-secondary"
            }
          >
            3. Password
          </span>

        </div>

        {/* =================================================
            SUCCESS MESSAGE
        ================================================= */}

        {message && (
          <div className="alert alert-success">
            {message}
          </div>
        )}

        {/* =================================================
            ERROR MESSAGE
        ================================================= */}

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        {/* =================================================
            STEP 1 - EMAIL
        ================================================= */}

        {step === 1 && (
          <form onSubmit={handleSendOTP}>

            <div className="mb-3">

              <label className="form-label">
                Faculty Email
              </label>

              <input
                type="email"
                className="form-control"
                placeholder="Enter faculty email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                disabled={loading}
                required
              />

            </div>

            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading
                ? "Sending OTP..."
                : "Send OTP"}
            </button>

          </form>
        )}

        {/* =================================================
            STEP 2 - OTP
        ================================================= */}

        {step === 2 && (
          <form onSubmit={handleVerifyOTP}>

            <div className="mb-3">

              <label className="form-label">
                Enter OTP
              </label>

              <input
                type="text"
                className="form-control text-center"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value)
                }
                maxLength="6"
                disabled={loading}
                required
              />

            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 mb-2"
              disabled={loading}
            >
              {loading
                ? "Verifying..."
                : "Verify OTP"}
            </button>

            <button
              type="button"
              className="btn btn-secondary w-100"
              onClick={() => {
                setStep(1);
                setOtp("");
                setError("");
                setMessage("");
              }}
              disabled={loading}
            >
              Change Email
            </button>

          </form>
        )}

        {/* =================================================
            STEP 3 - NEW PASSWORD
        ================================================= */}

        {step === 3 && (
          <form
            onSubmit={handleResetPassword}
          >

            <div className="mb-3">

              <label className="form-label">
                New Password
              </label>

              <input
                type="password"
                className="form-control"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(
                    e.target.value
                  )
                }
                disabled={loading}
                required
              />

            </div>

            <div className="mb-3">

              <label className="form-label">
                Confirm Password
              </label>

              <input
                type="password"
                className="form-control"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
                disabled={loading}
                required
              />

            </div>

            <button
              type="submit"
              className="btn btn-success w-100"
              disabled={loading}
            >
              {loading
                ? "Resetting Password..."
                : "Reset Password"}
            </button>

          </form>
        )}

        {/* =================================================
            BACK TO LOGIN
        ================================================= */}

        <div className="text-center mt-4">

          <button
            type="button"
            className="btn btn-link"
            onClick={() =>
              navigate("/faculty-login")
            }
            disabled={loading}
          >
            Back to Faculty Login
          </button>

        </div>

      </div>
    </div>
  );
};

export default FacultyForgotPassword;