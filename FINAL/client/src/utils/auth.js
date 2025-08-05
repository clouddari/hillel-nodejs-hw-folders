import { jwtDecode } from "jwt-decode";

function getCurrentUser() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    return jwtDecode(token);
  } catch (err) {
    console.log(err);
    return null;
  }
}

export default getCurrentUser;
