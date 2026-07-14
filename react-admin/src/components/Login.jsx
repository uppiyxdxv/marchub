import { useState } from "react";
import { login } from "../api";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const res = await login(email, password);
    if (res.success && res.user?.isAdmin) {
      onLogin(JSON.stringify(res.user));
    } else {
      setError(res.message || "Invalid admin credentials");
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#0a0f1a" }}>
      <form onSubmit={handleSubmit} style={{ background: "#1e293b", padding: "3rem", borderRadius: "16px", width: "100%", maxWidth: "400px", border: "1px solid #334155" }}>
        <h2 style={{ color: "#00f5c4", fontWeight: 800, marginBottom: ".3rem" }}>MarcHub</h2>
        <p style={{ color: "#64748b", marginBottom: "1.5rem" }}>Admin Panel</p>
        {error && <p style={{ color: "#ef4444", fontSize: ".85rem", marginBottom: "1rem" }}>{error}</p>}
        <div className="form-group"><label>Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
        <div className="form-group"><label>Password</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
        <button className="btn btn-primary" style={{ width: "100%", marginTop: ".5rem" }}>Login →</button>
      </form>
    </div>
  );
}
