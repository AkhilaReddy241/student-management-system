import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function AdminForgotPassword() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);


  // ==========================================
  // SEND OTP
  // ==========================================

  const handleSendOTP = async (e) => {

    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    try {

      setLoading(true);

      const res = await axios.post(
        "https://student-management-system-ult0.onrender.com/api/admin/forgot-password",
        {
          email: email,
        }
      );

      if (res.data.success) {

        toast.success("OTP sent to your email");

        setStep(2);
      }

    } catch (error) {

      console.log(
        "Send OTP Error:",
        error.response?.data || error
      );

      toast.error(
        error.response?.data?.message ||
        "Failed to send OTP"
      );

    } finally {

      setLoading(false);

    }

  };


  // ==========================================
  // VERIFY OTP
  // ==========================================

  const handleVerifyOTP = async (e) => {

    e.preventDefault();

    if (!otp.trim()) {
      toast.error("Please enter OTP");
      return;
    }

    try {

      setLoading(true);

      const res = await axios.post(
        "https://student-management-system-ult0.onrender.com/api/admin/verify-otp",
        {
          email: email,
          otp: otp,
        }
      );

      if (res.data.success) {

        toast.success("OTP verified successfully");

        setStep(3);
      }

    } catch (error) {

      console.log(
        "Verify OTP Error:",
        error.response?.data || error
      );

      toast.error(
        error.response?.data?.message ||
        "Invalid OTP"
      );

    } finally {

      setLoading(false);

    }

  };


  // ==========================================
  // RESET PASSWORD
  // ==========================================

  const handleResetPassword = async (e) => {

    e.preventDefault();

    if (!newPassword) {
      toast.error("Please enter a new password");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {

      setLoading(true);

      const res = await axios.post(
        "https://student-management-system-ult0.onrender.com/api/admin/reset-password",
        {
          email: email,
          otp: otp,
          newPassword: newPassword,
        }
      );

      if (res.data.success) {

        toast.success("Password reset successfully");

        setTimeout(() => {
          navigate("/admin-login");
        }, 1000);

      }

    } catch (error) {

      console.log(
        "Reset Password Error:",
        error.response?.data || error
      );

      toast.error(
        error.response?.data?.message ||
        "Failed to reset password"
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
          🔐 Admin Forgot Password
        </h2>


        {/* ================================= */}
        {/* STEP 1 - EMAIL */}
        {/* ================================= */}

        {step === 1 && (

          <form onSubmit={handleSendOTP}>

            <div className="mb-3">

              <label className="form-label">
                Admin Email
              </label>

              <input
                type="email"
                className="form-control"
                placeholder="Enter your admin email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
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


        {/* ================================= */}
        {/* STEP 2 - OTP */}
        {/* ================================= */}

        {step === 2 && (

          <form onSubmit={handleVerifyOTP}>

            <div className="mb-3">

              <label className="form-label">
                Enter OTP
              </label>

              <input
                type="text"
                className="form-control"
                placeholder="Enter 6-digit OTP"
                value={otp}
                maxLength="6"
                onChange={(e) =>
                  setOtp(e.target.value)
                }
              />

            </div>


            <button
              type="submit"
              className="btn btn-success w-100"
              disabled={loading}
            >

              {loading
                ? "Verifying..."
                : "Verify OTP"}

            </button>

          </form>

        )}


        {/* ================================= */}
        {/* STEP 3 - NEW PASSWORD */}
        {/* ================================= */}

        {step === 3 && (

          <form onSubmit={handleResetPassword}>

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
                  setNewPassword(e.target.value)
                }
              />

            </div>


            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
            >

              {loading
                ? "Resetting Password..."
                : "Reset Password"}

            </button>

          </form>

        )}


        {/* BACK TO LOGIN */}

        <button
          type="button"
          className="btn btn-secondary w-100 mt-3"
          onClick={() => navigate("/admin-login")}
        >
          ← Back to Admin Login
        </button>

      </div>

    </div>

  );

}

export default AdminForgotPassword;