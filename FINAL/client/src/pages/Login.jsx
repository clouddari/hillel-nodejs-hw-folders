import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const { login } = useContext(AuthContext);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const res = await axios.post("http://localhost:3000/api/auth/login", {
        username,
        password,
      });

      login(res.data.token);
      setMessage("You've logged in successfully ");
    } catch (err) {
      setMessage("Wrong credentials or internal server error");
      console.error(err);
    }
  };

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
