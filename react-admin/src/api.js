const API = "https://marchub-backend-wexu.onrender.com";

const get = async (path) => { const r = await fetch(API + path); return r.json(); };
const post = async (path, data) => {
  const r = await fetch(API + path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
  return r.json();
};
const put = async (path, data) => {
  const r = await fetch(API + path, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
  return r.json();
};
const del = async (path) => { await fetch(API + path, { method: "DELETE" }); };

export const login = (email, password) => post("/login", { email, password });
export const getUsers = () => get("/users");
export const getEnrollments = () => get("/all-enrollments");
export const deleteEnrollment = (email, course) => post("/delete-enrollment", { email, course });
export const getCourses = () => get("/courses");
export const createCourse = (data) => post("/courses", data);
export const updateCourse = (id, data) => put("/courses/" + id, data);
export const deleteCourse = (id) => del("/courses/" + id);
export const getCertificates = () => get("/certificates");
export const verifyCert = (email, course) => post("/certificates/verify", { email, course, action: "verify" });
export const getInternships = () => get("/internships");
export const createInternship = (data) => post("/internships", data);
export const updateInternship = (id, data) => put("/internships/" + id, data);
export const deleteInternship = (id) => del("/internships/" + id);
export const getRegistrations = () => get("/internships/all-registrations");
export const updateRegStatus = (id, action) => post("/internships/update-status", { id, action });
