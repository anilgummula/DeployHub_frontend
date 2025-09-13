import { BrowserRouter as Router, Routes, Route } from "react-router";
import { AuthProvider } from "./context/AuthContext";
import HomePage from "./pages/Home";
import LoginPage from "./pages/Login";
import AuthCallbackPage from "./pages/AuthCallback";
import DashboardPage from "./pages/Dashboard";
import ProjectPage from "./pages/Project";
import CreateProjectPage from "./pages/CreateProject";

export default function App() {
  return (
    // <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/projects/new" element={<CreateProjectPage />} />
          <Route path="/projects/:id" element={<ProjectPage />} />
        </Routes>
      </Router>
    // </AuthProvider>
  );
}
