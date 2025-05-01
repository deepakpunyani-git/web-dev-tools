import React, { useState, useEffect } from "react";
import { useSaveToolUsage  } from '../../components/saveUsage';
import BookmarkButton from "../../components/BookmarkButton"; 

const defaultSettings = {
     
  theme: "vs-light",

};


const PasswordStrengthChecker = () => {

   const [settings, setSettings] = useState(() => {
        try {
          const saved = localStorage.getItem("toolSettingsDefaults");
          return saved ? JSON.parse(saved) : defaultSettings;
        } catch {
          return defaultSettings;
        }
      });


  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [strength, setStrength] = useState('');
  const saveUsage = useSaveToolUsage();

useEffect(() => {
    const onStorageChange = (e) => {
      if (e.key === "toolSettingsDefaults") {
        try {
          setSettings(JSON.parse(e.newValue));
        } catch {}
      }
    };
    window.addEventListener("storage", onStorageChange);
    return () => window.removeEventListener("storage", onStorageChange);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      try {
        const latest = localStorage.getItem("toolSettingsDefaults");
        if (latest) {
          const parsed = JSON.parse(latest);
          const current = JSON.stringify(settings);
          if (JSON.stringify(parsed) !== current) {
            setSettings(parsed);
          }
        }
      } catch {}
    }, 1000);
    return () => clearInterval(interval);
  }, [settings]);


  const validatePassword = (password) => {
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const lengthValid = password.length >= 8;

    if (!lengthValid) {
      setStrength('Weak');
      return 'Password must be at least 8 characters long.';
    }
    if (!hasUppercase || !hasLowercase || !hasNumber || !hasSpecialChar) {
      setStrength('Weak');
      return 'Password must contain uppercase, lowercase, number, and special character.';
    }

    setStrength('Strong');
    saveUsage();

    return '';
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    const error = validatePassword(value);
    setErrorMessage(error);
  };

  return (
    <div className="container-fluid container-ed p-4">
      <h1 className="text-center mb-4">Password Strength Checker         <BookmarkButton /> 
      </h1>

      <div className="mb-3">
      <label  className="form-label">
          Enter Password:
        </label>
        <input
          type="test"
          className="form-control"
          placeholder="Enter password"
          value={password}
          theme={settings.theme}

          onChange={handleChange}
        />
      </div>

      {errorMessage && (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      )}

      <div className="mt-3">
        <h4>Password Strength: {strength}</h4>
      </div>
      <div className="mt-4">
  <h3>Why a Strong Password is Important</h3>
  <p>
    A strong password is essential for protecting your online accounts and personal information. Weak passwords are vulnerable to being guessed or cracked by attackers using methods like brute force, dictionary attacks, or social engineering. As cyber threats increase, using a strong password is one of the easiest and most effective ways to ensure your security. Without it, even accounts with sensitive data could be exposed to unauthorized access.
  </p>
  
  <p>
    A strong password typically contains a combination of uppercase letters, lowercase letters, numbers, and special characters. It is also long enough (at least 8 characters, ideally 12 or more) to make it harder for attackers to guess. Simply using your name, birth date, or common phrases like "password123" can leave your accounts vulnerable. Ensuring a varied and unique password for each of your accounts is crucial to reduce the risk of a widespread attack on your credentials.
  </p>

  <p>
    To create a truly strong password, consider using a password manager to generate and store random, complex passwords for each site or service. Additionally, enable two-factor authentication (2FA) wherever possible to add another layer of security. A strong password is a critical component of your online security, and when used in conjunction with other security practices like regular password changes and monitoring suspicious activity, it significantly reduces your chances of falling victim to cybercrime.
  </p>

  <p>The validatePassword function checks for common password rules (length, uppercase, lowercase, number, special character). It returns an error message if the password doesn't meet these criteria.</p>
</div>
    </div>
  );
};

export default PasswordStrengthChecker;
