import { Routes, Route } from "react-router-dom";
import Header from "./components/header";
import Home from "./pages/Home";
import Works from "./pages/Works";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Item from "./pages/Item";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminPanel from "./pages/AdminPanel";
import AdminReviewModeration from "./components/AdminReviewModeration";
import AdminRoute from "./components/AdminRoute";
import Footer from "./components/Footer";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import PublicOnlyRoute from "./components/PublicOnlyRoute";
import Favorites from "./pages/Favorites";

function App() {
  return (
    <div className="app-wrapper">
      <Header />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/works"
            element={
              <ProtectedRoute>
                <Works />
              </ProtectedRoute>
            }
          />
          <Route
            path="/favorites"
            element={
              <ProtectedRoute>
                <Favorites />
              </ProtectedRoute>
            }
          />

          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <Login />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicOnlyRoute>
                <Register />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/item/:id"
            element={
              <ProtectedRoute>
                <Item />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/reviews"
            element={
              <AdminRoute>
                <AdminReviewModeration />
              </AdminRoute>
            }
          />

          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

export default App;
