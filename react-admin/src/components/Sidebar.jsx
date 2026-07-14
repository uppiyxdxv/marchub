import { NavLink, useLocation } from "react-router-dom";

const links = [
  { to: "/", label: "📊 Dashboard" },
  { to: "/courses", label: "📚 Courses" },
  { to: "/enrollments", label: "📋 Enrollments" },
  { to: "/certificates", label: "🏆 Certificates" },
  { to: "/internships", label: "💼 Internships" },
];

export default function Sidebar({ onLogout }) {
  const loc = useLocation();
  return (
    <aside className="sidebar">
      <h2>⬡ <span>MarcHub</span></h2>
      <nav>
        {links.map((l) => (
          <NavLink key={l.to} to={l.to} className={loc.pathname === l.to ? "active" : ""} end={l.to === "/"}>{l.label}</NavLink>
        ))}
      </nav>
      <button className="logout" onClick={onLogout}>🚪 Logout</button>
    </aside>
  );
}
