import { useState } from "react";
import axios from "axios";
import "./Auth.css";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post("http://localhost:3000/api/auth/register", {
        username,
        password,
      });

      console.log("Token received:", res.data.token);
      setMessage(
        res.data.message || "Registration successful. You can Log in."
      );
    } catch (error) {
      setMessage("User already exists or internal server error");
      console.error(error);
    }
  };

  return (
    <div className="auth-container">
      <h1>Register Page</h1>

      <form className="auth-form" onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="User Name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button type="submit">Register</button>
      </form>

      <p
        className="auth-message"
        style={{ color: message.includes("successful") ? "green" : "red" }}
      >
        {message}
      </p>
    </div>
  );
}

export default Register;
