import { useState, useEffect } from "react";
import { getEnrollments, deleteEnrollment } from "../api";

export default function Enrollments() {
  const [enrolls, setEnrolls] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => { load(); }, []);

  const load = async () => setEnrolls(await getEnrollments());

  const handleDelete = async (email, course) => {
    if (!confirm(`Delete ${email}'s enrollment in ${course}?`)) return;
    await deleteEnrollment(email, course);
    load();
  };

  const filtered = enrolls.filter((e) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (e.name || "").toLowerCase().includes(q) || e.email.toLowerCase().includes(q) || e.course.toLowerCase().includes(q);
  });

  return (
    <div>
      <h1>📋 Enrollments</h1>
      <p className="sub">All student enrollments</p>
      <div className="search-row">
        <input placeholder="Search by name, email, or course…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table>
          <thead><tr><th>#</th><th>Name</th><th>Email</th><th>Course</th><th>Date</th><th></th></tr></thead>
          <tbody>
            {filtered.length === 0 ? <tr><td colSpan="6" className="empty">No enrollments.</td></tr> :
              filtered.map((e, i) => (
                <tr key={i}>
                  <td style={{ color: "#64748b" }}>{i + 1}</td>
                  <td style={{ fontWeight: 600 }}>{e.name || "—"}</td>
                  <td style={{ fontSize: ".8rem" }}>{e.email}</td>
                  <td><span className="badge badge-green">{e.course}</span></td>
                  <td style={{ fontSize: ".8rem", color: "#64748b" }}>{e.enrolledAt ? new Date(e.enrolledAt).toLocaleDateString() : "—"}</td>
                  <td><button className="btn btn-sm btn-danger" onClick={() => handleDelete(e.email, e.course)}>Delete</button></td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
