import React, { useState, ChangeEvent, FormEvent } from "react";
import "../style/login.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // For better alerts

// Authentication Service (Best practice: separate auth logic)
export const AuthService = {
  // Store token securely
  login: (token: string) => {
    // Store in HttpOnly cookie for enhanced security (ideal)
    // Alternative: localStorage with encryption
    localStorage.setItem("authToken", token);

    // Store expiration time
    const expirationTime = new Date().getTime() + 60 * 60 * 1000; // 1 hour
    localStorage.setItem("tokenExpiration", expirationTime.toString());
  },

  // Get authentication token
  getToken: () => localStorage.getItem("authToken"),

  // Check if token is valid
  isAuthenticated: () => {
    const token = localStorage.getItem("authToken");
    const expiration = localStorage.getItem("tokenExpiration");

    if (!token || !expiration) return false;

    return new Date().getTime() < parseInt(expiration);
  },

  // Logout method
  logout: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("tokenExpiration");
  },
};

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await axios.post("http://localhost:8000/api/auth/login", {
        email,
        password,
      });

      // Store token
      AuthService.login(response.data.token);

      // Success notification
      Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: "Redirecting to dashboard",
        timer: 1500,
        showConfirmButton: false,
      });

      // Redirect to protected route
      navigate("/productmanagement");
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.response?.data?.error || "Invalid credentials",
        confirmButtonColor: "#dc3545",
      });
    }
  };

  // Handle input change
  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (event: ChangeEvent<HTMLInputElement>) =>
      setter(event.target.value);

  return (
    <div className="login-container">
      <h2>Welcome Back</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={handleInputChange(setEmail)}
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={handleInputChange(setPassword)}
            required
          />
        </div>

        <button type="submit" className="login-button">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
