import { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css";

function Profile() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    profilePic: "",
    file: null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [profileSource, setProfileSource] = useState("none");
  const [profilePicUrl, setProfilePicUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get("http://localhost:3000/api/users/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUser(res.data);
      setForm({
        fullname: res.data.fullname || "",
        username: res.data.username,
        email: res.data.email,
        password: "",
        profilePic: res.data.profilePic,
        file: null,
      });
    };
    fetchData();
  }, []);

  const isDefaultPic = (url) => {
    return url === "/uploads/default-user.png";
  };

  const getImageSrc = () => {
    if (form.file) {
      return URL.createObjectURL(form.file);
    } else if (profileSource === "url" && profilePicUrl) {
      return profilePicUrl;
    } else if (form.profilePic.startsWith("http")) {
      return form.profilePic;
    } else {
      return `http://localhost:3000${form.profilePic}`;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    const data = new FormData();
    data.append("fullname", form.fullname);
    data.append("username", form.username);
    data.append("email", form.email);
    if (form.password) data.append("password", form.password);

    if (profileSource === "file" && form.file) {
      data.append("profilePic", form.file);
    } else if (profileSource === "url" && profilePicUrl) {
      data.append("profilePic", profilePicUrl);
    } else if (form.profilePic) {
      data.append("profilePic", form.profilePic);
    } else {
      data.append("profilePic", "/uploads/default-user.png");
    }

    try {
      const res = await axios.put(
        "http://localhost:3000/api/users/profile",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setUser(res.data);
      setIsEditing(false);
    } catch (err) {
      if (err.response && err.response.data?.message) {
        setErrorMessage(err.response.data.message);
      } else {
        setErrorMessage("Failed to update profile.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="profile-container">
      <h1 className="profile-title">My Profile</h1>

      {!isEditing ? (
        <div className="profile-view">
          {user.profilePic && (
            <img
              src={
                user.profilePic.startsWith("http")
                  ? user.profilePic
                  : `http://localhost:3000${user.profilePic}`
              }
              alt="Profile"
              className="profile-pic"
            />
          )}
          <p>
            <strong>Full Name:</strong> {user.fullname}
          </p>
          <p>
            <strong>Username:</strong> {user.username}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Role:</strong> {user.role}
          </p>
          <button onClick={() => setIsEditing(true)} className="edit-btn">
            Edit Profile
          </button>
        </div>
      ) : (
        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="change-picture-profile">
            <img src={getImageSrc()} alt="Preview" className="profile-pic" />

            <p className="userpic-text">Change profile picture:</p>

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
              <input
                type="file"
                onChange={(e) => setForm({ ...form, file: e.target.files[0] })}
                accept="image/*"
              />
            )}

            {profileSource === "url" && (
              <input
                type="text"
                placeholder="Image URL"
                value={profilePicUrl}
                onChange={(e) => setProfilePicUrl(e.target.value)}
              />
            )}

            {!isDefaultPic(form.profilePic) && (
              <button
                type="button"
                className="cancel-btn"
                onClick={() => {
                  setForm({
                    ...form,
                    file: null,
                    profilePic: "/uploads/default-user.png",
                  });
                  setProfilePicUrl("");
                  setProfileSource("none");
                }}
              >
                Delete current picture
              </button>
            )}
          </div>

          <label>
            Full Name:
            <input
              type="text"
              value={form.fullname}
              onChange={(e) => setForm({ ...form, fullname: e.target.value })}
            />
          </label>
          <label>
            Username:
            <input
              type="text"
              value={form.username}
              onChange={(e) => {
                setForm({ ...form, username: e.target.value });
                if (errorMessage) setErrorMessage("");
              }}
              required
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              value={form.email}
              onChange={(e) => {
                setForm({ ...form, email: e.target.value });
                if (errorMessage) setErrorMessage("");
              }}
              required
            />
          </label>
          <label>
            New Password (optional):
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </label>

          {errorMessage && (
            <p
              className="error-message"
              style={{ color: "red", marginTop: "10px" }}
            >
              {errorMessage}
            </p>
          )}

          <div className="form-actions">
            <button
              type="submit"
              className="save-btn"
              disabled={isSubmitting || Boolean(errorMessage)}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={() => {
                setIsEditing(false);
                setErrorMessage("");
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default Profile;
