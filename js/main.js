// ── MAIN JS — MarcHub ──
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
  getUsers(){ return JSON.parse(localStorage.getItem('lv_users')||'[]'); },
  saveUsers(u){ localStorage.setItem('lv_users',JSON.stringify(u)); },
  getUser(email){
    if(email===this.ADMIN_EMAIL) return {name:'Admin',email:this.ADMIN_EMAIL,isAdmin:true,phone:'',bio:'',avatar:''};
    return this.getUsers().find(u=>u.email===email)||null;
  },
  verifyPassword(email, password) {

    const user = this.getUsers().find(u => u.email === email);

    if (!user) {
        return false;
    }

    return user.password === password;
},
  registerUser(name,email,password,phone=''){
    const users=this.getUsers();
    if(users.find(u=>u.email===email)) return {ok:false,msg:'Email already registered.'};
    users.push({
    name,
    email,
    password,
    phone,
    bio:'',
    avatar:'',
    isAdmin:false,
    enrollments:[],
    createdAt:new Date().toISOString()
});
    this.saveUsers(users); return {ok:true};
  },
  loginUser(email,password){

    if(email===this.ADMIN_EMAIL && password===this.ADMIN_PASS){

        const s={
            name:"Admin",
            email:this.ADMIN_EMAIL,
            isAdmin:true
        };

        localStorage.setItem("lv_session",JSON.stringify(s));

        return {ok:true,user:s};
    }

    const u=this.getUsers().find(
        user=>user.email===email && user.password===password
    );

    if(!u){
        return {
            ok:false,
            msg:"Invalid email or password."
        };
    }

    const s={
        name:u.name,
        email:u.email,
        isAdmin:false
    };

    localStorage.setItem("lv_session",JSON.stringify(s));

    return {
        ok:true,
        user:s
    };
},
  logout(){ localStorage.removeItem('lv_session'); },
  getSession(){ return JSON.parse(localStorage.getItem('lv_session')||'null'); },
  updateProfile(email,updates){
    const users=this.getUsers(); const idx=users.findIndex(u=>u.email===email);
    if(idx===-1) return {ok:false,msg:'User not found.'};
    Object.assign(users[idx],updates); this.saveUsers(users);
    const s=this.getSession();
    if(s&&s.email===email){if(updates.name)s.name=updates.name;localStorage.setItem('lv_session',JSON.stringify(s));}
    return {ok:true};
  },
  resetPassword(email,newPass){
    const users=this.getUsers(); const idx=users.findIndex(u=>u.email===email);
    if(idx===-1) return {ok:false,msg:'No account with that email.'};
    users[idx].password=newPass; this.saveUsers(users); return {ok:true};
  },
  enrollUser(email,course,phone=''){
    const users=this.getUsers(); const idx=users.findIndex(u=>u.email===email);
    if(idx===-1) return {ok:false,msg:'User not found.'};
    if(!users[idx].enrollments) users[idx].enrollments=[];
    if(users[idx].enrollments.find(e=>e.course===course)) return {ok:false,msg:`Already enrolled in ${course}.`};
    users[idx].enrollments.push({course,phone,enrolledAt:new Date().toISOString(),progress:0});
    this.saveUsers(users); return {ok:true};
  },
getEnrollments(email) {
    const u = this.getUsers().find(u => u.email === email);
    return u ? (u.enrollments || []) : [];
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
  getAllEnrollments(){
    const all=JSON.parse(localStorage.getItem('lv_enrollments')||'[]');
    this.getUsers().forEach(u=>{
      (u.enrollments||[]).forEach(e=>{
        if(!all.find(x=>x.email===u.email&&x.course===e.course))
          all.push({name:u.name,email:u.email,phone:e.phone||'',course:e.course,enrolledAt:e.enrolledAt});
      });
    }); return all;
  },
  deleteEnrollment(email,course){
    const all=JSON.parse(localStorage.getItem('lv_enrollments')||'[]');
    localStorage.setItem('lv_enrollments',JSON.stringify(all.filter(e=>!(e.email===email&&e.course===course))));
    const users=this.getUsers(); const idx=users.findIndex(u=>u.email===email);
    if(idx!==-1){users[idx].enrollments=(users[idx].enrollments||[]).filter(e=>e.course!==course);this.saveUsers(users);}
  }
};
console.log('%cMarcHub 🚀','color:#00f5c4;font-size:1.5rem;font-weight:bold;');
