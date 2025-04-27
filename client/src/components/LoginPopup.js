import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN_MUTATION, VERIFY_OTP_MUTATION } from "../graphql/mutations";
import { toast } from "react-toastify";
import { useLogin } from "../context/LoginContext";

const LoginPopup = ({ onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);

  const { setIsAuthenticated } = useLogin();

  const [login] = useMutation(LOGIN_MUTATION);
  const [verifyOtp] = useMutation(VERIFY_OTP_MUTATION);

  useEffect(() => {
    toast.dismiss();
    setEmail("");
    setOtp("");
    setStep(1);
  }, []);

  const handleEmailSubmit = async () => {
    toast.dismiss();
    if (!email.trim()) return toast.error("Email is required.");

    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValid) return toast.error("Invalid email format.");

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
    }
  };

  const saveUserSettings = ({
    token,
    user: {
      role,
      bookmarkedTools = [],
      toolSettingsDefaults = {
        minimap: false,
        wordWrap: "on",
        tabSize: 2,
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
    }
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(value);
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
            />
            <button className="submit-btn" onClick={handleEmailSubmit}>Continue</button>
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={handleOtpChange}
              maxLength={6}
            />
            <div className="button-group">
              <button className="back-btn" onClick={() => setStep(1)}>← Back</button>
              <button className="submit-btn" onClick={handleOtpSubmit}>Verify OTP</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginPopup;
