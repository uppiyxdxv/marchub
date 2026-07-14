import { useState, useEffect } from "react";
import { getCourses, createCourse, updateCourse, deleteCourse } from "../api";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", price: 0, slotsLeft: 0, dueDate: "", nextBatchDate: "" });
  const [editId, setEditId] = useState(null);

  useEffect(() => { load(); }, []);

  const load = async () => setCourses(await getCourses());

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name) return;
    if (editId) {
      await updateCourse(editId, form);
    } else {
      await createCourse(form);
    }
    setForm({ name: "", description: "", price: 0, slotsLeft: 0, dueDate: "", nextBatchDate: "" });
    setEditId(null);
    load();
  };

  const handleEdit = (c) => {
    setForm({ name: c.name, description: c.description || "", price: c.price, slotsLeft: c.slotsLeft, dueDate: c.dueDate || "", nextBatchDate: c.nextBatchDate || "" });
    setEditId(c.id);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this course?")) return;
    await deleteCourse(id);
    load();
  };

  return (
    <div>
      <h1>📚 Courses</h1>
      <p className="sub">Manage course price, slots, due dates, and batches</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        <div className="card">
          <h3>{editId ? "✏ Edit Course" : "➕ New Course"}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group"><label>Name</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div className="form-group"><label>Description</label><textarea rows="2" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div className="form-group"><label>Price (₹)</label><input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: +e.target.value })} /></div>
            <div className="form-group"><label>Slots Left</label><input type="number" value={form.slotsLeft} onChange={(e) => setForm({ ...form, slotsLeft: +e.target.value })} /></div>
            <div className="form-group"><label>Due Date</label><input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} /></div>
            <div className="form-group"><label>Next Batch Date</label><input type="date" value={form.nextBatchDate} onChange={(e) => setForm({ ...form, nextBatchDate: e.target.value })} /></div>
            <button className="btn btn-primary">{editId ? "Update" : "Create"} Course →</button>
            {editId && <button className="btn" style={{ marginLeft: ".5rem" }} onClick={() => { setEditId(null); setForm({ name: "", description: "", price: 0, slotsLeft: 0, dueDate: "", nextBatchDate: "" }); }}>Cancel</button>}
          </form>
        </div>
        <div className="card">
          <h3>All Courses</h3>
          {courses.length === 0 ? <p className="empty">No courses yet.</p> :
            courses.map((c) => (
              <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "start", padding: ".75rem 0", borderBottom: "1px solid #334155" }}>
                <div>
                  <strong>{c.name}</strong>
                  <p style={{ fontSize: ".8rem", color: "#64748b", marginTop: ".2rem" }}>₹{c.price} · {c.slotsLeft} slots · Due: {c.dueDate || "—"} · Next: {c.nextBatchDate || "—"}</p>
                </div>
                <div style={{ display: "flex", gap: ".4rem" }}>
                  <button className="btn btn-sm btn-primary" onClick={() => handleEdit(c)}>✏</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(c.id)}>🗑</button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
