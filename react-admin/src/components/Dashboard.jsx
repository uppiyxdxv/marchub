import { useState, useEffect } from "react";
import { getUsers, getEnrollments, getCourses, getCertificates, getRegistrations } from "../api";

export default function Dashboard() {
  const [stats, setStats] = useState({ users: 0, enrolls: 0, courses: 0, certs: 0, interns: 0, regs: 0 });

  useEffect(() => {
    Promise.all([getUsers(), getEnrollments(), getCourses(), getCertificates(), getRegistrations()]).then(
      ([users, enrolls, courses, certs, regs]) => {
        setStats({
          users: Array.isArray(users) ? users.length : 0,
          enrolls: Array.isArray(enrolls) ? enrolls.length : 0,
          courses: Array.isArray(courses) ? courses.length : 0,
          certs: Array.isArray(certs) ? certs.length : 0,
          interns: Array.isArray(courses) ? courses.length : 0,
          regs: Array.isArray(regs) ? regs.length : 0,
        });
      }
    );
  }, []);

  return (
    <div>
      <h1>📊 Dashboard</h1>
      <p className="sub">MarcHub admin overview</p>
      <div className="stats">
        {[
          { n: stats.users, l: "Users", c: "#00f5c4" },
          { n: stats.enrolls, l: "Enrollments", c: "#3b82f6" },
          { n: stats.courses, l: "Courses", c: "#8b5cf6" },
          { n: stats.certs, l: "Certificates", c: "#f59e0b" },
          { n: stats.regs, l: "Internship Regs", c: "#10b981" },
        ].map((s) => (
          <div className="stat-card" key={s.l}><div className="n" style={{ color: s.c }}>{s.n}</div><div className="l">{s.l}</div></div>
        ))}
      </div>
    </div>
  );
}
