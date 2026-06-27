// ── MAIN JS ──

// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// Hamburger menu
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');
if (hamburger) {
  hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
}

// Course card glow colors
document.querySelectorAll('.course-card').forEach(card => {
  const color = card.dataset.color;
  if (color) {
    card.querySelector('.card-glow').style.setProperty('background',
      `radial-gradient(circle at top left, ${color}25, transparent 70%)`);
    card.style.setProperty('--c', color);
  }
});

// Intersection Observer — fade-in sections
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.course-card, .about-inner').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

// ── Toast utility ──
window.showToast = function(msg, type = 'success') {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.className = `toast ${type}`;
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => toast.classList.remove('show'), 3500);
};

// ── Auth helpers ──
window.AuthDB = {
  getUsers() {
    return JSON.parse(localStorage.getItem('lv_users') || '[]');
  },
  saveUsers(users) {
    localStorage.setItem('lv_users', JSON.stringify(users));
  },
  registerUser(name, email, password) {
    const users = this.getUsers();
    if (users.find(u => u.email === email)) return { ok: false, msg: 'Email already registered.' };
    users.push({ name, email, password, enrollments: [], createdAt: new Date().toISOString() });
    this.saveUsers(users);
    return { ok: true };
  },
  loginUser(email, password) {
    const users = this.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) return { ok: false, msg: 'Invalid email or password.' };
    localStorage.setItem('lv_session', JSON.stringify({ email: user.email, name: user.name }));
    return { ok: true, user };
  },
  logout() {
    localStorage.removeItem('lv_session');
  },
  getSession() {
    return JSON.parse(localStorage.getItem('lv_session') || 'null');
  },
  enrollUser(email, course, phone) {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.email === email);
    if (idx === -1) return { ok: false, msg: 'User not found.' };
    if (!users[idx].enrollments) users[idx].enrollments = [];
    if (users[idx].enrollments.find(e => e.course === course)) {
      return { ok: false, msg: `Already enrolled in ${course}.` };
    }
    users[idx].enrollments.push({
      course, phone,
      enrolledAt: new Date().toISOString(),
      progress: 0
    });
    this.saveUsers(users);
    return { ok: true };
  },
  getEnrollments(email) {
    const users = this.getUsers();
    const user = users.find(u => u.email === email);
    return user ? (user.enrollments || []) : [];
  }
};
console.log("%cMarcHub 🚀", "color:#00f5c4;font-size:1.5rem;font-weight:bold;");

const enrollBtn = document.getElementById("enrollBtn");

if (enrollBtn) {

  enrollBtn.addEventListener("click", async function () {

    const name = document.getElementById("enroll-name").value.trim();
    const email = document.getElementById("enroll-email").value.trim();
    const phone = document.getElementById("enroll-phone").value.trim();
    const course = document.getElementById("enroll-course").value;

    if (!name || !email || !phone || !course) {
      showToast("Please fill all required fields", "error");
      return;
    }

    try {

      const response = await fetch("https://marchub-backend.onrender.com/enroll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          course
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {

        showToast("Enrollment Successful!", "success");

        setTimeout(() => {
          window.location.href = "dashboard.html";
        }, 1500);

      } else {

        showToast(result.message || "Enrollment Failed", "error");

      }

    } catch (error) {

      console.error(error);

      showToast("Cannot connect to server", "error");

    }

  });

}