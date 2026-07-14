import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Courses from "./components/Courses";
import Enrollments from "./components/Enrollments";
import Certificates from "./components/Certificates";
import Internships from "./components/Internships";
import Sidebar from "./components/Sidebar";
import "./App.css";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("admin_token"));

  const handleLogin = (t) => {
    localStorage.setItem("admin_token", t);
    setToken(t);
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    setToken(null);
  };

  if (!token) return <Login onLogin={handleLogin} />;

  return (
    <BrowserRouter>
      <div className="app-layout">
        <Sidebar onLogout={handleLogout} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/enrollments" element={<Enrollments />} />
            <Route path="/certificates" element={<Certificates />} />
            <Route path="/internships" element={<Internships />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
