// ── MAIN JS — MarcHub ──
const BACKEND = "https://marchub-backend-wexu.onrender.com";
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
});
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav-links');
if (hamburger) hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));

document.querySelectorAll('.course-card').forEach(card => {
  const color = card.dataset.color;
  if (color) {
    card.querySelector('.card-glow')?.style.setProperty('background',
      `radial-gradient(circle at top left, ${color}25, transparent 70%)`);
    card.style.setProperty('--c', color);
  }
});

const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting){e.target.style.opacity='1';e.target.style.transform='translateY(0)';} });
},{ threshold:0.1 });
document.querySelectorAll('.course-card,.about-inner').forEach(el=>{
  el.style.opacity='0';el.style.transform='translateY(30px)';
  el.style.transition='opacity 0.6s ease,transform 0.6s ease';obs.observe(el);
});

window.showToast = function(msg, type='success') {
  let t = document.querySelector('.toast');
  if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t);}
  t.textContent=msg; t.className=`toast ${type}`;
  setTimeout(()=>t.classList.add('show'),10);
  setTimeout(()=>t.classList.remove('show'),3500);
};

window.AuthDB = {
  ADMIN_EMAIL:'marchub2026@gmail.com', ADMIN_PASS:'Uppiyxdxv@2004',
  async getUsers() {

    const response = await fetch(`${BACKEND}/users`);

    return await response.json();

},
  
   async getUser(email) {

    if (email === this.ADMIN_EMAIL) {
        return {
            name: "Admin",
            email: this.ADMIN_EMAIL,
            isAdmin: true,
            phone: "",
            bio: "",
            avatar: ""
        };
    }

    const users = await this.getUsers();

    return users.find(u => u.email === email) || null;
},
  async verifyPassword(email, password) {

    const response = await fetch(`${BACKEND}/verify-password`, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            email,
            password
        })

    });

    const result = await response.json();

    return result.success;

},
  async registerUser(name, email, password, phone = "") {

    const response = await fetch(`${BACKEND}/register`, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            name,
            email,
            password,
            phone
        })

    });

    return await response.json();

},
    async loginUser(email, password) {

    // Admin Login
    if (email === this.ADMIN_EMAIL && password === this.ADMIN_PASS) {

        const session = {
            name: "Admin",
            email: this.ADMIN_EMAIL,
            isAdmin: true
        };

        localStorage.setItem("lv_session", JSON.stringify(session));

        return {
            ok: true,
            user: session
        };
    }

    try {

        const response = await fetch(`${BACKEND}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            return {
                ok: false,
                msg: result.message || "Invalid Email or Password"
            };
        }

        const session = {
            name: result.user.name,
            email: result.user.email,
            isAdmin: false
        };

        localStorage.setItem("lv_session", JSON.stringify(session));

        return {
            ok: true,
            user: session
        };

    } catch (err) {

        console.error(err);

        return {
            ok: false,
            msg: "Unable to connect to server."
        };

    }

},
  logout(){ localStorage.removeItem('lv_session'); },
  getSession(){ return JSON.parse(localStorage.getItem('lv_session')||'null'); },
 async updateProfile(email, updates) {

    const response = await fetch(`${BACKEND}/update-profile`, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            email,

            ...updates

        })

    });

    return await response.json();

},
  
     async enrollUser(email, course, phone) {

        const response = await fetch(`${BACKEND}/enroll`, {

             method: "POST",

             headers: {
               "Content-Type": "application/json"
            },

             body: JSON.stringify({

               email,
               course,
               phone

           })

        });

         return await response.json();

      },
       async getEnrollments(email) {

         const response = await fetch(`${BACKEND}/enrollments/${email}`);

         return await response.json();

      },
  getTasks(course){ return JSON.parse(localStorage.getItem(`lv_tasks_${course}`)||'[]'); },
  saveTasks(course,tasks){ localStorage.setItem(`lv_tasks_${course}`,JSON.stringify(tasks)); },
  addTask(course,title,desc,due){
    const tasks=this.getTasks(course);
    tasks.push({id:Date.now(),title,desc,due,createdAt:new Date().toISOString()});
    this.saveTasks(course,tasks);
  },
  deleteTask(course,id){ this.saveTasks(course,this.getTasks(course).filter(t=>t.id!==id)); },
  getSubmissions(email,course){ return JSON.parse(localStorage.getItem(`lv_sub_${email}_${course}`)||'[]'); },
  submitTask(email,course,taskId,answer){
    const subs=this.getSubmissions(email,course);
    if(subs.find(s=>s.taskId===taskId)) return {ok:false,msg:'Already submitted.'};
    subs.push({taskId,answer,submittedAt:new Date().toISOString(),score:null});
    localStorage.setItem(`lv_sub_${email}_${course}`,JSON.stringify(subs)); return {ok:true};
  },
  allTasksSubmitted(email,course){
    const tasks=this.getTasks(course); if(!tasks.length) return false;
    const subs=this.getSubmissions(email,course);
    return tasks.every(t=>subs.find(s=>s.taskId===t.id));
  },
  async getAllEnrollments() {

    const response = await fetch(`${BACKEND}/all-enrollments`);

    return await response.json();

},
   async deleteEnrollment(email, course) {

    const response = await fetch(`${BACKEND}/delete-enrollment`, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            email,
            course
        })

    });

    return await response.json();

},
};
console.log('%cMarcHub 🚀','color:#00f5c4;font-size:1.5rem;font-weight:bold;');
