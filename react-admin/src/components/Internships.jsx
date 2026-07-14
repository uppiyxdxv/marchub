import { useState, useEffect } from "react";
import { getInternships, createInternship, updateInternship, deleteInternship, getRegistrations, updateRegStatus } from "../api";

export default function Internships() {
  const [interns, setInterns] = useState([]);
  const [regs, setRegs] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", requirements: "" });
  const [editId, setEditId] = useState(null);
  const [selId, setSelId] = useState("");

  useEffect(() => {
    Promise.all([getInternships(), getRegistrations()]).then(([i, r]) => {
      setInterns(i);
      setRegs(r);
    });
  }, []);

  const reload = async () => {
    const [i, r] = await Promise.all([getInternships(), getRegistrations()]);
    setInterns(i);
    setRegs(r);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title) return;
    if (editId) {
      await updateInternship(editId, form);
    } else {
      await createInternship(form);
    }
    setForm({ title: "", description: "", requirements: "" });
    setEditId(null);
    reload();
  };

  const handleEdit = (i) => {
    setForm({ title: i.title, description: i.description || "", requirements: i.requirements || "" });
    setEditId(i.id);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this internship?")) return;
    await deleteInternship(id);
    reload();
  };

  const handleStatus = async (id, action) => {
    await updateRegStatus(id, action);
    reload();
  };

  const handleToggleActive = async (intern) => {
    await updateInternship(intern.id, { ...intern, active: !intern.active });
    reload();
  };

  const filteredRegs = selId ? regs.filter((r) => r.internshipId == selId) : [];

  return (
    <div>
      <h1>💼 Internships</h1>
      <p className="sub">Manage internships, registrations, and visibility on homepage</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        <div className="card">
          <h3>{editId ? "✏ Edit" : "➕ New Internship"}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group"><label>Title</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
            <div className="form-group"><label>Description</label><textarea rows="3" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div className="form-group"><label>Requirements (one per line)</label><textarea rows="3" value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} /></div>
            <button className="btn btn-primary">{editId ? "Update" : "Create"} →</button>
            {editId && <button className="btn" style={{ marginLeft: ".5rem" }} onClick={() => { setEditId(null); setForm({ title: "", description: "", requirements: "" }); }}>Cancel</button>}
          </form>
        </div>
        <div className="card">
          <h3>Internships & Visibility</h3>
          {interns.length === 0 ? <p className="empty">No internships.</p> :
            interns.map((i) => (
              <div key={i.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: ".6rem 0", borderBottom: "1px solid #334155" }}>
                <div>
                  <strong>{i.title}</strong>
                  <p style={{ fontSize: ".78rem", color: "#64748b" }}>
                    {i.active ? <span className="badge badge-green">Visible on homepage</span> : <span className="badge badge-red">Hidden</span>}
                  </p>
                </div>
                <div style={{ display: "flex", gap: ".4rem", alignItems: "center" }}>
                  <button className="btn btn-sm" style={{ background: i.active ? "rgba(239,68,68,.1)" : "rgba(16,185,129,.1)", color: i.active ? "#ef4444" : "#10b981", border: "1px solid" }} onClick={() => handleToggleActive(i)}>
                    {i.active ? "Hide" : "Show"}
                  </button>
                  <button className="btn btn-sm btn-primary" onClick={() => handleEdit(i)}>✏</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(i.id)}>🗑</button>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="card" style={{ marginTop: "1.5rem" }}>
        <h3>Registrations</h3>
        <div className="form-group">
          <select value={selId} onChange={(e) => setSelId(e.target.value)}>
            <option value="">Select Internship</option>
            {interns.map((i) => <option key={i.id} value={i.id}>{i.title}</option>)}
          </select>
        </div>
        {selId && (
          <table>
            <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {filteredRegs.length === 0 ? <tr><td colSpan="5" className="empty">No registrations.</td></tr> :
                filteredRegs.map((r) => (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 600 }}>{r.name}</td>
                    <td style={{ fontSize: ".8rem" }}>{r.email}</td>
                    <td>{r.phone || "—"}</td>
                    <td>
                      {r.status === "APPROVED" ? <span className="badge badge-green">Approved</span> :
                       r.status === "REJECTED" ? <span className="badge badge-red">Rejected</span> :
                       r.status === "COMPLETED" ? <span className="badge badge-green">Completed</span> :
                       <span className="badge badge-yellow">Pending</span>}
                    </td>
                    <td>
                      {r.status === "PENDING" ? (
                        <div style={{ display: "flex", gap: ".4rem" }}>
                          <button className="btn btn-sm btn-primary" onClick={() => handleStatus(r.id, "approve")}>Approve</button>
                          <button className="btn btn-sm btn-danger" onClick={() => handleStatus(r.id, "reject")}>Reject</button>
                        </div>
                      ) : r.status === "APPROVED" ? (
                        <button className="btn btn-sm btn-primary" onClick={() => handleStatus(r.id, "complete")}>Complete</button>
                      ) : <span style={{ color: "#64748b", fontSize: ".8rem" }}>Done</span>}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
