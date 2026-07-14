import { useState, useEffect } from "react";
import { getCertificates, verifyCert, getUsers } from "../api";

export default function Certificates() {
  const [certs, setCerts] = useState([]);
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    Promise.all([getCertificates(), getUsers()]).then(([c, u]) => {
      setCerts(c);
      setUsers(u);
    });
  }, []);

  const handleVerify = async (email, course) => {
    await verifyCert(email, course);
    setCerts(await getCertificates());
  };

  const filtered = filter ? certs.filter((c) => c.course === filter) : certs;

  return (
    <div>
      <h1>🏆 Certificates</h1>
      <p className="sub">Verify completions and issue certificates</p>
      <div className="search-row">
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">All Courses</option>
          {["HTML", "CSS", "JavaScript", "Java", "Python", "SQL", "MongoDB"].map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table>
          <thead><tr><th>Student</th><th>Email</th><th>Course</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {filtered.length === 0 ? <tr><td colSpan="5" className="empty">No certificates.</td></tr> :
              filtered.map((c, i) => {
                const user = users.find((u) => u.email === c.email);
                return (
                  <tr key={i}>
                    <td style={{ fontWeight: 600 }}>{c.name || (user ? user.name : "—")}</td>
                    <td style={{ fontSize: ".8rem" }}>{c.email}</td>
                    <td><span className="badge badge-green">{c.course}</span></td>
                    <td>{c.adminVerified ? <span className="badge badge-green">✓ Verified</span> : <span className="badge badge-yellow">Pending</span>}</td>
                    <td>
                      {!c.adminVerified ? (
                        <button className="btn btn-sm btn-primary" onClick={() => handleVerify(c.email, c.course)}>Verify ✓</button>
                      ) : (
                        <span style={{ color: "#64748b", fontSize: ".8rem" }}>Issued</span>
                      )}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
