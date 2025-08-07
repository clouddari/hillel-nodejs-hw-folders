import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "./Header.css";

function Header() {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="site-header">
      <div className="header-container">
        <div className="logo"> Review-Bro</div>
        <nav className="main-nav">
          <NavLink to="/">Home</NavLink>
          {user && <NavLink to="/works">Works</NavLink>}
          {user && <NavLink to="/favorites">Favorites</NavLink>}

          {user?.role === "admin" && <NavLink to="/admin">Admin</NavLink>}
          {user?.role === "admin" && (
            <NavLink to="/admin/reviews">Moderate</NavLink>
          )}
          {user && (
            <NavLink to="/profile" className="header-link">
              <span className="username">{user.username || "Profile"}</span>
            </NavLink>
          )}
          {!user && <NavLink to="/login">Login</NavLink>}
          {!user && <NavLink to="/register">Register</NavLink>}
          {user && (
            <button className="nav-button" onClick={logout}>
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
