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

function App() {
  return (
    <>
      <Header />
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
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
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
      </Routes>

      <Footer />
    </>
  );
}

export default App;
