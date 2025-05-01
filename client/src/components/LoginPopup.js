import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN_MUTATION, VERIFY_OTP_MUTATION } from "../graphql/mutations";
import { toast } from "react-toastify";
import { useLogin } from "../context/LoginContext";
import { Spinner } from "react-bootstrap";

const LoginPopup = ({ onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [resendTimeout, setResendTimeout] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSubmitting, setIsEmailSubmitting] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const { setIsAuthenticated } = useLogin();

  const [login] = useMutation(LOGIN_MUTATION);
  const [verifyOtp] = useMutation(VERIFY_OTP_MUTATION);

  useEffect(() => {
    toast.dismiss();
    setEmail("");
    setOtp("");
    setStep(1);
  }, []);

  useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleEmailSubmit = async () => {
    toast.dismiss();
    if (!email.trim()) return toast.error("Email is required.");

    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValid) return toast.error("Invalid email format.");

    setIsEmailSubmitting(true);
    try {
      const { data } = await login({ variables: { email } });

      if (data?.LoginSignup?.success) {
        toast.success(data.LoginSignup.message);
        setOtp("");
        setStep(2);
      } else {
        toast.error(data?.LoginSignup?.message || "Login failed.");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsEmailSubmitting(false);
    }
  };

  const saveUserSettings = ({
    token,
    user: {
      role,
      bookmarkedTools = [],
      toolSettingsDefaults = {
        minimap: true,
        wordWrap: "off",
        tabSize: 2,
        fontSize: 14,
        insertSpaces: true,
        theme: "vs-light",
        lineNumbers: "on",
        cursorStyle: "line",
        renderIndentGuides: true,
      },
    },
  }) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("userRole", role);
    localStorage.setItem("bookmarkedTools", JSON.stringify(bookmarkedTools));
    localStorage.setItem("toolSettingsDefaults", JSON.stringify(toolSettingsDefaults));
  };

  const handleOtpSubmit = async () => {
    toast.dismiss();
    if (!otp) return toast.error("OTP is required.");

    setIsLoading(true);
    try {
      const { data } = await verifyOtp({ variables: { email, otp } });

      if (data?.VerifyOtp?.success) {
        saveUserSettings(data.VerifyOtp);
        setIsAuthenticated(true);
        toast.success("Login successful!");
        onLoginSuccess();
        onClose();
      } else {
        toast.error(data?.VerifyOtp?.message || "OTP verification failed.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(value);
  };

  const handleResendOtp = async () => {
    if (resendTimeout) return toast.error("Please wait before resending OTP.");

    setResendLoading(true);
    try {
      const { data } = await login({ variables: { email } });

      if (data?.LoginSignup?.success) {
        toast.success("OTP resent successfully!");
        setResendTimer(60);
        const timeout = setTimeout(() => setResendTimeout(null), 60000);
        setResendTimeout(timeout);
      } else {
        toast.error(data?.LoginSignup?.message || "Resend OTP failed.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="login-overlay">
      <div className="login-popup">
        <button className="close-popup" onClick={onClose}>✖</button>
        <h2>{step === 1 ? "Login / Signup" : "Enter OTP"}</h2>

        {step === 1 ? (
          <>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isEmailSubmitting}
            />
            <button className="submit-btn" onClick={handleEmailSubmit} disabled={isEmailSubmitting}>
              {isEmailSubmitting ? <Spinner animation="border" size="sm" /> : "Continue"}
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={handleOtpChange}
              maxLength={6}
              disabled={isLoading}
            />
            <div className="button-group">
              <button className="back-btn" onClick={() => setStep(1)} disabled={isLoading}>
                ← Back
              </button>
              <button className="submit-btn" onClick={handleOtpSubmit} disabled={isLoading}>
                {isLoading ? <Spinner animation="border" size="sm" /> : "Verify OTP"}
              </button>
              <button
                className="resend-btn"
                onClick={handleResendOtp}
                disabled={resendLoading || resendTimer > 0}
              >
                {resendLoading ? (
                  <Spinner animation="border" size="sm" />
                ) : resendTimer > 0 ? (
                  `Resend OTP in ${resendTimer}s`
                ) : (
                  "Resend OTP"
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginPopup;
