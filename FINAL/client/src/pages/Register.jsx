import { useState, useRef } from "react";
import axios from "axios";
import "./Auth.css";

import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileSource, setProfileSource] = useState("none");
  const [file, setFile] = useState(null);
  const [profilePicUrl, setProfilePicUrl] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/works");
    }
  }, [user, navigate]);

  const handleRegister = async (event) => {
    event.preventDefault();

    if (isSubmitting) return;

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    if (password.length < 5) {
      setMessage("Password must be at least 5 characters");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("fullname", fullname);
      formData.append("email", email);
      formData.append("password", password);

      if (profileSource === "file" && file) {
        formData.append("profilePic", file);
      } else if (profileSource === "url" && profilePicUrl) {
        formData.append("profilePic", profilePicUrl);
      }

      await axios.post("http://localhost:3000/api/auth/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("Registration successful");
      alert("User registered!");
    } catch (err) {
      if (err.response?.data?.message) {
        setMessage(err.response.data.message);
      } else {
        setMessage("Registration failed");
      }
    } finally {
      setIsSubmitting(false);
    }

    if (!fullname.trim()) {
      setMessage("Full name is required");
      return;
    }
  };

  const resetFile = () => {
    setFile(null);
  };

  return (
    <div className="auth-container">
      <h1>Sign up</h1>

      <form className="auth-form" onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Full Name"
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password (5+ characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <p className="userpic-text">Userpic:</p>

        <div className="radio-group">
          <input
            type="radio"
            id="radio-file"
            name="profileSource"
            value="file"
            checked={profileSource === "file"}
            onChange={() => setProfileSource("file")}
          />
          <label htmlFor="radio-file">From computer</label>

          <input
            type="radio"
            id="radio-url"
            name="profileSource"
            value="url"
            checked={profileSource === "url"}
            onChange={() => setProfileSource("url")}
          />
          <label htmlFor="radio-url">Via URL</label>
        </div>

        {profileSource === "file" && (
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => setFile(e.target.files[0])}
              accept="image/*"
            />
            {file && (
              <div className="remove-img">
                <button
                  type="button"
                  onClick={() => {
                    resetFile();
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                >
                  Remove selected image
                </button>
              </div>
            )}
          </div>
        )}

        {profileSource === "url" && (
          <input
            type="text"
            placeholder="Image URL"
            value={profilePicUrl}
            onChange={(e) => setProfilePicUrl(e.target.value)}
          />
        )}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Registering..." : "Register"}
        </button>
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
