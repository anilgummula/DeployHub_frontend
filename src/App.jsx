import { BrowserRouter as Router, Routes, Route } from "react-router";
import { AuthProvider } from "./context/AuthContext";
import HomePage from "./pages/Home";
import LoginPage from "./pages/Login";
import AuthCallbackPage from "./pages/AuthCallback";
import DashboardPage from "./pages/Dashboard";
import CreateProjectPage from "./pages/CreateProject";
import Project from "./pages/Project";

export default function App() {
  return (
    // <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/login/callback" element={<AuthCallbackPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/projects/new" element={<CreateProjectPage />} />
          <Route path="/projects/:id" element={<Project/>} />
        </Routes>
      </Router>
    // </AuthProvider>
  );
}
