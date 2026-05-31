# 🚀 LearnVerse – Complete Setup & Deployment Guide

## 📁 Project Structure
```
learnverse/
├── index.html          ← Landing page (3D animated hero)
├── css/
│   └── style.css       ← All styles
├── js/
│   ├── main.js         ← Auth helpers, toast, utils
│   └── three-bg.js     ← Three.js 3D animations
└── pages/
    ├── login.html      ← Login page
    ├── register.html   ← Registration page
    ├── enroll.html     ← Enrollment form (with WhatsApp redirect)
    └── dashboard.html  ← User dashboard with course progress
```

---

## 🗄️ DATABASE SETUP — Firebase (FREE)

Firebase Firestore is the best FREE choice for this project.
- ✅ Free tier: 50,000 reads/day, 20,000 writes/day
- ✅ No backend server needed
- ✅ Real-time updates
- ✅ Auth, Storage all in one

### Step 1 — Create Firebase Project

1. Go to: https://console.firebase.google.com/
2. Click **"Add Project"** → Name it `learnverse`
3. Disable Google Analytics (optional)
4. Click **"Create Project"**

### Step 2 — Enable Firestore Database

1. In the left sidebar: **Build → Firestore Database**
2. Click **"Create Database"**
3. Choose **"Start in test mode"** (we'll secure it later)
4. Select region: **asia-south1 (Mumbai)** → Click **Enable**

### Step 3 — Enable Firebase Auth

1. Sidebar: **Build → Authentication**
2. Click **"Get Started"**
3. Under **Sign-in method**, enable **Email/Password**
4. Click **Save**

### Step 4 — Get Firebase Config

1. Go to **Project Settings** (gear icon, top left)
2. Scroll to **"Your apps"** → Click `</>` (Web)
3. App nickname: `learnverse-web` → Click **Register**
4. Copy the `firebaseConfig` object shown

### Step 5 — Add Firebase to Your Project

In `index.html` and all pages, add BEFORE closing `</body>`:
```html
<!-- Firebase SDK -->
<script type="module">
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
  import { getFirestore, collection, addDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
  import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

  const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "learnverse.firebaseapp.com",
    projectId: "learnverse",
    storageBucket: "learnverse.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth(app);
  window.db = db;
  window.auth = auth;
</script>
```

### Step 6 — Firestore Collections

Your database will have these collections:

**`users`** collection:
```json
{
  "uid": "firebase-uid",
  "name": "John Doe",
  "email": "john@example.com",
  "createdAt": "2025-01-01T00:00:00Z"
}
```

**`enrollments`** collection:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+91 9876543210",
  "course": "JavaScript",
  "message": "Excited to learn!",
  "enrolledAt": "2025-01-01T00:00:00Z",
  "progress": 0,
  "userId": "firebase-uid"
}
```

### Step 7 — Update enroll.html to Save to Firestore

Replace the localStorage save block in `enroll.html` with:
```javascript
import { addDoc, collection, query, where, getDocs } from "firebase/firestore";

// Check existing enrollment
const q = query(collection(db, "enrollments"), where("email","==",email), where("course","==",course));
const existing = await getDocs(q);
if (!existing.empty) { showToast("Already enrolled!", "error"); return; }

// Save to Firestore
await addDoc(collection(db, "enrollments"), {
  name, email, phone, course, message,
  enrolledAt: new Date().toISOString(),
  progress: 0
});
```

---

## 📱 WHATSAPP GROUP LINKS — Setup

1. Open WhatsApp on your phone
2. Create a group for each course (e.g., "LearnVerse – JavaScript Batch 1")
3. Tap the group name → **Invite to Group via Link**
4. Copy the link (looks like: `https://chat.whatsapp.com/XXXXXXXXXX`)
5. Replace the placeholder links in **both** `enroll.html` and `dashboard.html`:

```javascript
const WHATSAPP_LINKS = {
  HTML:       'https://chat.whatsapp.com/YOUR_ACTUAL_HTML_LINK',
  CSS:        'https://chat.whatsapp.com/YOUR_ACTUAL_CSS_LINK',
  JavaScript: 'https://chat.whatsapp.com/YOUR_ACTUAL_JS_LINK',
  Java:       'https://chat.whatsapp.com/YOUR_ACTUAL_JAVA_LINK',
  Python:     'https://chat.whatsapp.com/YOUR_ACTUAL_PYTHON_LINK',
  SQL:        'https://chat.whatsapp.com/YOUR_ACTUAL_SQL_LINK',
  MongoDB:    'https://chat.whatsapp.com/YOUR_ACTUAL_MONGODB_LINK',
};
```

---

## 💻 VS CODE + GITHUB + LIVE DEPLOYMENT

### Step 1 — Install VS Code Extensions

Open VS Code → Extensions (Ctrl+Shift+X) → Install:
- **Live Server** (by Ritwick Dey) — preview locally
- **GitLens** — Git history
- **Prettier** — code formatting
- **GitHub Copilot** (optional)

### Step 2 — Open Project in VS Code

```bash
# Open VS Code terminal (Ctrl + `)
cd path/to/learnverse
code .
```

### Step 3 — Initialize Git

```bash
# In VS Code terminal:
git init
git add .
git commit -m "🚀 Initial commit: LearnVerse learning platform"
```

### Step 4 — Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `learnverse`
3. Set to **Public**
4. Do NOT initialize with README (you already have files)
5. Click **Create Repository**

### Step 5 — Connect & Push to GitHub

```bash
# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/learnverse.git
git branch -M main
git push -u origin main
```

**If asked for credentials:**
```bash
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
# Use GitHub Personal Access Token as password (Settings → Developer Settings → PAT)
```

### Step 6 — Deploy Live with GitHub Pages (FREE)

1. Go to your GitHub repo → **Settings**
2. Scroll to **Pages** (left sidebar)
3. Under **Source**, select: `Deploy from a branch`
4. Branch: `main` → Folder: `/ (root)` → Click **Save**
5. Wait 2-3 minutes
6. Your site is LIVE at: `https://YOUR_USERNAME.github.io/learnverse/`

### Step 7 — Update & Redeploy

Whenever you make changes:
```bash
git add .
git commit -m "✨ Update: describe your change"
git push
```
GitHub Pages auto-updates in ~1 minute.

---

## 🔄 FUTURE IMPROVEMENTS (Optional)

| Feature | Free Service |
|---------|-------------|
| Custom domain | Freenom (.tk, .ml) or Namecheap ($1/yr) |
| Backend API | Firebase Functions (free tier) |
| Email notifications | EmailJS (free tier) |
| File uploads | Firebase Storage |
| Analytics | Google Analytics (free) |
| Form backend | Formspree.io (free tier) |

---

## ✅ QUICK CHECKLIST

- [ ] Open `learnverse/` in VS Code
- [ ] Right-click `index.html` → **Open with Live Server** to preview
- [ ] Create Firebase project & replace config
- [ ] Create 7 WhatsApp groups & replace links in enroll.html + dashboard.html
- [ ] `git init && git add . && git commit -m "init"`
- [ ] Create GitHub repo & push
- [ ] Enable GitHub Pages
- [ ] Share your live URL! 🎉

---

*Built with HTML5, CSS3, JavaScript (ES6+), Three.js r128 | Database: Firebase Firestore*
