import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { useNavigate, Navigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const res = await axios.post("http://localhost:3000/api/auth/login", {
        username,
        password,
      });

      login(res.data.token);
      navigate("/");
    } catch (err) {
      setMessage("Wrong credentials or internal server error");
      console.error(err);
    }
  };

  if (user) return <Navigate to="/" />;

  return (
    <div className="auth-container">
      <h2>Login</h2>

      <form className="auth-form" onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
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

        <button type="submit">Log in</button>
      </form>

      {message && <p className="auth-message">{message}</p>}
    </div>
  );
}

export default Login;
